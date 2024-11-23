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
          <a href="#download" class="button secondary download-button">
            {{ t('hero.downloadButton') }}
          </a>
        </div>
        <div class="hero-right">
          <p class="hero-description">
            {{ t('hero.description_line1') }}
            <br />
            {{ t('hero.description_line2') }}
          </p>
        </div>
      </div>
      <nav :class="{ 'nav-hide': shouldHideNav }">
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
import { ref, onMounted, onUnmounted } from 'vue'
import Features from '@/components/sections/Features.vue'
import Rule from '@/components/sections/Rule.vue'
import Download from '@/components/sections/Download.vue'
import Footer from '@/components/Footer.vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const currentLanguage = ref(locale.value)

const toggleLanguage = () => {
  const newLocale = locale.value === 'en' ? 'zh' : 'en'
  locale.value = newLocale
  currentLanguage.value = newLocale
  localStorage.setItem('user-locale', newLocale)
  // Update rotating words after language change
  words.splice(
    0,
    words.length,
    t('hero.words.strain'),
    t('hero.words.dryness'),
    t('hero.words.fatigue'),
    t('hero.words.discomfort'),
    t('hero.words.burnout'),
  )
  currentWord.value = words[currentIndex]
}

const BASE_DURATION = 600 // 0.6s in ms
const CHAR_DELAY = 40 // 0.04s in ms
const words = [
  t('hero.words.strain'),
  t('hero.words.dryness'),
  t('hero.words.fatigue'),
  t('hero.words.discomfort'),
  t('hero.words.burnout'),
]
const currentWord = ref(words[0])
const animate = ref(true)
let currentIndex = 0

const sections = ['home', 'rule', 'features', 'download', 'about']
const currentSection = ref('home')
const heroOpacity = ref(1)
const shouldHideNav = ref(false)
const backgroundRef = ref<HTMLElement | null>(null)
let lastScrollY = 0 // Add this line to declare lastScrollY

// Helper function to format section names
const formatSectionName = (section: string) => {
  return t(`nav.${section}`)
}

const scrollActiveNavItemIntoView = () => {
  requestAnimationFrame(() => {
    const nav = document.querySelector('nav')
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

// Debounce scroll handler
const debounce = (fn: Function, ms = 16) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

let ticking = false
const handleScroll = () => {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(() => {
      const { scrollY } = window

      // Calculate nav visibility less frequently
      if (Math.abs(lastScrollY - scrollY) > 100) {
        const aboutSection = document.getElementById('about')
        if (aboutSection) {
          shouldHideNav.value = aboutSection.getBoundingClientRect().top - window.innerHeight < 0
        }
        lastScrollY = scrollY
      }

      // Use transforms for better performance
      heroOpacity.value = Math.max(0, Math.min(1, 1 - scrollY / (window.innerHeight * 0.75)))

      // Use transform3d for GPU acceleration
      if (backgroundRef.value) {
        backgroundRef.value.style.transform = `translate3d(-50%, calc(-50% + ${scrollY * 0.4}px), 0) rotate(-45deg)`
      }

      ticking = false
    })
  }
}

// Add ResizeObserver for more efficient resize handling
const resizeObserver = new ResizeObserver(
  debounce(() => {
    handleScroll()
  }, 150),
)

onMounted(() => {
  setInterval(() => {
    animate.value = false
    const totalDuration = BASE_DURATION + currentWord.value.length * CHAR_DELAY

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length
      currentWord.value = words[currentIndex]
      animate.value = true
    }, totalDuration)
  }, 4000)

  // Remove preloading code that used onImageLoad

  // Throttle scroll handler using requestAnimationFrame
  handleScroll()

  // Use Intersection Observer for section detection
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          currentSection.value = entry.target.id
        }
      })
    },
    {
      rootMargin: '-45% 0px -45% 0px',
    },
  )

  sections.forEach((section) => {
    const element = document.getElementById(section)
    if (element) sectionObserver.observe(element)
  })

  // Initial setup and event listeners
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Use ResizeObserver instead of resize event
  if (backgroundRef.value) {
    resizeObserver.observe(backgroundRef.value)
  }

  window.addEventListener('resize', handleScroll)

  // Cleanup
  onUnmounted(() => {
    sectionObserver.disconnect()
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
    resizeObserver.disconnect()
  })
})

const scrollToSection = (id: string) => {
  if (id === 'home') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    return
  }

  const element = document.getElementById(id)

  if (element) {
    const offset = 80 // Offset for fixed header
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }

  scrollActiveNavItemIntoView()
}
</script>

<style scoped>
.nav-wrapper {
  display: flex;
  align-items: center;
  gap: 8px; /* Reduced from 16px */
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 12px 0 24px; /* Adjusted padding: left 24px, right 12px */
  width: 100%;
}

.nav-content {
  flex: 1;
  overflow-x: auto;
  padding-right: 8px; /* Added padding to separate from language switch */
}

.lang-switch-circle {
  position: relative; /* Changed from fixed */
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
  flex-shrink: 0; /* Prevent shrinking */
  margin-right: -4px; /* Added negative margin to move slightly closer to edge */
}

.lang-switch {
  background: transparent;
  border: 1px solid var(--color-text);
  color: var(--color-text);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 16px;
  transition: all 0.2s ease;
}

.lang-switch:hover {
  background: var(--color-text);
  color: var(--color-background);
}

.lang-switch-circle:hover {
  background: var(--color-text);
  color: var(--color-background);
  transform: scale(1.1);
}
</style>
