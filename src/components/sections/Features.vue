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
            <div class="featured-screenshot" :style="{ opacity: firstImageOpacity }">
              <img src="@/assets/screenshots/break_overlay.png" alt="Break reminder interface" />
            </div>
            <div class="featured-screenshot" :style="{ opacity: secondImageOpacity }">
              <img src="@/assets/screenshots/summary_overlay.png" alt="Break summary interface" />
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
          <div class="description">
            <h4>Customizable Schedules</h4>
            <p>
              Tailor breaks to your needs. Set intervals and durations that align with your
              workflow.
            </p>
          </div>
          <div class="screenshot">
            <img src="@/assets/screenshots/schedule_setting.png" alt="Customizable settings" />
          </div>
        </div>

        <div class="feature-showcase-item">
          <div class="screenshot">
            <img src="@/assets/screenshots/stats_dark.png" alt="Analytics dashboard" />
          </div>
          <div class="description">
            <h4>Insightful Analytics</h4>
            <p>
              Understand your screen habits with clear visuals. Stay on top of your digital
              wellness.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import '@/assets/styles/Features.css'

const transitionProgress = ref(0)
const TRANSITION_DURATION = 1500 // 1.5 seconds for the transition
const DISPLAY_DURATION = 4000 // 4 seconds to display each image

let animationFrame: number | null = null
let lastTransitionTime = 0

const firstImageOpacity = computed(() => {
  return Math.cos(Math.PI * transitionProgress.value) * 0.5 + 0.5
})

const secondImageOpacity = computed(() => {
  return Math.cos(Math.PI * (transitionProgress.value + 1)) * 0.5 + 0.5
})

const animate = (currentTime: number) => {
  if (!lastTransitionTime) lastTransitionTime = currentTime
  const elapsed = currentTime - lastTransitionTime

  if (transitionProgress.value % 1 === 0) {
    // When at integer value (fully displayed), wait for DISPLAY_DURATION
    if (elapsed >= DISPLAY_DURATION) {
      lastTransitionTime = currentTime
      transitionProgress.value += 0.01
    }
  } else {
    // During transition, smoothly increment
    const progress = Math.min(elapsed / TRANSITION_DURATION, 1)
    const targetValue = Math.ceil(transitionProgress.value)
    transitionProgress.value = Math.floor(transitionProgress.value) + progress

    if (progress === 1) {
      lastTransitionTime = currentTime
      transitionProgress.value = targetValue
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
