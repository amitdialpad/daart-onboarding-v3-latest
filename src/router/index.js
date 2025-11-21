import { createRouter, createWebHistory } from 'vue-router'
import { useAgentStore } from '../stores/agent'
import AppLayout from '../layouts/AppLayout.vue'

const routes = [
  {
    path: '/',
    name: 'StartingPoint',
    component: () => import('../views/StartingPointView.vue'),
    meta: { title: 'Build an AI Agent', hideLayout: true }
  },
  {
    path: '/builder',
    name: 'ConversationalBuilder',
    component: () => import('../views/ConversationalBuilderView.vue'),
    meta: { title: 'Build Your Agent', useLayout: true }
  },
  {
    path: '/agent/:id/overview',
    name: 'AgentOverview',
    component: () => import('../views/AgentOverviewView.vue'),
    meta: { title: 'Agent Overview', useLayout: true }
  },
  {
    path: '/test-mode',
    name: 'TestMode',
    component: () => import('../views/TestModeView.vue'),
    meta: { title: 'Test Your Agent', useLayout: true }
  },
  {
    path: '/deploy',
    name: 'Deploy',
    component: () => import('../views/DeployView.vue'),
    meta: { title: 'Deploy Agent', useLayout: true }
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: () => import('../views/MonitorView.vue'),
    meta: { title: 'Performance Monitor', useLayout: true }
  },
  {
    path: '/agent-studio',
    name: 'AgentStudio',
    component: () => import('../views/AgentStudioView.vue'),
    meta: { title: 'Agent Studio', useLayout: true }
  },
  {
    path: '/workflow-builder',
    redirect: '/agent-studio'
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: () => import('../views/KnowledgeView.vue'),
    meta: { title: 'Knowledge', useLayout: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'DAART V3'
  next()
})

export default router
