import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import express from 'express';
import { createClientAndConnect } from './db';

const app = express();
app.use(cors());
const port = Number(process.env.SERVER_PORT) || 3001;

createClientAndConnect();

app.get('/friends', (_, res) => {
  res.json([
    { name: 'Саша 2', secondName: 'Панов' },
    { name: 'Лёша 2', secondName: 'Садовников' },
    { name: 'Серёжа 2', secondName: 'Иванов' },
  ]);
});

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
});
