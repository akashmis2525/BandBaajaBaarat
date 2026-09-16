import { Response } from 'express';
import { env } from '../config/env';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function success<T>(
  res: Response,
  message: string,
  data: T,
  status = 200,
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export function failure(
  res: Response,
  message: string,
  status = 400,
  error?: unknown,
) {
  const payload: Record<string, unknown> = {
    success: false,
    message,
  };
  if (error !== undefined && !env.isSecureEnv) {
    payload.error = error;
  }
  return res.status(status).json(payload);
}

export function paginate(page: number, limit: number, total: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
