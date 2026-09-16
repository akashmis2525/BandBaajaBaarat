import dotenv from 'dotenv';
import path from 'path';

const backendEnv = path.resolve(__dirname, '../../.env');
const rootEnv = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: backendEnv });
dotenv.config({ path: rootEnv });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const isStaging = nodeEnv === 'staging';
const isSecureEnv = isProduction || isStaging;
const isTest = nodeEnv === 'test';
const isDevelopment = nodeEnv === 'development';

function required(name: string, fallback?: string): string {
  if (isSecureEnv && !process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT || 4000),
  bindHost: process.env.BIND_HOST || '0.0.0.0',
  nodeEnv,
  isProduction,
  isStaging,
  isSecureEnv,
  isTest,
  isDevelopment,
  exposeOtp: isDevelopment || isTest,
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/bandbaajabaarat'),
  jwtSecret: required('JWT_SECRET', 'dev-access-secret-change-me'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  publicBaseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:4000',
  smsApiKey: process.env.SMS_API_KEY || '',
  smsProvider: process.env.SMS_PROVIDER || '',
  smsSender: process.env.SMS_SENDER || 'BANDBAJA',
  smsTemplateId: process.env.SMS_TEMPLATE_ID || '',
  smsApiUrl: process.env.SMS_API_URL || '',
  paymentGateway: process.env.PAYMENT_GATEWAY || '',
};

export function corsOrigins(): string[] {
  return env.corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export default env;
