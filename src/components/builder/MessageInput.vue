<template>
  <div class="message-input-container">
    <div class="input-wrapper">
      <!-- Text area for user input -->
      <textarea
        v-model="message"
        @keydown.enter.exact.prevent="handleSend"
        @keydown.enter.shift.exact="handleNewLine"
        placeholder="Type your message..."
        :disabled="disabled"
        ref="textarea"
        rows="1"
        class="message-textarea"
      />

      <!-- Action buttons -->
      <div class="input-actions">
        <button
          @click="handleImprove"
          :disabled="disabled || !message.trim()"
          class="improve-button"
        >
          Improve
        </button>
        <button
          @click="handleSend"
          :disabled="disabled || !message.trim()"
          class="send-button"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['send-message', 'improve'])

const message = ref('')
const textarea = ref(null)

// Auto-resize textarea
const autoResize = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

watch(message, () => {
  nextTick(() => autoResize())
})

// Handle send
const handleSend = () => {
  if (!message.value.trim() || props.disabled) return

  emit('send-message', message.value.trim())
  message.value = ''

  nextTick(() => {
    if (textarea.value) {
      textarea.value.style.height = 'auto'
      textarea.value.focus() // Refocus after sending
    }
  })
}

// Handle improve (future feature)
const handleImprove = () => {
  if (!message.value.trim() || props.disabled) return

  // For now, just send the message
  // In the future, this could trigger an AI improvement flow
  emit('improve', message.value.trim())
  emit('send', message.value.trim())
  message.value = ''

  nextTick(() => {
    if (textarea.value) {
      textarea.value.style.height = 'auto'
      textarea.value.focus() // Refocus after improving
    }
  })
}

// Handle new line (Shift + Enter)
const handleNewLine = () => {
  message.value += '\n'
}
</script>

<style scoped>
.message-input-container {
  padding: var(--dt-space-450);
  border-top: 1px solid var(--dt-color-border-subtle);
  background: var(--dt-color-surface-primary);
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  max-width: 100%;
}

.message-textarea {
  width: 100%;
  min-height: 44px;
  max-height: 200px;
  padding: var(--dt-space-400);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-400);
  font-family: var(--dt-font-family-body);
  font-size: var(--dt-font-size-200);
  line-height: 1.5;
  color: var(--dt-color-foreground-primary);
  background: var(--dt-color-surface-primary);
  resize: none;
  overflow-y: auto;
  transition: border-color 0.2s ease;
}

.message-textarea:focus {
  outline: none;
  border-color: var(--dt-color-purple-400);
}

.message-textarea:disabled {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-disabled);
  cursor: not-allowed;
}

.message-textarea::placeholder {
  color: var(--dt-color-foreground-tertiary);
}

.input-actions {
  display: flex;
  gap: var(--dt-space-400);
  justify-content: flex-end;
}

.improve-button,
.send-button {
  padding: var(--dt-space-400) var(--dt-space-500);
  border-radius: var(--dt-size-radius-400);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.improve-button {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
  border: 1px solid var(--dt-color-border-moderate);
}

.improve-button:hover:not(:disabled) {
  background: var(--dt-color-surface-tertiary);
  border-color: var(--dt-color-border-strong);
}

.send-button {
  background: var(--dt-color-purple-400);
  color: var(--dt-color-foreground-primary-inverted);
}

.send-button:hover:not(:disabled) {
  background: var(--dt-color-purple-500);
}

.improve-button:active:not(:disabled),
.send-button:active:not(:disabled) {
  transform: scale(0.98);
}

.improve-button:disabled,
.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
