<template>
  <div class="page-wrapper">
    <div class="floating-shapes" ref="shapesContainer"></div>

    <header id="home">
      <div class="header-brand">
        <img src="@/assets/icon.png" alt="BlinkBlink Logo" class="logo" loading="eager" />
        <h2 class="brand-name">BlinkBlink</h2>
      </div>

      <div class="hero-grid" :style="{ opacity: heroOpacity }">
        <div class="hero-background-image img-placeholder" ref="backgroundRef">
          <img src="@/assets/background.png" alt="" v-fade-in loading="lazy" />
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
const { t } = useI18n()

const BASE_DURATION = 600 // 0.6s in ms
const CHAR_DELAY = 40 // 0.04s in ms
const words = [
  t('hero.words.strain'),
  t('hero.words.dryness'),
  t('hero.words.fatigue'),
  t('hero.words.discomfort'),
  t('hero.words.burnout')
]
const currentWord = ref(words[0])
const animate = ref(true)
let currentIndex = 0

const sections = ['home', 'rule', 'features', 'download', 'about']
const currentSection = ref('home')
const heroOpacity = ref(1)
const shouldHideNav = ref(false)
const backgroundRef = ref<HTMLElement | null>(null)

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

  const handleScroll = () => {
    const { scrollY, innerHeight } = window
    const { scrollHeight } = document.documentElement

    // Update nav visibility
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      shouldHideNav.value = aboutSection.getBoundingClientRect().top - innerHeight < 0
    }

    // Update current section
    if (scrollY + innerHeight >= scrollHeight - 100) {
      currentSection.value = 'about'
    } else if (scrollY < innerHeight / 2) {
      currentSection.value = 'home'
    } else {
      // Find current section
      const viewportMiddle = scrollY + innerHeight / 2
      const bufferZone = innerHeight * 0.15

      for (const section of sections.slice(1, -1)) {
        const element = document.getElementById(section)
        if (!element) continue

        const { top, bottom } = element.getBoundingClientRect()
        const absoluteTop = top + scrollY
        const absoluteBottom = bottom + scrollY

        if (
          viewportMiddle >= absoluteTop - bufferZone &&
          viewportMiddle <= absoluteBottom + bufferZone
        ) {
          currentSection.value = section
          break
        }
      }
    }

    const fadeStart = innerHeight * 0.05
    const fadeEnd = innerHeight * 0.8
    heroOpacity.value = Math.max(0, Math.min(1, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart)))
    if (backgroundRef.value) {
      const parallaxRate = 0.4
      const yOffset = scrollY * parallaxRate
      backgroundRef.value.style.transform = `translate(-50%, calc(-50% + ${yOffset}px)) rotate(-45deg)`
    }

    scrollActiveNavItemIntoView()
  }

  // Initial setup and event listeners
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll)

  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
  })

  // Initialize shapes
  const shapesContainer = document.querySelector('.floating-shapes')
  if (shapesContainer) {
    for (let i = 0; i < SHAPE_COUNT; i++) {
      shapesContainer.appendChild(createShape())
    }
  }
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

// Shape generation config
const SHAPE_COUNT = 4
const COLORS = [
  'rgba(0, 194, 255, 0.8)', // subtle primary
  'rgba(109, 89, 255, 0.8)', // subtle secondary
  'rgba(255, 92, 168, 0.8)', // subtle accent
  'rgba(54, 179, 255, 0.8)', // subtle blue
]

// Shape generation function
const createShape = () => {
  const shape = document.createElement('div')
  shape.className = 'floating-shape'

  // Larger size for more gradual gradients
  const size = Math.random() * 300 + 300
  shape.style.width = `${size}px`
  shape.style.height = `${size}px`

  // Position more strategically
  const positions = [
    { left: '10%', top: '20%' },
    { left: '60%', top: '30%' },
    { left: '30%', top: '70%' },
  ]
  const pos = positions[Math.floor(Math.random() * positions.length)]
  shape.style.left = pos.left
  shape.style.top = pos.top

  // Random color
  shape.style.background = COLORS[Math.floor(Math.random() * COLORS.length)]

  // movement
  const moveX = Math.random() * 100 + 5 + 'vw'
  const moveY = Math.random() * 100 + 5 + 'vh'
  shape.style.setProperty('--move-x', moveX)
  shape.style.setProperty('--move-y', moveY)

  // Random duration and delay
  const duration = Math.random() * 15 + 45
  const delay = Math.random() * -20
  shape.style.setProperty('--duration', `${duration}s`)
  shape.style.setProperty('--delay', `${delay}s`)

  return shape
}
</script>
