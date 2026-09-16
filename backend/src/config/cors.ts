import { CorsOptions } from 'cors';
import { env, corsOrigins } from './env';

export function corsOptions(): CorsOptions {
  const allowed = corsOrigins();
  return {
    origin(origin, callback) {
      if (env.corsOrigin === '*') {
        if (env.isSecureEnv) {
          callback(new Error('CORS_ORIGIN=* is not allowed in staging or production'));
          return;
        }
        callback(null, true);
        return;
      }
      // Native apps and server-to-server calls often send no Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowed.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };
}
