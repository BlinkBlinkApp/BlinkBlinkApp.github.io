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
          <span class="overline">{{ t('features.overline') }}</span>
          <h3>{{ t('features.title') }}</h3>
          <p>{{ t('features.description') }}</p>
          <div class="highlights">
            <div class="highlight-item">
              <span class="highlight-number">{{ t('features.highlights.rule.number') }}</span>
              <span class="highlight-label">{{ t('features.highlights.rule.label') }}</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-number">{{
                t('features.highlights.customizable.number')
              }}</span>
              <span class="highlight-label">{{ t('features.highlights.customizable.label') }}</span>
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
              <img
                :src="image.src"
                :alt="image.alt"
                v-fade-in
                :fetchpriority="index === 0 ? 'high' : 'low'"
                :loading="index === 0 ? 'eager' : 'lazy'"
                width="1200"
                height="800"
              />
            </div>
          </div>
          <div class="description">
            <h4>{{ t('features.showcase.smart_break.title') }}</h4>
            <p>
              {{ t('features.showcase.smart_break.description') }}
            </p>
          </div>
        </div>

        <div class="feature-showcase-item">
          <div class="description order-even-2">
            <h4>{{ t('features.showcase.schedules.title') }}</h4>
            <p>
              {{ t('features.showcase.schedules.description') }}
            </p>
          </div>
          <div class="screenshot order-even-1">
            <img
              src="@/assets/screenshots/schedule_setting.webp"
              alt="Customizable settings"
              v-fade-in
              loading="lazy"
              width="800"
              height="600"
            />
          </div>
        </div>
        <div class="feature-showcase-item">
          <div class="screenshot order-odd-1">
            <img
              src="@/assets/screenshots/stats_dark.webp"
              alt="Analytics dashboard"
              v-fade-in
              loading="lazy"
              width="800"
              height="600"
            />
          </div>
          <div class="description order-odd-2">
            <h4>{{ t('features.showcase.analytics.title') }}</h4>
            <p>
              {{ t('features.showcase.analytics.description') }}
            </p>
          </div>
        </div>
        <div class="feature-showcase-item">
          <div class="description order-even-2">
            <h4>{{ t('features.showcase.theme.title') }}</h4>
            <p>
              {{ t('features.showcase.theme.description') }}
            </p>
          </div>
          <div class="screenshot order-even-1">
            <img
              src="@/assets/screenshots/light_dark_show.webp"
              alt="Analytics dashboard"
              v-fade-in
              loading="lazy"
              width="800"
              height="600"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import '@/assets/styles/Features.css'
import workDemo from '@/assets/screenshots/work_demo.webp'
import breakOverlay from '@/assets/screenshots/break_overlay.webp'
import summaryOverlay from '@/assets/screenshots/summary_overlay.webp'

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

const { t } = useI18n()
</script>
