import type { Request, NextFunction, Response } from 'express';
import cookieParser from 'set-cookie-parser';
import { catchAsync } from '../utils/catchAsync';
import { YP_BASE_URL } from '../constants/api';

export const protectController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Пример проверки данных в заголовке
  console.log('protectController Raw cookies object:', request.cookies);
  console.log(
    'protectController All cookie names:',
    Object.keys(request.cookies)
  );
  console.log('protectController uuid cookie:', request.cookies.uuid);
  console.log(
    'protectController uuid cookie (bracket notation):',
    request.cookies['uuid']
  );
  console.log(
    'protectController authCookie cookie:',
    request.cookies.authCookie
  );
  console.log(
    'protectController authCookie cookie (bracket notation):',
    request.cookies['authCookie']
  );
  // Здесь ваша логика проверки данных
  try {
    return next();
  } catch (error) {
    return response.status(403).json({ error: 'Доступ запрещен' });
  }
};

export const signin = catchAsync(
  async (request: Request, response: Response) => {
    const { login, password } = request.body;

    const yp_response = await fetch(`${YP_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login,
        password,
      }),
      credentials: 'include',
    });

    // Проверяем статус ответа
    if (!yp_response.ok) {
      response.status(401).json({ error: 'Authentication failed' });
    }

    // Шаг 2: парсим куки из ответа стороннего API
    // const setCookieHeaders = yp_response.headers.get('Set-Cookie');
    // @ts-ignore
    const setCookieHeaders = yp_response?.headers?.get?.('Set-Cookie');
    console.log('setCookieHeaders', { setCookieHeaders });

    if (setCookieHeaders) {
      // Парсим все куки
      const parsedCookies = cookieParser.parse(setCookieHeaders, {
        decodeValues: true, // Декодировать значения (по умолчанию true)
        map: true, // Получить объект { имя_куки: объект_куки }
      });
      // const parsedCookies = cookieParser.parse({
      //   headers: { 'set-cookie': setCookieHeader }
      // });
      console.log('parsedCookies', { parsedCookies });
      const sessionUuidCookie = parsedCookies['uuid'];
      const sessionAuthCookie = parsedCookies['authCookie'];

      if (!sessionUuidCookie || !sessionAuthCookie) {
        throw new Error(
          'Куку session_id не удалось получить от стороннего API'
        );
      }

      response.cookie(sessionUuidCookie.name, sessionUuidCookie.value, {
        httpOnly: sessionUuidCookie.httpOnly || true, // Безопасно по умолчанию
        secure: sessionUuidCookie.secure || false, // В продакшене ставьте true при HTTPS
        maxAge: sessionUuidCookie.maxAge
          ? sessionUuidCookie.maxAge * 1000
          : undefined,
        expires: sessionUuidCookie.expires,
        // domain: sessionUuidCookie.domain,
        domain: 'localhost',
        path: sessionUuidCookie.path || '/',
        // @ts-ignore
        sameSite: sessionUuidCookie.sameSite || 'lax',
      });

      response.cookie(sessionAuthCookie.name, sessionAuthCookie.value, {
        httpOnly: sessionAuthCookie.httpOnly || true, // Безопасно по умолчанию
        secure: sessionAuthCookie.secure || false, // В продакшене ставьте true при HTTPS
        maxAge: sessionAuthCookie.maxAge
          ? sessionAuthCookie.maxAge * 1000
          : undefined,
        expires: sessionAuthCookie.expires,
        // domain: sessionAuthCookie.domain,
        domain: 'localhost',
        path: sessionAuthCookie.path || '/',
        // @ts-ignore
        sameSite: sessionAuthCookie.sameSite || 'lax',
      });

      // Шаг 3: устанавливаем куки клиенту для использования с нашим бэкендом
      // parsedCookies.forEach((cookie) => {
      //   console.log('cookie', { cookie });
      //   response.cookie(
      //     cookie.name,
      //     cookie.value,
      //     {
      //       httpOnly: true, // Защита от XSS
      //       secure: process.env.NODE_ENV === 'production', // Только HTTPS в продакшене
      //       sameSite: 'lax', // Защита от CSRF
      //       domain: cookie.domain || undefined, // Используем домен из куки, если есть
      //       path: cookie.path || '/', // Используем путь из куки, если есть
      //       maxAge: cookie.maxAge || 24 * 60 * 60 * 1000 // 24 часа по умолчанию
      //     });
      // });
    }
    // @ts-ignore
    console.log('Response headers:', response.getHeaders());
    console.log('Set-Cookie header:', response.getHeaders()['set-cookie']);

    response.status(200).json({
      status: 'success',
      message: 'Authenticated successfully',
    });
  }
);

export const signout = catchAsync(
  async (request: Request, response: Response) => {
    console.log('Raw cookies object:', request.cookies);
    console.log('All cookie names:', Object.keys(request.cookies));
    console.log('uuid cookie:', request.cookies.uuid);
    console.log('uuid cookie (bracket notation):', request.cookies['uuid']);
    console.log('authCookie cookie:', request.cookies.authCookie);
    console.log(
      'authCookie cookie (bracket notation):',
      request.cookies['authCookie']
    );

    const yp_response = await fetch(`${YP_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        cookie:
          'uuid=2aeec771-5be1-4ef6-baad-3f5b5f03b551; Domain=ya-praktikum.tech; Path=/; Expires=Fri, 08 May 2026 09:35:25 GMT; HttpOnly; Secure; SameSite=None, authCookie=055bb17ea70ab407e9894a4efb403232a78af190%3A1775554525; Domain=ya-praktikum.tech; Path=/; Expires=Fri, 08 May 2026 09:35:25 GMT; HttpOnly; Secure; SameSite=None, uuid=213bce9c-66cd-4a9e-9a8d-903586f2e37e; Domain=ya-praktikum.tech; Path=/; Expires=Fri, 08 May 2026 09:35:25 GMT; HttpOnly; Secure; SameSite=None',
      },
      // credentials: 'include',
    });
    console.log('yp_response', { yp_response });

    response.status(200).json({
      status: 'success',
    });
  }
);
