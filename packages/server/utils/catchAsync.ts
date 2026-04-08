import type { NextFunction, Request, Response } from 'express';

type CatchAsyncCallbackType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// this closure function is a warp over controller to get rid of repeating catch section in each controller
export const catchAsync =
  (fn: CatchAsyncCallbackType) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error: Error) => next(error));
  };
