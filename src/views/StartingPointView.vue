<template>
  <div class="starting-point">
    <div class="container">
      <div class="content">
        <!-- Prompt Section -->
        <transition name="fade">
          <div v-if="!expandedGoalId" class="prompt-section">
            <h2 class="d-headline--sm d-fc-primary prompt-title">Build an AI Agent.</h2>

            <div class="prompt-card">
              <textarea
                v-model="userPrompt"
                :placeholder="animatedPlaceholder + (isTyping ? '|' : '')"
                class="prompt-textarea"
                rows="4"
                @input="autoGrowTextarea"
              ></textarea>
              <div class="prompt-actions">
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
        </transition>

        <!-- Suggested Goals -->
        <div :class="['suggested-goals', expandedGoalId ? '' : 'd-mt48']">
          <p v-if="!expandedGoalId" class="d-body--sm d-fc-secondary" style="text-align: center; margin-bottom: var(--dt-space-400);">
            Popular starting points
          </p>

          <div class="goals-grid-inline">
            <div
              v-for="goal in suggestedGoals"
              :key="goal.id"
              :class="['goal-pill-wrapper', { 'expanded': expandedGoalId === goal.id }]"
            >
              <div
                class="goal-pill"
                @click="toggleGoalDetails(goal.id)"
              >
                {{ goal.title }}
                <span v-if="goal.showBadge" :class="`d-badge d-badge--${goal.badgeKind}`" style="margin-left: var(--dt-space-300);">
                  {{ goal.badgeText }}
                </span>
              </div>

              <transition name="expand">
                <div v-if="expandedGoalId === goal.id" class="goal-details">
                  <button @click.stop="expandedGoalId = null" class="close-button">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>

                  <div class="expanded-content">
                    <div class="expanded-header">
                      <p class="goal-description">{{ goal.description }}</p>
                      <button
                        @click.stop="selectGoal(goal)"
                        class="d-btn d-btn--primary"
                        style="margin-top: var(--dt-space-400);"
                      >
                        Use This Template
                      </button>
                    </div>

                    <!-- Conversation Preview -->
                    <div class="conversation-preview">
                      <div class="preview-header">
                        <div class="preview-status-bar">
                          <span style="font-size: 11px;">9:41</span>
                          <div style="display: flex; gap: 4px; align-items: center;">
                            <span style="font-size: 11px;">●●●●</span>
                            <span style="font-size: 11px;">100%</span>
                          </div>
                        </div>
                        <div class="preview-chat-header">
                          <span class="preview-agent-name">{{ goal.title }}</span>
                        </div>
                      </div>
                      <div class="preview-messages">
                        <transition-group name="message-appear">
                          <div
                            v-for="(message, index) in visibleMessages[goal.id] || []"
                            :key="`${goal.id}-${index}`"
                            :class="['preview-message-wrapper', message.type]"
                          >
                            <div class="preview-bubble">
                              {{ message.text }}
                            </div>
                          </div>
                        </transition-group>
                      </div>
                    </div>

                    <!-- Stats Row -->
                    <div class="goal-stats">
                      <span class="stat-item">{{ goal.usageStats }}</span>
                      <span class="stat-divider">•</span>
                      <span class="stat-item">{{ goal.usedBy }}</span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userPrompt = ref('')
const expandedGoalId = ref(null)
const currentPlaceholder = ref(0)
const visibleMessages = ref({})
const animatedPlaceholder = ref('')
const isTyping = ref(false)

// Rotating placeholder examples
const placeholders = [
  'What do you want your agent to do?',
  'Answer billing questions and process refunds',
  'Schedule appointments via phone and email',
  'Handle prescription refill requests',
  'Collect patient intake forms before visits'
]

// Typewriter animation for placeholder
let typingInterval = null
let placeholderTimeout = null

function typewriterEffect() {
  const targetText = placeholders[currentPlaceholder.value]
  let charIndex = 0

  // Clear previous animation
  animatedPlaceholder.value = ''
  isTyping.value = true

  // Type out characters one by one
  typingInterval = setInterval(() => {
    if (charIndex < targetText.length) {
      animatedPlaceholder.value = targetText.substring(0, charIndex + 1)
      charIndex++
    } else {
      // Finished typing, wait before moving to next placeholder
      clearInterval(typingInterval)
      isTyping.value = false

      placeholderTimeout = setTimeout(() => {
        currentPlaceholder.value = (currentPlaceholder.value + 1) % placeholders.length
        typewriterEffect()
      }, 3000) // Wait 3 seconds before next placeholder
    }
  }, 50) // Type one character every 50ms
}

onMounted(() => {
  typewriterEffect()
})

onUnmounted(() => {
  if (typingInterval) {
    clearInterval(typingInterval)
  }
  if (placeholderTimeout) {
    clearTimeout(placeholderTimeout)
  }
})

// Mock suggested goals (healthcare context from PDF)
const suggestedGoals = ref([
  {
    id: 1,
    title: 'Patient Support Agent',
    description: 'Answers common questions about hours, insurance, and doctors.',
    usedBy: 'Healthcare clinics, hospitals',
    usageStats: '150+ teams',
    conversation: [
      { type: 'agent', text: 'Hi! How can I help you today?' },
      { type: 'user', text: 'What are your hours?' },
      { type: 'agent', text: 'We\'re open Monday-Friday, 8am-6pm.' },
      { type: 'user', text: 'Do you accept Blue Cross insurance?' },
      { type: 'agent', text: 'Yes! We accept Blue Cross, Aetna, and UnitedHealthcare.' },
      { type: 'user', text: 'Great, can I see Dr. Martinez?' },
      { type: 'agent', text: 'Dr. Martinez is available. Would you like to schedule an appointment?' }
    ],
    showBadge: false
  },
  {
    id: 2,
    title: 'Appointment Scheduler',
    description: 'Books, reschedules, and cancels patient visits using Google Calendar or EMR tools.',
    usedBy: 'Medical practices, wellness centers',
    usageStats: '320+ teams',
    conversation: [
      { type: 'agent', text: 'I can help you schedule an appointment. What type of visit do you need?' },
      { type: 'user', text: 'I need to see Dr. Smith for a checkup' },
      { type: 'agent', text: 'I have availability on Tuesday at 2pm or Thursday at 10am. Which works better for you?' },
      { type: 'user', text: 'Tuesday at 2pm works' },
      { type: 'agent', text: 'Perfect! I\'ve booked you for Tuesday at 2pm with Dr. Smith. You\'ll receive a confirmation email shortly.' },
      { type: 'user', text: 'Thanks!' },
      { type: 'agent', text: 'You\'re welcome! Please arrive 10 minutes early to check in.' }
    ],
    showBadge: true,
    badgeText: 'Popular',
    badgeKind: 'success'
  },
  {
    id: 3,
    title: 'Prescription Refill Coordinator',
    description: 'Handles refill requests and forwards approvals to providers.',
    usedBy: 'Pharmacies, medical offices',
    usageStats: '85+ teams',
    conversation: [
      { type: 'agent', text: 'Hi! Need help with a prescription refill?' },
      { type: 'user', text: 'Yes, I need to refill my blood pressure medication' },
      { type: 'agent', text: 'I can help with that. What\'s the medication name?' },
      { type: 'user', text: 'Lisinopril 10mg' },
      { type: 'agent', text: 'Got it. I\'ll forward this to Dr. Johnson for approval.' },
      { type: 'user', text: 'How long will it take?' },
      { type: 'agent', text: 'Usually within 24 hours. You\'ll get a text when it\'s ready at your pharmacy.' }
    ],
    showBadge: false
  },
  {
    id: 4,
    title: 'Billing & Claims Helper',
    description: 'Explains charges, checks insurance coverage, and guides patients through claims.',
    usedBy: 'Billing departments, insurance offices',
    usageStats: '120+ teams',
    conversation: [
      { type: 'agent', text: 'How can I help with your billing question?' },
      { type: 'user', text: 'I got a bill for $250. Is that right?' },
      { type: 'agent', text: 'Let me check that for you.' },
      { type: 'agent', text: 'Your insurance covered 80% of your visit. Your copay is $25, and the remaining $225 is for the lab work.' },
      { type: 'user', text: 'Why wasn\'t the lab work covered?' },
      { type: 'agent', text: 'Lab work requires separate authorization from your insurance. Would you like me to help you file an appeal?' }
    ],
    showBadge: false
  },
  {
    id: 5,
    title: 'Pre-Visit Intake Assistant',
    description: 'Collects patient info and forms before appointments.',
    usedBy: 'Hospitals, specialty clinics',
    usageStats: '95+ teams',
    conversation: [
      { type: 'agent', text: 'Hi Sarah! Your appointment is coming up. Let me help you complete your intake forms - it\'ll only take 2 minutes.' },
      { type: 'user', text: 'Okay, what do you need?' },
      { type: 'agent', text: 'First, have you had any changes to your medications since your last visit?' },
      { type: 'user', text: 'No, still the same' },
      { type: 'agent', text: 'Perfect. Any new allergies or health conditions?' },
      { type: 'user', text: 'Nope, all good' },
      { type: 'agent', text: 'Great! Your forms are complete. See you tomorrow at 10am!' }
    ],
    showBadge: false
  },
  {
    id: 6,
    title: 'Follow-Up & Reminder Bot',
    description: 'Sends visit reminders, surveys, and medication alerts to keep patients engaged.',
    usedBy: 'Primary care, chronic care management',
    usageStats: '200+ teams',
    conversation: [
      { type: 'agent', text: 'Hi John! Reminder: Your appointment with Dr. Martinez is tomorrow at 10am.' },
      { type: 'user', text: 'Thanks! I\'ll be there' },
      { type: 'agent', text: 'Great! Please arrive 10 minutes early to check in.' },
      { type: 'user', text: 'What should I bring?' },
      { type: 'agent', text: 'Just your insurance card and ID. We have all your medical records on file.' },
      { type: 'user', text: 'Perfect, thanks' },
      { type: 'agent', text: 'See you tomorrow! Reply STOP if you need to cancel.' }
    ],
    showBadge: false
  }
])

function startBuilding() {
  if (userPrompt.value.trim()) {
    router.push({ name: 'ConversationalBuilder', query: { goal: userPrompt.value } })
  }
}

function toggleGoalDetails(goalId) {
  if (expandedGoalId.value === goalId) {
    expandedGoalId.value = null
  } else {
    expandedGoalId.value = goalId
    // Animate messages appearing one by one
    animateMessages(goalId)
  }
}

function animateMessages(goalId) {
  const goal = suggestedGoals.value.find(g => g.id === goalId)
  if (!goal) return

  // Reset visible messages for this goal
  visibleMessages.value[goalId] = []

  // Show messages one by one with delay
  goal.conversation.forEach((message, index) => {
    setTimeout(() => {
      visibleMessages.value[goalId] = [
        ...(visibleMessages.value[goalId] || []),
        message
      ]
    }, index * 800) // 800ms delay between messages
  })
}

function selectGoal(goal) {
  userPrompt.value = goal.title
  startBuilding()
}

// Auto-grow textarea
function autoGrowTextarea(event) {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}
</script>

<style scoped>
.starting-point {
  min-height: 100vh;
  padding: var(--dt-space-550) var(--dt-space-550);
  background: var(--dt-color-surface-secondary);
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.prompt-section {
  max-width: 700px;
  margin: 0 auto var(--dt-space-800);
  text-align: center;
}

.prompt-title {
  margin-bottom: var(--dt-space-500);
  font-size: 48px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.prompt-description {
  margin-bottom: var(--dt-space-550);
  line-height: 1.6;
}

.prompt-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-550);
  margin-top: var(--dt-space-600);
  box-shadow: var(--dt-shadow-300);
}

.prompt-textarea {
  width: 100%;
  min-height: 120px;
  max-height: 300px;
  padding: var(--dt-space-500);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-300);
  font-family: var(--dt-font-family-body);
  font-size: var(--dt-font-size-200);
  line-height: var(--dt-font-line-height-300);
  resize: none;
  overflow-y: auto;
  color: var(--dt-color-foreground-primary);
  background: var(--dt-color-surface-secondary);
  transition: all 0.2s ease;
}

.prompt-textarea:focus {
  outline: none;
  border-color: var(--dt-color-border-strong);
  background: var(--dt-color-surface-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.prompt-textarea::placeholder {
  color: var(--dt-color-foreground-placeholder);
  transition: opacity 0.3s ease;
}

.prompt-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  max-width: 1200px;
  margin: 0 auto var(--dt-space-700);
  text-align: center;
}

.suggested-goals h2 {
  margin-bottom: var(--dt-space-500);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.suggested-goals p {
  margin-bottom: var(--dt-space-550);
  font-size: 15px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--dt-space-500);
}

.goal-card {
  padding: var(--dt-space-450);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  background: var(--dt-color-surface-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.goal-card:hover {
  border-color: var(--dt-color-border-default);
  box-shadow: var(--dt-shadow-200);
}

.goals-grid-inline {
  display: flex;
  justify-content: center;
  gap: var(--dt-space-400);
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto;
}

.goal-pill-wrapper {
  position: relative;
  transition: all 0.3s ease;
  transform-origin: center;
}

.goal-pill-wrapper.expanded {
  flex-basis: 100%;
  order: -1;
}

.goal-pill {
  padding: var(--dt-space-400) var(--dt-space-500);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-500);
  background: var(--dt-color-surface-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.goal-pill:hover {
  border-color: var(--dt-color-border-default);
  box-shadow: var(--dt-shadow-200);
  background: var(--dt-color-surface-secondary);
  transform: translateY(-1px);
}

.goal-pill:active {
  transform: translateY(0);
  transition: all 0.1s ease;
}

.goal-pill-wrapper.expanded .goal-pill {
  border-color: var(--dt-color-border-strong);
  background: var(--dt-color-surface-secondary);
}

.goal-details {
  margin-top: var(--dt-space-500);
  padding: var(--dt-space-600);
  background: var(--dt-color-surface-primary);
  border-radius: var(--dt-size-radius-400);
  border: 1px solid var(--dt-color-border-subtle);
  box-shadow: var(--dt-shadow-400);
  transform-origin: top center;
  position: relative;
}

.close-button {
  position: absolute;
  top: var(--dt-space-400);
  right: var(--dt-space-400);
  background: transparent;
  border: none;
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  padding: var(--dt-space-300);
  border-radius: var(--dt-size-radius-300);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.close-button:hover {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
}

.close-button:active {
  transform: scale(0.95);
}

.expanded-header {
  text-align: center;
  margin-bottom: var(--dt-space-600);
  padding: 0 var(--dt-space-500);
}

.goal-description {
  font-size: var(--dt-font-size-200);
  line-height: 1.6;
  color: var(--dt-color-foreground-secondary);
  margin: 0 0 var(--dt-space-400);
  font-weight: var(--dt-font-weight-normal);
}

.conversation-preview {
  background: #FFFFFF;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: var(--dt-space-600);
  border: 1px solid var(--dt-color-border-default);
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: var(--dt-shadow-300);
  display: flex;
  flex-direction: column;
  max-height: 500px;
}

.preview-header {
  background: #F8F9FA;
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.preview-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px 4px;
  font-size: 11px;
  font-weight: 600;
  color: #000000;
}

.preview-chat-header {
  padding: 12px 20px;
  text-align: center;
  background: #FFFFFF;
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.preview-agent-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.preview-messages {
  padding: 20px 16px;
  background: #FFFFFF;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
}

.preview-message-wrapper {
  display: flex;
  margin-bottom: 4px;
}

.preview-message-wrapper.agent {
  justify-content: flex-start;
}

.preview-message-wrapper.user {
  justify-content: flex-end;
}

.preview-bubble {
  padding: 10px 14px;
  font-size: 15px;
  line-height: 1.4;
  max-width: 75%;
  word-wrap: break-word;
}

.preview-message-wrapper.agent .preview-bubble {
  background: #E5E5EA;
  color: #000000;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
}

.preview-message-wrapper.user .preview-bubble {
  background: #007AFF;
  color: #FFFFFF;
  border-radius: 18px;
  border-bottom-right-radius: 4px;
}

.goal-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-350);
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: var(--dt-space-500);
  font-weight: 500;
}

.stat-item {
  font-weight: 500;
}

.stat-divider {
  color: rgba(0, 0, 0, 0.2);
  font-weight: 400;
}

.goal-used-by {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-secondary);
  margin: 0;
  font-style: italic;
}

/* Fade in/out for prompt section */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Subtle expand/collapse animation */
.expand-enter-active {
  animation: slideIn 0.25s ease-out;
}

.expand-leave-active {
  animation: slideOut 0.2s ease-in;
}

/* Chat message appearing animation */
.message-appear-enter-active {
  animation: messageSlideIn 0.3s ease-out;
}

.message-appear-leave-active {
  animation: messageSlideOut 0.2s ease-in;
}

@keyframes messageSlideIn {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes messageSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-5px) scale(0.98);
  }
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-5px);
  }
}

/* Subtle fade-in for pills on page load */
.goal-pill-wrapper {
  animation: fadeIn 0.3s ease-out backwards;
}

.goal-pill-wrapper:nth-child(1) { animation-delay: 0.05s; }
.goal-pill-wrapper:nth-child(2) { animation-delay: 0.08s; }
.goal-pill-wrapper:nth-child(3) { animation-delay: 0.11s; }
.goal-pill-wrapper:nth-child(4) { animation-delay: 0.14s; }
.goal-pill-wrapper:nth-child(5) { animation-delay: 0.17s; }
.goal-pill-wrapper:nth-child(6) { animation-delay: 0.2s; }

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
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
