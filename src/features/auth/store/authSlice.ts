// src/features/auth/store/authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { AuthState, LoginPayload, SignupPayload } from '../types';
import logger from '../../../shared/utils/logger';
import { resetChatState } from '../../chat/store/chatSlice';
import { resetChatroomsState } from '../../chatrooms/store/chatroomsSlice';

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

export const signup = createAsyncThunk('auth/signup', async (payload: SignupPayload, { rejectWithValue }) => {
  try {
    const response = await authApi.signup(payload);
    localStorage.setItem('token', response?.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    logger.info('User signed up', { userId: response.user.id });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    logger.error('Signup failed', { error: message });
    return rejectWithValue(message);
  }
});

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    const response = await authApi.login(payload);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    logger.info('User logged in', { userId: response.user.id });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    logger.error('Login failed', { error: message });
    return rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    await authApi.logout();
  } catch (error) {
    logger.warn('Logout API call failed, clearing local state anyway');
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(resetChatState());
    dispatch(resetChatroomsState());
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Signup
    builder.addCase(signup.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(signup.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
      state.token = payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(signup.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });
    // Login
    builder.addCase(login.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
      state.token = payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
