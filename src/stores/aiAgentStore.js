import { defineStore } from 'pinia'
import { api } from '../boot/axios'

export const useAiAgentStore = defineStore('aiAgent', {
  state: () => ({
    conversationId: null,
    messages: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async sendMessage(text) {
      if (!text.trim()) return

      // Add user message to UI immediately
      this.messages.push({
        id: Date.now(),
        role: 'user',
        text: text,
      })

      this.isLoading = true
      this.error = null

      try {
        const response = await api.post('/ai/medical-agent/chat', {
          conversation_id: this.conversationId,
          message: text,
        })

        if (!this.conversationId && response.data.conversation_id) {
          this.conversationId = response.data.conversation_id
        }

        // Add AI message to UI
        this.messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          text: response.data.message,
          action: response.data.action,
          requiresConfirmation: response.data.requires_confirmation,
          appointment: response.data.appointment
        })
      } catch (err) {
        console.error('Error sending message:', err)
        this.error = 'Hubo un problema al conectar con el asistente. Por favor, intenta nuevamente.'
        
        this.messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          text: 'Lo siento, he perdido la conexión. Por favor intenta de nuevo.',
          isError: true
        })
      } finally {
        this.isLoading = false
      }
    },

    clearConversation() {
      this.conversationId = null
      this.messages = []
      this.error = null
    }
  }
})
