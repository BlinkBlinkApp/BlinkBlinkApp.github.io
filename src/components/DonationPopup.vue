<template>
  <div class="donation-popup" @click.self="$emit('close')">
    <div class="donation-content">
      <button class="close-button" @click="$emit('close')">
        <i class="fa-solid fa-times">X</i>
      </button>

      <h2>{{ t('donation.title') }}</h2>
      <p>{{ t('donation.description') }}</p>

      <div class="donation-options">
        <a
          v-if="!showThankYou"
          :href="t('donation.buyMeACoffeeUrl')"
          target="_blank"
          class="donation-button buy-me-coffee"
          @click="handleDonation"
        >
          <i class="fa-solid fa-coffee"></i>
          {{ t('donation.buttons.buyMeACoffee') }}
        </a>
        <a
          v-if="!showThankYou"
          :href="t('donation.kofiUrl')"
          target="_blank"
          class="donation-button ko-fi"
          @click="handleDonation"
        >
          <i class="fa-solid fa-mug-hot"></i>
          {{ t('donation.buttons.kofi') }}
        </a>
        <a
          v-if="!showThankYou"
          :href="t('donation.paypalUrl')"
          target="_blank"
          class="donation-button paypal"
          @click="handleDonation"
        >
          <i class="fa-brands fa-paypal"></i>
          {{ t('donation.buttons.paypal') }}
        </a>
        <div v-if="showThankYou" class="thank-you-message">
          <i class="fa-solid fa-heart"></i>
          {{ t('donation.thankYou') }}
        </div>
      </div>
      <button class="button skip" @click="$emit('proceed')">
        {{ t('donation.skipButton') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted, ref } from 'vue'

const { t } = useI18n()
const showThankYou = ref(false)

const handleDonation = () => {
  showThankYou.value = true
}

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'proceed'): void
}>()

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.donation-popup {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.donation-content {
  background: var(--background-color);
  padding: 2rem;
  border-radius: var(--radius-lg);
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-color);
}

.donation-content h2 {
  color: var(--heading-color, #fff);
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.donation-content p {
  color: var(--text-color, rgba(255, 255, 255, 0.9));
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.button {
  flex: 1;
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  border: none;
}

.donate {
  background: var(--accent-color);
  color: white;
}

.skip {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-color, rgba(255, 255, 255, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.skip:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-color, #fff);
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.close-button i {
  font-size: 1.1rem;
}

.donation-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.donation-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  border: none;
  text-decoration: none;
  transition: transform 0.2s ease, filter 0.2s ease;
  font-size: 1.1rem;
}

.donation-button:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.buy-me-coffee {
  background: #FFDD00;
  color: #000000;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
}

.ko-fi {
  background: #29ABE0;
  color: white;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}

.paypal {
  background: #003087;
  color: white;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}

.skip {
  width: 100%;
  margin-top: 1rem;
}

.thank-you-message {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffc3a0 100%);
  border-radius: var(--radius-md);
  font-size: 1.2rem;
  color: #fff;
  animation: fadeIn 0.5s ease;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.thank-you-message i {
  color: #fff;
  margin-right: 0.5rem;
  animation: heartBeat 1.3s ease-in-out infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}
</style>
