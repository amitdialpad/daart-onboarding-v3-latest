# Context from DAART Onboarding V2 Prototype

**Imported:** November 21, 2025
**Source:** `/Users/amitayre/code/daart-onboarding-prototype`
**Purpose:** Consolidate learnings, design decisions, and patterns from V2 into V3 development

---

## Table of Contents
1. [Project Background](#project-background)
2. [V2 vs V3 Approach](#v2-vs-v3-approach)
3. [Key Design Decisions from V2](#key-design-decisions-from-v2)
4. [What Worked Well in V2](#what-worked-well-in-v2)
5. [Known Issues from V2](#known-issues-from-v2)
6. [Component Architecture Patterns](#component-architecture-patterns)
7. [State Management Patterns](#state-management-patterns)
8. [Design System & Styling](#design-system--styling)
9. [Missing Features from V2](#missing-features-from-v2)
10. [User Flow Comparisons](#user-flow-comparisons)

---

## Project Background

### What is DAART?
DAART (Dialpad Agentic AI in Real-Time) is Dialpad's platform for building AI agents that can take actions via APIs, workflows, and multi-step tasks. This is an evolution from RAG-based chatbots to true agentic AI.

### The Prototype Journey
- **V1**: Initial concept exploration (not documented)
- **V2**: Workspace-based builder with tabs, scenario quick-starts, and wizard flows
- **V3** (current): Conversational-first builder based on Sofia's "North Star" vision

---

## V2 vs V3 Approach

### V2 Prototype (Workspace Paradigm)
**Core Metaphor:** Traditional workspace with tabs and sections

**Flow:**
```
Home (Agent Hub) → Choose Template → Name Agent → Workspace (Build/Test/Deploy/Monitor)
```

**Key Features:**
- Agent Hub with empty state, first agent success, multi-agent grid
- Tabbed workspace (Build, Test, Proving Ground, Deploy, Monitor)
- Build tab with 4 sections: Configuration, Sources, Skills, Visual Builder
- Testing panel (right sidebar)
- Wizard mode for first-time users
- Static prototype with localStorage persistence

**Strengths:**
- Comprehensive feature set (all tabs implemented)
- Clear information architecture
- Production-like UI
- Multiple agent management

**Weaknesses:**
- Too many steps before value
- Knowledge comes AFTER agent creation (backwards)
- No immediate feedback during setup
- Complex navigation for beginners

---

### V3 Prototype (Conversational Paradigm) ⭐ Current Project

**Core Metaphor:** AI-guided conversation with milestone tracking

**Flow:**
```
Starting Point → Conversational Builder (with Milestone Tracker) → Agent Ready
```

**Key Innovations:**
- Suggested goals based on CC transcripts (personalized)
- Chat-based building (AI asks questions, user responds)
- Milestone tracker (always visible progress)
- In-conversation actions (connect tools, validate inline)
- Two paths: "Step-by-step" (beginner) vs "Run whole plan" (pro)
- Test mode integrated into conversation

**Why Separate Repo:**
- Fundamentally different UX paradigm
- Parallel feedback opportunity for EPD
- Clean slate for Dialtone design system
- No legacy code conflicts

---

## Key Design Decisions from V2

### 1. Navigation Architecture
**V2 Decision:** Flat sidebar with all pages visible
- Before: Nested navigation with expandable sections
- After: Agent dropdown in header + flat sidebar list
- Why: Reduced cognitive load, faster navigation

**Lesson for V3:**
Keep navigation simple and visible. Don't hide important pages in nested menus.

---

### 2. Onboarding Philosophy
**V2 Evolution:**
- **V2.0**: Template-first (choose template → name agent)
- **V2.1**: Knowledge-first experiment (upload docs → test immediately)

**Key Insight:** Users want to see value FAST
- Time to first test: < 2 minutes (goal)
- Knowledge = Intelligence (mental model)
- Test before committing (confidence building)

**Lesson for V3:**
The conversational builder already solves this! Users see progress immediately through the milestone tracker and can test inline.

---

### 3. Empty States & Progressive Disclosure
**V2 Pattern:**
- Empty state with large CTA (not overwhelming)
- First agent success view (celebration moment)
- Progressive complexity (simple → advanced features)

**Lesson for V3:**
Use empty states to guide, not block. Celebrate milestones (Phase 1 complete, tools connected, etc.)

---

### 4. Multi-Agent Management
**V2 Learning:**
- Trial banner only shows when 2+ agents exist
- Activity feed provides context
- Agent cards show status clearly
- Search appears at 3+ agents

**Lesson for V3:**
Not applicable for V3 (single-agent focus), but remember for future iterations.

---

## What Worked Well in V2

### ✅ **Sources Section Redesign**
**Pattern:** Split into "Connected" and "Available" sections
- Connected sources grouped by type (Integrations, Documents, etc.)
- Available sources in accordion (easy to browse and add)
- Remove buttons inline

**Why it worked:**
- Clear visual hierarchy
- No redundant sections
- Easy to see what's already added vs what's available

**Apply to V3:**
When showing tool connections in conversational builder, use this same pattern of "current state" vs "available options"

---

### ✅ **Testing Panel Component**
**Pattern:** Reusable TestingPanel.vue component
- Channel tabs (Digital, Voice)
- Chat interface with typing indicators
- Suggested questions
- Mock AI responses

**Why it worked:**
- Consistent testing experience across views
- Easy to integrate anywhere
- Progressive empty states

**Apply to V3:**
Reuse this component for Phase 6 (Test mode) in conversational builder

---

### ✅ **Agent Auto-Configuration**
**Pattern:** Infer agent settings from knowledge
```javascript
function inferAgentName(knowledge) {
  // "Acme_pricing.pdf" → "Acme Assistant"
}

function detectPurpose(knowledge) {
  // Keyword matching → "support" | "sales" | "scheduling"
}
```

**Why it worked:**
- Reduces manual input
- Smart defaults
- Users can always edit later

**Apply to V3:**
In pro path, when user pastes document, auto-extract context summary for milestone tracker

---

### ✅ **COMPASS Validation**
**Pattern:** Collapsible validation panel with severity levels
- Error: blocks publishing
- Warning: suggests improvements
- Field-specific feedback

**Why it worked:**
- Non-blocking (collapsible)
- Contextual guidance
- Clear severity levels

**Apply to V3:**
Phase 4 (Validation) can use similar pattern for showing improvements

---

### ✅ **Proving Ground (Evaluate Tab)**
**Pattern:** Synthetic testing with personas
- Setup modal: channel + scenario count + personas
- Test runs history
- Results with failure analysis

**Why it worked:**
- Easy to configure
- Clear results visualization
- Persona variety (Frustrated, Impatient, Confused, etc.)

**Apply to V3:**
Not in V3 scope, but pattern could inspire how we show validation results

---

## Known Issues from V2

### ❌ Issue 1: Skill Mining Not Implemented
**What's missing:**
- No "Suggested Skills" widget in Monitor Dashboard
- No skill discovery from conversation patterns
- No auto-suggestions in Skills section

**Why it matters:**
- Key differentiator from competitors
- Helps users discover capabilities
- Reduces manual configuration

**Lesson for V3:**
Not in V3 scope (V3 is pre-deployment), but good to know for future

---

### ❌ Issue 2: Widget Preview Missing
**What's missing:**
- Configuration form exists, but no live preview
- No split-view showing actual widget appearance
- No responsive preview (desktop/mobile)

**Why it matters:**
- Visual feedback is critical
- Users can't see what customers will see
- Reduces confidence in customization

**Lesson for V3:**
Phase 2 (Connections) could show visual preview of connected tools (not critical for MVP)

---

### ❌ Issue 3: Visual Builder is Static
**What exists:**
- Canvas placeholder
- AI Builder panel
- Zoom controls

**What's missing:**
- No actual flow building
- No node connections
- No real logic

**Why it matters:**
- Pro users want visual control
- Drag-and-drop is powerful metaphor
- Workflow visualization helps debugging

**Lesson for V3:**
V3 focuses on conversational builder (simpler), Visual Builder is V2 feature

---

### ❌ Issue 4: Wizard Mode Confusing
**Problem:**
- Wizard shows in workspace after onboarding
- Unclear when to use wizard vs direct editing
- Some users skip wizard and get lost

**Root cause:**
- Mixing onboarding and workspace
- Not clear when onboarding "ends"

**Lesson for V3:**
Conversational builder IS the onboarding. No wizard needed in workspace after. Much cleaner mental model!

---

## Component Architecture Patterns

### Pattern 1: View + Sub-Components
**V2 Example:**
```
AgentsWorkspaceV2View.vue (1500+ lines)
├── TestingPanel.vue
├── ProvingGroundPanel.vue
├── AIAssistant.vue
└── TracesPanel.vue
```

**Lesson:**
Keep views focused. Extract complex sections into components early.

**V3 Application:**
```
ConversationalBuilderView.vue
├── ChatMessage.vue ✅ (already done)
├── MessageInput.vue ✅ (already done)
└── MilestoneTracker.vue ✅ (already done)
```

Good job! V3 already follows this pattern.

---

### Pattern 2: State Management (Pinia + localStorage)
**V2 Example:**
```javascript
// stores/activityFeed.js
export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [],
    recommendations: []
  }),

  actions: {
    addActivity(activity) {
      this.activities.unshift(activity)
      // Save to localStorage
      localStorage.setItem('daart-activities', JSON.stringify(this.activities))
    }
  }
})
```

**Lesson:**
Pinia for reactivity, localStorage for persistence. Simple and effective for prototypes.

**V3 Application:**
Already using this pattern! `conversation.js` and `agent.js` stores. Keep it up.

---

### Pattern 3: Progressive Complexity
**V2 Example:**
```vue
<!-- Show simple UI for draft agents -->
<div v-if="agent.status === 'draft'" class="getting-started-checklist">
  <!-- 6-step checklist -->
</div>

<!-- Show full metrics for live agents -->
<div v-else class="metrics-dashboard">
  <!-- Complex dashboard -->
</div>
```

**Lesson:**
Different UI for different states. Don't overwhelm beginners with advanced features.

**V3 Application:**
Two paths (beginner vs pro) already implement this! Pro path skips optional questions.

---

## Design System & Styling

### V2 Approach: Lo-Fi Custom CSS
**Constraints:**
- No emojis
- No icons (mostly)
- Black primary color
- Gray backgrounds (#fafafa)
- Generous spacing (24px, 32px, 48px)

**Why lo-fi:**
- Focus on UX validation, not visual polish
- Easier to handoff to design team
- No dependencies on design system availability

---

### V3 Approach: Dialtone Design System
**Key Difference:** Production-ready design tokens

**Implementation:**
```css
/* V2 (hardcoded) */
background: #fafafa;
padding: 24px;
border-radius: 8px;

/* V3 (Dialtone tokens) ✅ */
background: var(--dt-color-surface-secondary);
padding: var(--dt-space-550);
border-radius: var(--dt-size-radius-400);
```

**Benefits:**
- Theme support (light/dark mode)
- Consistent spacing and colors
- Automatic updates when design system changes
- Easier engineering handoff

**Status in V3:** ✅ Already implemented! Great job.

---

## Missing Features from V2

### Features Implemented in V2 (not in V3 scope)
1. **Multi-agent management** - V3 focuses on building one agent
2. **Monitor dashboard** - V3 ends at agent creation/testing
3. **Deploy tab** - V3 is pre-deployment
4. **Proving Ground** - V3 doesn't include evaluation
5. **Analytics** - V3 is onboarding-focused
6. **Billing** - V3 is pre-purchase

**This is OK!** V3 has different scope and goals.

---

### Features Partially in V2 (could inspire V3)
1. **Suggested questions** (TestingPanel) → V3 could add in test mode
2. **Intelligence meter** (knowledge-first plan) → V3 milestone tracker is similar
3. **Auto-configuration** (infer from knowledge) → V3 could infer from conversation
4. **Contextual tips** (AI Assistant) → V3 AI messages already do this

---

## User Flow Comparisons

### V2 Flow (Workspace Builder)
```
1. Home → Empty State
2. Click "Create Agent"
3. Choose Template (6 options)
4. Name Agent (modal)
5. Setup Animation
6. Workspace → Wizard Mode
   - Step 1: Configure
   - Step 2: Add Knowledge
   - Step 3: Test
7. Exit Wizard → Full Workspace
```

**Time to value:** ~5-10 minutes
**Clicks to first test:** 15-20 clicks

---

### V3 Flow (Conversational Builder)
```
1. Starting Point
2. Select Suggested Goal (or custom)
3. Conversational Builder
   - Choose Path (step-by-step or auto)
   - Answer Questions (or paste document)
   - Connect Tools (inline)
   - Validate (inline)
   - Test (inline)
4. Agent Ready!
```

**Time to value:** ~2-5 minutes
**Clicks to first test:** 5-10 clicks

**Winner:** V3 is significantly faster! 🎉

---

## Recommendations for V3 Development

### 1. Reuse V2 Components Where Possible
- ✅ **TestingPanel.vue** - Copy for Phase 6 (Test mode)
- ✅ **Mock data patterns** - Use similar structure for suggested goals
- ✅ **State management pattern** - Already doing this!

---

### 2. Learn from V2 Mistakes
- ❌ **Don't:** Make workspace too complex (V2 had 5 tabs)
- ✅ **Do:** Keep conversation flow simple and linear
- ❌ **Don't:** Mix onboarding and management (V2 wizard confusion)
- ✅ **Do:** Clear separation (V3 conversation ends → workspace begins)

---

### 3. Apply V2 Successes
- ✅ **Progressive disclosure** - Beginner vs pro paths
- ✅ **Celebration moments** - Phase complete messages
- ✅ **Empty states** - "Ready to test" vs "Add knowledge first"
- ✅ **Suggested content** - Healthcare goals already implemented

---

### 4. Design Patterns to Copy
```vue
<!-- Pattern: Split View (Sources section from V2) -->
<div class="split-layout">
  <div class="left-panel">
    <!-- Primary action area -->
  </div>
  <div class="right-panel">
    <!-- Preview or testing area -->
  </div>
</div>

<!-- Pattern: Progressive Empty States (TestingPanel from V2) -->
<div v-if="noKnowledge" class="empty-state">
  Add knowledge to start testing
</div>
<div v-else-if="hasLowKnowledge" class="partial-state">
  Try asking a question
</div>
<div v-else class="ready-state">
  <!-- Full interface -->
</div>

<!-- Pattern: Accordion for Available Options (Sources from V2) -->
<div class="available-section">
  <accordion-item v-for="category in categories">
    <!-- Options to add -->
  </accordion-item>
</div>
```

---

## Key Takeaways for V3

### What Makes V3 Better
1. **Conversational guidance** - AI asks questions (less overwhelming)
2. **Milestone tracking** - Always visible progress (no scrolling back)
3. **Inline actions** - Connect tools in conversation (no tab switching)
4. **Two paths** - Beginner vs pro (accommodates both user types)
5. **Faster time to value** - Test in 2-5 min vs 5-10 min

### What to Preserve from V2
1. **Progressive disclosure** - Show complexity gradually
2. **Celebration moments** - Mark achievements
3. **Smart defaults** - Auto-configure where possible
4. **Clear empty states** - Guide users when stuck
5. **Testing integration** - Let users validate early and often

### What to Avoid from V2
1. **Too many tabs** - Keep navigation simple
2. **Wizard confusion** - Clear onboarding vs workspace boundary
3. **Late testing** - Test early in V3 (Phase 6, not post-build)
4. **Complex forms** - Conversation is more natural
5. **Hidden features** - Milestone tracker makes progress visible

---

## Next Steps

### Immediate Actions
1. ✅ Review this document
2. ✅ Identify V2 components to reuse (TestingPanel!)
3. ✅ Copy proven patterns (split view, progressive empty states)
4. ✅ Continue V3 implementation with V2 lessons in mind

### Future References
- V2 Repo: `/Users/amitayre/code/daart-onboarding-prototype`
- V2 Documentation: `PROJECT_STATUS.md`, `COMPREHENSIVE_SUMMARY.md`
- V3 Plan: `V3_PLAN.md` (in V2 repo)
- Design Reference: `docs/For context.pdf` (in V2 repo)

---

**Document Status:** ✅ Complete
**Last Updated:** November 21, 2025
**Maintained By:** Amit Ayre
