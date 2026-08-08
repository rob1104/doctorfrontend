import { defineStore } from 'pinia'
import { api } from '../boot/axios'
import { Notify } from 'quasar'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    whatsapp: [],
    appointments: [],
    isListening: false
  }),

  getters: {
    unreadWhatsapp: (state) => state.whatsapp.filter(n => !n.is_read).length,
    unreadAppointments: (state) => state.appointments.filter(n => !n.is_read).length,
  },

  actions: {
    async fetchNotifications() {
      try {
        const response = await api.get('/notifications')
        const all = response.data
        this.whatsapp = all.filter(n => n.type === 'whatsapp')
        this.appointments = all.filter(n => n.type === 'appointment')
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    },

    async markAsRead(id, type) {
      try {
        await api.patch(`/notifications/${id}/read`)
        const list = type === 'whatsapp' ? this.whatsapp : this.appointments
        const item = list.find(n => n.id === id)
        if (item) item.is_read = true
      } catch (error) {
        console.error('Error marking as read:', error)
      }
    },

    async markAllAsRead(type) {
      try {
        await api.post(`/notifications/mark-all-read`, null, { params: { type } })
        const list = type === 'whatsapp' ? this.whatsapp : this.appointments
        list.forEach(n => n.is_read = true)
      } catch (error) {
        console.error('Error marking all as read:', error)
      }
    },

    startListening() {
      if (this.isListening || !window.Echo) return
      
      const token = localStorage.getItem('auth_token');
      if (window.Echo.connector.options) {
        window.Echo.connector.options.auth = window.Echo.connector.options.auth || {};
        window.Echo.connector.options.auth.headers = window.Echo.connector.options.auth.headers || {};
        window.Echo.connector.options.auth.headers['Authorization'] = `Bearer ${token}`;
      }
      if (window.Echo.connector.pusher) {
        window.Echo.connector.pusher.config = window.Echo.connector.pusher.config || {};
        window.Echo.connector.pusher.config.auth = window.Echo.connector.pusher.config.auth || {};
        window.Echo.connector.pusher.config.auth.headers = window.Echo.connector.pusher.config.auth.headers || {};
        window.Echo.connector.pusher.config.auth.headers['Authorization'] = `Bearer ${token}`;
      }

      window.Echo.private('admin.notifications')
        .listen('AppointmentCreated', (e) => {
          this.fetchNotifications()
          const appointment = e.appointment
          
          let dateStr = appointment.appointment_date
          if (dateStr) {
            const parts = dateStr.split('-')
            if (parts.length === 3) dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`
          }

          Notify.create({
            color: 'primary',
            textColor: 'white',
            icon: 'notifications_active',
            message: `Nuevo paciente agendó: ${appointment.patient?.first_name} ${appointment.patient?.last_name}`,
            caption: `Fecha: ${dateStr} a las ${appointment.start_time?.substring(0,5)}`,
            position: 'top-right',
            classes: 'elegant-notify',
            timeout: 6000,
            actions: [{ label: 'Ver', color: 'white' }]
          })
        })
        .listen('WhatsAppMessageReceived', (e) => {
          if (e.message.is_from_patient) {
            this.fetchNotifications()
            const msg = e.message
            Notify.create({
              color: 'green-7',
              textColor: 'white',
              icon: 'chat',
              message: `Nuevo mensaje de WhatsApp`,
              caption: `${msg.phone} dice: "${msg.message.substring(0, 30)}..."`,
              position: 'bottom-right',
              timeout: 5000,
              classes: 'elegant-notify'
            })
          }
        })
      
      this.isListening = true
    },

    stopListening() {
      if (window.Echo) {
        window.Echo.leave('admin.notifications')
      }
      this.isListening = false
    }
  }
})
