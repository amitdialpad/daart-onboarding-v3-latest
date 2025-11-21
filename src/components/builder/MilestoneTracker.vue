<template>
  <div class="preview-panel">
    <div class="preview-header">
      <h3>Agent Preview</h3>
    </div>

    <div class="preview-content">
      <!-- Agent Name & Goal -->
      <div class="preview-section">
        <div class="section-header">
          <h4>Agent Configuration</h4>
        </div>
        <div class="config-item">
          <div class="config-label">Name</div>
          <div class="config-value">{{ agentName }}</div>
        </div>
        <div class="config-item">
          <div class="config-label">Goal</div>
          <div class="config-value">{{ milestones.goal || 'Not set' }}</div>
        </div>
      </div>

      <!-- Current Progress -->
      <div v-if="currentPhase" class="preview-section">
        <div class="section-header">
          <h4>Progress</h4>
        </div>
        <div class="progress-info">
          <div class="phase-indicator">
            <span class="phase-number">{{ currentPhase.number }}</span>
            <span class="phase-total">/6</span>
          </div>
          <div class="phase-details">
            <div class="phase-name">{{ currentPhase.name }}</div>
            <div class="phase-status" :class="currentPhase.status">
              {{ formatStatus(currentPhase.status) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration Summary (Collapsible) -->
      <div class="preview-section">
        <button
          @click="toggleSection('config')"
          class="section-toggle"
          :class="{ expanded: expandedSections.config }"
        >
          <h4>What's Built</h4>
          <span class="toggle-icon">{{ expandedSections.config ? '−' : '+' }}</span>
        </button>

        <div v-if="expandedSections.config" class="section-content">
          <!-- Foundation -->
          <div v-if="hasFoundation" class="config-group">
            <div class="group-title">
              <span class="checkmark"></span>
              Foundation
            </div>
            <div class="group-details">
              <div v-if="foundation.purpose" class="detail-item">{{ foundation.purpose }}</div>
              <div v-if="foundation.businessHours" class="detail-item">{{ foundation.businessHours }}</div>
              <div v-if="foundation.appointmentDuration" class="detail-item">Duration: {{ foundation.appointmentDuration }}</div>
            </div>
          </div>

          <!-- Connections -->
          <div v-if="hasConnections" class="config-group">
            <div class="group-title">
              <span class="checkmark"></span>
              Connections ({{ connections.length }})
            </div>
            <div class="group-details">
              <div v-for="conn in connections" :key="conn.type" class="detail-item">
                <span class="connection-badge">{{ conn.type }}</span>
                {{ conn.name }}
              </div>
            </div>
          </div>

          <!-- Guardrails -->
          <div v-if="hasGuardrails" class="config-group">
            <div class="group-title">
              <span class="checkmark"></span>
              Safety Rules
            </div>
            <div class="group-details">
              <div v-if="guardrails.identityVerification" class="detail-item">
                Verification: {{ guardrails.identityVerification }}
              </div>
              <div v-if="guardrails.businessRules && guardrails.businessRules.length > 0" class="detail-item">
                {{ guardrails.businessRules.length }} business rule(s)
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!hasFoundation && !hasConnections && !hasGuardrails" class="empty-state">
            Configuration in progress...
          </div>
        </div>
      </div>

      <!-- Completed Milestones (Collapsible) -->
      <div v-if="milestones.completed && milestones.completed.length > 0" class="preview-section">
        <button
          @click="toggleSection('completed')"
          class="section-toggle"
          :class="{ expanded: expandedSections.completed }"
        >
          <h4>Completed Steps</h4>
          <span class="toggle-icon">{{ expandedSections.completed ? '−' : '+' }}</span>
        </button>

        <div v-if="expandedSections.completed" class="section-content">
          <div
            v-for="(item, index) in milestones.completed"
            :key="index"
            class="completed-item"
          >
            <span class="checkmark"></span>
            {{ item }}
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="preview-section">
        <div class="section-header">
          <h4>Quick Actions</h4>
        </div>
        <div class="action-buttons">
          <button
            @click="$emit('test-agent')"
            class="action-button secondary"
            :disabled="!canTest"
          >
            Test Agent
          </button>
          <button
            @click="$emit('view-overview')"
            class="action-button tertiary"
          >
            View Overview
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAgentStore } from '../../stores/agent'

const props = defineProps({
  milestones: {
    type: Object,
    required: true,
  },
  currentPhase: {
    type: Object,
    default: null,
  },
})

defineEmits(['test-agent', 'view-overview'])

const agentStore = useAgentStore()

// Expanded sections state
const expandedSections = ref({
  config: true,
  completed: false,
})

// Computed values from agent store
const agentName = computed(() => agentStore.name || 'New AI Agent')
const foundation = computed(() => agentStore.foundation || {})
const connections = computed(() => agentStore.connections || [])
const guardrails = computed(() => agentStore.guardrails || {})

const hasFoundation = computed(() => {
  return foundation.value.purpose || foundation.value.businessHours || foundation.value.appointmentDuration
})

const hasConnections = computed(() => {
  return connections.value.length > 0
})

const hasGuardrails = computed(() => {
  return guardrails.value.identityVerification || (guardrails.value.businessRules && guardrails.value.businessRules.length > 0)
})

const canTest = computed(() => {
  return hasFoundation.value && hasConnections.value
})

const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

const formatStatus = (status) => {
  return status.replace('_', ' ')
}
</script>

<style scoped>
.preview-panel {
  width: 360px;
  background: var(--dt-color-surface-primary);
  border-left: 1px solid var(--dt-color-border-subtle);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.preview-header {
  padding: var(--dt-space-550);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.preview-header h3 {
  margin: 0;
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Section Styles */
.preview-section {
  padding: var(--dt-space-500);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.section-header {
  margin-bottom: var(--dt-space-400);
}

.section-header h4 {
  margin: 0;
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

/* Config Items */
.config-item {
  margin-bottom: var(--dt-space-400);
}

.config-item:last-child {
  margin-bottom: 0;
}

.config-label {
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--dt-space-200);
}

.config-value {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  line-height: 1.5;
}

/* Progress Info */
.progress-info {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
}

.phase-indicator {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.phase-number {
  font-size: 32px;
  font-weight: var(--dt-font-weight-bold);
  color: var(--dt-color-purple-400);
  line-height: 1;
}

.phase-total {
  font-size: var(--dt-font-size-300);
  color: var(--dt-color-foreground-secondary);
}

.phase-details {
  flex: 1;
}

.phase-name {
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  margin-bottom: var(--dt-space-200);
}

.phase-status {
  font-size: var(--dt-font-size-100);
  padding: var(--dt-space-200) var(--dt-space-300);
  border-radius: var(--dt-size-radius-300);
  display: inline-block;
  text-transform: capitalize;
}

.phase-status.pending {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-secondary);
}

.phase-status.in_progress {
  background: var(--dt-color-purple-100);
  color: var(--dt-color-purple-500);
}

.phase-status.completed {
  background: var(--dt-color-green-100);
  color: var(--dt-color-green-500);
}

/* Collapsible Section Toggle */
.section-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  padding: 0;
  margin-bottom: var(--dt-space-400);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.section-toggle:hover {
  opacity: 0.7;
}

.section-toggle h4 {
  margin: 0;
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  text-align: left;
}

.toggle-icon {
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
  transition: transform 0.2s ease;
}

.section-toggle.expanded .toggle-icon {
  transform: rotate(180deg);
}

.section-content {
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Config Groups */
.config-group {
  margin-bottom: var(--dt-space-450);
}

.config-group:last-child {
  margin-bottom: 0;
}

.group-title {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  margin-bottom: var(--dt-space-300);
}

.checkmark {
  color: var(--dt-color-green-400);
  font-weight: var(--dt-font-weight-bold);
  font-size: 14px;
}

.group-details {
  padding-left: var(--dt-space-500);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
}

.detail-item {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.5;
}

.connection-badge {
  display: inline-block;
  padding: 2px var(--dt-space-200);
  background: var(--dt-color-purple-100);
  color: var(--dt-color-purple-500);
  border-radius: var(--dt-size-radius-200);
  font-size: 10px;
  font-weight: var(--dt-font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: var(--dt-space-200);
}

.empty-state {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-tertiary);
  font-style: italic;
  text-align: center;
  padding: var(--dt-space-500);
}

/* Completed Items */
.completed-item {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-300);
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.5;
  margin-bottom: var(--dt-space-300);
}

.completed-item:last-child {
  margin-bottom: 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
}

.action-button {
  width: 100%;
  padding: var(--dt-space-400) var(--dt-space-450);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.action-button.secondary {
  background: var(--dt-color-purple-400);
  border-color: var(--dt-color-purple-400);
  color: var(--dt-color-surface-primary);
}

.action-button.secondary:hover:not(:disabled) {
  background: var(--dt-color-purple-500);
  border-color: var(--dt-color-purple-500);
}

.action-button.tertiary {
  background: transparent;
  border-color: var(--dt-color-border-moderate);
  color: var(--dt-color-foreground-primary);
}

.action-button.tertiary:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Scrollbar styling */
.preview-content::-webkit-scrollbar {
  width: 6px;
}

.preview-content::-webkit-scrollbar-track {
  background: transparent;
}

.preview-content::-webkit-scrollbar-thumb {
  background: var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-200);
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: var(--dt-color-border-strong);
}

@media (max-width: 1200px) {
  .preview-panel {
    width: 300px;
  }
}

@media (max-width: 1024px) {
  .preview-panel {
    display: none;
  }
}
</style>
