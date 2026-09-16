import { Response, NextFunction } from 'express';
import { AuthedRequest } from './auth';
import { failure } from '../utils/response';

const OBJECT_ID = /^[a-fA-F0-9]{24}$/;

export function isMongoId(value: unknown): value is string {
  return typeof value === 'string' && OBJECT_ID.test(value);
}

export function validateObjectIdParam(...params: string[]) {
  const names = params.length ? params : ['id'];
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    for (const name of names) {
      const value = req.params[name];
      const id = Array.isArray(value) ? value[0] : value;
      if (id && !OBJECT_ID.test(id)) {
        return failure(res, 'Invalid identifier', 400);
      }
    }
    return next();
  };
}
