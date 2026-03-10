// src/features/chatrooms/types/index.ts

export interface Chatroom {
  roomId: string;
  roomName: string;
  createdBy: string;
  participants: string[];
  createdAt: string;
  description?: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    senderName: string;
  };
}

export interface ChatroomsState {
  rooms: Chatroom[];
  currentRoom: Chatroom | null;
  loading: boolean;
  error: string | null;
}

export interface CreateChatroomPayload {
  roomName: string;
  description?: string;
}
