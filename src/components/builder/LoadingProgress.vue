<template>
  <div class="loading-progress">
    <div class="progress-header">
      <span class="progress-title">{{ title }}</span>
    </div>

    <div class="progress-items">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="['progress-item', item.status]"
      >
        <div class="progress-icon">
          <span v-if="item.status === 'completed'" class="checkmark"></span>
          <span v-else-if="item.status === 'in_progress'" class="spinner"></span>
          <span v-else class="dot"></span>
        </div>
        <span class="progress-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Configuring your agent...'
  },
  items: {
    type: Array,
    required: true,
    // Each item: { label: string, status: 'pending' | 'in_progress' | 'completed' }
  }
})
</script>

<style scoped>
.loading-progress {
  background: var(--dt-color-surface-secondary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-500);
  margin-top: var(--dt-space-400);
}

.progress-header {
  margin-bottom: var(--dt-space-450);
}

.progress-title {
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.progress-items {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
}

.progress-item {
  display: flex;
  align-items: center;
  gap: var(--dt-space-350);
  transition: opacity 0.3s ease;
}

.progress-item.pending {
  opacity: 0.4;
}

.progress-item.in_progress {
  opacity: 1;
}

.progress-item.completed {
  opacity: 1;
}

.progress-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checkmark {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dt-color-green-400);
  color: var(--dt-color-surface-primary);
  border-radius: 50%;
  font-size: 14px;
  font-weight: var(--dt-font-weight-bold);
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--dt-color-border-subtle);
  border-top-color: var(--dt-color-purple-400);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--dt-color-border-moderate);
  border-radius: 50%;
}

.progress-label {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  font-weight: var(--dt-font-weight-normal);
}

.progress-item.completed .progress-label {
  font-weight: var(--dt-font-weight-medium);
}
</style>
