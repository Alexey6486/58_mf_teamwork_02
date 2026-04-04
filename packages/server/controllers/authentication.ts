import type { NextFunction, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

export const protectController = catchAsync(async (
  _request: unknown, _response: Response, next: NextFunction,
) => {
  // TODO check token or come up with other way
  console.log('auth check');
  next();
});
