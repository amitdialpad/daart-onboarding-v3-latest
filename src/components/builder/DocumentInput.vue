<template>
  <div class="document-input-card">
    <p class="input-label">Paste your requirements document below:</p>
    <textarea
      v-model="documentText"
      placeholder="Paste your document here... Include details like business hours, appointment types, scheduling rules, safety requirements, etc."
      class="document-textarea"
      rows="8"
      ref="textarea"
      @input="autoResize"
    />
    <div class="input-actions">
      <button
        @click="handleCancel"
        :disabled="isProcessing"
        class="action-btn cancel-btn"
      >
        Cancel
      </button>
      <button
        @click="handleSubmit"
        :disabled="isProcessing || !documentText.trim()"
        class="action-btn submit-btn"
      >
        {{ isProcessing ? 'Processing...' : 'Submit' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

const documentText = ref('')
const isProcessing = ref(false)
const textarea = ref(null)

// Auto-resize textarea as content grows
const autoResize = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

// Focus textarea on mount
onMounted(() => {
  nextTick(() => {
    if (textarea.value) {
      textarea.value.focus()
    }
  })
})

const handleSubmit = () => {
  if (!documentText.value.trim() || isProcessing.value) return

  isProcessing.value = true
  emit('submit', documentText.value.trim())
}

const handleCancel = () => {
  if (isProcessing.value) return
  emit('cancel')
}
</script>

<style scoped>
.document-input-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-500);
  margin: var(--dt-space-400) 0;
}

.input-label {
  margin: 0 0 var(--dt-space-400);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.document-textarea {
  width: 100%;
  min-height: 150px;
  max-height: 400px;
  padding: var(--dt-space-400);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-400);
  font-family: var(--dt-font-family-body);
  font-size: var(--dt-font-size-200);
  line-height: 1.5;
  color: var(--dt-color-foreground-primary);
  background: var(--dt-color-surface-primary);
  resize: vertical;
  overflow-y: auto;
  transition: border-color 0.2s ease;
}

.document-textarea:focus {
  outline: none;
  border-color: var(--dt-color-purple-400);
  box-shadow: 0 0 0 3px var(--dt-color-purple-100);
}

.document-textarea::placeholder {
  color: var(--dt-color-foreground-tertiary);
}

.input-actions {
  display: flex;
  gap: var(--dt-space-400);
  justify-content: flex-end;
  margin-top: var(--dt-space-400);
}

.action-btn {
  padding: var(--dt-space-350) var(--dt-space-500);
  border-radius: var(--dt-size-radius-400);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
  white-space: nowrap;
}

.action-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  border-color: var(--dt-color-border-moderate);
  background: var(--dt-color-surface-primary);
  color: var(--dt-color-foreground-primary);
}

.cancel-btn:hover:not(:disabled) {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.submit-btn {
  border-color: var(--dt-color-purple-400);
  background: var(--dt-color-purple-400);
  color: var(--dt-color-foreground-primary-inverted);
}

.submit-btn:hover:not(:disabled) {
  background: var(--dt-color-purple-500);
  border-color: var(--dt-color-purple-500);
}

/* Responsive */
@media (max-width: 768px) {
  .input-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
