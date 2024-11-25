import './assets/styles/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)
app.use(i18n)

app.directive('fade-in', {
  mounted(el) {
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
  },
})

app.use(router).mount('#app')
