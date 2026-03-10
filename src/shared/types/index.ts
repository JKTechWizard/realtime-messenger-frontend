// src/shared/types/index.ts

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type LoadingState = 'idle' | 'pending' | 'succeeded' | 'failed';
