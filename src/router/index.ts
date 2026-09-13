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
    if (savedPosition) {
      return savedPosition
    }

    // A hash change during a visit is the nav being clicked, and `handleNavClick`
    // has already scrolled. The first navigation of a visit looks identical to
    // that test — same path, a hash that was not there before — so it used to be
    // swallowed here, which is why opening or refreshing `/#download` was left
    // to the browser's own jump to the fragment and landed above the section.
    const isFirstNavigation = from === START_LOCATION
    if (!isFirstNavigation && from.path === to.path && to.hash !== from.hash) {
      return false
    }

    // Arriving with a hash — someone opening or refreshing `/#download` — is
    // the worst case for scrolling to a fixed position: the images above the
    // section have not loaded, so the section is not yet where the router would
    // be scrolling to, and the page came to rest above it. `scrollToSection`
    // re-aims until the page stops moving. Returning false keeps the router
    // from scrolling as well and fighting it.
    if (to.hash) {
      scrollToSection(to.hash.slice(1))
      return false
    }

    return { top: 0, behavior: window.innerWidth <= 768 ? 'auto' : 'smooth' }
  },
})

export default router
