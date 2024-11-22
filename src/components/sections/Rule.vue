<template>
  <section id="rule" class="rule-section">
    <div class="rule-content">
      <div class="title-container">
        <div class="title-row">
          <span class="pre-heading">The</span>
          <div class="number-group">
            <!-- Wrap each number set in a container -->
            <div class="number-set">
              <div class="number-container">
                <span class="rule-number">20</span>
                <span class="unit">min</span>
              </div>
              <div class="bubble-text bottom">Stay focused,<br>crush your tasks!</div>
            </div>
            <span class="connector">·</span>
            <div class="number-set">
              <div class="number-container">
                <span class="rule-number">20</span>
                <span class="unit">ft</span>
              </div>
              <div class="bubble-text top">Glance away, rest your eyes</div>
            </div>
            <span class="connector">·</span>
            <div class="number-set">
              <div class="number-container">
                <span class="rule-number">20</span>
                <span class="unit">sec</span>
              </div>
              <div class="bubble-text bottom">Breathe,<br>blink,<br>recharge.</div>
            </div>
          </div>
          <span class="post-heading">Rule</span>
        </div>
      </div>

      <div class="benefits-wrapper">
        <div class="benefits">
          <h3>Why it Matters</h3>
          <p class="benefits-intro">
            This simple rule, recommended by eye care professionals, helps combat digital eye strain
            and supports healthier screen habits while boosting productivity.
          </p>

          <div class="benefits-grid">
            <div class="benefit-card">
              <h4>Every 20 Minutes</h4>
              <p>
                Regular breaks prevent eye fatigue and maintain focus throughout your workday. Think
                of it as a mini-reset for your visual system.
              </p>
            </div>

            <div class="benefit-card">
              <h4>Look 20 Feet Away</h4>
              <p>
                Focusing on distant objects relaxes your eye muscles and eases visual stress. It's
                like stretching for your eyes.
              </p>
            </div>

            <div class="benefit-card">
              <h4>For 20 Seconds</h4>
              <p>
                This short pause gives your eyes a chance to fully relax and readjust, while also
                promoting mindful blinking and better posture.
              </p>
            </div>
          </div>

          <div class="key-benefits">
            <h4>Key Benefits</h4>
            <ul>
              <li>Reduced digital eye strain and fatigue</li>
              <li>Better focus and sustained productivity</li>
              <li>Prevention of dry eyes and blurred vision</li>
              <li>Improved posture and neck comfort</li>
              <li>Encourages mindful blinking and relaxation</li>
              <li>Healthier screen-time habits for long-term wellness</li>
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

  const observer = new IntersectionObserver((entries) => {
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
  }, {
    threshold: 0,
    rootMargin: '-10% 0px'
  })

  numberSets.forEach(set => observer.observe(set))
})
</script>
