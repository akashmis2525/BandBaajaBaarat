import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/tokens';
import { corsOrigins, env } from './env';
import { Conversation } from '../models/Chat';

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigin === '*' && !env.isSecureEnv ? true : corsOrigins(),
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        (socket.handshake.auth?.token as string) ||
        String(socket.handshake.headers.authorization || '').replace('Bearer ', '');
      if (!token) return next(new Error('Authentication required'));
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      socket.data.role = payload.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.data.userId}`);
    socket.on('conversation:join', async (conversationId: string) => {
      if (!conversationId || !/^[a-fA-F0-9]{24}$/.test(conversationId)) return;
      const convo = await Conversation.findById(conversationId).select('customer vendor');
      if (!convo) return;
      if (String(convo.customer) !== socket.data.userId && String(convo.vendor) !== socket.data.userId) {
        return;
      }
      socket.join(`conversation:${conversationId}`);
    });
    socket.on('disconnect', () => undefined);
  });

  return io;
}

export function getIo(): Server | null {
  return io;
}
