// src/features/chat/components/ChatPanel.tsx
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchMessages } from '../store/chatSlice';
import { useSocket } from '../hooks/useSocket';
import { Chatroom } from '../../chatrooms/types';
import { Message } from '../types';
import { getInitials, generateAvatarColor, formatMessageTime } from '../../../shared/utils/helpers';
import './Chat.css';

interface Props { room: Chatroom; }

const TYPING_DEBOUNCE_MS = 1200;

// Checkmark SVG (double tick like WhatsApp)
const CheckIcon: React.FC<{ color?: string }> = ({ color = 'currentColor' }) => (
  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 4L4.5 7.5L9 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 4L8.5 7.5L13 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChatPanel: React.FC<Props> = ({ room }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { messages: allMessages, loading, typingUsers, isConnected } = useAppSelector((s) => s.chat);
  const { joinRoom, leaveRoom, sendMessage, emitTyping, emitStopTyping } = useSocket();

  const messages = allMessages[room.roomId] ?? [];
  const typingList = typingUsers[room.roomId] ?? [];

  const [inputValue, setInputValue] = useState('');
  const inputValueRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    dispatch(fetchMessages(room.roomId));
    joinRoom(room.roomId);
    return () => { leaveRoom(room.roomId); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = textareaRef.current?.value.trim() ?? '';
    if (!trimmed) return;
    sendMessage(room.roomId, trimmed);
    setInputValue('');
    inputValueRef.current = '';
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
    }
    if (isTypingRef.current) { emitStopTyping(room.roomId); isTypingRef.current = false; }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setInputValue(value);
    inputValueRef.current = value;
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    if (value && !isTypingRef.current) { isTypingRef.current = true; emitTyping(room.roomId); }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      if (isTypingRef.current) { isTypingRef.current = false; emitStopTyping(room.roomId); }
    }, TYPING_DEBOUNCE_MS);
  };

  const groupedMessages = groupMessagesByDate(messages);
  const roomAvatarColor = generateAvatarColor(room.roomId);
  const roomInitial = room.roomName.charAt(0).toUpperCase();

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-avatar-wrapper">
            <div className="chat-header-avatar" style={{ background: roomAvatarColor }}>
              {roomInitial}
            </div>
            <span className="chat-header-status-dot" />
          </div>
          <div className="chat-room-info">
            <h2>{room.roomName}</h2>
            <div className="chat-room-meta">
              {room.participants.length} {room.participants.length === 1 ? 'member' : 'members'}
            </div>
          </div>
        </div>
        <div className="chat-header-right">
          <div className={`connection-badge ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="connection-badge-dot" />
            {isConnected ? 'Live' : 'Reconnecting…'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages-area">
        {loading && (
          <div className="messages-loading">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="message-skeleton-row" style={{ flexDirection: i % 3 === 0 ? 'row-reverse' : 'row' }}>
                <div className="message-skeleton-avatar" />
                <div className="message-skeleton-bubble" style={{ width: `${130 + i * 30}px` }} />
              </div>
            ))}
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="chat-empty-messages">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              No messages yet — say hello!
            </p>
          </div>
        )}

        {groupedMessages.map(({ date, msgs }) => (
          <div key={date}>
            <div className="chat-date-divider"><span>{date}</span></div>
            {renderMessageGroups(msgs, user?.id ?? '')}
          </div>
        ))}

        {/* Typing indicator */}
        {typingList.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-bubbles">
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
            <span className="typing-label">
              {typingList.length === 1
                ? `${typingList[0]} is typing…`
                : `${typingList.slice(0, 2).join(', ')} are typing…`}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          {/* Left — plus icon */}
          <button className="chat-action-btn" aria-label="Attach file">
            <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>

          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Write your message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          {/* Right — mic icon + send button */}
          <div className="chat-input-actions">
            <button className="chat-action-btn" aria-label="Voice message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Helpers ─── */

interface DateGroup { date: string; msgs: Message[]; }

function groupMessagesByDate(messages: Message[]): DateGroup[] {
  const groups: Record<string, Message[]> = {};
  messages.forEach((msg) => {
    const date = new Date(msg.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let label: string;
    if (isSameDay(date, today)) label = 'Today';
    else if (isSameDay(date, yesterday)) label = 'Yesterday';
    else label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(msg);
  });
  return Object.entries(groups).map(([date, msgs]) => ({ date, msgs }));
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function renderMessageGroups(msgs: Message[], currentUserId: string): React.ReactNode {
  // Group consecutive messages from the same sender
  const groups: Message[][] = [];
  let cur: Message[] = [];
  let lastId = '';
  msgs.forEach((msg) => {
    if (msg.senderId !== lastId) {
      if (cur.length) groups.push(cur);
      cur = [msg];
      lastId = msg.senderId;
    } else {
      cur.push(msg);
    }
  });
  if (cur.length) groups.push(cur);

  return groups.map((group, gi) => {
    const isOwn = group[0].senderId === currentUserId;
    const nameParts = group[0].senderName.split(' ');
    const initials = getInitials(nameParts[0] || '?', nameParts[1] || '?');
    const avatarColor = generateAvatarColor(group[0].senderId);

    return (
      <div key={`grp-${gi}-${group[0].messageId}`} className="message-group">
        {group.map((msg, mi) => {
          const isLast = mi === group.length - 1;
          const time = formatMessageTime(msg.timestamp);

          return (
            <div key={msg.messageId} className={`message-row ${isOwn ? 'own' : ''}`}>
              {/* Avatar: only show on the last message of a group */}
              {!isOwn && (
                isLast
                  ? <div className="message-avatar" style={{ background: avatarColor }}>{initials}</div>
                  : <div className="message-avatar-spacer" />
              )}

              <div className="message-content">
                <div className="message-bubble">
                  {msg.content}
                  {/* Inline time + double tick */}
                  <div className="message-bubble-footer">
                    <span className="message-time-inline">{time}</span>
                    <span className="message-check">
                      {isOwn
                        ? <CheckIcon color="rgba(255,255,255,0.8)" />
                        : <CheckIcon color="rgba(0,0,0,0.4)" />}
                    </span>
                  </div>
                </div>
                {/* "✔ Sent" label below last own message in group */}
                {isOwn && isLast && (
                  <div className="message-sent-label">
                    <svg width="12" height="8" viewBox="0 0 14 9" fill="none">
                      <path d="M1 4L4.5 7.5L9 2" stroke="#6c63ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 4L8.5 7.5L13 2" stroke="#6c63ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Sent
                  </div>
                )}
              </div>

              {isOwn && (
                isLast
                  ? <div className="message-avatar" style={{ background: avatarColor }}>{initials}</div>
                  : <div className="message-avatar-spacer" />
              )}
            </div>
          );
        })}
      </div>
    );
  });
}

export default ChatPanel;
