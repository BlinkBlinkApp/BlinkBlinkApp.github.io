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
          <a href="#download" class="button secondary download-button">
            Download Now ➤
          </a>
        </div>
        <div class="hero-right">
          <p class="hero-description">
            BlinkBlink keeps your vision healthy while you conquer the digital world.
          </p>
        </div>
      </div>
      <nav>
        <div class="nav-content">
          <a
            v-for="section in sections"
            :key="section"
            :href="`#${section}`"
            :class="{ active: currentSection === section }"
            @click.prevent="scrollToSection(section)"
          >
            {{ section === 'rule' ? '20·20·20' : section.charAt(0).toUpperCase() + section.slice(1) }}
          </a>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <Rule />
      <Features />
      <Download />
      <About />
    </main>
  </div>
</template>

<script setup lang="ts">
import '@/assets/styles/Home.css'
import { ref, onMounted } from 'vue'
import About from '@/components/sections/About.vue'
import Features from '@/components/sections/Features.vue'
import Rule from '@/components/sections/Rule.vue'
import Download from '@/components/sections/Download.vue'

const BASE_DURATION = 600 // 0.6s in ms
const CHAR_DELAY = 40 // 0.04s in ms
const words = ['strain', 'dryness', 'fatigue', 'discomfort', 'screen-time burnout']
const currentWord = ref(words[0])
const animate = ref(true)
let currentIndex = 0

const sections = ['home', 'rule', 'features', 'download', 'about']
const currentSection = ref('home')
const heroOpacity = ref(1)

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

  // Add scroll spy for navigation
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px',
    threshold: 0
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentSection.value = entry.target.id || 'home'
      }
    })
  }, observerOptions)

  // Observe header for home section
  const header = document.querySelector('header')
  if (header) observer.observe(header)

  // Observe other sections
  sections.slice(1).forEach(section => {
    const element = document.getElementById(section)
    if (element) observer.observe(element)
  })

  // Update scroll handler to use vh
  const handleScroll = () => {
    const scrollPosition = window.scrollY
    const viewportHeight = window.innerHeight
    const fadeStart = viewportHeight * 0.05
    const fadeEnd = viewportHeight * 0.8

    if (scrollPosition <= fadeStart) {
      heroOpacity.value = 1
    } else if (scrollPosition >= fadeEnd) {
      heroOpacity.value = 0
    } else {
      heroOpacity.value = 1 - ((scrollPosition - fadeStart) / (fadeEnd - fadeStart))
    }
  }

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll) // Add resize listener to update on viewport changes
})

const scrollToSection = (id: string) => {
  if (id === 'home') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
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
