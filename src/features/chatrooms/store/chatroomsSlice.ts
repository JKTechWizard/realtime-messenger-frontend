// src/features/chatrooms/store/chatroomsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { chatroomsApi } from '../api/chatroomsApi';
import { Chatroom, ChatroomsState, CreateChatroomPayload } from '../types';
import logger from '../../../shared/utils/logger';

const initialState: ChatroomsState = {
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
};

export const fetchChatrooms = createAsyncThunk('chatrooms/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await chatroomsApi.getAll();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch chatrooms';
    logger.error('fetchChatrooms failed', { error: message });
    return rejectWithValue(message);
  }
});

export const createChatroom = createAsyncThunk(
  'chatrooms/create',
  async (payload: CreateChatroomPayload, { rejectWithValue }) => {
    try {
      const room = await chatroomsApi.create(payload);
      logger.info('Chatroom created', { roomId: room.roomId });
      return room;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create chatroom';
      logger.error('createChatroom failed', { error: message });
      return rejectWithValue(message);
    }
  }
);

export const joinChatroom = createAsyncThunk('chatrooms/join', async (roomId: string, { rejectWithValue }) => {
  try {
    return await chatroomsApi.join(roomId);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to join chatroom';
    logger.error('joinChatroom failed', { error: message, roomId });
    return rejectWithValue(message);
  }
});

const chatroomsSlice = createSlice({
  name: 'chatrooms',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<Chatroom | null>) => {
      state.currentRoom = action.payload;
    },
    updateRoomLastMessage: (
      state,
      action: PayloadAction<{ roomId: string; content: string; timestamp: string; senderName: string }>
    ) => {
      const room = state.rooms.find((r) => r.roomId === action.payload.roomId);
      if (room) {
        room.lastMessage = {
          content: action.payload.content,
          timestamp: action.payload.timestamp,
          senderName: action.payload.senderName,
        };
      }
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatrooms.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchChatrooms.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.rooms = payload;
    });
    builder.addCase(fetchChatrooms.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });
    builder.addCase(createChatroom.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(createChatroom.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.rooms.unshift(payload);
    });
    builder.addCase(createChatroom.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });
    builder.addCase(joinChatroom.fulfilled, (state, { payload }) => {
      const idx = state.rooms.findIndex((r) => r.roomId === payload.roomId);
      if (idx !== -1) state.rooms[idx] = payload;
      state.currentRoom = payload;
    });
  },
});

export const { setCurrentRoom, updateRoomLastMessage, clearError } = chatroomsSlice.actions;
export default chatroomsSlice.reducer;
