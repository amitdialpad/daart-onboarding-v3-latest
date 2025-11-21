<template>
  <div class="intercom-page">
    <div class="intercom-page-header">
      <h1 class="intercom-page-title">Knowledge</h1>
      <p class="intercom-page-description">Manage your agent's knowledge base and training data</p>
    </div>

    <!-- Empty State -->
    <div class="intercom-empty-state">
      <div class="intercom-empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>
        </svg>
      </div>
      <h2 class="intercom-empty-title">Knowledge Base Coming Soon</h2>
      <p class="intercom-empty-description">
        This is where you'll be able to add documents, FAQs, and training data to improve your agent's knowledge and responses.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAgentStore } from '../stores/agent'

const agentStore = useAgentStore()
</script>

<style scoped>
/* All styles inherited from intercom-styles.css */
</style>
