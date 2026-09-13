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
            <br />
            <div class="rotating-text-wrapper">
              <span
                class="rotating-text"
                :class="{ 'animate-out': !animate }"
                :style="{
                  '--word-length': currentWord.length,
                  '--base-duration': baseDuration + 's',
                  '--char-delay': charDelay + 's',
                  '--total-duration': calculateTotalDuration(currentWord.length) + 's',
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
            <a
              href="#download"
              class="button secondary download-button"
              @click="handleNavClick($event, 'download')"
            >
              {{ t('hero.downloadButton') }}
            </a>
            <a
              href="https://blinkblink.canny.io/"
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
    INTERVAL: 4000, // Total time each word is displayed
    BASE_DURATION: 0.6, // Base animation duration per character
    CHAR_DELAY: 0.04, // Delay between each character animation
    MIN_WORD_TIME: 2000, // Minimum time a word stays visible before animating out
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
const baseDuration = ref(CONFIG.ANIMATION.BASE_DURATION)
const charDelay = ref(CONFIG.ANIMATION.CHAR_DELAY)

// Add router instance
const router = useRouter()
const route = useRoute()
const sections = ['home', 'rule', 'features', 'download', 'about']
const { activeSection } = useSectionObserver(sections)
const { scrollActiveNavItemIntoView } = useNavScroll(activeSection)

// Calculate the total duration needed for a word animation
const calculateTotalDuration = (wordLength: number) => {
  return baseDuration.value + (wordLength - 1) * charDelay.value
}

// Calculate how long to wait before switching to the next word
const getAnimationTimeout = (wordLength: number) => {
  // Calculate the total animation time needed
  const animationTime = calculateTotalDuration(wordLength)

  // Make sure the minimum visible time is respected
  return Math.max(CONFIG.ANIMATION.INTERVAL - CONFIG.ANIMATION.MIN_WORD_TIME, animationTime * 1000)
}

const rotateWords = () => {
  let index = 0

  const scheduleNextWord = () => {
    // Schedule fade out
    setTimeout(() => {
      animate.value = false

      // Schedule the new word after the exit animation completes
      setTimeout(
        () => {
          index = (index + 1) % words.length
          currentWord.value = words[index]
          animate.value = true

          // Schedule the next rotation based on current word length
          scheduleNextWord()
        },
        calculateTotalDuration(currentWord.value.length) * 1000,
      )
    }, CONFIG.ANIMATION.MIN_WORD_TIME)
  }

  // Start the first rotation
  scheduleNextWord()
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

  // Adjust animation for the first word after language change
  animate.value = true
}

// Setup and cleanup
onMounted(() => {
  rotateWords()
  scrollActiveNavItemIntoView()
})

const formatSectionName = (section: string) => {
  return t(`nav.${section}`)
}

/** How close to the intended position counts as arrived. */
const SCROLL_TOLERANCE = 4
/** How long to keep correcting before assuming the page has settled. */
const SETTLE_MS = 1200

/**
 * Scrolls to a section and stays on it while the page settles.
 *
 * A smooth scroll travels to the pixel the browser computed when it started.
 * Anything that changes the height of the page in flight — an image finishing,
 * a section growing as it is passed — leaves that pixel pointing above the
 * section, which is why clicking Download within a second or two of arriving
 * landed short of it.
 *
 * So the target is re-read from the live element rather than captured up front,
 * and for a moment afterwards it is checked and corrected. The corrections are
 * instant rather than smooth: by then they are a few pixels, and a second
 * animation would read as drift. Any scroll of the user's own cancels the
 * whole thing — once they have taken over, moving the page under them would be
 * the worse bug.
 */
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (!element) return

  const behavior = window.innerWidth <= 768 ? 'auto' : 'smooth'
  element.scrollIntoView({ behavior, block: 'start' })

  const deadline = Date.now() + SETTLE_MS
  let cancelled = false
  const cancel = () => {
    cancelled = true
  }

  // Only a deliberate input counts as taking over; the smooth scroll itself
  // fires plenty of scroll events.
  window.addEventListener('wheel', cancel, { passive: true, once: true })
  window.addEventListener('touchstart', cancel, { passive: true, once: true })
  window.addEventListener('keydown', cancel, { once: true })

  const correct = () => {
    if (cancelled) return
    if (Math.abs(element.getBoundingClientRect().top) > SCROLL_TOLERANCE) {
      element.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
  }

  const settle = () => {
    if (cancelled) return
    correct()
    if (Date.now() < deadline) setTimeout(settle, 120)
    else {
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('keydown', cancel)
    }
  }
  setTimeout(settle, 140)

  // A slow image can land after the window above has closed. `load` is the one
  // moment the page is known to be done moving, so take it as a last aim
  // rather than lengthening the polling and holding the page hostage for it.
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => setTimeout(correct, 60), { once: true })
  }
}

const handleNavClick = (event: Event, section: string) => {
  event.preventDefault()
  scrollToSection(section)

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

.hero-title {
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.rotating-text-wrapper {
  display: inline-block;
  min-height: 1.5em;
  position: relative;
  overflow-x: hidden;
  min-width: 5ch;
  margin-top: 0.1em;
}

.rotating-text {
  display: inline-flex;
  position: relative;
  line-height: 1.2;
}

.char {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: char-appear var(--base-duration) forwards;
  animation-delay: calc(var(--char-index) * var(--char-delay));
}

.animate-out .char {
  opacity: 1;
  transform: translateY(0);
  animation: char-disappear var(--base-duration) forwards;
  animation-delay: calc(var(--char-index) * var(--char-delay));
}

@keyframes char-appear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes char-disappear {
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

@media (max-width: 640px) {
  .rotating-text-wrapper {
    display: block;
    width: 100%;
    min-height: 2em;
  }
}
</style>
