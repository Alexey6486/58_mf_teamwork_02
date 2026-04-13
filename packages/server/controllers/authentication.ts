import type { Request, NextFunction, Response } from 'express';
import cookieParser from 'set-cookie-parser';
import type { CookieOptions } from 'express-serve-static-core';
import { catchAsync } from '../utils/catchAsync';
import { cookiesToString } from '../utils/cookies';
import { YP_BASE_URL, YP_COOKIE_AUTH, YP_COOKIE_UUID } from '../constants/api';

export const protectController = async (
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    return next();
    // if (request.cookies[YP_COOKIE_UUID] && request.cookies[YP_COOKIE_AUTH]) {
    //   const yp_user = await fetch(`${YP_BASE_URL}/auth/user`, {
    //     method: 'GET',
    //     headers: {
    //       Cookie: cookiesToString(request.cookies),
    //     },
    //     credentials: 'include',
    //   });
    //
    //   if (!yp_user?.ok) {
    //     return response.status(403).json({ error: 'Доступ запрещен' });
    //   }
    //
    //   return next();
    // }
    // return response.status(403).json({ error: 'Доступ запрещен' });
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
        secure: sessionUuidCookie.secure, // В продакшене ставьте true при HTTPS
        maxAge: sessionUuidCookie.maxAge,
        expires: sessionUuidCookie.expires,
        domain:
          process.env.NODE_ENV === 'development'
            ? process.env.DEV_COOKIE_DOMAIN
            : process.env.PROD_COOKIE_DOMAIN,
        path: sessionUuidCookie.path || '/',
        sameSite: sessionUuidCookie.sameSite as CookieOptions['sameSite'],
      });

      response.cookie(sessionAuthCookie.name, sessionAuthCookie.value, {
        httpOnly: sessionAuthCookie.httpOnly,
        secure: sessionAuthCookie.secure,
        maxAge: sessionAuthCookie.maxAge,
        expires: sessionAuthCookie.expires,
        domain:
          process.env.NODE_ENV === 'development'
            ? process.env.DEV_COOKIE_DOMAIN
            : process.env.PROD_COOKIE_DOMAIN,
        path: sessionAuthCookie.path,
        sameSite: sessionUuidCookie.sameSite as CookieOptions['sameSite'],
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
