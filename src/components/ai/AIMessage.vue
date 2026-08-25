<template>
  <div :class="['message-wrapper', isUser ? 'user-message' : 'ai-message']">
    <div class="message-bubble">
      <div v-if="!isUser" class="avatar">
        <q-avatar size="32px" color="primary" text-color="white" icon="support_agent" />
      </div>
      <div class="content">
        <div class="text" v-html="formattedText"></div>
        <slot></slot>
      </div>
      <div v-if="isUser" class="avatar user-avatar">
        <q-avatar size="32px" color="grey-3" text-color="grey-8" icon="person" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const isUser = computed(() => props.message.role === 'user')

const formattedText = computed(() => {
  if (!props.message.text) return ''
  // Basic markdown-like formatting (bold)
  return props.message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
})
</script>

<style scoped>
.message-wrapper {
  display: flex;
  margin-bottom: 16px;
  width: 100%;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-bubble {
  display: flex;
  max-width: 85%;
  align-items: flex-end;
  gap: 8px;
}

.content {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.user-message .content {
  background-color: #e3f2fd;
  color: #0d47a1;
  border-bottom-right-radius: 4px;
}

.ai-message .content {
  background-color: white;
  color: #333;
  border-bottom-left-radius: 4px;
}

.text {
  word-wrap: break-word;
}
</style>
