<template>
  <q-layout view="lHh Lpr lFf" :class="{ 'bg-dark text-white': $q.dark.isActive, 'bg-white text-dark': !$q.dark.isActive }">
    <!-- Header tipo Glassmorphism -->
    <q-header :class="['glass-header', { 'glass-header-scrolled shadow-2': scrolled, 'glass-dark': $q.dark.isActive }]" style="transition: all 0.3s ease;">
      <q-toolbar class="q-py-md max-width-container q-px-md">
        <q-toolbar-title class="text-weight-bold row items-center cursor-pointer" @click="scrollToTop">
          <q-avatar size="42px" color="primary" text-color="white" class="q-mr-sm shadow-3">
            <q-icon name="spa" size="24px" />
          </q-avatar>
          <div class="column justify-center" style="line-height: 1.2;">
            <span :class="$q.dark.isActive ? 'text-white' : 'text-dark'" class="text-subtitle1">
              <span class="text-primary text-weight-bolder">Dr.</span> Sobrevilla
            </span>
            <span class="text-caption text-grey-6 text-weight-medium" style="font-size: 11px;">Dermatólogo Certificado</span>
          </div>
        </q-toolbar-title>

        <q-space />

        <!-- Desktop Navigation -->
        <div class="gt-sm row items-center q-gutter-x-md q-mr-lg">
          <q-btn flat no-caps label="Servicios" @click="scrollTo('seccion-servicios')" class="nav-link" :class="$q.dark.isActive ? 'text-grey-3' : 'text-grey-8'" />
          <q-btn flat no-caps label="El Dermatólogo" @click="scrollTo('seccion-doctor')" class="nav-link" :class="$q.dark.isActive ? 'text-grey-3' : 'text-grey-8'" />
          <q-btn flat no-caps label="Beneficios" @click="scrollTo('seccion-beneficios')" class="nav-link" :class="$q.dark.isActive ? 'text-grey-3' : 'text-grey-8'" />
        </div>

        <div class="row items-center q-gutter-x-sm">
          <q-btn
            flat
            round
            dense
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
            :color="$q.dark.isActive ? 'warning' : 'dark'"
            @click="toggleDarkMode"
          />

          <!-- Mobile Menu Toggle -->
          <q-btn
            flat
            round
            dense
            icon="menu"
            class="lt-md"
            :color="$q.dark.isActive ? 'white' : 'dark'"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />

          <!-- Desktop CTA -->
          <q-btn
            unelevated
            rounded
            color="primary"
            label="Agendar Cita"
            class="q-px-lg shadow-3 text-weight-bold gt-xs agenda-btn"
            no-caps
            icon-right="event"
            @click="scrollTo('seccion-agendar')"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Mobile Navigation Drawer -->
    <q-drawer
      v-model="mobileMenuOpen"
      side="right"
      overlay
      behavior="mobile"
      elevated
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
    >
      <div class="q-pa-md column h-full" style="height: 100%;">
        <div class="row justify-between items-center q-mb-xl">
          <div class="text-h6 text-weight-bold">Menú</div>
          <q-btn flat round dense icon="close" @click="mobileMenuOpen = false" />
        </div>

        <q-list class="q-gutter-y-md">
          <q-item clickable v-ripple @click="scrollTo('seccion-servicios', true)" class="border-radius-8">
            <q-item-section avatar><q-icon name="spa" color="primary" /></q-item-section>
            <q-item-section class="text-subtitle1 text-weight-medium">Servicios</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="scrollTo('seccion-doctor', true)" class="border-radius-8">
            <q-item-section avatar><q-icon name="medical_information" color="primary" /></q-item-section>
            <q-item-section class="text-subtitle1 text-weight-medium">El Dermatólogo</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="scrollTo('seccion-beneficios', true)" class="border-radius-8">
            <q-item-section avatar><q-icon name="verified" color="primary" /></q-item-section>
            <q-item-section class="text-subtitle1 text-weight-medium">Beneficios</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="aiChatOpen = true; mobileMenuOpen = false" class="border-radius-8">
            <q-item-section avatar><q-icon name="support_agent" color="secondary" /></q-item-section>
            <q-item-section class="text-subtitle1 text-weight-medium">Chat Asistente</q-item-section>
          </q-item>
        </q-list>

        <q-space />
        
        <q-btn
          unelevated
          color="primary"
          label="Agendar Cita Ahora"
          class="full-width q-py-md text-subtitle1 border-radius-12 shadow-3"
          no-caps
          icon-right="event"
          @click="scrollTo('seccion-agendar', true)"
        />
      </div>
    </q-drawer>

    <q-page-container class="q-pb-xl">
      <router-view />
    </q-page-container>

    <!-- Mobile Bottom Fixed Action Bar -->
    <div class="lt-sm fixed-bottom bg-white shadow-up-3 mobile-bottom-bar" :class="{'bg-dark border-top-dark': $q.dark.isActive}">
      <div class="row items-center justify-between q-pa-sm q-gutter-x-sm">
        <q-btn
          outline
          color="secondary"
          icon="support_agent"
          label="Dudas"
          class="col border-radius-12 q-py-sm bg-transparent"
          no-caps
          @click="aiChatOpen = true"
        />
        <q-btn
          unelevated
          color="primary"
          icon="event"
          label="Agendar Cita"
          class="col-7 border-radius-12 q-py-sm shadow-2 text-weight-bold"
          no-caps
          @click="scrollTo('seccion-agendar')"
        />
      </div>
    </div>

    <!-- AI Assistant Sticky CTA (Desktop Global) -->
    <q-page-sticky position="bottom-right" :offset="[30, 30]" class="gt-xs" style="z-index: 2000;">
      <q-card 
        class="cursor-pointer ai-badge shadow-6 flex row items-center no-wrap overflow-hidden" 
        :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-white text-dark'"
        @click="aiChatOpen = true"
        style="border-radius: 30px; transition: all 0.3s ease; border: 1px solid rgba(0,0,0,0.05);"
      >
        <div class="bg-secondary text-white flex flex-center q-pa-sm" style="border-radius: 50%; margin: 4px; width: 44px; height: 44px;">
          <q-icon name="support_agent" size="24px" />
        </div>
        <div class="q-px-md q-py-sm column justify-center" style="line-height: 1.2;">
          <span class="text-weight-bold text-subtitle2">¿Tienes dudas?</span>
          <span class="text-caption" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-6'">Pregúntale a nuestro asistente</span>
        </div>
      </q-card>
    </q-page-sticky>

    <!-- AI Assistant Dialog -->
    <q-dialog v-model="aiChatOpen" :position="$q.screen.lt.sm ? 'standard' : 'bottom'" :maximized="$q.screen.lt.sm" transition-show="slide-up" transition-hide="slide-down">
      <div :class="$q.screen.lt.sm ? 'bg-white window-width' : 'bg-white'" :style="$q.screen.lt.sm ? 'height: 100dvh; display: flex; flex-direction: column;' : 'width: 100%; max-width: 420px; height: 75vh; max-height: 650px; border-radius: 20px 20px 0 0; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 -10px 40px rgba(0,0,0,0.15);'">
        <AIChat @close="aiChatOpen = false" style="flex-grow: 1;" />
      </div>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import AIChat from '../components/ai/AIChat.vue'

const $q = useQuasar()
const scrolled = ref(false)
const aiChatOpen = ref(false)
const mobileMenuOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const openAiChat = () => {
  aiChatOpen.value = true
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('open-ai-chat', openAiChat)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('open-ai-chat', openAiChat)
})

const scrollTo = (id, closeMenu = false) => {
  if (closeMenu) mobileMenuOpen.value = false;
  // Let DOM update if drawer closes
  setTimeout(() => {
    const el = document.getElementById(id)
    if (el) {
      // Adjusted offset for sticky header
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, 100)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleDarkMode = () => {
  $q.dark.toggle()
  localStorage.setItem('darkMode', $q.dark.isActive)
}
</script>

<style scoped>
.max-width-container {
  max-width: 1200px;
  margin: 0 auto;
}

.glass-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 2000;
}

.glass-header.glass-dark {
  background: rgba(18, 18, 18, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-header-scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.glass-header-scrolled.glass-dark {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.nav-link {
  font-weight: 500;
  font-size: 15px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(0, 150, 136, 0.08); /* Primary color low opacity */
  color: var(--q-primary) !important;
}

.agenda-btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.agenda-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 150, 136, 0.3) !important;
}

.mobile-bottom-bar {
  z-index: 2000;
  padding-bottom: env(safe-area-inset-bottom);
}

.shadow-up-3 {
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.08);
}

.border-top-dark {
  border-top: 1px solid rgba(255,255,255,0.05);
}

.border-radius-8 { border-radius: 8px; }
.border-radius-12 { border-radius: 12px; }

.ai-badge:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}
</style>
