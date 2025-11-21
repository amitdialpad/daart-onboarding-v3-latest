<template>
  <div class="monitor-view">
    <!-- Empty State: Agent Not Deployed -->
    <div v-if="agentStore.status !== 'deployed'" class="intercom-page">
      <div class="intercom-empty-state">
        <div class="intercom-empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M3 13h2v8H3v-8zm4-6h2v14H7V7zm4 10h2v4h-2v-4zm4-8h2v12h-2V9zm4-4h2v16h-2V5z" fill="currentColor"/>
          </svg>
        </div>
        <h2 class="intercom-empty-title">No Performance Data Yet</h2>
        <p class="intercom-empty-description">
          Your agent needs to be deployed before you can monitor its performance. Deploy your agent to start tracking conversations, response times, and customer satisfaction.
        </p>
        <button @click="goToDeploy" class="intercom-button intercom-button-primary">
          Deploy Your Agent
        </button>
      </div>
    </div>

    <!-- Active Monitor View -->
    <div v-else>
      <!-- Header -->
      <div class="monitor-header">
        <div class="header-content">
          <h1 class="monitor-title">Performance Monitor</h1>
          <div class="header-actions">
            <select v-model="timeRange" class="time-select">
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <button @click="refreshData" class="refresh-button">
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="monitor-content">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Total Conversations</span>
            <span class="kpi-trend positive">+12%</span>
          </div>
          <div class="kpi-value">{{ stats.totalConversations }}</div>
          <div class="kpi-subtitle">vs previous period</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Resolution Rate</span>
            <span class="kpi-trend" :class="stats.resolutionRate >= 70 ? 'positive' : 'negative'">
              {{ stats.resolutionRate }}%
            </span>
          </div>
          <div class="kpi-value">{{ stats.resolvedConversations }}/{{ stats.totalConversations }}</div>
          <div class="kpi-subtitle">resolved without human</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Avg Response Time</span>
            <span class="kpi-trend positive">-15%</span>
          </div>
          <div class="kpi-value">{{ stats.avgResponseTime }}s</div>
          <div class="kpi-subtitle">faster than humans</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Customer Satisfaction</span>
            <span class="kpi-trend" :class="stats.csatScore >= 4 ? 'positive' : 'negative'">
              {{ stats.csatScore }}/5
            </span>
          </div>
          <div class="kpi-value">{{ stats.csatPercentage }}%</div>
          <div class="kpi-subtitle">positive ratings</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Volume Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Conversation Volume</h3>
            <span class="chart-subtitle">Conversations per day</span>
          </div>
          <div class="chart-placeholder-simple">
            <span class="placeholder-text">Chart will appear here</span>
          </div>
        </div>

        <!-- Resolution Trend -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Resolution Trend</h3>
            <span class="chart-subtitle">Percentage resolved over time</span>
          </div>
          <div class="chart-placeholder-simple">
            <span class="placeholder-text">Chart will appear here</span>
          </div>
        </div>
      </div>

      <!-- Recent Conversations -->
      <div class="conversations-section">
        <div class="section-header">
          <h2 class="section-title">Recent Conversations</h2>
          <button @click="viewAllConversations" class="view-all-button">
            View All →
          </button>
        </div>

        <div class="conversations-list">
          <div v-for="conversation in recentConversations" :key="conversation.id"
               class="conversation-item"
               @click="viewConversation(conversation.id)">
            <div class="conversation-main">
              <div class="conversation-info">
                <span class="conversation-user">{{ conversation.user }}</span>
                <span class="conversation-time">{{ conversation.time }}</span>
              </div>
              <p class="conversation-preview">{{ conversation.preview }}</p>
            </div>
            <div class="conversation-meta">
              <span class="conversation-status" :class="conversation.status">
                {{ conversation.status }}
              </span>
              <span v-if="conversation.rating" class="conversation-rating" :class="conversation.rating">
                {{ conversation.rating === 'good' ? '+' : '-' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="recommendations-section">
        <div class="section-header">
          <h2 class="section-title">Recommendations</h2>
          <span class="section-subtitle">AI-powered suggestions to improve performance</span>
        </div>

        <div class="recommendations-list">
          <div v-for="rec in recommendations" :key="rec.id" class="recommendation-card">
            <div class="recommendation-icon" :class="rec.type">
              {{ rec.icon }}
            </div>
            <div class="recommendation-content">
              <h4 class="recommendation-title">{{ rec.title }}</h4>
              <p class="recommendation-description">{{ rec.description }}</p>
            </div>
            <button @click="applyRecommendation(rec.id)" class="recommendation-action">
              {{ rec.actionLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentStore } from '../stores/agent'

const router = useRouter()
const agentStore = useAgentStore()

const timeRange = ref('7d')

const stats = ref({
  totalConversations: 248,
  resolvedConversations: 187,
  resolutionRate: 75,
  avgResponseTime: 2.3,
  csatScore: 4.2,
  csatPercentage: 84
})

const volumeData = ref([
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 78 },
  { label: 'Wed', value: 90 },
  { label: 'Thu', value: 85 },
  { label: 'Fri', value: 95 },
  { label: 'Sat', value: 45 },
  { label: 'Sun', value: 40 }
])

const resolutionTrend = ref([68, 70, 72, 75, 73, 76, 75])

const recentConversations = ref([
  {
    id: 1,
    user: 'Sarah Johnson',
    time: '2 minutes ago',
    preview: 'I need to reschedule my appointment for next week...',
    status: 'resolved',
    rating: 'good'
  },
  {
    id: 2,
    user: 'Mike Chen',
    time: '15 minutes ago',
    preview: 'What are your office hours on Friday?',
    status: 'resolved',
    rating: 'good'
  },
  {
    id: 3,
    user: 'Emily Rodriguez',
    time: '1 hour ago',
    preview: 'I have a question about my recent bill...',
    status: 'escalated',
    rating: null
  },
  {
    id: 4,
    user: 'David Kim',
    time: '2 hours ago',
    preview: 'Can I book an appointment with Dr. Martinez?',
    status: 'resolved',
    rating: 'good'
  },
  {
    id: 5,
    user: 'Lisa Anderson',
    time: '3 hours ago',
    preview: 'What insurance plans do you accept?',
    status: 'resolved',
    rating: 'poor'
  }
])

const recommendations = ref([
  {
    id: 1,
    type: 'knowledge',
    icon: '',
    title: 'Add FAQ about insurance coverage',
    description: '12 conversations asked about insurance but agent couldn\'t provide specific details',
    actionLabel: 'Add Knowledge'
  },
  {
    id: 2,
    type: 'training',
    icon: '',
    title: 'Improve billing question responses',
    description: 'Low satisfaction (60%) on billing-related questions. Consider training on common scenarios',
    actionLabel: 'Train Agent'
  },
  {
    id: 3,
    type: 'workflow',
    icon: '',
    title: 'Add task for checking wait times',
    description: 'Users frequently ask about current wait times. Adding this task could resolve 15+ conversations/day',
    actionLabel: 'Add Task'
  }
])

const refreshData = () => {
  // Simulate refresh
  alert('Data refreshed! (This is a prototype - in production, this would fetch real data)')
}

const viewAllConversations = () => {
  router.push('/conversations')
}

const viewConversation = (id) => {
  alert(`Opening conversation ${id} (This is a prototype - would show full transcript)`)
}

const applyRecommendation = (id) => {
  const rec = recommendations.value.find(r => r.id === id)
  if (rec) {
    alert(`Applying: ${rec.title}\n\n(This is a prototype - in production, this would guide you through implementing the recommendation)`)
  }
}

const goToDeploy = () => {
  router.push('/deploy')
}
</script>

<style scoped>
.monitor-view {
  min-height: 100vh;
  background: var(--dt-color-surface-secondary);
}

/* Header */
.monitor-header {
  background: var(--dt-color-surface-primary);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  padding: var(--dt-space-500) var(--dt-space-550);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.monitor-title {
  margin: 0;
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.header-actions {
  display: flex;
  gap: var(--dt-space-400);
}

.time-select {
  padding: var(--dt-space-300) var(--dt-space-400);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  background: var(--dt-color-surface-primary);
  cursor: pointer;
}

.time-select:focus {
  outline: none;
  border-color: var(--dt-color-purple-400);
}

.refresh-button {
  padding: var(--dt-space-300) var(--dt-space-450);
  background: var(--dt-color-purple-400);
  color: var(--dt-color-surface-primary);
  border: none;
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover {
  background: var(--dt-color-purple-500);
}

/* Content */
.monitor-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--dt-space-600);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-600);
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--dt-space-500);
}

.kpi-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-500);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--dt-space-400);
}

.kpi-label {
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
}

.kpi-trend {
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-bold);
  padding: 2px var(--dt-space-300);
  border-radius: var(--dt-size-radius-200);
}

.kpi-trend.positive {
  background: var(--dt-color-green-100);
  color: var(--dt-color-green-600);
}

.kpi-trend.negative {
  background: var(--dt-color-red-100);
  color: var(--dt-color-red-600);
}

.kpi-value {
  font-size: var(--dt-font-size-600);
  font-weight: var(--dt-font-weight-bold);
  color: var(--dt-color-foreground-primary);
  margin-bottom: var(--dt-space-200);
}

.kpi-subtitle {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
}

/* Charts */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--dt-space-500);
}

.chart-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-550);
}

.chart-header {
  margin-bottom: var(--dt-space-500);
}

.chart-title {
  margin: 0 0 var(--dt-space-200);
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.chart-subtitle {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-secondary);
}

.chart-placeholder-simple {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-300);
  border: 1px dashed var(--dt-color-border-moderate);
}

.placeholder-text {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-tertiary);
  font-style: italic;
}

/* Conversations */
.conversations-section {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-550);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--dt-space-500);
}

.section-title {
  margin: 0;
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.section-subtitle {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
}

.view-all-button {
  padding: var(--dt-space-300) var(--dt-space-450);
  background: transparent;
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-button:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
}

.conversation-item {
  display: flex;
  justify-content: space-between;
  padding: var(--dt-space-450);
  background: var(--dt-color-surface-secondary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-300);
  cursor: pointer;
  transition: all 0.2s ease;
}

.conversation-item:hover {
  background: var(--dt-color-surface-tertiary);
  border-color: var(--dt-color-border-moderate);
}

.conversation-main {
  flex: 1;
  min-width: 0;
}

.conversation-info {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  margin-bottom: var(--dt-space-300);
}

.conversation-user {
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.conversation-time {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
}

.conversation-preview {
  margin: 0;
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-meta {
  display: flex;
  align-items: center;
  gap: var(--dt-space-350);
}

.conversation-status {
  padding: var(--dt-space-200) var(--dt-space-350);
  border-radius: var(--dt-size-radius-200);
  font-size: 11px;
  font-weight: var(--dt-font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.conversation-status.resolved {
  background: var(--dt-color-green-100);
  color: var(--dt-color-green-600);
}

.conversation-status.escalated {
  background: var(--dt-color-orange-100);
  color: var(--dt-color-orange-600);
}

.conversation-rating {
  font-size: 18px;
}

/* Recommendations */
.recommendations-section {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-550);
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-450);
}

.recommendation-card {
  display: flex;
  align-items: center;
  gap: var(--dt-space-450);
  padding: var(--dt-space-500);
  background: var(--dt-color-blue-100);
  border: 1px solid var(--dt-color-blue-200);
  border-radius: var(--dt-size-radius-400);
}

.recommendation-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dt-color-surface-primary);
  border-radius: var(--dt-size-radius-300);
  font-size: 24px;
  flex-shrink: 0;
}

.recommendation-content {
  flex: 1;
  min-width: 0;
}

.recommendation-title {
  margin: 0 0 var(--dt-space-200);
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.recommendation-description {
  margin: 0;
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.5;
}

.recommendation-action {
  padding: var(--dt-space-350) var(--dt-space-450);
  background: var(--dt-color-purple-400);
  color: var(--dt-color-surface-primary);
  border: none;
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.recommendation-action:hover {
  background: var(--dt-color-purple-500);
}

/* Responsive */
@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .recommendation-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
