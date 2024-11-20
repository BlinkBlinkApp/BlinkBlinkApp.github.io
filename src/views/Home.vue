<template>
  <div>
    <header>
      <div class="header-brand">
        <img
          src="@/assets/monster_1.png"
          alt="BlinkBlink Logo"
          width="60"
          height="60"
          class="logo"
        />
        <h2 class="brand-name">BlinkBlink</h2>
      </div>

      <div class="hero-grid">
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
          <a href="#download" class="download-button">
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
    </header>

    <nav>
      <a href="#why">Why BlinkBlink</a>
      <a href="#rule">20·20·20</a>
      <a href="#download">Download</a>
      <a href="#about">About</a>
    </nav>

    <Why />
    <Rule />
    <Download />
    <About />
  </div>
</template>

<script setup lang="ts">
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
})
</script>
