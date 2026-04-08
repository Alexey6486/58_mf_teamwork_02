import type { Request, Response, NextFunction } from 'express';

const YANDEX_API_BASE = 'https://ya-praktikum.tech/api/v2';

const UNSAFE_COOKIE_ATTRS = new Set(['domain', 'secure', 'samesite']);

const READ_ONLY_METHODS = new Set(['GET', 'HEAD']);

function sanitizeSetCookie(raw: string): string {
  return raw
    .split(';')
    .map(part => part.trim())
    .filter(
      part => !UNSAFE_COOKIE_ATTRS.has(part.split('=')[0].trim().toLowerCase())
    )
    .join('; ');
}

function extractSetCookies(headers: Headers): string[] {
  const getAll = (headers as unknown as { getSetCookie(): string[] })
    .getSetCookie;
  if (typeof getAll === 'function') {
    return getAll.call(headers);
  }

  const single = headers.get('set-cookie');
  return single ? [single] : [];
}

function buildTargetUrl(req: Request): string {
  const query = req.url.includes('?') ? `?${req.url.split('?')[1]}` : '';
  return `${YANDEX_API_BASE}${req.path}${query}`;
}

export async function apiProxy(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (req.headers.cookie) {
      headers['Cookie'] = req.headers.cookie;
    }

    const fetchInit: RequestInit = {
      method: req.method,
      headers,
    };

    if (!READ_ONLY_METHODS.has(req.method)) {
      fetchInit.body = JSON.stringify(req.body);
    }

    const response = await fetch(buildTargetUrl(req), fetchInit);
    const body = await response.text();

    const setCookies = extractSetCookies(response.headers);
    if (setCookies.length > 0) {
      res.setHeader('Set-Cookie', setCookies.map(sanitizeSetCookie));
    }

    res
      .status(response.status)
      .set(
        'Content-Type',
        response.headers.get('content-type') || 'application/json'
      )
      .send(body);
  } catch (err) {
    next(err);
  }
}
