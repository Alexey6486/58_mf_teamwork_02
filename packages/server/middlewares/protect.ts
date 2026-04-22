import type { Request, NextFunction, Response } from 'express';
import { YP_BASE_URL, YP_COOKIE_AUTH, YP_COOKIE_UUID } from '../constants/api';

const AUTH_TIMEOUT_MS = 5000;

export const protect = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (
      !request.cookies ||
      !request.cookies[YP_COOKIE_UUID] ||
      !request.cookies[YP_COOKIE_AUTH]
    ) {
      response.status(401).json({ error: 'Не авторизован' });
      return;
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), AUTH_TIMEOUT_MS);

    try {
      const yp_user = await fetch(`${YP_BASE_URL}/auth/user`, {
        method: 'GET',
        headers: {
          Cookie: `${YP_COOKIE_UUID}=${request.cookies[YP_COOKIE_UUID]}; ${YP_COOKIE_AUTH}=${request.cookies[YP_COOKIE_AUTH]}`,
        },
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!yp_user.ok) {
        console.error(
          `[protect] Auth check failed: ${yp_user.status} ${yp_user.statusText}`
        );
        response.status(401).json({ error: 'Не авторизован' });
        return;
      }

      next();
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          console.error('[protect] Auth check timeout');
          response.status(504).json({ error: 'Таймаут проверки авторизации' });
        } else {
          console.error('[protect] Auth check network error:', fetchError.message);
          response.status(401).json({ error: 'Не авторизован' });
        }
      } else {
        console.error('[protect] Auth check unknown error:', fetchError);
        response.status(401).json({ error: 'Не авторизован' });
      }
    }
  } catch (error) {
    console.error('[protect] Unexpected error:', error);
    response.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};
