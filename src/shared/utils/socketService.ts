// src/shared/utils/socketService.ts
import { io, Socket } from 'socket.io-client';
import env from '../../config/env';

class SocketService {
  private socket: Socket | null = null;
  private queue: { event: string; data: unknown }[] = [];
  private flushQueue(): void {
    if (!this.queue.length) return;
    const pending = [...this.queue];
    this.queue = [];
    pending.forEach(({ event, data }) => this.socket?.emit(event, data));
  }

  connect(token: string): Socket {
    if (this.socket?.connected) return this.socket;

    this.socket = io(env.SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.info('[Socket] Connected:', this.socket?.id);
      this.flushQueue();
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.queue = [];
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  emit<T>(event: string, data: T): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`[Socket] Not connected — queuing "${event}"`);
      this.queue.push({ event, data });
    }
  }

  on<T>(event: string, handler: (data: T) => void): void {
    this.socket?.on(event, handler);
  }

  off(event: string): void {
    this.socket?.off(event);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

const socketService = new SocketService();
export default socketService;
