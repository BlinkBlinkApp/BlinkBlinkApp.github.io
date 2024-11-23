<template>
  <section id="rule" class="rule-section">
    <div class="rule-content">
      <div class="title-container">
        <div class="title-row">
          <span class="pre-heading">{{ $t('rule.pre_heading') }}</span>
          <div class="number-group">
            <!-- Wrap each number set in a container -->
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
import { onMounted } from 'vue'

onMounted(() => {
  const numberSets = document.querySelectorAll('.number-set')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const set = entry.target as HTMLElement
        const number = set.querySelector('.number-container') as HTMLElement
        const bubble = set.querySelector('.bubble-text') as HTMLElement
        const index = Array.from(numberSets).indexOf(set)

        if (entry.isIntersecting) {
          // Animate number
          number.style.animation = 'none'
          number.offsetHeight
          number.style.animation = 'floatIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          number.style.animationDelay = `${index * 0.4}s`

          // Animate bubble
          bubble.style.animation = 'none'
          bubble.offsetHeight
          bubble.style.animation = `
          bubbleFloat 3s ease-in-out infinite,
          fadeIn 0.5s ease-out forwards
        `
          bubble.style.animationDelay = `${index * 0.3}s, ${index * 0.3}s`
        } else {
          // Hide both elements
          number.style.opacity = '0'
          number.style.animation = 'none'
          bubble.style.opacity = '0'
          bubble.style.animation = 'none'
        }
      })
    },
    {
      threshold: 0,
      rootMargin: '-10% 0px',
    },
  )

  numberSets.forEach((set) => observer.observe(set))
})
</script>
