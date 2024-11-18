import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Why from '../views/Why.vue'
import Pricing from '../views/Pricing.vue'
import Download from '../views/Download.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/why', name: 'Why', component: Why },
  { path: '/pricing', name: 'Pricing', component: Pricing },
  { path: '/download', name: 'Download', component: Download },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
