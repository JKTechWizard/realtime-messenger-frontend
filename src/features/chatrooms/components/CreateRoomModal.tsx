// src/features/chatrooms/components/CreateRoomModal.tsx
import React, { useState } from 'react';
import { useAppDispatch } from '../../../store';
import { createChatroom } from '../store/chatroomsSlice';

interface Props {
  onClose: () => void;
}

const CreateRoomModal: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setNameError('Room name is required');
      return;
    }
    if (roomName.trim().length < 3) {
      setNameError('Room name must be at least 3 characters');
      return;
    }
    setLoading(true);
    const result = await dispatch(createChatroom({ roomName: roomName.trim(), description: description.trim() }));
    setLoading(false);
    if (createChatroom.fulfilled.match(result)) onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Create a Room</h2>
            <p className="modal-subtitle">Start a new conversation space</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="modal-field">
            <label htmlFor="roomName">Room Name *</label>
            <input
              id="roomName"
              type="text"
              placeholder="e.g. design-team, general, announcements"
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
                if (nameError) setNameError('');
              }}
              maxLength={50}
              autoFocus
            />
            {nameError && <span className="modal-field-error">{nameError}</span>}
          </div>

          <div className="modal-field">
            <label htmlFor="description">Description <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              id="description"
              placeholder="What's this room for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={200}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-submit-btn" disabled={loading}>
              {loading ? 'Creating…' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
