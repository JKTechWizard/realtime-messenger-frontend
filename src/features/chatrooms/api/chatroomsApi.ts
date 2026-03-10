// src/features/chatrooms/api/chatroomsApi.ts
import apiClient from '../../../shared/utils/apiClient';
import { Chatroom, CreateChatroomPayload } from '../types';

export const chatroomsApi = {
  getAll: async (): Promise<Chatroom[]> => {
    const { data } = await apiClient.get<Chatroom[]>('/chatrooms');
    return data;
  },

  getById: async (roomId: string): Promise<Chatroom> => {
    const { data } = await apiClient.get<Chatroom>(`/chatrooms/${roomId}`);
    return data;
  },

  create: async (payload: CreateChatroomPayload): Promise<Chatroom> => {
    const { data } = await apiClient.post<Chatroom>('/chatrooms', payload);
    return data;
  },

  join: async (roomId: string): Promise<Chatroom> => {
    const { data } = await apiClient.post<Chatroom>(`/chatrooms/${roomId}/join`);
    return data;
  },

  leave: async (roomId: string): Promise<void> => {
    await apiClient.post(`/chatrooms/${roomId}/leave`);
  },
};
