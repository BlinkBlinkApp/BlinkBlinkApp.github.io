<template>
  <section id="rule" class="section">
    <h2>The 20·20·20 Rule</h2>
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
      <p>
        The 20·20·20 rule is a simple yet effective method recommended by optometrists to reduce
        digital eye strain. When you focus on a screen for long periods, your eye muscles can become
        fatigued. This rule helps prevent eye strain, dry eyes, and potential long-term vision
        problems.
      </p>

      <div class="benefits">
        <h4>Benefits:</h4>
        <ul>
          <li>Reduces eye strain and fatigue</li>
          <li>Prevents dry eyes</li>
          <li>Maintains healthy vision</li>
          <li>Increases productivity</li>
          <li>Promotes better posture</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.section {
  background: linear-gradient(135deg, var(--background-alt) 0%, #ffffff 100%);
  padding: 6rem 2rem;
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

.rule-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.rule-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.rule-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

.rule-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.rule-number {
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.rule-text {
  font-size: 1.2rem;
  color: #42b883;
  margin: 1rem 0;
}

.explanation {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  margin-top: 4rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.explanation h3 {
  color: var(--primary-color);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.benefits {
  margin-top: 2rem;
  padding: 2rem;
  background: var(--background-alt);
  border-radius: 12px;
}

.benefits h4 {
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.benefits ul {
  list-style-type: none;
  padding: 0;
}

.benefits li {
  margin: 1rem 0;
  padding-left: 2rem;
  position: relative;
  transition: transform 0.2s ease;
}

.benefits li:hover {
  transform: translateX(5px);
}

.benefits li::before {
  content: '→';
  color: var(--accent-color);
  position: absolute;
  left: 0;
  font-weight: bold;
}
</style>
