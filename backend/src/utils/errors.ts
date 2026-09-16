export class AppError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

import { Request, Response, NextFunction } from 'express';
import { AuthedRequest } from '../middleware/auth';

type Handler = (req: AuthedRequest, res: Response, next: NextFunction) => Promise<unknown>;

export function asyncHandler(fn: Handler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as AuthedRequest, res, next)).catch(next);
  };
}
