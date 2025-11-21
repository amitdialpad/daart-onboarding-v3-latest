<template>
  <div class="vs-preview-card">
    <!-- Header -->
    <div class="vs-header">
      <span class="vs-title">Agent Studio sneak peek</span>
      <span class="vs-arrow">→</span>
    </div>

    <!-- Visual Preview -->
    <div class="vs-visual">
      <!-- Agent Box -->
      <div class="vs-box agent-box">
        <div class="box-label">Agent</div>
        <div class="box-content">{{ agentGoal }}</div>
      </div>

      <!-- Arrow -->
      <div class="vs-connector">→</div>

      <!-- Task Box -->
      <div class="vs-box task-box">
        <div class="box-label">Task</div>
        <div class="box-content">Book appointments</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="vs-actions">
      <button @click="$emit('check-vs')" class="vs-button secondary">
        Check out Agent Studio →
      </button>
      <button @click="$emit('keep-building')" class="vs-button primary">
        Keep building →
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAgentStore } from '../../stores/agent'

defineEmits(['check-vs', 'keep-building'])

const agentStore = useAgentStore()

const agentGoal = computed(() => {
  const goal = agentStore.goal || 'Healthcare agent'
  // Truncate if too long
  return goal.length > 40 ? goal.substring(0, 40) + '...' : goal
})
</script>

<style scoped>
.vs-preview-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-500);
  margin-top: var(--dt-space-400);
}

/* Header */
.vs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dt-space-500);
  padding-bottom: var(--dt-space-400);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.vs-title {
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.vs-arrow {
  font-size: var(--dt-font-size-400);
  color: var(--dt-color-foreground-secondary);
}

/* Visual Preview */
.vs-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-400);
  padding: var(--dt-space-550);
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-300);
  margin-bottom: var(--dt-space-500);
}

.vs-box {
  flex: 1;
  min-width: 0;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  padding: var(--dt-space-400);
  text-align: center;
}

.box-label {
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--dt-space-300);
}

.box-content {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  font-weight: var(--dt-font-weight-medium);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.vs-connector {
  font-size: 24px;
  color: var(--dt-color-foreground-tertiary);
  flex-shrink: 0;
}

/* Actions */
.vs-actions {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
}

.vs-button {
  flex: 1;
  padding: var(--dt-space-400) var(--dt-space-500);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
  white-space: nowrap;
}

.vs-button.primary {
  background: var(--dt-color-purple-400);
  border-color: var(--dt-color-purple-400);
  color: var(--dt-color-surface-primary);
}

.vs-button.primary:hover {
  background: var(--dt-color-purple-500);
  border-color: var(--dt-color-purple-500);
}

.vs-button.secondary {
  background: transparent;
  border-color: var(--dt-color-border-moderate);
  color: var(--dt-color-foreground-primary);
}

.vs-button.secondary:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.vs-button:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .vs-visual {
    flex-direction: column;
    gap: var(--dt-space-300);
  }

  .vs-connector {
    transform: rotate(90deg);
  }

  .vs-actions {
    flex-direction: column;
  }

  .vs-button {
    width: 100%;
  }
}
</style>
