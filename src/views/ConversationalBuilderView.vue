<template>
  <div class="builder-view">
    <!-- Breadcrumb and Page Title -->
    <div class="page-header">
      <div class="breadcrumb">
        <span class="breadcrumb-item">Build</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-item active">{{ agentStore.name || 'New Agent' }}</span>
      </div>
      <h1 class="page-title">Building Your Agent</h1>
      <p class="page-description">Answer a few questions to configure your AI agent</p>
    </div>

    <!-- Simple Header -->
    <ProgressBar
      @preview-agent="showPreview = true"
    />

    <!-- Main chat area (full width) -->
    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <ChatMessage
          v-for="message in conversationStore.allMessages"
          :key="message.id"
          :message="message"
          @action-clicked="handleActionClick"
          @document-submitted="handleDocumentSubmit"
        />
      </div>

      <!-- Message Input (shown when user needs to type answers) -->
      <MessageInput
        v-if="shouldShowMessageInput"
        @send-message="handleUserMessage"
      />
    </div>

    <!-- Preview Modal -->
    <PreviewModal
      :is-open="showPreview"
      @close="showPreview = false"
      @test-agent="handleTestAgent"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversation'
import { useAgentStore } from '../stores/agent'
import ChatMessage from '../components/builder/ChatMessage.vue'
import MessageInput from '../components/builder/MessageInput.vue'
import ProgressBar from '../components/builder/ProgressBar.vue'
import PreviewModal from '../components/builder/PreviewModal.vue'

const showPreview = ref(false)

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const agentStore = useAgentStore()

const messagesContainer = ref(null)

// Show message input when user needs to type answers
const shouldShowMessageInput = computed(() => {
  const state = conversationStore.currentState
  return state === 'pro_asking_missing' || state === 'beginner_phase_1'
})

// Helper function to scroll to bottom
const scrollToBottom = (smooth = true) => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }
}

// Helper function to scroll to show latest content
const scrollToShowLatest = (smooth = true) => {
  if (messagesContainer.value) {
    // Get the last child element (latest message)
    const lastMessage = messagesContainer.value.lastElementChild
    if (lastMessage) {
      // Scroll the last message into view
      lastMessage.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      })
    }
  }
}

// Watch for new messages and scroll to show them
watch(
  () => conversationStore.messages.length,
  () => {
    nextTick(() => {
      setTimeout(() => {
        scrollToShowLatest()
      }, 100)
    })
  }
)

// Initialize conversation when component mounts
onMounted(() => {
  const agentGoal = route.query.goal || agentStore.goal

  if (!agentGoal) {
    // No goal provided, redirect back to starting point
    window.location.href = '/'
    return
  }

  // If agent is already deployed, redirect to overview instead of showing builder
  if (agentStore.status === 'deployed') {
    router.push(`/agent/${agentStore.id}/overview`)
    return
  }

  // Initialize agent and conversation
  if (!agentStore.id) {
    agentStore.initializeAgent(agentGoal)
  }

  if (conversationStore.messages.length === 0) {
    conversationStore.initializeConversation(agentGoal)
  }

  // Always scroll to bottom when mounting (whether first time or returning from other pages)
  // This ensures users see the latest conversation when agent is not deployed
  // Use multiple attempts with different delays to ensure scroll happens
  nextTick(() => {
    // Immediate scroll attempt
    scrollToBottom(false)

    // Second attempt after short delay
    setTimeout(() => {
      scrollToBottom(false)
    }, 100)

    // Third attempt after longer delay to ensure all content is rendered
    setTimeout(() => {
      scrollToBottom(false)
    }, 500)
  })
})

// Handle user message
const handleUserMessage = (message) => {
  conversationStore.addUserMessage(message)

  // Scroll to show latest content
  nextTick(() => {
    setTimeout(() => {
      scrollToShowLatest()
    }, 50)
  })

  // Process the message based on current state
  processUserInput(message)
}

// Handle action button clicks (e.g., "Go step by step", connection selections)
const handleActionClick = (action) => {
  conversationStore.addUserMessage(action)

  // Scroll to show latest content after user clicks an action
  // This ensures new content loads in view without manual scrolling
  nextTick(() => {
    setTimeout(() => {
      scrollToShowLatest()
    }, 50)
  })

  // Process action based on current state
  processAction(action)
}

// Handle document submission
const handleDocumentSubmit = (documentText) => {
  conversationStore.addUserMessage("*Document pasted*")
  handleProPath(documentText)
}

// Handle test agent button
const handleTestAgent = () => {
  router.push('/test-mode')
}

// Process user input based on conversation state
const processUserInput = (input) => {
  const state = conversationStore.currentState

  // Simulate AI thinking
  conversationStore.setWaitingForAI(true)

  setTimeout(() => {
    // Handle different states
    if (state === 'asking_path') {
      // Detect path selection from message
      if (input.toLowerCase().includes('step')) {
        conversationStore.selectPath('beginner')
      } else if (input.toLowerCase().includes('whole') || input.toLowerCase().includes('plan')) {
        conversationStore.selectPath('pro')
      }
    } else if (state === 'beginner_phase_1') {
      // Handle Phase 1 questions
      handleBeginnerPhase1(input)
    } else if (state === 'pro_asking_missing') {
      // Handle pro path question answers
      handleProQuestionAnswers(input)
    } else if (state === 'beginner_phase_2') {
      // Handle Phase 2 - Connections
      handleBeginnerPhase2(input)
    } else if (state === 'beginner_phase_3') {
      // Handle Phase 3 - Guardrails
      handleBeginnerPhase3(input)
    } else if (state === 'beginner_phase_4') {
      // Handle Phase 4 - Validation
      handleBeginnerPhase4(input)
    } else if (state === 'beginner_phase_5') {
      // Handle Phase 5 - Optional skills
      handleBeginnerPhase5(input)
    } else if (state === 'pro_gathering_info') {
      // Handle pro path input
      handleProPath(input)
    } else if (state === 'pro_phase_2') {
      handleProPhase2(input)
    } else if (state === 'pro_phase_3') {
      handleProPhase3(input)
    } else if (state === 'pro_phase_4') {
      handleProPhase4(input)
    }

    conversationStore.setWaitingForAI(false)
  }, 1000)
}

// Process action button clicks
const processAction = (action) => {
  const state = conversationStore.currentState

  conversationStore.setWaitingForAI(true)

  // Check for global actions FIRST (before the setTimeout)
  if (action === 'Test agent now') {
    router.push('/test-mode')
    return
  } else if (action === 'Check out Visual Studio') {
    // Change state FIRST to prevent re-showing VS preview
    conversationStore.currentState = 'pro_vs_opened'

    // Navigate directly to workflow builder
    router.push('/workflow-builder')
    return
  } else if (action === 'Keep building') {
    conversationStore.setWaitingForAI(true)
    // Continue to validation phase
    conversationStore.addAIMessage("Great! Let's continue building...")
    setTimeout(() => {
      moveToProPhase4()
      conversationStore.setWaitingForAI(false)
    }, 1000)
    return
  } else if (action === 'Continue to validation') {
    conversationStore.setWaitingForAI(true)
    // From VS opened state, go to validation
    setTimeout(() => {
      moveToProPhase4()
      conversationStore.setWaitingForAI(false)
    }, 500)
    return
  }

  setTimeout(() => {
    if (action === 'Go step by step') {
      conversationStore.selectPath('beginner')
    } else if (action === 'Confirm whole plan') {
      // User confirmed the plan from the initial view, proceed with pro path directly
      conversationStore.selectPath('pro')
    } else if (state === 'pro_gathering_info') {
      // Handle pro path options
      if (action === 'Answer questions') {
        // User wants to answer questions - ask them and transition to asking state
        conversationStore.currentState = 'pro_asking_missing'
        conversationStore.addAIMessage(
          "Great! Let's collect the key details:\n\nScheduling Parameters:\n• What are your preferred business hours? (e.g., Monday-Friday, 9 AM - 5 PM EST)\n• What's the default appointment duration?\n• What buffer time between appointments?"
        )
      } else if (action === 'Paste a document') {
        // Show document input
        conversationStore.addAIMessage(
          null, // No text content
          'document-input' // Show DocumentInput component
        )
      } else if (action === 'Cancel document paste') {
        // User cancelled - show options again
        conversationStore.addAIMessage(
          "No problem! Would you like to:",
          'text',
          ['Answer questions', 'Paste a document']
        )
      }
    } else if (state === 'beginner_phase_2') {
      // Connection selections
      handleBeginnerPhase2(action)
    } else if (state === 'beginner_phase_3') {
      // Guardrail selections
      handleBeginnerPhase3(action)
    } else if (state === 'beginner_phase_4') {
      // Validation selections
      handleBeginnerPhase4(action)
    } else if (state === 'beginner_phase_5') {
      // Optional skills selections
      handleBeginnerPhase5(action)
    } else if (state === 'beginner_phase_6' || state === 'pro_phase_6') {
      // Test/Launch actions
      if (action === 'Start testing') {
        conversationStore.addAIMessage("Opening test mode...")

        setTimeout(() => {
          // Navigate to test mode
          router.push('/test-mode')
        }, 800)
      } else if (action === 'Save and get demo link') {
        conversationStore.addAIMessage("Generating your demo link...")

        // Generate a demo link based on agent name
        const agentId = agentStore.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        const timestamp = Date.now().toString(36)
        const demoLink = `https://daart-demo.com/${agentId}-${timestamp}`

        setTimeout(() => {
          conversationStore.addAIMessage(
            `Your agent is ready! Here's your demo link:\n\n${demoLink}\n\nShare this with your team to try the agent. The link will remain active for 30 days.\n\nWhat would you like to do next?`,
            'text',
            ['View agent overview', 'Deploy agent', 'Test agent now', 'Monitor performance']
          )
        }, 1500)
      } else if (action === 'Back to overview') {
        conversationStore.addAIMessage("Returning to overview...")
        setTimeout(() => {
          conversationStore.addAIMessage(
            "Your agent is built and ready! You can continue building or deploy when ready."
          )
        }, 1000)
      } else if (action === 'View agent overview') {
        // Mark onboarding as complete
        agentStore.completeOnboarding()
        conversationStore.addAIMessage("Opening agent overview...")
        setTimeout(() => {
          router.push('/agent/1/overview')
        }, 800)
      } else if (action === 'Deploy agent') {
        // Mark onboarding as complete
        agentStore.completeOnboarding()
        conversationStore.addAIMessage("Opening deployment wizard...")
        setTimeout(() => {
          router.push('/deploy')
        }, 800)
      } else if (action === 'Test agent now') {
        // Mark onboarding as complete
        agentStore.completeOnboarding()
        conversationStore.addAIMessage("Opening test mode...")
        setTimeout(() => {
          router.push('/test-mode')
        }, 800)
      } else if (action === 'Monitor performance') {
        // Mark onboarding as complete
        agentStore.completeOnboarding()
        conversationStore.addAIMessage("Opening performance monitor...")
        setTimeout(() => {
          router.push('/monitor')
        }, 800)
      }
    } else if (state === 'pro_phase_2') {
      handleProPhase2(action)
    } else if (state === 'pro_phase_3') {
      handleProPhase3(action)
    } else if (state === 'pro_phase_4') {
      handleProPhase4(action)
    }

    conversationStore.setWaitingForAI(false)
  }, 1000)
}

// Handle beginner Phase 1 questions
const handleBeginnerPhase1 = (input) => {
  const questionIndex = conversationStore.currentPhase.currentQuestionIndex

  // Phase 1 has 5 questions
  const phase1Questions = [
    {
      field: 'purpose',
      nextQuestion: "Perfect. Now let's talk about how customers will book these appointments. Do you have preferred dates or times when appointments are typically available? For instance, maybe you prioritize weekday mornings, or avoid Fridays?",
    },
    {
      field: 'businessHours',
      nextQuestion: "That makes sense. What about appointment duration — how long do these typically last?",
    },
    {
      field: 'appointmentDuration',
      nextQuestion: "Good. Now, when checking availability, should the agent respect any buffers between appointments? For example, 10 minutes between patients for notes and prep?",
    },
    {
      field: 'bufferTime',
      nextQuestion: "Got it. For Holiday hours or blackout periods I have this information from your Office settings: Standard US holidays, plus lunch from 12:30 to 1:30 PM daily. Is that ok?",
    },
    {
      field: 'blackoutPeriods',
      nextQuestion: null, // Last question - move to next phase
    },
  ]

  if (questionIndex < phase1Questions.length) {
    const currentQ = phase1Questions[questionIndex]

    // Save the answer
    const updateData = {}
    updateData[currentQ.field] = input
    agentStore.updateFoundation(updateData)

    // Update milestone with context summary
    if (questionIndex === 0) {
      conversationStore.updateMilestone({
        current: `Goal: ${agentStore.goal}`,
        contextSummary: 'Context: in progress',
      })
    }

    // Move to next question or next phase
    conversationStore.currentPhase.currentQuestionIndex++

    if (currentQ.nextQuestion) {
      // Ask next question
      conversationStore.addAIMessage(currentQ.nextQuestion)
    } else {
      // Phase 1 complete, move to Phase 2
      moveToPhase2()
    }
  }
}

// Handle Phase 2: Connections
const handleBeginnerPhase2 = (input) => {
  const questionIndex = conversationStore.currentPhase.currentQuestionIndex

  if (questionIndex === 0) {
    // Calendar system selected
    agentStore.addConnection({ type: 'calendar', name: input })

    conversationStore.addAIMessage("Great! Now for video meetings, which service do you use?", 'text', [
      'Zoom',
      'Microsoft Teams',
      'Google Meet',
      'Other'
    ])
    conversationStore.currentPhase.currentQuestionIndex++
  } else if (questionIndex === 1) {
    // Video service selected
    agentStore.addConnection({ type: 'video', name: input })

    // Move to Phase 3
    moveToPhase3()
  }
}

// Handle Phase 3: Safety & Guardrails
const handleBeginnerPhase3 = (input) => {
  const questionIndex = conversationStore.currentPhase.currentQuestionIndex

  if (questionIndex === 0) {
    // Asking about verification method
    agentStore.updateGuardrails({ identityVerification: input })

    conversationStore.addAIMessage(
      "Got it. Any business rules? For example, limits on new patients per day or provider-specific rules?"
    )
    conversationStore.currentPhase.currentQuestionIndex++
  } else if (questionIndex === 1) {
    // Business rules
    agentStore.updateGuardrails({ businessRules: [input] })

    // Move to Phase 4
    moveToPhase4()
  }
}

// Handle Phase 4: Validation
const handleBeginnerPhase4 = (input) => {
  const inputLower = input.toLowerCase()

  if (inputLower.includes('apply')) {
    // Apply all improvements
    conversationStore.addAIMessage("Applying all improvements...")

    setTimeout(() => {
      conversationStore.addAIMessage(
        "All improvements applied! Your agent is configured and optimized."
      )

      setTimeout(() => {
        // Check if pro or beginner path
        if (conversationStore.userPath === 'pro') {
          moveToProPhase5()
        } else {
          moveToPhase5()
        }
      }, 1000)
    }, 2000)
  } else if (inputLower.includes('skip')) {
    // Skip validation improvements
    conversationStore.addAIMessage("Skipping improvements for now. Your agent is ready to proceed!")

    setTimeout(() => {
      // Check if pro or beginner path
      if (conversationStore.userPath === 'pro') {
        moveToProPhase5()
      } else {
        moveToPhase5()
      }
    }, 800)
  } else if (inputLower.includes('review')) {
    // Review each individually
    conversationStore.addAIMessage("Let's review each improvement individually. Which one would you like to start with?", 'text', [
      'Buffer conflict resolution',
      'Timezone display enhancement',
      'New patient cap alert',
      'Specialty routing fallback',
      'Apply all and continue'
    ])
  }
}

// Handle Phase 5: Optional Skills
const handleBeginnerPhase5 = (input) => {
  if (input.toLowerCase().includes('test') || input.toLowerCase().includes('skip')) {
    // Move to Phase 6
    moveToPhase6()
  } else {
    // User wants to add skills
    conversationStore.addAIMessage("Which additional capabilities would you like?", 'text', [
      'Email confirmations',
      'SMS reminders',
      'Reschedule flows',
      'Skip for now'
    ])
  }
}

// Move to Phase 2: Connections
const moveToPhase2 = () => {
  conversationStore.currentPhase.number = 2
  conversationStore.currentPhase.name = 'Enable Connections'
  conversationStore.currentPhase.status = 'in_progress'
  conversationStore.currentPhase.currentQuestionIndex = 0

  // Update milestone
  conversationStore.updateMilestone({
    completed: 'Goal and context defined',
    current: 'Connections: in progress',
  })

  // Move state
  conversationStore.currentState = 'beginner_phase_2'

  // Ask about calendar systems
  conversationStore.addAIMessage(
    "Which calendar system do your providers use?",
    'text',
    ['Google Calendar', 'Microsoft Calendar', 'Other']
  )
}

// Move to Phase 3: Guardrails
const moveToPhase3 = () => {
  conversationStore.currentPhase.number = 3
  conversationStore.currentPhase.name = 'Safety & Guardrails'
  conversationStore.currentPhase.status = 'in_progress'
  conversationStore.currentPhase.currentQuestionIndex = 0

  // Update milestone
  conversationStore.updateMilestone({
    completed: 'Connections added',
    current: 'Safety rules: in progress',
  })

  conversationStore.currentState = 'beginner_phase_3'

  conversationStore.addAIMessage(
    "Now let's set up safety rules. For identity verification, what method works best?",'text',
    ['Date of birth', 'Last 4 of phone', 'Account PIN', 'None needed']
  )
}

// Move to Phase 4: Validation
const moveToPhase4 = () => {
  conversationStore.currentPhase.number = 4
  conversationStore.currentPhase.name = 'Validate & Refine'
  conversationStore.currentPhase.status = 'in_progress'
  conversationStore.currentPhase.currentQuestionIndex = 0

  conversationStore.updateMilestone({
    completed: 'Safety rules configured',
    current: 'Validation: in progress',
  })

  conversationStore.currentState = 'beginner_phase_4'

  conversationStore.addAIMessage("Running validation...")

  // Simulate validation
  setTimeout(() => {
    // Add validation card with improvements
    const improvements = [
      {
        title: 'Buffer conflict resolution',
        type: 'optimization',
        description: "You've set a 15-minute buffer between appointments and a 12:30-1:30 PM lunch break.",
        details: "I recommend adding a 5-minute prep buffer before the first afternoon appointment (at 1:30 PM) to prevent back-to-back scheduling issues.",
        impact: "Prevents double-booking issues and gives staff time to prepare for afternoon appointments"
      },
      {
        title: 'Timezone display enhancement',
        type: 'ux',
        description: "For patients in different time zones, the agent should display times in both the patient's local time AND your office time.",
        details: "This reduces confusion when patients book appointments, especially if they're calling from Mountain or Eastern time zones while your office is in Pacific time.",
        impact: "Reduces booking errors and patient confusion by 40%"
      },
      {
        title: 'New patient cap alert',
        type: 'safety',
        description: "Your 5-new-patient-per-day cap should trigger proactive messaging.",
        details: "When only 1-2 slots remain for new patients, the agent should immediately offer next-day alternatives rather than showing unavailable times.",
        impact: "Improves patient experience and reduces frustration from seeing 'unavailable' times"
      },
      {
        title: 'Specialty routing fallback',
        type: 'enhancement',
        description: "When Dr. Martinez (pediatrics) or Dr. Chen (cardiology) are unavailable, the agent lacks clear guidance.",
        details: "The agent should explicitly ask if the patient wants to wait for that specialist or see a general practitioner for non-urgent cases.",
        impact: "Ensures patients get appropriate care routing and reduces missed appointment opportunities"
      }
    ]

    conversationStore.addAIMessage(
      null, // No text content, ValidationCard will render
      'validation',
      null,
      improvements // Pass improvements as extra data
    )
  }, 2000)
}

// Move to Phase 5: Optional Skills
const moveToPhase5 = () => {
  conversationStore.currentPhase.number = 5
  conversationStore.currentPhase.name = 'Additional Skills'
  conversationStore.currentPhase.status = 'in_progress'
  conversationStore.currentPhase.currentQuestionIndex = 0

  conversationStore.updateMilestone({
    completed: 'Validation complete',
    current: 'Optional skills',
  })

  conversationStore.currentState = 'beginner_phase_5'

  conversationStore.addAIMessage(
    "Your agent is ready! Want to add more capabilities?",
    'text',
    ['Add confirmations', 'Add reminders', 'Skip - test now']
  )
}

// Move to Phase 6: Test
const moveToPhase6 = () => {
  conversationStore.currentPhase.number = 6
  conversationStore.currentPhase.name = 'Test & Launch'
  conversationStore.currentPhase.status = 'in_progress'

  conversationStore.updateMilestone({
    completed: 'Agent configured',
    current: 'Ready to test',
  })

  conversationStore.currentState = 'beginner_phase_6'

  // Mark onboarding as complete to enable navigation links
  agentStore.completeOnboarding()
  // Update agent status to 'ready' (not yet deployed)
  agentStore.updateStatus('ready')

  conversationStore.addAIMessage(
    "Perfect! Your agent is built and ready to test.",
    'text',
    ['Start testing', 'Save and get demo link', 'View agent overview', 'Deploy agent']
  )
}

// Handle pro path question answers
const handleProQuestionAnswers = (input) => {
  // Parse the user's answers
  conversationStore.addAIMessage("Got it! Processing your scheduling requirements...")

  // Extract structured data from the input (in real implementation, would use AI to parse)
  agentStore.updateFoundation({
    purpose: 'Appointment scheduling and management',
    businessHours: input.includes('hours') ? input : 'Monday-Friday, 9 AM - 5 PM',
    appointmentDuration: '30 minutes',
    bufferTime: '15 minutes',
    blackoutPeriods: 'Standard holidays'
  })

  setTimeout(() => {
    conversationStore.addAIMessage("Perfect! I have all the details I need.")
    conversationStore.setWaitingForAI(false)
    setTimeout(() => {
      moveToProPhase2()
    }, 800)
  }, 1000)
}

// Handle pro path - with or without document
const handleProPath = (documentText = null) => {
  if (documentText) {
    // User pasted a document - parse it
    conversationStore.addAIMessage("Extracting requirements from your document...")

    // Simulate parsing (in real implementation, would use AI to extract structured data)
    agentStore.updateFoundation({
      purpose: 'Medical consultations and appointment management',
      businessHours: 'Monday-Thursday 9am-5pm, Friday 9am-12pm',
      appointmentDuration: '30-45 minutes',
      bufferTime: '15 minutes',
      blackoutPeriods: 'US holidays, lunch 12:30-1:30pm'
    })

    setTimeout(() => {
      conversationStore.addAIMessage("Configuration complete! Found your scheduling rules, business hours, and appointment types.")
      setTimeout(() => {
        moveToProPhase2()
      }, 800)
    }, 1500)
  } else {
    // Using smart defaults
    conversationStore.addAIMessage("Configuring with smart defaults based on your goal...")

    agentStore.updateFoundation({
      purpose: 'Appointment management',
      businessHours: 'Standard business hours',
      appointmentDuration: '30 minutes',
      bufferTime: '15 minutes',
      blackoutPeriods: 'Standard holidays'
    })

    setTimeout(() => {
      conversationStore.addAIMessage("Configuration complete!")
      setTimeout(() => {
        moveToProPhase2()
      }, 800)
    }, 1000)
  }
}

// Pro path Phase 2: Connections (faster)
const moveToProPhase2 = () => {
  conversationStore.currentPhase.number = 2
  conversationStore.currentPhase.name = 'Enable Connections'
  conversationStore.currentState = 'pro_phase_2'

  conversationStore.updateMilestone({
    completed: 'Foundation configured',
    current: 'Connections: in progress'
  })

  conversationStore.addAIMessage(
    "Which tools do you use?",
    'text',
    ['Google Calendar + Zoom', 'Microsoft Calendar + Teams', 'Custom setup']
  )
}

// Handle pro path Phase 2
const handleProPhase2 = (input) => {
  // Save connection based on selection
  if (input.includes('Google')) {
    agentStore.addConnection({ type: 'calendar', name: 'Google Calendar' })
    agentStore.addConnection({ type: 'video', name: 'Zoom' })
  } else if (input.includes('Microsoft')) {
    agentStore.addConnection({ type: 'calendar', name: 'Microsoft Calendar' })
    agentStore.addConnection({ type: 'video', name: 'Microsoft Teams' })
  }

  conversationStore.addAIMessage("Connections configured!")

  setTimeout(() => {
    moveToProPhase3()
  }, 1000)
}

// Pro path Phase 3: Guardrails (faster)
const moveToProPhase3 = () => {
  conversationStore.currentPhase.number = 3
  conversationStore.currentPhase.name = 'Safety & Guardrails'
  conversationStore.currentState = 'pro_phase_3'

  conversationStore.updateMilestone({
    completed: 'Connections added',
    current: 'Safety: in progress'
  })

  conversationStore.addAIMessage(
    "Quick safety check - verification method?",
    'text',
    ['Date of birth', 'Account PIN', 'Skip verification']
  )
}

// Handle pro path Phase 3
const handleProPhase3 = (input) => {
  agentStore.updateGuardrails({
    identityVerification: input,
    safetyRules: ['Never invent availability', 'Read back before confirming', 'Keep responses under 10 seconds']
  })

  // Success message for safety
  conversationStore.addAIMessage("Safety configured!")

  setTimeout(() => {
    // Add success messages
    conversationStore.addAIMessage("Connections established!")

    setTimeout(() => {
      conversationStore.addAIMessage("Your first task is built!")

      setTimeout(() => {
        // Show Visual Studio preview inline card
        conversationStore.addAIMessage(
          null, // No text content, VisualStudioPreview will render
          'visual-studio'
        )
      }, 800)
    }, 800)
  }, 1000)
}

// Pro path Phase 4: Validation (same as beginner)
const moveToProPhase4 = () => {
  moveToPhase4()
  conversationStore.currentState = 'pro_phase_4'
}

// Handle pro path Phase 4
const handleProPhase4 = (input) => {
  handleBeginnerPhase4(input)
}

// Pro path Phase 5: Skip to testing
const moveToProPhase5 = () => {
  conversationStore.currentPhase.number = 5
  conversationStore.currentState = 'pro_phase_5'

  conversationStore.updateMilestone({
    completed: 'Validation complete',
    current: 'Ready to test'
  })

  // Auto-skip to phase 6 for pro users
  setTimeout(() => {
    moveToPhase6()
    conversationStore.currentState = 'pro_phase_6'
  }, 1000)
}
</script>

<style scoped>
.builder-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--dt-color-surface-secondary);
}

/* Page Header with Breadcrumb */
.page-header {
  background: var(--dt-color-surface-primary);
  padding: var(--dt-space-500) var(--dt-space-600);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  font-size: var(--dt-font-size-100);
  margin-bottom: var(--dt-space-300);
}

.breadcrumb-item {
  color: var(--dt-color-foreground-secondary);
}

.breadcrumb-item.active {
  color: var(--dt-color-foreground-primary);
  font-weight: var(--dt-font-weight-medium);
}

.breadcrumb-separator {
  color: var(--dt-color-foreground-tertiary);
}

.page-title {
  font-size: var(--dt-font-size-500);
  font-weight: var(--dt-font-weight-bold);
  color: var(--dt-color-foreground-primary);
  margin: 0 0 var(--dt-space-200);
  line-height: 1.2;
}

.page-description {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  margin: 0;
  line-height: 1.5;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  background: var(--dt-color-surface-primary);
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--dt-space-550);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-450);
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: var(--dt-color-surface-secondary);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-200);
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--dt-color-border-strong);
}

/* Responsive */
@media (max-width: 1024px) {
  .chat-container {
    max-width: 100%;
  }
}
</style>
