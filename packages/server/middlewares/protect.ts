import type { Request, NextFunction, Response } from 'express';
import { YP_BASE_URL, YP_COOKIE_AUTH, YP_COOKIE_UUID } from '../constants/api';
import { cookiesToString } from '../utils/cookies';

export const protect = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    if (request.cookies[YP_COOKIE_UUID] && request.cookies[YP_COOKIE_AUTH]) {
      const yp_user = await fetch(`${YP_BASE_URL}/auth/user`, {
        method: 'GET',
        headers: {
          Cookie: cookiesToString(request.cookies),
        },
        credentials: 'include',
      });

      if (!yp_user?.ok) {
        return response.status(403).json({ error: 'Доступ запрещен' });
      }

      return next();
    }
    return response.status(403).json({ error: 'Доступ запрещен' });
  } catch {
    return response.status(403).json({ error: 'Доступ запрещен' });
  }
};
