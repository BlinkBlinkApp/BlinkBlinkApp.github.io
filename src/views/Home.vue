<template>
  <div class="page-wrapper">
    <header id="home">
      <div class="header-brand">
        <img
          src="@/assets/icon.webp"
          alt="BlinkBlink Logo"
          class="logo"
          fetchpriority="high"
          width="32"
          height="32"
        />
        <h2 class="brand-name">BlinkBlink</h2>
      </div>

      <div class="hero-grid" :style="{ opacity: heroOpacity }">
        <div class="hero-background-image img-placeholder" ref="backgroundRef">
          <img
            src="@/assets/background.webp"
            alt=""
            v-fade-in
            loading="lazy"
            width="800"
            height="600"
            decoding="async"
          />
        </div>
        <div class="hero-left">
          <h1 class="hero-title">
            {{ t('hero.title') }}
            <div class="rotating-text-wrapper">
              <span
                class="rotating-text"
                :class="{ 'animate-out': !animate }"
                :style="{
                  '--word-length': currentWord.length,
                  '--base-duration': '0.6s',
                  '--char-delay': '0.04s',
                }"
              >
                <span
                  v-for="(char, index) in currentWord
                    .split('')
                    .map((c) => (c === ' ' ? '\u00A0' : c))"
                  :key="`${currentWord}-${index}`"
                  class="char"
                  :style="{ '--char-index': index }"
                  >{{ char }}</span
                >
              </span>
            </div>
          </h1>
          <div class="hero-buttons">
            <a href="#download" class="button secondary download-button">
              {{ t('hero.downloadButton') }}
            </a>
            <a
              href="https://forms.gle/2mZisXYEzaCz7Ra5A"
              class="button text feedback-button"
              target="_blank"
              rel="noopener"
            >
              {{ t('hero.feedbackButton') }}
            </a>
          </div>
        </div>
        <div class="hero-right">
          <p class="hero-description">
            {{ t('hero.description_line1') }}
            <br />
            {{ t('hero.description_line2') }}
          </p>
        </div>
      </div>
      <nav>
        <div class="nav-wrapper">
          <div class="nav-content">
            <a
              v-for="section in sections"
              :key="section"
              :href="`#${section}`"
              :class="{ active: currentSection === section }"
              @click.prevent="scrollToSection(section)"
            >
              {{ formatSectionName(section) }}
            </a>
          </div>
          <button class="lang-switch-circle" @click="toggleLanguage">
            {{ currentLanguage === 'en' ? '中' : 'EN' }}
          </button>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <Rule />
      <Features />
      <Download />
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import '@/assets/styles/Home.css'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Features from '@/components/sections/Features.vue'
import Rule from '@/components/sections/Rule.vue'
import Download from '@/components/sections/Download.vue'
import Footer from '@/components/Footer.vue'
import { useI18n } from 'vue-i18n'

const CONFIG = {
  ANIMATION: {
    INTERVAL: 4000,
    DURATION: 600,
    DELAY: 50,
  },
} as const

// Core state
const { t, locale } = useI18n()
const currentLanguage = ref(locale.value)
const words = ['strain', 'dryness', 'fatigue', 'discomfort', 'burnout'].map((word) =>
  t(`hero.words.${word}`),
)
const currentWord = ref(words[0])
const animate = ref(true)
const currentSection = ref('home')
const heroOpacity = ref(1)

// Utility functions
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number = 50) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

const handleScroll = debounce(() => {
  const { scrollY } = window
  heroOpacity.value = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8))
}, CONFIG.ANIMATION.DELAY)

const rotateWords = () => {
  let index = 0
  return setInterval(() => {
    animate.value = false
    setTimeout(() => {
      index = (index + 1) % words.length
      currentWord.value = words[index]
      animate.value = true
    }, CONFIG.ANIMATION.DURATION)
  }, CONFIG.ANIMATION.INTERVAL)
}

const sections = ['home', 'rule', 'features', 'download', 'about']
const scrollToSection = (id: string) => {
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const element = document.getElementById(id)
  if (element) {
    requestAnimationFrame(() => {
      const navHeight = 80
      const offset = element.offsetTop - navHeight

      window.scrollTo({ top: offset })

      requestAnimationFrame(() => {
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        })
      })
    })

    setTimeout(scrollActiveNavItemIntoView, 800)
  }
}

// Language handling
const toggleLanguage = () => {
  const newLocale = locale.value === 'en' ? 'zh' : 'en'
  locale.value = newLocale
  currentLanguage.value = newLocale
  localStorage.setItem('user-locale', newLocale)

  const newWords = ['strain', 'dryness', 'fatigue', 'discomfort', 'burnout'].map((word) =>
    t(`hero.words.${word}`),
  )
  words.splice(0, words.length, ...newWords)
  currentWord.value = words[0]
}

// Setup and cleanup
onMounted(() => {
  const wordRotationInterval = rotateWords()
  const sectionObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) currentSection.value = entry.target.id
      }),
    { rootMargin: '-45% 0px -45% 0px' },
  )

  sections.forEach((section) => {
    const element = document.getElementById(section)
    if (element) sectionObserver.observe(element)
  })

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll)

  onUnmounted(() => {
    clearInterval(wordRotationInterval)
    sectionObserver.disconnect()
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
  })
})

const formatSectionName = (section: string) => {
  return t(`nav.${section}`)
}

const scrollActiveNavItemIntoView = () => {
  requestAnimationFrame(() => {
    const nav = document.querySelector('.nav-content')
    const activeItem = nav?.querySelector('a.active') as HTMLElement
    if (nav && activeItem) {
      const navRect = nav.getBoundingClientRect()
      const activeRect = activeItem.getBoundingClientRect()

      // Check if active item is not fully visible
      if (activeRect.left < navRect.left || activeRect.right > navRect.right) {
        nav.scrollTo({
          left: activeItem.offsetLeft - (nav.clientWidth - activeItem.clientWidth) / 2,
          behavior: 'smooth',
        })
      }
    }
  })
}

watch(currentSection, () => {
  scrollActiveNavItemIntoView()
})
</script>

<style scoped>
.nav-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 8px 20px 8px 24px;
  width: 100%;
}

.nav-content {
  flex: 1;
  overflow-x: auto;
  padding-right: 8px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav-content::-webkit-scrollbar {
  display: none;
}

.lang-switch-circle {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-background);
  border: 2px solid var(--color-text);
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  margin-right: 0;
}

.lang-switch-circle:hover {
  background: var(--color-text);
  color: var(--color-background);
  transform: scale(1.1);
}

.hero-buttons {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.button.text {
  background: transparent;
  padding: 8px 16px;
  color: var(--color-text);
  opacity: 0.8;
  white-space: nowrap;
}

.button.text:hover {
  opacity: 1;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .hero-buttons {
    gap: 12px;
    width: 100%;
  }

  .hero-buttons .button {
    width: 100%;
    text-align: center;
  }

  .button.text {
    padding: 12px 16px;
  }
}
</style>
