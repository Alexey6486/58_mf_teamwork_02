import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from './db';
import { routerForum } from './routes/forum';
import { routerAuthentication } from './routes/authentication';
// import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const port = Number(process.env.SERVER_PORT) || 3001;

// Глобальная настройка CORS
app.use(
  cors({
    origin: 'http://localhost', // разрешить запросы с указанного источника
    credentials: true, // если true, то обязательно должен быть указан origin
  })
);

// .json() позволяет конвертировать строку пейлоад запроса в JS объект
app.use(express.json());

// поднимаем БД
dbConnect().then();

// api ручки
// app.use(
//   '/api/v1',
//   createProxyMiddleware({
//     changeOrigin: true,
//     logger: console,
//     target: 'https://ya-praktikum.tech/api/v2',
//   })
// );
app.use('/api/v1', routerAuthentication);
app.use('/api/v1/forum', routerForum);

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
});
