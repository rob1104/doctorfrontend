<template>
  <q-layout view="lHh Lpr lFf" class="bg-white">
    <!-- Header tipo Glassmorphism -->
    <q-header :class="['glass-header', { 'bg-white shadow-2': scrolled }]" style="transition: all 0.3s ease;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="text-weight-bold row items-center">
          <q-avatar size="36px" color="primary" text-color="white" class="q-mr-sm shadow-3">
            <q-icon name="medical_services" size="20px" />
          </q-avatar>
          <span class="text-dark">
            <span class="text-primary">Dr.</span> Sobrevilla
          </span>
        </q-toolbar-title>

        <q-btn
          unelevated
          rounded
          color="primary"
          label="Agendar Cita"
          class="q-px-lg shadow-2 text-weight-medium"
          no-caps
          @click="scrollToAgenda"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
</script>

<style scoped>
.glass-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #263238;
}
</style>
