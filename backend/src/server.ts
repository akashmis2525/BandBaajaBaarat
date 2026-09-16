import http from 'http';
import { createApp } from './app';
import { connectDatabase } from './config/db';
import { env } from './config/env';
import { initSocket } from './config/socket';
import { sanitizeLogMessage } from './utils/log';

async function main() {
  if (env.isSecureEnv && (env.corsOrigin === '*' || !process.env.CORS_ORIGIN)) {
    throw new Error('CORS_ORIGIN must be an explicit comma-separated origin list in staging and production');
  }
  await connectDatabase();
  const app = createApp();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(env.port, env.bindHost, () => {
    console.log(`Band Baaja Baarat API listening on ${env.bindHost}:${env.port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server', sanitizeLogMessage(err));
  process.exit(1);
});
