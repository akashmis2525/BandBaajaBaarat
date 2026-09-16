import mongoose from 'mongoose';
import { env } from './env';

export async function connectDatabase(uri = env.mongoUri): Promise<typeof mongoose> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return mongoose;
}

export function databaseStatus(): 'connected' | 'disconnected' | 'connecting' | 'disconnecting' {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
}

export async function pingDatabase(): Promise<boolean> {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) return false;
    await mongoose.connection.db.admin().command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
