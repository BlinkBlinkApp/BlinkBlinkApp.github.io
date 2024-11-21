<template>
  <section id="features" class="features-section">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h3>Protect Your Digital Vision</h3>
          <p>
            Modern life means more screen time than ever. BlinkBlink helps you maintain healthy eyes
            with smart reminders based on the 20-20-20 rule: Every 20 minutes, look at something 20
            feet away for 20 seconds.
          </p>
        </div>
      </div>

      <div class="features-showcase">
        <div class="feature-showcase-item">
          <div class="screenshot">
            <img src="@/assets/screenshots/break_overlay.png" alt="Break reminder interface" />
          </div>
          <div class="description">
            <h4>Gentle Break Reminders</h4>
            <p>
              Subtle notifications and a soothing screen blur signal it’s time to pause. Take 20
              seconds to relax your eyes and refresh your mind.
            </p>
          </div>
        </div>

        <div class="feature-showcase-item">
          <div class="description">
            <h4>Personalized Settings</h4>
            <p>
              Customize your schedule with ease. Adjust break intervals and durations to seamlessly
              fit your work style.
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
            <h4>Actionable Insights</h4>
            <p>
              Visualize your habits with intuitive analytics. Track progress and take control of
              your digital wellness.
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
