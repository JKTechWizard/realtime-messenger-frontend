// src/features/chat/api/chatApi.ts
import { ApiResponse } from '@shared/types';
import apiClient from '../../../shared/utils/apiClient';
import { Message } from '../types';

export const chatApi = {
  getMessages: async (roomId: string): Promise<Message[]> => {
    const { data } = await apiClient.get<ApiResponse<Message[]>>(`/chatrooms/${roomId}/messages`);
    return data.data;
  },
};
