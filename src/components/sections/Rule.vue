<template>
  <section id="rule" class="rule-section">
    <div class="rule-content">
      <div class="title-container">
        <div class="title-row">
          <span class="pre-heading">{{ $t('rule.pre_heading') }}</span>
          <div class="number-group" style="contain: layout">
            <div class="number-set">
              <div class="number-container">
                <span class="rule-number">20</span>
                <span class="unit">min</span>
              </div>
              <div class="bubble-text bottom">{{ $t('rule.bubbles.focus') }}</div>
            </div>
            <span class="connector">·</span>
            <div class="number-set">
              <div class="number-container">
                <span class="rule-number">20</span>
                <span class="unit">ft</span>
              </div>
              <div class="bubble-text top">{{ $t('rule.bubbles.glance') }}</div>
            </div>
            <span class="connector">·</span>
            <div class="number-set">
              <div class="number-container">
                <span class="rule-number">20</span>
                <span class="unit">sec</span>
              </div>
              <div class="bubble-text bottom">{{ $t('rule.bubbles.breathe') }}</div>
            </div>
          </div>
          <span class="post-heading">{{ $t('rule.post_heading') }}</span>
        </div>
      </div>

      <div class="benefits-wrapper">
        <div class="benefits">
          <h3>{{ $t('rule.why_matters.title') }}</h3>
          <p class="benefits-intro">
            {{ $t('rule.why_matters.intro') }}
          </p>

          <div class="benefits-grid">
            <div class="benefit-card">
              <h4>{{ $t('rule.why_matters.every_20_min.title') }}</h4>
              <p>{{ $t('rule.why_matters.every_20_min.desc') }}</p>
            </div>

            <div class="benefit-card">
              <h4>{{ $t('rule.why_matters.look_20_feet.title') }}</h4>
              <p>{{ $t('rule.why_matters.look_20_feet.desc') }}</p>
            </div>

            <div class="benefit-card">
              <h4>{{ $t('rule.why_matters.for_20_sec.title') }}</h4>
              <p>{{ $t('rule.why_matters.for_20_sec.desc') }}</p>
            </div>
          </div>

          <div class="key-benefits">
            <h4>{{ $t('rule.key_benefits.title') }}</h4>
            <ul>
              <li v-for="(item, index) in $tm('rule.key_benefits.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import '@/assets/styles/Rule.css'
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  const numberSets = document.querySelectorAll('.number-set')
  let rafId: number

  const observer = new IntersectionObserver(
    (entries) => {
      // Cancel any pending animation frame
      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
        entries.forEach((entry) => {
          const set = entry.target as HTMLElement
          const number = set.querySelector('.number-container') as HTMLElement
          const bubble = set.querySelector('.bubble-text') as HTMLElement
          const index = Array.from(numberSets).indexOf(set)

          if (entry.isIntersecting) {
            set.style.transform = 'translate3d(0,0,0)' // Force GPU acceleration
            set.dataset.animate = 'true'
            number.style.setProperty('--animation-delay', `${index * 0.3}s`) // Reduced delay
            bubble.style.setProperty('--animation-delay', `${index * 0.3 + 0.15}s`)
          } else {
            delete set.dataset.animate
          }
        })
      })
    },
    {
      threshold: [0.1], // Reduced threshold for earlier triggering
      rootMargin: '50px', // Add some margin for smoother transitions
    }
  )

  numberSets.forEach(set => observer.observe(set))

  onBeforeUnmount(() => {
    observer.disconnect()
    if (rafId) cancelAnimationFrame(rafId)
  })
})
</script>

<style scoped>
.rule-section {
  contain: layout paint;
}

.rule-content {
  contain: style;
}

.title-row {
  position: relative;
  overflow: visible;
}

.pre-heading,
.post-heading {
  position: relative;
  z-index: 1;
}

.number-group {
  contain: layout paint;
}

.number-set {
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

.number-container, .bubble-text {
  transform: translate3d(0,0,0);
  will-change: transform, opacity;
}
</style>
