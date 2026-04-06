import os from 'os';
import dotenv from 'dotenv';
dotenv.config();

import type { HelmetData } from 'react-helmet';
import express, { type Request as ExpressRequest } from 'express';
import path from 'path';

import fs from 'fs/promises';
import { createServer as createViteServer, type ViteDevServer } from 'vite';
import serialize from 'serialize-javascript';
import cookieParser from 'cookie-parser';
import { apiProxy } from './middlewares/api-proxy';

// На системах линукс под порт 80 проект не запускается
const port_linux = process.env.CREATE_SERVER_LINUX_PORT || 2000;
const port_win = process.env.CREATE_SERVER_WIN_PORT || 80;
const platform = os?.platform() ?? undefined;

const clientPath = path.join(__dirname, '..');
const isDev = process.env.NODE_ENV === 'development';
const port = isDev && platform && !platform.includes('win')
  ? port_linux
  : port_win;
const API_PROXY_PATH = '/api/v2';

async function createServer() {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(API_PROXY_PATH, apiProxy);

  let vite: ViteDevServer | undefined;
  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: 'custom',
    });

    app.use(vite.middlewares);
  } else {
    app.use(
      express.static(path.join(clientPath, 'dist/client'), { index: false })
    );
  }

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Получаем файл client/index.html который мы правили ранее
      // Создаём переменные
      let render: (req: ExpressRequest) => Promise<{
        html: string;
        initialState: unknown;
        helmet: HelmetData;
        styleTags: string;
      }>;
      let template: string;
      if (vite) {
        template = await fs.readFile(
          path.resolve(clientPath, 'index.html'),
          'utf-8'
        );

        // Применяем встроенные HTML-преобразования vite и плагинов
        template = await vite.transformIndexHtml(url, template);

        // Загружаем модуль клиента, который писали выше,
        // он будет рендерить HTML-код
        render = (
          await vite.ssrLoadModule(
            path.join(clientPath, 'src/entry-server.tsx')
          )
        ).render;
      } else {
        template = await fs.readFile(
          path.join(clientPath, 'dist/client/index.html'),
          'utf-8'
        );

        // Получаем путь до сбилдженого модуля клиента, чтобы не тащить средства сборки клиента на сервер
        const pathToServer = path.join(
          clientPath,
          'dist/server/entry-server.js'
        );

        // Импортируем этот модуль и вызываем с инишл стейтом
        render = (await import(pathToServer)).render;
      }

      // Получаем HTML-строку из JSX
      const {
        html: appHtml,
        initialState,
        helmet,
        styleTags,
      } = await render(req);

      // Заменяем комментарий на сгенерированную HTML-строку
      const html = template
        .replace('<!--ssr-styles-->', styleTags)
        .replace(
          `<!--ssr-helmet-->`,
          `${helmet.meta.toString()} ${helmet.title.toString()} ${helmet.link.toString()}`
        )
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(
          `<!--ssr-initial-state-->`,
          `<script>window.APP_INITIAL_STATE = ${serialize(initialState, {
            isJSON: true,
          })}</script>`
        );

      // Завершаем запрос и отдаём HTML-страницу
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`);
  });
}

createServer();
