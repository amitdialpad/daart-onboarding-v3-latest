<template>
  <div class="chat-header">
    <div class="header-content">
      <!-- Left: Agent name -->
      <h1 class="agent-name">{{ agentName }}</h1>

      <!-- Right: Preview button -->
      <button @click="$emit('preview-agent')" class="preview-button">
        Preview Agent
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAgentStore } from '../../stores/agent'

defineEmits(['preview-agent'])

const agentStore = useAgentStore()

const agentName = computed(() => agentStore.name || 'New AI Agent')
</script>

<style scoped>
.chat-header {
  background: var(--dt-color-surface-primary);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--dt-space-500) var(--dt-space-550);
  max-width: 900px;
  margin: 0 auto;
  gap: var(--dt-space-500);
}

.agent-name {
  margin: 0;
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.preview-button {
  padding: var(--dt-space-300) var(--dt-space-450);
  background: transparent;
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.preview-button:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.preview-button:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: var(--dt-space-400) var(--dt-space-450);
  }

  .agent-name {
    font-size: var(--dt-font-size-200);
  }

  .preview-button {
    padding: var(--dt-space-300) var(--dt-space-400);
    font-size: var(--dt-font-size-100);
  }
}
</style>
