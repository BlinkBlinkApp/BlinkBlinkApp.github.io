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
          <div class="lang-picker" ref="langPicker">
            <!--
              The nav is pinned to the bottom of the window, so the list opens
              upward. Two languages do not need a drawer; the point is that a
              tenth one costs a JSON file and a line in locales.ts.
            -->
            <!--
              Teleported out of the nav. Inside it the list occupied its box but
              painted nothing: the nav carries a backdrop-filter, a 3D transform
              and a fixed position, and a popover that has to escape all three is
              not worth fighting for. Anchored to the button instead.
            -->
            <Teleport to="body">
              <transition name="lang-drawer">
                <ul
                  v-if="langOpen"
                  ref="langDrawer"
                  class="lang-drawer"
                  role="listbox"
                  :aria-label="t('nav.language')"
                  :style="langDrawerStyle"
                >
                  <li v-for="language in LANGUAGES" :key="language.code">
                    <button
                      type="button"
                      role="option"
                      :aria-selected="language.code === locale"
                      :class="{ current: language.code === locale }"
                      @click="pickLanguage(language.code)"
                    >
                      {{ language.name }}
                    </button>
                  </li>
                </ul>
              </transition>
            </Teleport>
            <button
              class="lang-switch-circle"
              type="button"
              :aria-label="t('nav.language')"
              aria-haspopup="listbox"
              :aria-expanded="langOpen"
              @click="langOpen ? (langOpen = false) : openLanguages()"
            >
              {{ currentShort }}
            </button>
          </div>
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
import { scrollToSection } from '@/utils/scrollToSection'
import { LANGUAGES, rememberLocale } from '@/i18n/locales'

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
const langOpen = ref(false)
const langPicker = ref<HTMLElement | null>(null)
const langDrawer = ref<HTMLElement | null>(null)
const langDrawerStyle = ref<Record<string, string>>({})

/** Pins the teleported list above the button it belongs to. */
const openLanguages = () => {
  const button = langPicker.value?.querySelector('.lang-switch-circle')
  if (button) {
    const box = button.getBoundingClientRect()
    langDrawerStyle.value = {
      right: `${Math.round(window.innerWidth - box.right)}px`,
      bottom: `${Math.round(window.innerHeight - box.top + 10)}px`,
    }
  }
  langOpen.value = true
}

const currentShort = computed(
  () => LANGUAGES.find((language) => language.code === locale.value)?.short ?? locale.value.toUpperCase()
)

const pickLanguage = (code: string) => {
  locale.value = code
  currentLanguage.value = code
  rememberLocale(code)
  langOpen.value = false

  // The rotating headline keeps its own copy of the words, so it has to be
  // re-read rather than left in the language that was showing.
  const newWords = ['strain', 'dryness', 'fatigue', 'discomfort', 'burnout'].map((word) => t(`hero.words.${word}`))
  words.splice(0, words.length, ...newWords)
  currentWord.value = words[0]
  animate.value = true
}

/** Anywhere outside the picker, or Escape, closes it. */
const handleLangDismiss = (event: Event) => {
  if (!langOpen.value) return
  if (event.type === 'keydown' && (event as KeyboardEvent).key !== 'Escape') return
  if (event.type === 'pointerdown') {
    const target = event.target as Node
    if (langPicker.value?.contains(target) || langDrawer.value?.contains(target)) return
  }
  langOpen.value = false
}

// Setup and cleanup
onMounted(() => {
  rotateWords()
  scrollActiveNavItemIntoView()
  // pointerdown rather than click: a press that starts outside should close the
  // drawer even if the pointer is released somewhere else.
  document.addEventListener('pointerdown', handleLangDismiss)
  document.addEventListener('keydown', handleLangDismiss)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleLangDismiss)
  document.removeEventListener('keydown', handleLangDismiss)
})

const formatSectionName = (section: string) => {
  return t(`nav.${section}`)
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

/*
 * The picker wraps the button so the drawer can be positioned against it. The
 * nav sits at the bottom of the window, so it opens upward.
 */
.lang-picker {
  position: relative;
  flex-shrink: 0;
}

.lang-drawer {
  position: fixed;
  z-index: 1200;
  margin: 0;
  padding: 0.3rem;
  list-style: none;
  min-width: 8.5rem;
  /*
   * Opaque, unlike the nav's frosted pill. The nav always has page content
   * behind it to frost; this opens over the hero's flat background, where a
   * 70% white surface is invisible. A popover has to read as lifted off the
   * page, which is a solid surface, a real edge and a shadow.
   */
  background: var(--background-light);
  border: 1px solid rgba(var(--text-secondary-rgb), 0.22);
  border-radius: 14px;
  box-shadow:
    0 10px 28px rgba(var(--text-secondary-rgb), 0.22),
    0 2px 6px rgba(var(--text-secondary-rgb), 0.12);
  display: grid;
  gap: 0.15rem;
}

.lang-drawer button {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 10px;
  background: none;
  color: var(--text-primary);
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.lang-drawer button:hover {
  background: rgba(var(--primary-rgb), 0.1);
}

/* The language in use is stated, not just highlighted on hover. */
.lang-drawer button.current {
  background: rgba(var(--primary-rgb), 0.14);
  font-weight: var(--font-weight-semibold);
}

.lang-drawer button:focus-visible,
.lang-switch-circle:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Opening answers a click, so it moves; closing gets out of the way faster. */
.lang-drawer-enter-active {
  transition:
    opacity 0.16s ease-out,
    transform 0.16s ease-out;
}

.lang-drawer-leave-active {
  transition:
    opacity 0.1s ease-in,
    transform 0.1s ease-in;
}

.lang-drawer-enter-from,
.lang-drawer-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .lang-drawer-enter-active,
  .lang-drawer-leave-active {
    transition: none;
  }
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
