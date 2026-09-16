import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { AppError } from '../utils/errors';
import { failure } from '../utils/response';
import { env } from '../config/env';
import { sanitizeLogMessage } from '../utils/log';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof Error && err.message === 'Not allowed by CORS') {
    return failure(res, 'Origin not allowed', 403);
  }
  if (err instanceof AppError) {
    return failure(res, err.message, err.status, err.details);
  }
  if (err instanceof ZodError) {
    return failure(
      res,
      'Validation failed',
      400,
      err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    );
  }
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 5MB)' : 'Upload failed';
    return failure(res, message, 400);
  }
  const mongoErr = err as { code?: number; message?: string; name?: string };
  if (mongoErr?.name === 'CastError') {
    return failure(res, 'Invalid identifier', 400);
  }
  if (mongoErr?.code === 11000) {
    return failure(res, 'A record with this value already exists', 409);
  }
  console.error(sanitizeLogMessage(err));
  return failure(
    res,
    'Something went wrong',
    500,
    env.isSecureEnv ? undefined : { message: mongoErr?.message },
  );
}

export function notFound(_req: Request, res: Response) {
  return failure(res, 'Route not found', 404);
}
