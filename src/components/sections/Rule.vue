<template>
  <section id="rule" class="section rule-section">
    <div class="container">
      <h2>The 20·20·20 Rule</h2>
      <p class="subtitle">A simple method to protect your eyes during screen time</p>

      <div class="rule-container">
        <div class="rule-card">
          <div class="rule-number">20</div>
          <div class="rule-text">Minutes of work</div>
          <p>Work on your screen for 20 minutes</p>
        </div>

        <div class="rule-card">
          <div class="rule-number">20</div>
          <div class="rule-text">Feet away</div>
          <p>Look at something 20 feet away</p>
        </div>

        <div class="rule-card">
          <div class="rule-number">20</div>
          <div class="rule-text">Seconds break</div>
          <p>Take a 20-second eye break</p>
        </div>
      </div>

      <div class="explanation">
        <h3>Why This Rule Works</h3>
        <div class="explanation-grid">
          <p class="explanation-text">
            The 20·20·20 rule is a simple yet effective method recommended by optometrists to reduce
            digital eye strain. When you focus on a screen for long periods, your eye muscles can become
            fatigued. This rule helps prevent eye strain, dry eyes, and potential long-term vision
            problems.
          </p>

          <div class="benefits">
            <h4>Benefits of the 20·20·20 Rule:</h4>
            <ul>
              <li>Reduces eye strain and fatigue</li>
              <li>Prevents dry eyes</li>
              <li>Maintains healthy vision</li>
              <li>Increases productivity</li>
              <li>Promotes better posture</li>
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
  const cards = document.querySelectorAll('.rule-card')
  cards.forEach((card, index) => {
    (card as HTMLElement).style.animationDelay = `${index * 0.2}s`
  })
})
</script>
