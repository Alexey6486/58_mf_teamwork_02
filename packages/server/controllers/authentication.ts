import type { Request, NextFunction, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

export const protectController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Пример проверки токена в заголовке

  console.log('protectController', { h: request.headers, c: request.cookies });

  // const token = request.headers.authorization;

  // if (!token) {
  //   return response.status(401).json({ error: 'Требуется аутентификация' });
  // }

  // Здесь ваша логика проверки токена
  try {
    // Пример проверки JWT токена
    // const decoded = jwt.verify(token, 'your-secret-key');
    // req.user = decoded;
    // const response = await fetch('https://ya-praktikum.tech/api/v2/auth/user', {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     login: 'axel',
    //     password: 'SombraViente2',
    //   }),
    // })
    //
    // https.get('https://ya-praktikum.tech/api/v2/auth/signin', (response) => {
    //   let data = '';
    //
    //   response.on('data', (chunk) => {
    //     data += chunk;
    //   });
    //
    //   response.on('end', () => {
    //     try {
    //       const jsonData = JSON.parse(data);
    //       res.json(jsonData);
    //     } catch (parseError) {
    //       res.status(500).json({ error: 'Invalid JSON response' });
    //     }
    //   });
    // }).on('error', (error) => {
    //   res.status(500).json({ error: 'Request failed', details: error.message });
    // });

    console.log({ response });
    return next();
  } catch (error) {
    return response.status(403).json({ error: 'Недействительный токен' });
  }
};

export const signin = catchAsync(
  async (_request: Request, response: Response) => {
    response.status(200).json({
      status: 'success',
    });
  }
);

export const signout = catchAsync(
  async (_request: Request, response: Response) => {
    console.log('logout');
    response.status(200).json({
      status: 'success',
    });
  }
);
