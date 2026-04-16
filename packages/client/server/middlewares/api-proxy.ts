import { createProxyMiddleware } from 'http-proxy-middleware';

const YANDEX_API_BASE =
  process.env.YP_API_BASE || 'https://ya-praktikum.tech/api/v2';

export const apiProxy = createProxyMiddleware({
  target: YANDEX_API_BASE,
  changeOrigin: true,
  cookieDomainRewrite: '',
  on: {
    proxyRes(proxyRes) {
      const setCookie = proxyRes.headers['set-cookie'];
      if (setCookie) {
        proxyRes.headers['set-cookie'] = setCookie.map(cookie =>
          cookie
            .split(';')
            .filter(part => {
              const key = part.trim().split('=')[0].toLowerCase();
              return key !== 'domain' && key !== 'secure' && key !== 'samesite';
            })
            .join('; ')
        );
      }
    },
  },
});
