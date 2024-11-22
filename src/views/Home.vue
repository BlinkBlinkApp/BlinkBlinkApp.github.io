<template>
  <div class="page-wrapper">
    <header id="home">
      <div class="header-brand">
        <img src="@/assets/icon.png" alt="BlinkBlink Logo" class="logo" />
        <h2 class="brand-name">BlinkBlink</h2>
      </div>

      <div class="hero-grid" :style="{ opacity: heroOpacity }">
        <div class="hero-background-image">
          <img src="@/assets/background.png" alt="" />
        </div>
        <div class="hero-left">
          <h1 class="hero-title">
            Protect your eyes from
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
          <a href="#download" class="button secondary download-button"> Download Now for Free ➤ </a>
        </div>
        <div class="hero-right">
          <p class="hero-description">
            BlinkBlink keeps your vision healthy while you conquer the digital world.
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

const BASE_DURATION = 600 // 0.6s in ms
const CHAR_DELAY = 40 // 0.04s in ms
const words = ['strain', 'dryness', 'fatigue', 'discomfort', 'screen-time burnout']
const currentWord = ref(words[0])
const animate = ref(true)
let currentIndex = 0

const sections = ['home', 'rule', 'features', 'download', 'about']
const currentSection = ref('home')
const heroOpacity = ref(1)
const shouldHideNav = ref(false)

// Helper function to format section names
const formatSectionName = (section: string) => {
  return section === 'rule' ? '20·20·20' : section.charAt(0).toUpperCase() + section.slice(1)
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

    // Update hero opacity
    const fadeStart = innerHeight * 0.05
    const fadeEnd = innerHeight * 0.8
    heroOpacity.value = Math.max(0, Math.min(1, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart)))
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
}
</script>
