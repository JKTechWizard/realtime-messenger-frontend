# Nexus Chat — Frontend

A production-grade real-time chat application frontend built with **React 18**, **Redux Toolkit**, **TypeScript**, and **custom CSS**. Feature-based folder structure, WebSocket integration via Socket.IO, and pixel-perfect UI.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| State management | Redux Toolkit + React-Redux |
| Routing | React Router v6 |
| Realtime | Socket.IO Client |
| HTTP client | Axios |
| Styling | Custom CSS (no Tailwind) |
| Fonts | Syne (display) + DM Sans (body) |

---

## Folder Structure

```
src/
├── config/
│   └── env.ts                   # Environment variable config
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   └── authApi.ts       # REST API calls (signup, login, logout, profile)
│   │   ├── components/
│   │   │   ├── Auth.css         # Auth page styles
│   │   │   ├── LoginPage.tsx    # Login screen
│   │   │   └── SignupPage.tsx   # Signup screen
│   │   ├── hooks/
│   │   │   └── useAuth.ts       # Typed hook wrapping auth Redux actions
│   │   ├── store/
│   │   │   └── authSlice.ts     # Auth Redux slice (signup/login/logout thunks)
│   │   ├── types/
│   │   │   └── index.ts         # User, AuthState, LoginPayload, SignupPayload
│   │   └── index.ts             # Barrel exports
│   │
│   ├── chatrooms/
│   │   ├── api/
│   │   │   └── chatroomsApi.ts  # REST API (getAll, create, join, leave)
│   │   ├── components/
│   │   │   ├── Chatrooms.css    # Sidebar + modal styles
│   │   │   ├── ChatroomsPage.tsx# Main layout (sidebar + panel)
│   │   │   └── CreateRoomModal.tsx
│   │   ├── store/
│   │   │   └── chatroomsSlice.ts# Rooms slice (fetch/create/join thunks)
│   │   ├── types/
│   │   │   └── index.ts         # Chatroom, ChatroomsState, CreateChatroomPayload
│   │   └── index.ts
│   │
│   └── chat/
│       ├── api/
│       │   └── chatApi.ts       # REST API (getMessages for persistence)
│       ├── components/
│       │   ├── Chat.css         # Chat panel styles
│       │   └── ChatPanel.tsx    # Full chat UI (header, messages, input)
│       ├── hooks/
│       │   └── useSocket.ts     # Socket lifecycle (join/leave/send/typing)
│       ├── store/
│       │   └── chatSlice.ts     # Messages, typing indicators, connection state
│       ├── types/
│       │   └── index.ts         # Message, ChatState, SendMessagePayload
│       └── index.ts
│
├── shared/
│   ├── components/
│   │   └── ProtectedRoute.tsx   # Auth guard for protected routes
│   ├── utils/
│   │   ├── apiClient.ts         # Axios instance with JWT interceptors
│   │   ├── socketService.ts     # Singleton Socket.IO service
│   │   ├── logger.ts            # Structured logger (info/warn/error/debug)
│   │   ├── helpers.ts           # Date formatting, initials, avatar colors, etc.
│   │   └── index.ts
│   └── types/
│       └── index.ts             # ApiError, ApiResponse, LoadingState
│
├── store/
│   └── index.ts                 # Redux store + typed hooks (useAppDispatch/Selector)
│
├── styles/
│   └── global.css               # CSS variables, resets, fonts, scrollbar
│
├── App.tsx                      # Root component with BrowserRouter + Routes
└── index.tsx                    # ReactDOM entry point
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- A running backend server (see backend README)

### Installation

```bash
cd chatroom-app
npm install
```

### Environment Variables

Copy `.env` and update values:

```bash
cp .env .env.local
```

| Variable | Description | Default |
|---|---|---|
| `REACT_APP_API_BASE_URL` | Backend REST API base URL | `http://localhost:5000/api` |
| `REACT_APP_SOCKET_URL` | Socket.IO server URL | `http://localhost:5000` |
| `REACT_APP_ENV` | Environment (`development`/`production`) | `development` |

### Run

```bash
npm start        # Development server at http://localhost:3000
npm run build    # Production build
```

---

## Features

### Authentication
- Signup with first name, last name, email, password
- Login with email + password
- JWT token stored in `localStorage`, auto-attached via Axios interceptor
- Auto-redirect on login/logout
- Form validation with inline errors

### Chatrooms
- Sidebar listing all rooms with last message preview + member count
- Create new room via modal (name + optional description)
- Join any room on click (auto-calls REST + socket join)
- Search/filter rooms by name
- Room avatar with deterministic color from roomId

### Real-time Chat
- WebSocket connection via Socket.IO with JWT auth
- Send messages with Enter key (Shift+Enter for newline)
- Receive messages in real time from other users
- Typing indicators with debounce (1.2s)
- Live connection status badge in header
- Auto-scroll to latest message

### Data Persistence
- All past messages fetched via REST API when entering a room
- Re-joining a room shows full message history
- Messages grouped by date with dividers
- Consecutive messages from same sender are visually grouped

### UX Details
- Skeleton loaders for rooms and messages
- Graceful error states
- Structured logging via `logger.ts`
- All config via environment variables

---

## Backend Contract

### REST API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| POST | `/api/auth/logout` | ✅ | Invalidate session |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/chatrooms` | ✅ | List all rooms |
| POST | `/api/chatrooms` | ✅ | Create room |
| POST | `/api/chatrooms/:roomId/join` | ✅ | Join room |
| POST | `/api/chatrooms/:roomId/leave` | ✅ | Leave room |
| GET | `/api/chatrooms/:roomId/messages` | ✅ | Get message history |

### Socket.IO Events

**Client → Server:**
- `join_room` `{ roomId }`
- `leave_room` `{ roomId }`
- `send_message` `{ roomId, content }`
- `user_typing` `{ roomId, userId, userName }`
- `user_stopped_typing` `{ roomId, userId, userName }`

**Server → Client:**
- `receive_message` `{ messageId, senderId, senderName, roomId, content, timestamp }`
- `user_typing` `{ roomId, userId, userName }`
- `user_stopped_typing` `{ roomId, userId, userName }`
