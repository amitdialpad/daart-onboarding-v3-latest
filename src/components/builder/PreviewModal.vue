<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
        <div class="modal-container" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <h2>Agent Configuration</h2>
            <button @click="$emit('close')" class="close-button">
              ×
            </button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <!-- Agent Basics -->
            <div class="config-section">
              <h3 class="section-title">Agent Details</h3>
              <div class="config-grid">
                <div class="config-item">
                  <div class="config-label">Name</div>
                  <div class="config-value">{{ agentName }}</div>
                </div>
                <div class="config-item">
                  <div class="config-label">Goal</div>
                  <div class="config-value">{{ agentGoal }}</div>
                </div>
              </div>
            </div>

            <!-- Foundation -->
            <div v-if="hasFoundation" class="config-section">
              <h3 class="section-title">Foundation</h3>
              <div class="config-grid">
                <div v-if="foundation.purpose" class="config-item">
                  <div class="config-label">Purpose</div>
                  <div class="config-value">{{ foundation.purpose }}</div>
                </div>
                <div v-if="foundation.businessHours" class="config-item">
                  <div class="config-label">Business Hours</div>
                  <div class="config-value">{{ foundation.businessHours }}</div>
                </div>
                <div v-if="foundation.appointmentDuration" class="config-item">
                  <div class="config-label">Appointment Duration</div>
                  <div class="config-value">{{ foundation.appointmentDuration }}</div>
                </div>
                <div v-if="foundation.bufferTime" class="config-item">
                  <div class="config-label">Buffer Time</div>
                  <div class="config-value">{{ foundation.bufferTime }}</div>
                </div>
              </div>
            </div>

            <!-- Connections -->
            <div v-if="hasConnections" class="config-section">
              <h3 class="section-title">Connections</h3>
              <div class="connections-list">
                <div v-for="conn in connections" :key="conn.type" class="connection-item">
                  <span class="connection-badge" :class="conn.type">
                    {{ conn.type }}
                  </span>
                  <span class="connection-name">{{ conn.name }}</span>
                </div>
              </div>
            </div>

            <!-- Guardrails -->
            <div v-if="hasGuardrails" class="config-section">
              <h3 class="section-title">Safety & Guardrails</h3>
              <div class="config-grid">
                <div v-if="guardrails.identityVerification" class="config-item">
                  <div class="config-label">Identity Verification</div>
                  <div class="config-value">{{ guardrails.identityVerification }}</div>
                </div>
                <div v-if="guardrails.businessRules && guardrails.businessRules.length > 0" class="config-item">
                  <div class="config-label">Business Rules</div>
                  <div class="config-value">
                    <ul class="rules-list">
                      <li v-for="(rule, index) in guardrails.businessRules" :key="index">
                        {{ rule }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="!hasFoundation && !hasConnections && !hasGuardrails" class="empty-state">
              <p>Agent configuration in progress...</p>
              <p class="empty-subtitle">Complete the conversation to see your agent's full configuration.</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button @click="$emit('close')" class="footer-button secondary">
              Close
            </button>
            <button @click="handleTest" class="footer-button primary" :disabled="!canTest">
              Test Agent
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useAgentStore } from '../../stores/agent'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'test-agent'])

const agentStore = useAgentStore()

const agentName = computed(() => agentStore.name || 'New AI Agent')
const agentGoal = computed(() => agentStore.goal || 'Not set')
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

const handleTest = () => {
  emit('test-agent')
  emit('close')
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--dt-space-500);
}

/* Modal Container */
.modal-container {
  background: var(--dt-color-surface-primary);
  border-radius: var(--dt-size-radius-400);
  box-shadow: var(--dt-shadow-400);
  max-width: 700px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--dt-space-550);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.modal-header h2 {
  margin: 0;
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.close-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--dt-size-radius-300);
  font-size: 28px;
  line-height: 1;
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
}

/* Content */
.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--dt-space-550);
}

.config-section {
  margin-bottom: var(--dt-space-550);
}

.config-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 var(--dt-space-400);
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--dt-space-450);
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
}

.config-label {
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-value {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  line-height: 1.5;
}

/* Connections */
.connections-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
}

.connection-item {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: var(--dt-space-400);
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-300);
}

.connection-badge {
  display: inline-block;
  padding: 4px var(--dt-space-300);
  border-radius: var(--dt-size-radius-200);
  font-size: 11px;
  font-weight: var(--dt-font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.connection-badge.calendar {
  background: var(--dt-color-blue-100);
  color: var(--dt-color-blue-500);
}

.connection-badge.video {
  background: var(--dt-color-purple-100);
  color: var(--dt-color-purple-500);
}

.connection-name {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
}

/* Rules List */
.rules-list {
  margin: 0;
  padding-left: var(--dt-space-500);
}

.rules-list li {
  margin-bottom: var(--dt-space-200);
}

.rules-list li:last-child {
  margin-bottom: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--dt-space-700);
}

.empty-state p {
  margin: 0 0 var(--dt-space-300);
  font-size: var(--dt-font-size-300);
  color: var(--dt-color-foreground-secondary);
}

.empty-subtitle {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-tertiary);
}

/* Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--dt-space-300);
  padding: var(--dt-space-550);
  border-top: 1px solid var(--dt-color-border-subtle);
}

.footer-button {
  padding: var(--dt-space-400) var(--dt-space-500);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.footer-button.primary {
  background: var(--dt-color-purple-400);
  border-color: var(--dt-color-purple-400);
  color: var(--dt-color-surface-primary);
}

.footer-button.primary:hover:not(:disabled) {
  background: var(--dt-color-purple-500);
  border-color: var(--dt-color-purple-500);
}

.footer-button.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer-button.secondary {
  background: transparent;
  border-color: var(--dt-color-border-moderate);
  color: var(--dt-color-foreground-primary);
}

.footer-button.secondary:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.footer-button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Scrollbar */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: var(--dt-color-surface-secondary);
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-200);
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--dt-color-border-strong);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .config-grid {
    grid-template-columns: 1fr;
  }
}
</style>
