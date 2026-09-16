import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { corsOptions } from './config/cors';
import { buildRouter } from './routes';
import { errorHandler, notFound } from './middleware/error';

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (key.startsWith('$') || key.includes('.')) continue;
      out[key] = sanitizeValue(nested);
    }
    return out;
  }
  return value;
}

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cors(corsOptions()));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use((req, _res, next) => {
    if (req.body) req.body = sanitizeValue(req.body) as typeof req.body;
    next();
  });
  app.use('/uploads', express.static(path.resolve(process.cwd(), env.uploadDir)));
  app.use('/api', buildRouter());
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
