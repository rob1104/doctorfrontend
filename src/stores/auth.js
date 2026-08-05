import { defineStore } from 'pinia'
import { api } from '../boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/login', {
          email,
          password
        })
        
        this.token = response.data.access_token
        this.user = response.data.user
        
        localStorage.setItem('auth_token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return true
      } catch (error) {
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    },

    loadUser() {
      if (this.token) {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          this.user = JSON.parse(userStr)
        }
      }
    }
  }
})
