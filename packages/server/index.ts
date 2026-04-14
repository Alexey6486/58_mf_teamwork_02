import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from './db';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import { routerForum } from './routes/forum';
import { routerAuthentication } from './routes/authentication';
import { YP_BASE_URL } from './constants/api';
import { routerTheme } from './routes/theme';

dotenv.config();

const app = express();
const port = Number(process.env.SERVER_PORT) || 3001;

// Глобальная настройка CORS
// Список разрешённых доменов
const allowedOrigins: string[] = [
  'http://localhost:3001',
  'http://localhost:2000',
  'http://localhost',
];

interface CorsOriginCallback {
  (error: Error | null, origin?: boolean): void;
}

const corsOptions = {
  origin: (origin: string | undefined, callback: CorsOriginCallback) => {
    // Разрешаем запросы без Origin (например, curl или прямые запросы)
    if (!origin) return callback(null, true);

    // Проверяем, есть ли домен в списке разрешённых
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Разрешаем запрос
    } else {
      callback(new Error('Not allowed by CORS')); // Запрещаем запрос
    }
  },
  credentials: true, // Разрешаем учётные данные (куки, авторизация)
};

// Применяем middleware
app.use(cors(corsOptions));

// .json() позволяет конвертировать строку пейлоад запроса в JS объект
app.use(express.json());
app.use(cookieParser());

// поднимаем БД
dbConnect().then();

// api ручки
app.use(
  '/api/v2',
  createProxyMiddleware({
    changeOrigin: true,
    logger: console,
    target: YP_BASE_URL,
  })
);

app.use('/api/v1/auth', routerAuthentication);
app.use('/api/v1/forum', routerForum);
app.use('/api/v1/theme', routerTheme);

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
});
