import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    // Don't scroll if only the hash changed
    if (from.path === to.path && to.hash !== from.hash) {
      return false
    }

    const behavior = window.innerWidth <= 768 ? 'auto' : 'smooth'

    if (to.hash) {
      return {
        el: to.hash,
        behavior,
        top: 100,
      }
    }

    return { top: 0, behavior }
  },
})

export default router
