<template>
  <section id="about" class="section">
    <div class="container">
      <h2>About BlinkBlink</h2>
      <div class="content-grid">
        <div class="story">
          <h3>Why We Built This</h3>
          <p>
            Born from our own experience with digital eye strain, BlinkBlink was created to help
            everyone maintain healthy eyes in our screen-centric world. We believe that taking care
            of your eyes shouldn't be a disruption to your workflow.
          </p>

          <div class="mission">
            <h4>Our Mission</h4>
            <p>
              To make digital wellness effortless and accessible to everyone, one blink at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.section {
  background: var(--background-light);
  padding: 6rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.story {
  padding-right: 2rem;
}

.story h3 {
  color: var(--text-primary);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.mission {
  margin-top: 2rem;
  padding: 2rem;
  background: var(--background-alt);
  border-radius: 12px;
}

.features-highlight {
  display: grid;
  gap: 2rem;
}

.highlight-item {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.highlight-item:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
