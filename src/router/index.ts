import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
import Home from '../views/Home.vue'
import { scrollToSection } from '@/utils/scrollToSection'

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
    const isFirstNavigation = from === START_LOCATION

    // The hash wins on the first navigation, before savedPosition is even
    // considered. Refreshing /#download hands this a savedPosition recorded
    // against the previous page height — the images above the section have not
    // loaded yet, so restoring that pixel puts you in #features. Someone who
    // reloads a URL ending in #download is asking for #download, whatever
    // number the last visit left behind.
    if (isFirstNavigation && to.hash) {
      scrollToSection(to.hash.slice(1))
      return false
    }

    // Back and forward within a visit: honour where they were.
    if (savedPosition) {
      return savedPosition
    }

    // A hash change during a visit is the nav being clicked, and
    // `handleNavClick` has already scrolled.
    if (from.path === to.path && to.hash !== from.hash) {
      return false
    }

    if (to.hash) {
      scrollToSection(to.hash.slice(1))
      return false
    }

    return { top: 0, behavior: window.innerWidth <= 768 ? 'auto' : 'smooth' }
  },
})

export default router
