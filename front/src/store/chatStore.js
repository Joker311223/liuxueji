import { create } from 'zustand'

const useChatStore = create((set, get) => ({
  messages: [],
  currentKnowledge: null,
  isStreaming: false,
  config: {
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1.0,
  },

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now() }]
  })),

  updateLastMessage: (content) => set((state) => {
    const messages = [...state.messages]
    if (messages.length > 0) {
      messages[messages.length - 1].content = content
    }
    return { messages }
  }),

  setStreaming: (isStreaming) => set({ isStreaming }),

  setCurrentKnowledge: (knowledge) => set({ currentKnowledge: knowledge }),

  updateConfig: (newConfig) => set((state) => ({
    config: { ...state.config, ...newConfig }
  })),

  clearMessages: () => set({ messages: [] }),
}))

export default useChatStore
