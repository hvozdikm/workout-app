import { createRouter, createWebHistory } from '@ionic/vue-router'

import AppTabs from '../pages/AppTabs.vue'
import TodayPage from '../../features/workout-plan/pages/TodayPage.vue'
import PlanBuilderPage from '../../features/workout-plan/pages/PlanBuilderPage.vue'
import PlanSummaryPage from '../../features/workout-plan/pages/PlanSummaryPage.vue'
import WorkoutSessionPage from '../../features/workout-session/pages/WorkoutSessionPage.vue'
import SettingsPage from '../../features/settings/pages/SettingsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/tabs/today',
    },
    {
      path: '/tabs/',
      component: AppTabs,
      children: [
        {
          path: '',
          redirect: '/tabs/today',
        },
        {
          path: 'today',
          component: TodayPage,
        },
        {
          path: 'planner',
          component: PlanBuilderPage,
        },
        {
          path: 'summary',
          component: PlanSummaryPage,
        },
        {
          path: 'session',
          component: WorkoutSessionPage,
        },
        {
          path: 'settings',
          component: SettingsPage,
        },
      ],
    },
  ],
})

export default router
