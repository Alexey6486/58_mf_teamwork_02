import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';
import { swPrecachePlugin } from './src/sw-precache-plugin';
dotenv.config();

const distClientDir = path.join(__dirname, 'dist/client');

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
  },
  define: {
    __EXTERNAL_SERVER_URL__: JSON.stringify(process.env.EXTERNAL_SERVER_URL),
    __INTERNAL_SERVER_URL__: JSON.stringify(process.env.INTERNAL_SERVER_URL),
    __YP_API_BASE__: JSON.stringify(
      process.env.YP_API_BASE ?? 'https://ya-praktikum.tech/api/v2'
    ),
    __OAUTH_REDIRECT_URI__: JSON.stringify(
      process.env.OAUTH_REDIRECT_URI ?? 'http://localhost:3000'
    ),
    __OAUTH_YANDEX_URL__: JSON.stringify(
      process.env.OAUTH_YANDEX_URL ?? 'https://oauth.yandex.ru/authorize'
    ),
  },
  build: {
    outDir: distClientDir,
  },
  ssr: {
    format: 'cjs',
  },
  plugins: [react(), swPrecachePlugin(distClientDir)],
});
