<template>
  <section id="why" class="section">
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

<script setup lang="ts"></script>

<style scoped>
.section {
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-alt) 100%);
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
}

.background-shapes .shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
}

.shape-1 {
  background: var(--primary-color);
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
}

.shape-2 {
  background: var(--secondary-color);
  width: 400px;
  height: 400px;
  bottom: -150px;
  right: -150px;
}

.shape-3 {
  background: var(--accent-color, #ff6b6b);
  width: 250px;
  height: 250px;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 6rem;
  margin-bottom: 8rem;
  padding: 3rem;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-image {
  width: 400px;
  height: auto;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
  animation: float 6s ease-in-out infinite;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.hero-text {
  flex: 1;
}

.hero-text h3 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-text p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.features-showcase {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  margin: 4rem 0;
}

.feature-showcase-item {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s ease;
}

.feature-showcase-item:hover {
  transform: translateY(-8px);
}

.screenshot {
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.screenshot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.feature-showcase-item:hover .screenshot img {
  transform: scale(1.05);
}

.description {
  padding: 1.5rem;
  text-align: center;
}

.description h4 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.secondary-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 4rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 3rem;
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.98);
}

.feature-card:hover::after {
  transform: scaleX(1);
}

.icon-wrapper {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  width: 70px;
  height: 70px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.icon-wrapper::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;

  background: rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

.icon {
  font-size: 2rem;
}

.feature-card h4 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1.1rem;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotateY(0deg);
  }
  50% {
    transform: translateY(-20px) rotateY(5deg);
  }
}

@keyframes shimmer {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(50%, 50%) rotate(360deg);
  }
}

@media (max-width: 1200px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .features-showcase {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
    padding: 2rem;
  }

  .hero-image {
    width: 280px;
  }

  .features {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .intro h2 {
    font-size: 2.8rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .background-shapes .shape {
    opacity: 0.2;
  }

  .secondary-features {
    grid-template-columns: 1fr;
  }
}
</style>
