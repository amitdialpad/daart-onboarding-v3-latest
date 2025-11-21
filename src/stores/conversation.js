import { defineStore } from 'pinia'

// Conversation states for the state machine
export const ConversationState = {
  // Initial
  SHOWING_PLAN: 'showing_plan',
  ASKING_PATH: 'asking_path',

  // Beginner Path
  BEGINNER_PHASE_1: 'beginner_phase_1',
  BEGINNER_PHASE_2: 'beginner_phase_2',
  BEGINNER_PHASE_3: 'beginner_phase_3',
  BEGINNER_PHASE_4: 'beginner_phase_4',
  BEGINNER_PHASE_5: 'beginner_phase_5',
  BEGINNER_PHASE_6: 'beginner_phase_6',

  // Pro Path
  PRO_GATHERING_INFO: 'pro_gathering_info',
  PRO_CONFIGURING: 'pro_configuring',
  PRO_ASKING_MISSING: 'pro_asking_missing',
  PRO_PHASE_2: 'pro_phase_2',
  PRO_PHASE_4: 'pro_phase_4',
  PRO_PHASE_6: 'pro_phase_6',
}

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    // Current state
    currentState: ConversationState.SHOWING_PLAN,
    userPath: null, // 'beginner' | 'pro'

    // Message history
    messages: [],

    // Current phase tracking
    currentPhase: {
      number: 1,
      name: 'Agent Foundation & Skills',
      status: 'pending', // 'pending' | 'in_progress' | 'completed'
      currentQuestionIndex: 0,
    },

    // Milestone tracking
    milestones: {
      goal: '',
      contextSummary: '',
      completed: [],
      current: '',
      upcoming: [
        'Add tools connections',
        'Add safety and behavior guides (guardrails)',
        'Validate',
        'Add more tasks (optional)',
        'Test',
      ],
    },

    // UI state
    isWaitingForAI: false,
    isProcessing: false,
  }),

  getters: {
    // Get all messages
    allMessages: (state) => state.messages,

    // Check if waiting for user input
    isWaitingForUser: (state) => !state.isWaitingForAI && !state.isProcessing,

    // Get current milestone status
    milestoneStatus: (state) => ({
      goal: state.milestones.goal,
      contextSummary: state.milestones.contextSummary,
      completed: state.milestones.completed,
      current: state.milestones.current,
      upcoming: state.milestones.upcoming,
    }),
  },

  actions: {
    // Add a message to the conversation
    addMessage(message) {
      const newMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...message,
      }
      this.messages.push(newMessage)
    },

    // Add AI message
    addAIMessage(content, type = 'text', actions = null, improvements = null, progressItems = null, title = null) {
      this.addMessage({
        sender: 'ai',
        content,
        type,
        actions,
        improvements, // For validation cards
        progressItems, // For loading progress
        title, // For loading progress title
      })
    },

    // Update a specific message by ID
    updateMessage(messageId, updates) {
      const message = this.messages.find(m => m.id === messageId)
      if (message) {
        Object.assign(message, updates)
      }
    },

    // Add user message
    addUserMessage(content) {
      this.addMessage({
        sender: 'user',
        content,
        type: 'text',
      })
    },

    // Initialize conversation with the initial plan
    initializeConversation(agentGoal) {
      this.messages = []
      this.milestones.goal = agentGoal

      // Add simple initial greeting
      this.addAIMessage(
        `Perfect! Here's what we'll build together:`
      )

      // Show the visual plan directly
      setTimeout(() => {
        this.addAIMessage(
          null,  // No text content for visual plan
          'whole-plan'  // Show the WholePlanView component
        )
      }, 500)

      this.currentState = ConversationState.ASKING_PATH
    },

    // Select user path (beginner or pro)
    selectPath(path) {
      this.userPath = path

      if (path === 'beginner') {
        this.currentState = ConversationState.BEGINNER_PHASE_1
        this.currentPhase.status = 'in_progress'
        this.milestones.current = `Goal: ${this.milestones.goal}`

        // Start Phase 1 - just ask the first question
        this.addAIMessage(
          "Great! Let's start with the basics."
        )

        setTimeout(() => {
          this.addAIMessage(
            "What's the main purpose of appointments in your business?"
          )
        }, 800)
      } else if (path === 'pro') {
        this.currentState = ConversationState.PRO_CONFIGURING
        this.currentPhase.status = 'in_progress'

        this.addAIMessage(
          "Perfect! Let me run through the entire setup for you."
        )

        // Show loading progress
        setTimeout(() => {
          this.addAIMessage(
            "Running full agent configuration...",
            'loading-progress',
            null,
            null,
            [
              { label: 'Agent Foundation & Skills - Creating booking capabilities with intelligent scheduling logic', status: 'pending' },
              { label: 'Tool Connections - Preparing integrations for calendar, video conferencing, and CRM systems', status: 'pending' },
              { label: 'Safety & Behavioral Guardrails - Implementing boundaries to ensure professional, compliant interactions', status: 'pending' },
              { label: 'Conversation Flows - Designing natural dialogues for scheduling, rescheduling, confirmations, and cancellations', status: 'pending' },
              { label: 'Smart Features - Adding timezone handling, conflict detection, and automated reminders', status: 'pending' }
            ],
            'I\'m now building your agent with the following:'
          )
        }, 800)

        // After loading, show the completion message
        setTimeout(() => {
          this.addAIMessage(
            "Configuration complete! Your agent framework is built. Now I just need a few key details to finalize everything.\n\nYou can answer these individually, or if you have a document with your scheduling policies, business hours, and requirements, feel free to copy and paste it here and I'll extract everything I need.",
            'text',
            ['Answer questions', 'Paste a document']
          )
          this.currentState = ConversationState.PRO_GATHERING_INFO
        }, 3500)
      }
    },

    // Update milestone
    updateMilestone(update) {
      if (update.current) {
        this.milestones.current = update.current
      }
      if (update.contextSummary) {
        this.milestones.contextSummary = update.contextSummary
      }
      if (update.completed) {
        this.milestones.completed.push(update.completed)
      }
    },

    // Set waiting state
    setWaitingForAI(waiting) {
      this.isWaitingForAI = waiting
    },

    // Set processing state
    setProcessing(processing) {
      this.isProcessing = processing
    },

    // Clear conversation
    clearConversation() {
      this.messages = []
      this.currentState = ConversationState.SHOWING_PLAN
      this.userPath = null
      this.currentPhase = {
        number: 1,
        name: 'Agent Foundation & Skills',
        status: 'pending',
        currentQuestionIndex: 0,
      }
      this.milestones = {
        goal: '',
        contextSummary: '',
        completed: [],
        current: '',
        upcoming: [
          'Add tools connections',
          'Add safety and behavior guides (guardrails)',
          'Validate',
          'Add more tasks (optional)',
          'Test',
        ],
      }
    },
  },
})
