# DAART Project Context - Full Reference

Load complete context for the DAART Onboarding V3 project.

---

## 🔗 Essential Links

**Live Demo**: https://amitdialpad.github.io/daart-onboarding-v3-latest/

**GitHub Repository**: https://github.com/amitdialpad/daart-onboarding-v3-latest

**Main Branch**: `main`

**Local Dev Server**: http://localhost:5174

---

## 📋 Project Overview

**Project Name**: DAART Onboarding V3 - Conversational Builder Prototype

**Purpose**: Build a conversational onboarding experience that helps users create AI agents with multiple skills through an intuitive, step-by-step flow.

**Key Differentiator**: "One agent with multiple skills" - users build a single powerful agent that can handle appointment scheduling, billing questions, form collection, etc., all in one agent (not separate bots).

---

## 🎯 Current State (End of Session 3)

### What's Built:
1. ✅ **Homepage** (StartingPointView.vue)
   - Outcome-focused value proposition
   - Free trial messaging
   - 6 template pills with outcome-focused benefits
   - Direct navigation to builder on template click

2. ✅ **Multi-Skill Selection Flow** (ConversationalBuilderView.vue)
   - Skills shown FIRST (before path choice)
   - Multi-select checkboxes via SkillSelector component
   - 7 skill options including custom
   - Welcoming explanatory text

3. ✅ **Path Choice** (After skills selected)
   - "Guide me step by step" (guided configuration)
   - "I'll configure it myself in the advanced builder"

4. ✅ **6-Phase Configuration**
   - Phase 1: Agent Foundation & Skills
   - Phase 2: Enable Connections
   - Phase 3: Safety & Guardrails
   - Phase 4: Validation
   - Phase 5: Design Conversations
   - Phase 6: Test Agent

5. ✅ **Agent Studio Integration**
   - Option shown at Phase 6 completion
   - "Coming soon" placeholder page
   - Navigation ready for future implementation

6. ✅ **Test Mode** (TestModeView.vue)
   - Chat interface for testing agent
   - Mock responses for demo

---

## 🏗️ Architecture

### Tech Stack:
- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **State Management**: Pinia (stores: agent, conversation)
- **Router**: Vue Router
- **Build Tool**: Vite
- **Styling**: Dialtone design system (CSS variables)
- **Deployment**: GitHub Pages

### Key Files:

**Views**:
- `/src/views/StartingPointView.vue` - Homepage with templates
- `/src/views/ConversationalBuilderView.vue` - Main onboarding flow (1100+ lines)
- `/src/views/AgentStudioView.vue` - Visual flow builder (placeholder)
- `/src/views/TestModeView.vue` - Agent testing interface
- `/src/views/AgentOverviewView.vue` - Agent config summary
- `/src/views/DeployView.vue` - Deployment wizard
- `/src/views/MonitorView.vue` - Performance monitoring

**Components**:
- `/src/components/builder/SkillSelector.vue` - Multi-select skill checkboxes
- `/src/components/builder/ChatMessage.vue` - Message bubble component
- `/src/components/builder/MessageInput.vue` - User input field
- `/src/components/builder/ProgressBar.vue` - Phase progress indicator
- `/src/components/builder/LoadingProgress.vue` - Loading animation

**Stores**:
- `/src/stores/agent.js` - Agent configuration state (goal, skills, connections, guardrails)
- `/src/stores/conversation.js` - Conversation flow state machine (messages, phases, milestones)

**Config**:
- `/vite.config.js` - Build config with base path `/daart-onboarding-v3-latest/`
- `/src/router/index.js` - Route definitions

---

## 🎨 Design Principles Applied

Based on Stewart Butterfield's 8 principles (see DESIGN_PRINCIPLES.md):

1. ✅ **Create Understanding** - Clear explanations, concrete examples
2. ✅ **Sell Outcomes** - All features show results ("Save 2+ hours per day")
3. ✅ **Avoid Fake Work** - Removed multi-channel preview, direct navigation
4. ⏸️ **Be Specific** - Partially applied
5. ⏸️ **Credibility & Trust** - Free trial badge added
6. ✅ **Don't Make Me Think** - Simplified choices, clear paths
7. ⏸️ **Write Less** - Ongoing refinement
8. ✅ **Generosity** - "Free to build and test" messaging

---

## 📊 Key Changes by Session

### Session 1: Initial Prototype
- Created basic conversational builder structure
- Implemented 6-phase onboarding flow
- Added template selection on homepage

### Session 2: Homepage Improvements
**See**: SESSION_2_SUMMARY.md

Key changes:
- Outcome-focused value proposition
- Rewrote all 6 templates with outcome-focused bullets
- Added "Free to try" badge
- Removed multi-channel preview (600+ lines) - violated "Avoid Fake Work"
- Simplified to direct navigation from templates

### Session 3: Multi-Skill Agent Flow
**See**: SESSION_3_SUMMARY.md

Key changes:
- **Root cause identified**: Asking "guided vs advanced" BEFORE skills created wrong mental model
- **Solution**: Moved skill selection BEFORE path choice
- Created SkillSelector component with multi-select checkboxes
- Added welcoming explanatory text
- Expanded skills from 3 to 7 (including custom option)
- Added Agent Studio option at completion
- Fixed button copy from "6 steps" to "step by step"

---

## 🔄 Conversation Flow (Current)

### Homepage → Builder Flow:

1. **User lands on homepage**
   - Sees outcome-focused value prop
   - Views 6 template pills

2. **User clicks template or enters custom goal**
   - Navigates to `/builder?goal={goal}`
   - ConversationalBuilderView initializes

3. **Welcome message**
   ```
   "Perfect! Let's build your {goal} agent."
   ```

4. **Explanation (600ms delay)**
   ```
   "First, let's define what your agent can do. You can give it multiple
   skills - like scheduling appointments AND answering questions. This is
   what makes your agent powerful!"
   ```

5. **Skill Selector (1400ms delay)**
   - Shows SkillSelector component
   - 7 options with checkboxes:
     - Schedule appointments
     - Collect forms
     - Answer billing questions
     - Answer common questions
     - Handle prescription refills
     - Send reminders
     - Something else (I'll describe it)
   - Button: "Continue with selected skills" (disabled until selection)

6. **User selects skills and continues**
   - Skills added to agent store
   - Confirmation message: "Great! Your agent will have these skills: {list}"

7. **Path choice (800ms delay)**
   ```
   "How would you like to configure your agent?"
   - Guide me step by step
   - I'll configure it myself in the advanced builder
   ```

8. **If "Guide me step by step"**:
   - Proceeds through 6 phases with questions
   - Each phase has specific configuration questions
   - Progress bar shows current phase

9. **If "Advanced builder"**:
   - Navigates to `/agent-studio`
   - Shows "coming soon" placeholder

10. **Phase 6 completion**:
    ```
    "Perfect! Your agent is built and ready to test."

    "From here, you can test your agent or jump into Agent Studio to
    visually design and modify the conversation flow with a drag-and-drop
    interface."

    "What would you like to do next?"
    - Start testing
    - Open Agent Studio
    - View agent overview
    ```

---

## 🗂️ State Management

### Agent Store (`/src/stores/agent.js`)

**State**:
```javascript
{
  id: string,
  name: string,
  goal: string,
  skills: [{ id, type, config }],
  connections: [{ type, name }],
  guardrails: {
    identityVerification: string,
    businessRules: []
  },
  foundation: {
    purpose: string,
    businessHours: string,
    appointmentDuration: string,
    bufferTime: string,
    blackoutPeriods: string
  },
  onboardingComplete: boolean
}
```

**Key Actions**:
- `initializeAgent(goal)` - Create new agent
- `addSkill(skillId)` - Add skill to agent
- `updateSkillConfig(skillId, config)` - Configure skill
- `addConnection(connection)` - Add tool connection
- `updateGuardrails(guardrails)` - Set safety rules
- `completeOnboarding()` - Mark onboarding done

### Conversation Store (`/src/stores/conversation.js`)

**State**:
```javascript
{
  currentState: ConversationState,
  userPath: 'beginner' | 'pro',
  selectedSkills: [],
  currentlyConfiguringSkill: number,
  messages: [],
  currentPhase: {
    number: number,
    name: string,
    status: 'pending' | 'in_progress' | 'completed',
    currentQuestionIndex: number
  },
  milestones: {
    goal: string,
    contextSummary: string,
    completed: [],
    current: string,
    upcoming: []
  },
  isWaitingForAI: boolean,
  isProcessing: boolean
}
```

**Conversation States**:
```javascript
ConversationState = {
  SHOWING_PLAN: 'showing_plan',
  ASKING_PATH: 'asking_path',
  BEGINNER_PHASE_1: 'beginner_phase_1',
  // ... through BEGINNER_PHASE_6
  PRO_GATHERING_INFO: 'pro_gathering_info',
  PRO_CONFIGURING: 'pro_configuring',
  PRO_SKILL_SELECTION: 'pro_skill_selection',
  PRO_ASKING_MISSING: 'pro_asking_missing',
  // ... through PRO_PHASE_6
}
```

**Key Actions**:
- `initializeConversation(agentGoal)` - Start onboarding
- `addMessage(message)` - Add message to history
- `addAIMessage(content, type, actions)` - Add AI message
- `addUserMessage(content)` - Add user message
- `updateMilestone(update)` - Update progress
- `completePhaseAndMoveNext(nextPhase)` - Advance phase

---

## 🐛 Known Issues & Technical Debt

### Fixed:
✅ Syntax error in conversation.js (apostrophe escaping)
✅ Base URL mismatch in vite.config.js
✅ GitHub Pages deployment path issues

### Current Issues:
None blocking.

### Future Improvements:
1. **Custom Skill Input Flow** - Handle "Something else" option with follow-up
2. **Dynamic Skill Suggestions** - Analyze goal text to suggest relevant skills
3. **Skill Dependencies** - Suggest complementary skills (scheduler → reminders)
4. **Agent Studio Implementation** - Build actual drag-and-drop flow builder
5. **Persistent State** - Already using localStorage via Pinia, but could add "Continue where you left off"

---

## 👥 Team & Feedback

### Key People:
- **Michele** (Engineering Head) - Provided core feedback about "one agent, multiple skills"
- **User/PM** (Amit) - Product direction and UX feedback
- **EPD** - Engineering, Product, Design team (next feedback round pending)

### Michele's Feedback (Addressed in Session 3):
> "One agent with multiple skills is our differentiation, but the flow makes it feel like you're building separate single-skill agents (a 'skill builder' not an 'agent builder')."

**Resolution**: Restructured flow to show multi-skill selection FIRST, establishing the correct mental model upfront.

### Pending EPD Feedback:
Awaiting feedback from Engineering, Product, Design team on Session 3 changes.

---

## 📝 Documentation Files

**Session Summaries**:
- `SESSION_2_SUMMARY.md` - Homepage improvements based on Stewart Butterfield principles
- `SESSION_3_SUMMARY.md` - Multi-skill agent flow implementation

**Design Documentation**:
- `DESIGN_PRINCIPLES.md` - Full documentation of Stewart Butterfield's 8 principles
- `HOMEPAGE_ANALYSIS.md` - Principle-by-principle homepage analysis

**Utility**:
- `clear-storage.html` - Clear localStorage for testing (open in browser)

---

## 🚀 Deployment Process

### Build & Deploy:
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npx gh-pages -d dist -r https://github.com/amitdialpad/daart-onboarding-v3-latest.git
```

### Vite Config:
```javascript
base: '/daart-onboarding-v3-latest/'
```

**Important**: The `base` path must match the GitHub repo name for proper asset loading.

### GitHub Pages Setup:
- Source: `gh-pages` branch
- Path: `/` (root)
- URL: https://amitdialpad.github.io/daart-onboarding-v3-latest/

---

## 🧪 Testing & Development

### Local Development:
```bash
npm run dev
```
Opens at: http://localhost:5174

### Clear Browser State:
Open `/clear-storage.html` in browser to reset all localStorage data.

### Git Remotes:
```bash
origin    https://github.com/amitdialpad/daart-onboarding-v3.git (OLD)
upstream  https://github.com/amitdialpad/daart-onboarding-v3-latest.git (CURRENT)
```

**Note**: `upstream` is the active repository with the fixed base URL.

---

## 🎯 Next Steps (After EPD Feedback)

### Likely Priorities:

1. **Implement EPD Feedback** - TBD based on team review

2. **Custom Skills Flow** - Add follow-up for "Something else" option

3. **Agent Studio MVP** - Build basic drag-and-drop interface

4. **Enhanced Validation** - Phase 4 could be more interactive

5. **Polish & Refinement**:
   - Review all copy for clarity
   - Ensure consistent timing/delays
   - Add more micro-interactions
   - Improve loading states

---

## 💡 Key Learnings

### From Session 2:
- **Outcomes > Features**: "Save 2+ hours" beats "Books appointments"
- **Avoid Fake Work**: Removed 600+ lines of multi-channel preview
- **Direct Action**: Get users building faster, less explaining

### From Session 3:
- **Order Matters**: Skill selection before path choice = correct mental model
- **Multi-Select Communicates**: Checkboxes signal "pick more than one" without explanation
- **Warmth Prevents Friction**: Explanatory text prevents "dumped in" feeling
- **Specific > Abstract**: "Step by step" beats "6 steps"

### Architecture Insights:
- **State Machine Pattern**: Conversation flow works well with explicit states
- **Timed Messages**: Staggered delays (600ms, 1400ms) create natural conversation rhythm
- **Component Composition**: Skill selector as separate component enables reuse
- **Pinia Persistence**: localStorage integration makes state survive refreshes

---

## 🔍 Code Search Tips

### Find Key Logic:
```bash
# Skill selection handler
grep -r "handleSkillsSelected" src/

# Conversation initialization
grep -r "initializeConversation" src/

# State machine transitions
grep -r "currentState" src/stores/conversation.js

# Phase progression
grep -r "completePhaseAndMoveNext" src/
```

### Important Line Ranges:

**ConversationalBuilderView.vue**:
- Lines 1016-1047: `handleSkillsSelected()` - Multi-skill selection handler
- Lines 310-320: Updated action handlers (guided vs advanced)
- Lines 799-819: Phase 6 completion with Agent Studio option
- Lines 381-386: Agent Studio navigation handler

**conversation.js**:
- Lines 128-171: `initializeConversation()` - Welcome + skills + explanation
- Lines 159-166: Skill options array (7 skills)

**SkillSelector.vue**:
- Lines 44-63: Multi-select logic and continue handler

---

## 📊 Component Tree

```
App.vue
└── AppLayout.vue (if not hideLayout)
    └── Router View
        ├── StartingPointView.vue (/)
        │   └── Goal input + Template pills
        │
        ├── ConversationalBuilderView.vue (/builder)
        │   ├── ProgressBar
        │   ├── ChatMessage (multiple)
        │   │   ├── SkillSelector (when type='skill-selector')
        │   │   └── Action buttons
        │   ├── MessageInput
        │   └── LoadingProgress (when processing)
        │
        ├── AgentStudioView.vue (/agent-studio)
        │   └── Coming soon overlay
        │
        ├── TestModeView.vue (/test-mode)
        │   └── Chat interface
        │
        ├── AgentOverviewView.vue (/agent/:id/overview)
        │   └── Config display
        │
        └── DeployView.vue (/deploy)
            └── Deployment wizard
```

---

## 🎨 Styling Reference

Using **Dialtone Design System** CSS variables:

**Spacing**: `--dt-space-{300-800}`
**Colors**: `--dt-color-{category}-{variant}`
**Typography**: `--dt-font-size-{100-800}`, `--dt-font-weight-{normal|medium|semibold|bold}`
**Border Radius**: `--dt-size-radius-{300-500}`
**Shadows**: `--dt-shadow-{200-400}`

**Example**:
```css
padding: var(--dt-space-400);
background: var(--dt-color-surface-primary);
color: var(--dt-color-foreground-primary);
border-radius: var(--dt-size-radius-300);
```

---

## 📞 Command to Load This Context

When returning to this project, use:

```
/daart
```

This command loads this entire context file, giving you:
- All links and references
- Complete architecture overview
- Current state and what's been built
- Key code locations with line numbers
- Design principles and learnings
- Next steps and priorities

---

**Last Updated**: Session 3 (End)
**Status**: ✅ Multi-skill flow complete, awaiting EPD feedback
**Next Session**: Apply EPD feedback and iterate
