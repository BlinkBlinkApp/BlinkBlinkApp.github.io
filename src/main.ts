import './assets/styles/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.directive('fade-in', {
  mounted(el) {
    el.classList.add('img-lazy')

    const loadImage = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add('img-loaded')
        })
      })
      el.removeEventListener('load', loadImage)
    }

    if (el.complete) {
      loadImage()
    } else {
      el.addEventListener('load', loadImage)
    }
  }
})

app.use(router).mount('#app')
