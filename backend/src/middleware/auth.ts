import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/tokens';
import { User } from '../models/User';
import { failure } from '../utils/response';

export interface AuthedRequest extends Request {
  auth?: TokenPayload;
  userId?: string;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return failure(res, 'Authentication required', 401);
    }
    const token = header.slice(7);
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user || user.isBlocked) {
      return failure(res, 'Account is unavailable', 401);
    }
    req.auth = payload;
    req.userId = payload.sub;
    return next();
  } catch {
    return failure(res, 'Invalid or expired token', 401);
  }
}

export function requireRole(...roles: Array<'customer' | 'vendor'>) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return failure(res, 'You do not have permission to perform this action', 403);
    }
    return next();
  };
}

export async function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const payload = verifyAccessToken(header.slice(7));
      req.auth = payload;
      req.userId = payload.sub;
    }
  } catch {
    // ignore invalid optional token
  }
  next();
}
