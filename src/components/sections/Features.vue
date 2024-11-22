<template>
  <section id="features" class="features-section">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="pattern-overlay"></div>

    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <span class="overline">Features</span>
          <h3>Protect Your Digital Vision</h3>
          <p>
            More screen time doesn't have to mean strained eyes. BlinkBlink helps you stay focused,
            refreshed, and in control of your screen habits.
          </p>
          <div class="highlights">
            <div class="highlight-item">
              <span class="highlight-number">20-20-20</span>
              <span class="highlight-label">Eye Care Rule</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-number">100%</span>
              <span class="highlight-label">Customizable</span>
            </div>
          </div>
        </div>
      </div>

      <div class="features-showcase">
        <div class="feature-showcase-item featured">
          <div class="screenshot-wrapper transition-container">
            <div
              v-for="(image, index) in featuredImages"
              :key="image.src"
              class="featured-screenshot"
              :style="{ opacity: getImageOpacity(index) }"
            >
              <img :src="image.src" :alt="image.alt" />
            </div>
          </div>
          <div class="description">
            <h4>Smart Break Experience</h4>
            <p>
              From gentle break reminders to insightful summaries, BlinkBlink guides you through a
              complete eye care routine.
            </p>
          </div>
        </div>

        <div class="feature-showcase-item">
          <div class="description order-even-2">
            <h4>Customizable Schedules</h4>
            <p>
              Tailor breaks to your needs. Set intervals and durations that align with your
              workflow.
            </p>
          </div>
          <div class="screenshot order-even-1">
            <img src="@/assets/screenshots/schedule_setting.png" alt="Customizable settings" />
          </div>
        </div>
        <div class="feature-showcase-item">
          <div class="screenshot order-odd-1">
            <img src="@/assets/screenshots/stats_dark.png" alt="Analytics dashboard" />
          </div>
          <div class="description order-odd-2">
            <h4>Insightful Analytics</h4>
            <p>
              Understand your screen habits with clear visuals. Stay on top of your digital
              wellness.
            </p>
          </div>
        </div>
        <div class="feature-showcase-item">
          <div class="description order-even-2">
            <h4>Seamless Theme Integration</h4>
            <p>
              Automatically adapts to your system's light or dark mode for a consistent and
              comfortable visual experience.
            </p>
          </div>
          <div class="screenshot order-even-1">
            <img src="@/assets/screenshots/light_dark_show.png" alt="Analytics dashboard" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import '@/assets/styles/Features.css'
import workDemo from '@/assets/screenshots/work_demo.png'
import breakOverlay from '@/assets/screenshots/break_overlay.png'
import summaryOverlay from '@/assets/screenshots/summary_overlay.png'

interface FeaturedImage {
  src: string
  alt: string
}

const featuredImages: FeaturedImage[] = [
  { src: workDemo, alt: 'Work screen demo' },
  { src: breakOverlay, alt: 'Break reminder interface' },
  { src: summaryOverlay, alt: 'Break summary interface' },
]

const transitionProgress = ref(0)
const TRANSITION_DURATION = 2000
const DISPLAY_DURATION = 5000

let animationFrame: number | null = null
let lastTransitionTime = 0

const getImageOpacity = (index: number) => {
  const totalImages = featuredImages.length
  const currentIndex = Math.floor(transitionProgress.value)
  const nextIndex = (currentIndex + 1) % totalImages

  if (index === currentIndex) {
    return 1 - (transitionProgress.value - currentIndex)
  } else if (index === nextIndex) {
    return transitionProgress.value - currentIndex
  }
  return 0
}

const animate = (currentTime: number) => {
  if (!lastTransitionTime) lastTransitionTime = currentTime
  const elapsed = currentTime - lastTransitionTime

  if (Math.floor(transitionProgress.value) === transitionProgress.value) {
    // At a whole number, wait for display duration
    if (elapsed >= DISPLAY_DURATION) {
      lastTransitionTime = currentTime
      transitionProgress.value += 0.01
    }
  } else {
    // During transition, use smooth easing
    const progress = elapsed / TRANSITION_DURATION
    const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

    transitionProgress.value = Math.floor(transitionProgress.value) + Math.min(1, ease)

    if (progress >= 1) {
      lastTransitionTime = currentTime
      transitionProgress.value = Math.ceil(transitionProgress.value) % featuredImages.length
    }
  }

  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  animationFrame = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>
