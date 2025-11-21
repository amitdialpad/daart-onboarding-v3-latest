<template>
  <div :class="['chat-message', message.sender]">
    <!-- Message bubble -->
    <div class="message-bubble">
      <!-- Validation Card (special type) -->
      <ValidationCard
        v-if="message.type === 'validation'"
        :improvements="message.improvements || []"
        @apply-all="$emit('action-clicked', 'Apply all')"
        @review-each="$emit('action-clicked', 'Review each')"
        @skip="$emit('action-clicked', 'Skip validation')"
      />

      <!-- Visual Studio Preview (special type) -->
      <VisualStudioPreview
        v-else-if="message.type === 'visual-studio'"
        @check-vs="$emit('action-clicked', 'Check out Visual Studio')"
        @keep-building="$emit('action-clicked', 'Keep building')"
      />

      <!-- Whole Plan View (special type) -->
      <WholePlanView
        v-else-if="message.type === 'whole-plan'"
        @confirm="$emit('action-clicked', 'Confirm whole plan')"
        @cancel="$emit('action-clicked', 'Go step by step')"
      />

      <!-- Document Input (special type) -->
      <DocumentInput
        v-else-if="message.type === 'document-input'"
        @submit="(doc) => $emit('document-submitted', doc)"
        @cancel="$emit('action-clicked', 'Cancel document paste')"
      />

      <!-- Loading Progress (special type) -->
      <LoadingProgress
        v-else-if="message.type === 'loading-progress'"
        :title="message.title"
        :items="message.progressItems || []"
      />

      <!-- Regular text content -->
      <div v-else class="message-text">
        {{ message.content }}
      </div>
    </div>

    <!-- Action buttons (for selections like "Go step by step", calendar options, etc.) -->
    <!-- Only show for regular text messages, not for special components that have their own buttons -->
    <div
      v-if="message.actions && message.actions.length > 0 && message.type === 'text'"
      class="message-actions"
    >
      <button
        v-for="(action, index) in message.actions"
        :key="index"
        @click="$emit('action-clicked', action)"
        class="action-button"
      >
        {{ action }}
      </button>
    </div>

    <!-- Timestamp (optional, can be shown on hover) -->
    <div class="message-timestamp">
      {{ formatTime(message.timestamp) }}
    </div>
  </div>
</template>

<script setup>
import ValidationCard from './ValidationCard.vue'
import VisualStudioPreview from './VisualStudioPreview.vue'
import WholePlanView from './WholePlanView.vue'
import DocumentInput from './DocumentInput.vue'
import LoadingProgress from './LoadingProgress.vue'

defineProps({
  message: {
    type: Object,
    required: true,
  },
})

defineEmits(['action-clicked', 'document-submitted'])

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.chat-message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* AI messages (left-aligned) */
.chat-message.ai {
}

/* User messages (right-aligned) */
.chat-message.user {
  align-self: flex-end;
}

.message-bubble {
  padding: var(--dt-space-450);
  border-radius: var(--dt-size-radius-400);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
}

/* AI message styling */
.chat-message.ai .message-bubble {
  background: var(--dt-color-surface-secondary);
  border: 1px solid var(--dt-color-border-subtle);
}

/* User message styling */
.chat-message.user .message-bubble {
  background: var(--dt-color-purple-200);
  color: var(--dt-color-foreground-primary);
}

.message-text {
  font-size: var(--dt-font-size-200);
  line-height: 1.5;
  color: var(--dt-color-foreground-primary);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-actions {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  margin-top: var(--dt-space-300);
}

.action-button {
  padding: var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.action-button:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.action-button:active {
  transform: scale(0.98);
}

.message-timestamp {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-tertiary);
  margin-top: var(--dt-space-200);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-message:hover .message-timestamp {
  opacity: 1;
}

/* Timestamp alignment */
.chat-message.ai .message-timestamp {
  text-align: left;
}

.chat-message.user .message-timestamp {
  text-align: right;
}
</style>
