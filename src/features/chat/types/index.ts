// src/features/chat/types/index.ts

export interface Message {
  messageId: string;
  senderId: string;
  senderName: string;
  roomId: string;
  content: string;
  timestamp: string;
}

export interface ChatState {
  messages: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
  typingUsers: Record<string, string[]>;
  isConnected: boolean;
}

export interface SendMessagePayload {
  roomId: string;
  content: string;
}

export type SocketEvent =
  | 'connect'
  | 'disconnect'
  | 'join_room'
  | 'leave_room'
  | 'send_message'
  | 'receive_message'
  | 'user_typing'
  | 'user_stopped_typing'
  | 'room_users_update';
