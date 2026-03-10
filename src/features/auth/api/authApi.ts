// src/features/auth/api/authApi.ts
import { ApiResponse } from '@shared/types';
import apiClient from '../../../shared/utils/apiClient';
import { AuthResponse, LoginPayload, SignupPayload } from '../types';

export const authApi = {
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', payload);
    return data.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    const { data } = await apiClient.get<ApiResponse<AuthResponse['user']>>('/auth/me');
    return data.data;
  },
};
