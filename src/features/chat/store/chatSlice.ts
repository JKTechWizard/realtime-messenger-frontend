// src/features/chat/store/chatSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { chatApi } from '../api/chatApi';
import { ChatState, Message } from '../types';
import logger from '../../../shared/utils/logger';

const initialState: ChatState = {
  messages: {},
  loading: false,
  error: null,
  typingUsers: {},
  isConnected: false,
};

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (roomId: string, { rejectWithValue }) => {
    try {
      const messages = await chatApi.getMessages(roomId);
      return { roomId, messages };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch messages';
      logger.error('fetchMessages failed', { error: message, roomId });
      return rejectWithValue(message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    receiveMessage: (state, action: PayloadAction<Message>) => {
      const { roomId } = action.payload;
      if (!state.messages[roomId]) state.messages[roomId] = [];
      state.messages[roomId].push(action.payload);
    },
    setTypingUser: (state, action: PayloadAction<{ roomId: string; userId: string; userName: string }>) => {
      const { roomId, userName } = action.payload;
      if (!state.typingUsers[roomId]) state.typingUsers[roomId] = [];
      if (!state.typingUsers[roomId].includes(userName)) {
        state.typingUsers[roomId].push(userName);
      }
    },
    removeTypingUser: (state, action: PayloadAction<{ roomId: string; userId: string; userName: string }>) => {
      const { roomId, userName } = action.payload;
      if (state.typingUsers[roomId]) {
        state.typingUsers[roomId] = state.typingUsers[roomId].filter((u) => u !== userName);
      }
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    clearRoomMessages: (state, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchMessages.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.messages[payload.roomId] = payload.messages;
    });
    builder.addCase(fetchMessages.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });
  },
});

export const {
  receiveMessage,
  setTypingUser,
  removeTypingUser,
  setConnected,
  clearRoomMessages,
  clearError,
} = chatSlice.actions;
export default chatSlice.reducer;
