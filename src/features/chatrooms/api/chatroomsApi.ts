// src/features/chatrooms/api/chatroomsApi.ts
import { ApiResponse } from '@shared/types';
import apiClient from '../../../shared/utils/apiClient';
import { Chatroom, CreateChatroomPayload } from '../types';

export const chatroomsApi = {
  getAll: async (): Promise<Chatroom[]> => {
    const { data } = await apiClient.get<ApiResponse<Chatroom[]>>('/chatrooms');
    return data.data;
  },

  getById: async (roomId: string): Promise<Chatroom> => {
    const { data } = await apiClient.get<ApiResponse<Chatroom>>(`/chatrooms/${roomId}`);
    return data.data;
  },

  create: async (payload: CreateChatroomPayload): Promise<Chatroom> => {
    const { data } = await apiClient.post<ApiResponse<Chatroom>>('/chatrooms', payload);
    return data.data;
  },

  join: async (roomId: string): Promise<Chatroom> => {
    const { data } = await apiClient.post<ApiResponse<Chatroom>>(`/chatrooms/${roomId}/join`);
    return data.data;
  },

  leave: async (roomId: string): Promise<void> => {
    await apiClient.post(`/chatrooms/${roomId}/leave`);
  },
};
