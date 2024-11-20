<template>
  <section id="why" class="why-section">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="container">
      <div class="hero-content">
        <img src="@/assets/icon.png" alt="BlinkBlink mascot" class="hero-image" />
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
            <img src="@/assets/screenshots/tray_dark_windows.png" alt="Break reminder interface" />
          </div>
          <div class="description">
            <h4>Smart Break Reminders</h4>
            <p>Gentle notifications that respect your workflow</p>
          </div>
        </div>

        <div class="feature-showcase-item">
          <div class="screenshot">
            <img src="@/assets/screenshots/tray_dark_windows.png" alt="Customizable settings" />
          </div>
          <div class="description">
            <h4>Personalized Settings</h4>
            <p>Customize timings to match your schedule</p>
          </div>
        </div>

        <div class="feature-showcase-item">
          <div class="screenshot">
            <img src="@/assets/screenshots/tray_dark_windows.png" alt="Analytics dashboard" />
          </div>
          <div class="description">
            <h4>Visual Analytics</h4>
            <p>Track your eye care habits at a glance</p>
          </div>
        </div>

        <div class="feature-showcase-item">
          <div class="screenshot">
            <img src="@/assets/screenshots/tray_dark_windows.png" alt="Multi-screen support" />
          </div>
          <div class="description">
            <h4>Multi-Screen Ready</h4>
            <p>Seamless experience across all your displays</p>
          </div>
        </div>
      </div>

      <div class="secondary-features">
        <div class="feature-card">
          <div class="icon-wrapper">
            <span class="icon">👀</span>
          </div>
          <h4>Intelligent Timing</h4>
          <p>Smart break reminders that adapt to your work patterns and respect your focus time</p>
        </div>
        <div class="feature-card">
          <div class="icon-wrapper">
            <span class="icon">📊</span>
          </div>
          <h4>Wellness Insights</h4>
          <p>Detailed analytics to track your eye care habits and improve your digital wellness</p>
        </div>
        <div class="feature-card">
          <div class="icon-wrapper">
            <span class="icon">⚡</span>
          </div>
          <h4>Effortless Protection</h4>
          <p>Light on system resources, but powerful in protecting your eye health</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import '@/assets/styles/Why.css'
</script>
