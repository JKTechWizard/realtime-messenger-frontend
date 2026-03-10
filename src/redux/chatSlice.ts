import { createSlice } from "@reduxjs/toolkit"
import type { Message } from "../types/index.ts"

interface ChatState {
  messages: Message[]
}

const initialState: ChatState = {
  messages: []
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload
    },
    addMessage(state, action) {
      state.messages.push(action.payload)
    }
  }
})

export const { setMessages, addMessage } = chatSlice.actions
export default chatSlice.reducer