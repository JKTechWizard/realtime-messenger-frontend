// src/features/chat/hooks/useSocket.ts
import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { receiveMessage, setTypingUser, removeTypingUser, setConnected } from '../store/chatSlice';
import { updateRoomLastMessage } from '../../chatrooms/store/chatroomsSlice';
import socketService from '../../../shared/utils/socketService';
import { Message } from '../types';
import logger from '../../../shared/utils/logger';

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((s) => s.auth);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!token || !user || initializedRef.current) return;
    initializedRef.current = true;

    const socket = socketService.connect(token);

    socket.on('connect', () => dispatch(setConnected(true)));
    socket.on('disconnect', () => dispatch(setConnected(false)));

    socket.on('receive_message', (message: Message) => {
      dispatch(receiveMessage(message));
      dispatch(
        updateRoomLastMessage({
          roomId: message.roomId,
          content: message.content,
          timestamp: message.timestamp,
          senderName: message.senderName,
        })
      );
    });

    socket.on('user_typing', (data: { roomId: string; userId: string; userName: string }) => {
      if (data.userId !== user.id) dispatch(setTypingUser(data));
    });

    socket.on('user_stopped_typing', (data: { roomId: string; userId: string; userName: string }) => {
      dispatch(removeTypingUser(data));
    });

    logger.info('Socket initialized');

    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [token, user, dispatch]);

  const joinRoom = useCallback((roomId: string) => {
    socketService.emit('join_room', { roomId });
    logger.info('Joined room', { roomId });
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socketService.emit('leave_room', { roomId });
    logger.info('Left room', { roomId });
  }, []);

  const sendMessage = useCallback(
    (roomId: string, content: string) => {
      if (!user) return;
      socketService.emit('send_message', { roomId, content });
    },
    [user]
  );

  const emitTyping = useCallback(
    (roomId: string) => {
      if (!user) return;
      socketService.emit('user_typing', { roomId, userId: user.id, userName: `${user.firstName} ${user.lastName}` });
    },
    [user]
  );

  const emitStopTyping = useCallback(
    (roomId: string) => {
      if (!user) return;
      socketService.emit('user_stopped_typing', { roomId, userId: user.id, userName: `${user.firstName} ${user.lastName}` });
    },
    [user]
  );

  return { joinRoom, leaveRoom, sendMessage, emitTyping, emitStopTyping };
};
