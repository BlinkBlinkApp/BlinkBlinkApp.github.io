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
          <p>More screen time doesn't have to mean strained eyes. BlinkBlink helps you stay focused,
            refreshed, and in control of your screen habits.</p>
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
          <div class="screenshot-wrapper">
            <div class="featured-screenshot">
              <img src="@/assets/screenshots/break_overlay.png" alt="Break reminder interface" />
            </div>
          </div>
          <div class="description">
            <h4>Gentle Reminders</h4>
            <p>Soft notifications and a calming screen blur signal it's time to pause and reset.</p>
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
import '@/assets/styles/Features.css'
</script>
