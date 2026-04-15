"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiProxy = void 0;
const http_proxy_middleware_1 = require("http-proxy-middleware");
const YANDEX_API_BASE = 'https://ya-praktikum.tech/api/v2';
exports.apiProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: YANDEX_API_BASE,
    changeOrigin: true,
    cookieDomainRewrite: '',
    on: {
        proxyRes(proxyRes) {
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
                proxyRes.headers['set-cookie'] = setCookie.map(cookie => cookie
                    .split(';')
                    .filter(part => {
                    const key = part.trim().split('=')[0].toLowerCase();
                    return key !== 'domain' && key !== 'secure' && key !== 'samesite';
                })
                    .join('; '));
            }
        },
    },
});
