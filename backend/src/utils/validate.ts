import { ZodError, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { failure } from './response';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      const err = parsed.error as ZodError;
      return failure(
        res,
        'Validation failed',
        400,
        err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      );
    }
    req[source] = parsed.data as never;
    return next();
  };
}

export function objectIdSchema() {
  const { z } = require('zod') as typeof import('zod');
  return z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid id');
}
