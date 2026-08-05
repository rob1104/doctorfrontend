import { boot } from 'quasar/wrappers'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

export default boot(({ app }) => {
  // Configuración para Laravel Reverb
  window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'h4orsgy6vuvmu4iwjbvr', 
    wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    encrypted: import.meta.env.VITE_REVERB_SCHEME === 'https',
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    
    // Auth endpoint para canales privados usando Sanctum
    authEndpoint: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '/broadcasting/auth') : 'http://localhost:8000/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    }
  })

  app.config.globalProperties.$echo = window.Echo
})
