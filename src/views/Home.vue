<template>
  <div>
    <header>
      <div class="header-brand">
        <img src="@/assets/icon.png" alt="BlinkBlink Logo" class="logo" />
        <h2 class="brand-name">BlinkBlink</h2>
      </div>

      <div class="hero-grid">
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
            Download Now
            <ArrowIcon class="download-arrow" />
          </a>
        </div>
        <div class="hero-right">
          <p class="hero-description">
            BlinkBlink keeps your vision healthy while you conquer the digital world.
          </p>
        </div>
      </div>
      <nav data-nav-state="bottom">
        <div class="nav-content">
          <a href="#why" @click.prevent="scrollToSection('why')">Why BlinkBlink</a>
          <a href="#rule" @click.prevent="scrollToSection('rule')">20·20·20</a>
          <a href="#download" @click.prevent="scrollToSection('download')">Download</a>
          <a href="#about" @click.prevent="scrollToSection('about')">About</a>
        </div>
      </nav>
    </header>

    <Why />
    <Rule />
    <Download />
    <About />
  </div>
</template>

<script setup lang="ts">
import '@/assets/styles/Home.css'
import { ref, onMounted } from 'vue'
import About from '@/components/sections/About.vue'
import Why from '@/components/sections/Why.vue'
import Rule from '@/components/sections/Rule.vue'
import Download from '@/components/sections/Download.vue'
import ArrowIcon from '@/components/icons/Arrow.vue'

const BASE_DURATION = 600 // 0.6s in ms
const CHAR_DELAY = 40 // 0.04s in ms
const words = ['strain', 'dryness', 'fatigue', 'discomfort', 'screen-time burnout']
const currentWord = ref(words[0])
const animate = ref(true)
let currentIndex = 0

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

  // Add scroll handler for nav
  const nav = document.querySelector('nav')
  let lastScroll = 0

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY
    const headerHeight = document.querySelector('header')?.offsetHeight || 0

    if (currentScroll > headerHeight - 100) {
      nav?.setAttribute('data-nav-state', 'top')
    } else {
      nav?.setAttribute('data-nav-state', 'bottom')
    }

    lastScroll = currentScroll
  })
})

const scrollToSection = (id: string) => {
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
