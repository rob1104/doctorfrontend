<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-dark" style="border-bottom: 1px solid #E0E0E0">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          color="dark"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title class="text-weight-bold">
          <span class="text-primary">Dr.</span> Sobrevilla
        </q-toolbar-title>
        <div class="text-grey-7 text-caption q-mr-md hidden-xs">Panel Administrativo</div>

        <!-- Dark Mode Toggle -->
        <q-btn flat dense round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" :color="$q.dark.isActive ? 'warning' : 'dark'" class="q-mr-sm" @click="toggleDarkMode" />

        <!-- Notificaciones de Citas -->
        <q-btn flat dense round icon="event" color="dark" class="q-mr-sm">
          <q-badge v-if="notificationsStore.unreadAppointments > 0" color="red" floating>
            {{ notificationsStore.unreadAppointments }}
          </q-badge>
          <q-menu max-height="400px" style="min-width: 300px;">
            <q-list separator>
              <q-item-label header class="text-weight-bold row items-center justify-between">
                Citas Nuevas
                <q-btn v-if="notificationsStore.unreadAppointments > 0" flat dense color="primary" label="Marcar todas leídas" @click="notificationsStore.markAllAsRead('appointment')" size="sm" />
              </q-item-label>
              <q-item v-if="notificationsStore.appointments.length === 0">
                <q-item-section class="text-grey text-center">No hay notificaciones</q-item-section>
              </q-item>
              <q-item v-for="notif in notificationsStore.appointments" :key="notif.id" clickable v-ripple @click="handleNotificationClick(notif, 'appointment')" :class="!notif.is_read ? 'bg-blue-1' : ''">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" icon="event_available" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ notif.data.patient?.first_name }} {{ notif.data.patient?.last_name }}</q-item-label>
                  <q-item-label caption lines="1">{{ notif.data.appointment_date }} a las {{ notif.data.start_time?.substring(0,5) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- Notificaciones de WhatsApp -->
        <q-btn flat dense round icon="chat" color="dark" class="q-mr-md">
          <q-badge v-if="notificationsStore.unreadWhatsapp > 0" color="red" floating>
            {{ notificationsStore.unreadWhatsapp }}
          </q-badge>
          <q-menu max-height="400px" style="min-width: 300px;">
            <q-list separator>
              <q-item-label header class="text-weight-bold row items-center justify-between">
                Mensajes de WhatsApp
                <q-btn v-if="notificationsStore.unreadWhatsapp > 0" flat dense color="green" label="Marcar todos leídos" @click="notificationsStore.markAllAsRead('whatsapp')" size="sm" />
              </q-item-label>
              <q-item v-if="notificationsStore.whatsapp.length === 0">
                <q-item-section class="text-grey text-center">No hay mensajes nuevos</q-item-section>
              </q-item>
              <q-item v-for="notif in notificationsStore.whatsapp" :key="notif.id" clickable v-ripple @click="handleNotificationClick(notif, 'whatsapp')" :class="!notif.is_read ? 'bg-green-1' : ''">
                <q-item-section avatar>
                  <q-avatar color="green" text-color="white" icon="chat" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ notif.data.patient_name || notif.data.phone }}</q-item-label>
                  <q-item-label caption lines="1">{{ notif.data.message }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-dark text-white"
    >
      <div class="q-pa-lg text-center">
        <q-avatar size="64px" color="primary" text-color="white" class="q-mb-sm shadow-3">
          <q-icon name="admin_panel_settings" />
        </q-avatar>
        <div class="text-weight-bold text-subtitle1">Portal Médico</div>
        <div class="text-caption text-grey-4">Dermatología</div>
      </div>
      
      <q-separator dark class="q-my-md opacity-50" />

      <q-list class="q-px-sm">
        <q-item clickable tag="a" href="#/admin/dashboard" class="rounded-borders q-mb-sm">
          <q-item-section avatar>
            <q-icon name="dashboard" color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
            <q-item-label caption class="text-grey-5">Agenda y Panel</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable tag="a" href="#/admin/patients" class="rounded-borders q-mb-sm">
          <q-item-section avatar>
            <q-icon name="people" color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pacientes</q-item-label>
            <q-item-label caption class="text-grey-5">Directorio y Expedientes</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" href="#/admin/cobranza" class="rounded-borders q-mb-sm">
          <q-item-section avatar>
            <q-icon name="payments" color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cobranza</q-item-label>
            <q-item-label caption class="text-grey-5">Pagos y Facturación</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" href="#/admin/medications" class="rounded-borders q-mb-sm">
          <q-item-section avatar>
            <q-icon name="vaccines" color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Medicamentos</q-item-label>
            <q-item-label caption class="text-grey-5">Catálogo y Recetas</q-item-label>
          </q-item-section>
        </q-item>

        <q-item 
          clickable 
          tag="a" 
          href="#/admin/users" 
          class="rounded-borders q-mb-sm"
          v-if="!authStore.user || authStore.user.id === 1 || ['admin', 'administrador', 'doctor'].includes((authStore.user.role || '').toLowerCase())"
        >
          <q-item-section avatar>
            <q-icon name="manage_accounts" color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Usuarios</q-item-label>
            <q-item-label caption class="text-grey-5">Control de Accesos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" href="#/admin/settings" class="rounded-borders q-mb-sm">
          <q-item-section avatar>
            <q-icon name="settings" color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Configuración</q-item-label>
            <q-item-label caption class="text-grey-5">Formato de Recetas</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" href="#/" target="_blank" class="rounded-borders q-mb-sm">
          <q-item-section avatar>
            <q-icon name="open_in_new" color="grey-5" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-grey-4">Ver Landing Page</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="logout" class="rounded-borders">
          <q-item-section avatar>
            <q-icon name="logout" color="red-4" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-red-4">Cerrar Sesión</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="absolute-bottom text-center q-pb-md text-grey-5 text-caption">
        Versión {{ version }}
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'
import { useNotificationsStore } from '../stores/notifications'

const router = useRouter()
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const $q = useQuasar()

const leftDrawerOpen = ref(false)
const version = import.meta.env.VITE_APP_VERSION || 'Desarrollo'

onMounted(() => {
  notificationsStore.fetchNotifications()
  notificationsStore.startListening()
})

onUnmounted(() => {
  notificationsStore.stopListening()
})

const handleNotificationClick = async (notif, type) => {
  if (!notif.is_read) {
    await notificationsStore.markAsRead(notif.id, type)
  }
  
  if (type === 'whatsapp') {
    router.push({ path: '/admin/dashboard', query: { openChat: notif.data.phone } })
  } else if (type === 'appointment') {
    router.push({ path: '/admin/dashboard', query: { openAppointment: notif.data.id } })
  }
}

const toggleDarkMode = () => {
  $q.dark.toggle()
  localStorage.setItem('darkMode', $q.dark.isActive)
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = async () => {
  try {
    const { api } = await import('../boot/axios')
    await api.post('/logout')
  } catch(e) {} finally {
    authStore.logout()
    router.push('/login')
  }
}
</script>
