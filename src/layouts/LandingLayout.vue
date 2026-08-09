<template>
  <q-layout view="lHh Lpr lFf" :class="{ 'bg-dark text-white': $q.dark.isActive, 'bg-white text-dark': !$q.dark.isActive }">
    <!-- Header tipo Glassmorphism -->
    <q-header :class="['glass-header', { 'glass-header-scrolled shadow-2': scrolled, 'glass-dark': $q.dark.isActive }]" style="transition: all 0.3s ease;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="text-weight-bold row items-center">
          <q-avatar size="36px" color="primary" text-color="white" class="q-mr-sm shadow-3">
            <q-icon name="medical_services" size="20px" />
          </q-avatar>
          <span :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
            <span class="text-primary">Dr.</span> Sobrevilla
          </span>
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          :color="$q.dark.isActive ? 'warning' : 'dark'"
          class="q-mr-sm"
          @click="toggleDarkMode"
        />

        <q-btn
          unelevated
          rounded
          color="primary"
          label="Agendar Cita"
          class="q-px-lg shadow-2 text-weight-medium gt-xs"
          no-caps
          @click="scrollToAgenda"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Mobile Sticky CTA -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="lt-sm" style="z-index: 2000;">
      <q-btn
        fab
        icon="event"
        color="primary"
        @click="scrollToAgenda"
        class="shadow-4"
      >
        <q-tooltip>Agendar Cita</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const scrollToAgenda = () => {
  const el = document.getElementById('seccion-agendar')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const toggleDarkMode = () => {
  $q.dark.toggle()
  localStorage.setItem('darkMode', $q.dark.isActive)
}
</script>

<style scoped>
.glass-header {
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 2000;
}

.glass-header.glass-dark {
  background: #121212;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-header-scrolled {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.glass-header-scrolled.glass-dark {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
