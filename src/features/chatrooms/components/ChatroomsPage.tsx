// src/features/chatrooms/components/ChatroomsPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchChatrooms, setCurrentRoom, joinChatroom } from '../store/chatroomsSlice';
import { logout } from '../../auth/store/authSlice';
import { useSocket } from '../../chat/hooks/useSocket';
import ChatPanel from '../../chat/components/ChatPanel';
import CreateRoomModal from './CreateRoomModal';
import { Chatroom } from '../types';
import { getInitials, generateAvatarColor, truncate, formatTimestamp } from '../../../shared/utils/helpers';
import './Chatrooms.css';

const ChatroomsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { rooms, currentRoom, loading, error } = useAppSelector((s) => s.chatrooms);
  const { isConnected } = useAppSelector((s) => s.chat);
  const { joinRoom, leaveRoom } = useSocket();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { dispatch(fetchChatrooms()); }, [dispatch]);

  const handleRoomClick = useCallback(
    async (room: Chatroom) => {
      if (currentRoom?.roomId === room.roomId) return;
      if (currentRoom) leaveRoom(currentRoom.roomId);
      const isParticipant = room.participants.includes(user?.id ?? '');
      if (!isParticipant) {
        await dispatch(joinChatroom(room.roomId));
      } else {
        dispatch(setCurrentRoom(room));
      }
      joinRoom(room.roomId);
    },
    [currentRoom, dispatch, joinRoom, leaveRoom, user]
  );

  const handleLogout = async () => {
    if (currentRoom) leaveRoom(currentRoom.roomId);
    await dispatch(logout());
    navigate('/login');
  };

  const filteredRooms = rooms.filter((r) =>
    r.roomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userInitials = user ? getInitials(user.firstName, user.lastName) : '?';
  const userFullName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <div className="chatrooms-layout">
      {/* ── Sidebar ── */}
      <aside className="chatrooms-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">My Chats</h1>
          <div className="sidebar-search">
            <span className="sidebar-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <button className="create-room-btn" onClick={() => setShowCreateModal(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Room
        </button>

        <div className="sidebar-rooms-list">
          {loading && (
            <div className="rooms-loading">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="room-skeleton" />)}
            </div>
          )}

          {error && <p className="sidebar-error">{error}</p>}

          {!loading && filteredRooms.length === 0 && (
            <p style={{ padding: '16px 24px', fontSize: 13, color: 'var(--color-text-muted)' }}>
              {searchQuery ? 'No rooms match your search' : 'No rooms yet — create one!'}
            </p>
          )}

          {filteredRooms.map((room) => {
            const isActive = currentRoom?.roomId === room.roomId;
            const avatarColor = generateAvatarColor(room.roomId);
            const initial = room.roomName.charAt(0).toUpperCase();
            const lastMsg = room.lastMessage;
            // Fake unread badge for demo — in real app this comes from backend
            const unread = 0;

            return (
              <div
                key={room.roomId}
                className={`room-item ${isActive ? 'active' : ''}`}
                onClick={() => handleRoomClick(room)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleRoomClick(room)}
              >
                {/* Avatar with status dot */}
                <div className="room-avatar-wrapper">
                  <div className="room-avatar" style={{ background: avatarColor }}>
                    {initial}
                  </div>
                  <span className={`room-status-dot ${isConnected ? 'online' : 'offline'}`} />
                </div>

                {/* Text */}
                <div className="room-info">
                  <div className="room-name">{room.roomName}</div>
                  <div className="room-last-message">
                    {lastMsg
                      ? truncate(lastMsg.content, 35)
                      : room.description
                      ? truncate(room.description, 35)
                      : 'No messages yet'}
                  </div>
                </div>

                {/* Meta */}
                <div className="room-meta">
                  <span className="room-time">
                    {lastMsg ? formatTimestamp(lastMsg.timestamp) : ''}
                  </span>
                  {unread > 0 && (
                    <span className="room-badge">{unread > 999 ? '999' : unread}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-avatar">{userInitials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userFullName}</div>
            <div className="sidebar-user-status">Online</div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Sign out" aria-label="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      {currentRoom ? (
        <ChatPanel room={currentRoom} />
      ) : (
        <div className="chatrooms-empty">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <h3>Select a conversation</h3>
          <p>Choose a room from the sidebar or create a new one to begin chatting.</p>
        </div>
      )}

      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};

export default ChatroomsPage;
