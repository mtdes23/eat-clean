import { createRouter, createWebHistory } from 'vue-router'
import WeeklyMenu from '../components/WeeklyMenu.vue'
import RecipeDetail from '../views/RecipeDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WeeklyMenu
    },
    {
      path: '/recipe/:id',
      name: 'recipe',
      component: RecipeDetail,
      props: true
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
