/// <reference types="cookie-parser" />
import type { Request, Response, NextFunction } from 'express';
export declare function apiProxy(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>;
