export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
}

export interface ChatRoom {
  roomId: string
  roomName: string
  createdBy: string
  participants: string[]
}

export interface Message {
  messageId: string
  senderId: string
  roomId: string
  content: string
  timestamp: string
}