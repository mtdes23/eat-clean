import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { tab: 'menu', title: 'Eat Clean Menu' },
    component: () => import('../views/WeeklyMenu.vue')
  },
  {
    path: '/meals',
    name: 'meals',
    meta: { tab: 'meals', title: 'Tất cả Món ăn' },
    component: () => import('../views/AllMeals.vue')
  },
  {
    path: '/about',
    name: 'about',
    meta: { tab: 'about', title: 'Giới thiệu' },
    component: () => import('../views/About.vue')
  },
  {
    path: '/recipe/:id',
    name: 'recipe',
    meta: { tab: null, title: 'Công thức' },
    component: () => import('../views/RecipeDetail.vue'),
    props: true
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
