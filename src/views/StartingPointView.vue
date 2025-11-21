<template>
  <div class="starting-point">
    <div class="container">
      <div class="content">
        <!-- Prompt Section -->
        <div class="prompt-section">
          <h2 class="d-headline--sm d-fc-primary prompt-title">Build an AI Agent.</h2>
          <p class="d-body--md d-fc-secondary prompt-description">
            Describe what you want your AI Agent to do.
          </p>

          <div class="prompt-card">
            <textarea
              v-model="userPrompt"
              placeholder="Eg: A receptionist that manages appointments using Google Calendar, can schedule, reschedule, and send confirmations."
              class="prompt-textarea"
              rows="4"
            ></textarea>
            <div class="prompt-actions">
              <button class="improve-btn">
                ✨ Improve
              </button>
              <button
                class="d-btn d-btn--primary d-btn--lg"
                @click="startBuilding"
                :disabled="!userPrompt.trim()"
              >
                Start Building
              </button>
            </div>
          </div>
        </div>

        <!-- Suggested Goals -->
        <div class="suggested-goals d-mt48">
          <h2 class="d-headline--sm d-fc-primary">
            Or start with a template
          </h2>

          <div class="goals-grid">
            <div
              v-for="goal in suggestedGoals.slice(0, 4)"
              :key="goal.id"
              class="goal-card"
              @click="selectGoal(goal)"
            >
              <h3 class="d-headline--xs d-fc-primary d-mb8 goal-title">
                {{ goal.title }}
                <span v-if="goal.showBadge" :class="`d-badge d-badge--${goal.badgeKind}`">
                  {{ goal.badgeText }}
                </span>
              </h3>
              <p class="d-body--sm d-fc-secondary">{{ goal.description }}</p>
            </div>
          </div>
        </div>

        <!-- Help Content -->
        <div class="help-section d-mt48" style="text-align: center;">
          <a href="#" class="d-link" style="font-size: var(--dt-font-size-200);">Learn more about AI Agents →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userPrompt = ref('')

// Mock suggested goals (healthcare context from PDF)
const suggestedGoals = ref([
  {
    id: 1,
    title: 'Patient Support Agent',
    description: 'Answers common questions about hours, insurance, and doctors.',
    showBadge: false
  },
  {
    id: 2,
    title: 'Appointment Scheduler',
    description: 'Books, reschedules, and cancels patient visits using Google Calendar or EMR tools.',
    showBadge: true,
    badgeText: 'Popular',
    badgeKind: 'success'
  },
  {
    id: 3,
    title: 'Prescription Refill Coordinator',
    description: 'Handles refill requests and forwards approvals to providers.',
    showBadge: false
  },
  {
    id: 4,
    title: 'Billing & Claims Helper',
    description: 'Explains charges, checks insurance coverage, and guides patients through claims.',
    showBadge: false
  },
  {
    id: 5,
    title: 'Pre-Visit Intake Assistant',
    description: 'Collects patient info and forms before appointments.',
    showBadge: false
  },
  {
    id: 6,
    title: 'Follow-Up & Reminder Bot',
    description: 'Sends visit reminders, surveys, and medication alerts to keep patients engaged.',
    showBadge: false
  }
])

function startBuilding() {
  if (userPrompt.value.trim()) {
    router.push({ name: 'ConversationalBuilder', query: { goal: userPrompt.value } })
  }
}

function selectGoal(goal) {
  userPrompt.value = goal.title
  startBuilding()
}
</script>

<style scoped>
.starting-point {
  min-height: 100vh;
  padding: var(--dt-space-700) var(--dt-space-550);
  background: var(--dt-color-surface-secondary);
}

.content {
  max-width: 1100px;
  margin: 0 auto;
}

.prompt-section {
  max-width: 800px;
  margin: 0 auto var(--dt-space-700);
  text-align: center;
}

.prompt-title {
  margin-bottom: var(--dt-space-450);
}

.prompt-description {
  margin-bottom: var(--dt-space-550);
  line-height: 1.6;
}

.prompt-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-500);
  margin-top: var(--dt-space-550);
}

.prompt-textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--dt-space-450);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-300);
  font-family: var(--dt-font-family-body);
  font-size: var(--dt-font-size-200);
  line-height: var(--dt-font-line-height-300);
  resize: vertical;
  color: var(--dt-color-foreground-primary);
  background: var(--dt-color-surface-secondary);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.prompt-textarea:focus {
  outline: none;
  border-color: var(--dt-color-border-strong);
  background: var(--dt-color-surface-primary);
}

.prompt-textarea::placeholder {
  color: var(--dt-color-foreground-placeholder);
}

.prompt-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--dt-space-450);
  gap: var(--dt-space-450);
}

.improve-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: var(--dt-space-400) var(--dt-space-425);
  background: transparent;
  border: none;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: color 0.2s ease;
  border-radius: var(--dt-size-radius-300);
}

.improve-btn:hover {
  color: var(--dt-color-foreground-primary);
  background: var(--dt-color-surface-secondary);
}

.suggested-goals {
  max-width: 1100px;
  margin: 0 auto var(--dt-space-700);
  text-align: center;
}

.suggested-goals h2 {
  margin-bottom: var(--dt-space-400);
}

.suggested-goals p {
  margin-bottom: var(--dt-space-450);
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--dt-space-500);
}

.goal-card {
  padding: var(--dt-space-500);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  background: var(--dt-color-surface-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
}

.goal-card:hover {
  border-color: var(--dt-color-border-default);
  box-shadow: var(--dt-shadow-200);
}

.help-section {
  max-width: 700px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .goals-grid {
    grid-template-columns: 1fr;
  }

  .prompt-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
