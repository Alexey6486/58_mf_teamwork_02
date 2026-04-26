import type { Request, Response } from 'express';
import cookieParser from 'set-cookie-parser';
import { catchAsync } from '../utils/catchAsync';
import { cookiesToString } from '../utils/cookies';
import { YP_BASE_URL, YP_COOKIE_AUTH, YP_COOKIE_UUID } from '../constants/api';

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
    if (!yp_response?.ok) {
      response.status(401).json({ error: 'Authentication failed' });
    }

    // Шаг 2: парсим куки из ответа стороннего API
    const setCookieHeaders = yp_response?.headers?.get?.('Set-Cookie');

    if (setCookieHeaders) {
      // Парсим все куки
      const parsedCookies = cookieParser.parse(setCookieHeaders, {
        decodeValues: true, // Декодировать значения (по умолчанию true)
        map: true, // Получить объект { имя_куки: объект_куки }
      });

      const sessionUuidCookie = parsedCookies[YP_COOKIE_UUID];
      const sessionAuthCookie = parsedCookies[YP_COOKIE_AUTH];

      if (!sessionUuidCookie || !sessionAuthCookie) {
        throw new Error('Cookies не найдены');
      }

      response.cookie(sessionUuidCookie.name, sessionUuidCookie.value, {
        httpOnly: sessionUuidCookie.httpOnly, // Безопасно по умолчанию
        // secure: sessionUuidCookie.secure, // В продакшене ставьте true при HTTPS
        maxAge: sessionUuidCookie.maxAge,
        expires: sessionUuidCookie.expires,
        domain: process.env.DOMAIN ? process.env.DOMAIN : process.env.DOMAIN_IP,
        path: sessionUuidCookie.path || '/',
        // sameSite: sessionUuidCookie.sameSite as CookieOptions['sameSite'],
      });

      response.cookie(sessionAuthCookie.name, sessionAuthCookie.value, {
        httpOnly: sessionAuthCookie.httpOnly,
        secure: false, // sessionAuthCookie.secure,
        maxAge: sessionAuthCookie.maxAge,
        expires: sessionAuthCookie.expires,
        domain: process.env.DOMAIN ? process.env.DOMAIN : process.env.DOMAIN_IP,
        path: sessionAuthCookie.path,
        sameSite: 'lax', // sessionUuidCookie.sameSite as CookieOptions['sameSite'],
      });
    }

    response.status(200).json({
      status: 'success',
      message: 'Authenticated successfully',
    });
  }
);

export const signout = catchAsync(
  async (request: Request, response: Response) => {
    await fetch(`${YP_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: cookiesToString(request.cookies),
      },
      credentials: 'include',
    });

    response.clearCookie(YP_COOKIE_UUID);
    response.clearCookie(YP_COOKIE_AUTH);

    response.status(200).json({
      status: 'success',
    });
  }
);
