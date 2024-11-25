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
                  :data-word-end="char === '\u00A0'"
                  >{{ char }}</span
                >
              </span>
            </div>
          </h1>
          <div class="hero-buttons">
            <a
              href="#download"
              class="button secondary download-button"
              @click="handleNavClick($event, 'download')"
            >
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
              :class="{ active: activeSection === section }"
              @click="handleNavClick($event, section)"
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Features from '@/components/sections/Features.vue'
import Rule from '@/components/sections/Rule.vue'
import Download from '@/components/sections/Download.vue'
import Footer from '@/components/Footer.vue'
import { useI18n } from 'vue-i18n'
import { useSectionObserver } from '@/composables/useSectionObserver'
import { useNavScroll } from '@/composables/useNavScroll'

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
const heroOpacity = ref(1)

// Add router instance
const router = useRouter()
const route = useRoute()
const sections = ['home', 'rule', 'features', 'download', 'about']
const { activeSection } = useSectionObserver(sections)
const { scrollActiveNavItemIntoView } = useNavScroll(activeSection)

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

  onUnmounted(() => {
    clearInterval(wordRotationInterval)
  })

  scrollActiveNavItemIntoView()
})

const formatSectionName = (section: string) => {
  return t(`nav.${section}`)
}

// Simplify handleNavClick to only use hash
const handleNavClick = (event: Event, section: string) => {
  event.preventDefault()

  // Directly scroll to element
  const element = document.getElementById(section)
  if (element) {
    const behavior = window.innerWidth <= 768 ? 'auto' : 'smooth'
    const offset = 100 // Same as router's scroll behavior
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset

    window.scrollTo({ top: y, behavior })
  }

  // Update URL without triggering router scroll behavior
  router.replace({ hash: section === 'home' ? '' : `#${section}` })
  scrollActiveNavItemIntoView()
}
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
