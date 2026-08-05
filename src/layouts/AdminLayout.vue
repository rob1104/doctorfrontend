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
        <div class="text-grey-7 text-caption">Panel Administrativo</div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)
const version = import.meta.env.VITE_APP_VERSION || 'Desarrollo'

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
