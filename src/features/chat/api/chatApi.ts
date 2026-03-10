// src/features/chat/api/chatApi.ts
import apiClient from '../../../shared/utils/apiClient';
import { Message } from '../types';

export const chatApi = {
  getMessages: async (roomId: string): Promise<Message[]> => {
    const { data } = await apiClient.get<Message[]>(`/chatrooms/${roomId}/messages`);
    return data;
  },
};
