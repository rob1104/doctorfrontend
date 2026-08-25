<template>
  <q-layout view="lHh Lpr lFf" container class="chat-layout bg-grey-2" style="height: 100%; width: 100%;">
    <q-header class="chat-header bg-primary text-white row items-center q-pa-md shadow-2">
      <q-avatar size="40px" class="q-mr-md bg-white">
        <q-icon name="support_agent" color="primary" />
      </q-avatar>
      <div>
        <div class="text-h6 text-white" style="line-height: 1.2;">Asistente Virtual</div>
        <div class="text-caption text-blue-2">Clínica Dr. Sobrevilla</div>
      </div>
      <q-space />
      <q-btn flat round dense icon="refresh" @click="store.clearConversation" class="q-mr-sm">
        <q-tooltip>Reiniciar conversación</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="close" @click="$emit('close')">
        <q-tooltip>Cerrar chat</q-tooltip>
      </q-btn>
    </q-header>
    
    <q-page-container>
      <q-page class="chat-messages q-pa-md">
        <div v-if="store.messages.length === 0" class="text-center q-my-xl text-grey-6">
          <q-icon name="forum" size="4xl" class="q-mb-md opacity-50" />
          <div class="text-h6">¡Hola!</div>
          <p>Soy el asistente virtual. Puedo ayudarte a consultar disponibilidad y agendar tu cita médica.</p>
          <p>¿En qué te puedo ayudar hoy?</p>
        </div>

        <div v-for="(msg, index) in store.messages" :key="msg.id">
          <AIMessage :message="msg">
            <AppointmentConfirmation 
              v-if="msg.requiresConfirmation && index === store.messages.length - 1" 
              @respond="handleSuggestion" 
              :disabled="store.isLoading"
            />
          </AIMessage>
        </div>
        
        <div v-if="store.isLoading" class="q-my-md flex items-center text-grey-6">
          <q-spinner-dots size="2em" color="primary" class="q-mr-sm" />
          <span>Escribiendo...</span>
        </div>
        
        <!-- Elemento ancla para el scroll -->
        <div ref="scrollTarget"></div>
      </q-page>
    </q-page-container>
    
    <q-footer class="chat-input-area q-pa-sm bg-white shadow-up-2">
      <q-form @submit.prevent="sendMessage" class="row items-center no-wrap">
        <q-input 
          ref="inputRef"
          v-model="inputText" 
          outlined 
          rounded 
          dense
          placeholder="Escribe un mensaje..." 
          class="col q-mr-sm text-black"
          :disable="store.isLoading"
          bg-color="grey-1"
          autofocus
        />
        <q-btn 
          round 
          color="primary" 
          icon="send" 
          type="submit" 
          :disable="!inputText.trim() || store.isLoading"
        />
      </q-form>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUpdated, nextTick, watch } from 'vue'
import { useAiAgentStore } from '../../stores/aiAgentStore'
import AIMessage from './AIMessage.vue'
import AppointmentConfirmation from './AppointmentConfirmation.vue'

const store = useAiAgentStore()
const inputText = ref('')
const scrollTarget = ref(null)
const inputRef = ref(null)

watch(() => store.isLoading, async (loading) => {
  if (!loading) {
    await nextTick()
    if (inputRef.value) {
      inputRef.value.focus()
    }
  }
  scrollToBottom()
})

watch(() => store.messages.length, () => {
  scrollToBottom()
})

const scrollToBottom = () => {
  setTimeout(() => {
    // Buscar el contenedor con scroll real generado por q-layout
    const scrollEl = document.querySelector('.chat-layout .scroll') || document.querySelector('.chat-messages').closest('.scroll')
    
    if (scrollEl) {
      scrollEl.scrollTo({
        top: scrollEl.scrollHeight,
        behavior: 'smooth'
      })
    } else if (scrollTarget.value) {
      scrollTarget.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, 150) // Retraso ligeramente mayor para asegurar layout completo
}

onMounted(() => {
  scrollToBottom()
})

const sendMessage = () => {
  if (!inputText.value.trim() || store.isLoading) return
  const text = inputText.value
  inputText.value = ''
  store.sendMessage(text)
}

const handleSuggestion = (response) => {
  if (store.isLoading) return
  store.sendMessage(response)
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background: #f8f9fa;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.chat-input-area {
  border-top: 1px solid #e0e0e0;
}
</style>
