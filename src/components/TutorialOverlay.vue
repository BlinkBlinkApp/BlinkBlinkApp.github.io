<template>
  <div class="tutorial-overlay">
    <button class="close-button" @click="$emit('close')">
      <i class="fa-solid fa-times">X</i>
    </button>

    <div class="tutorial-header">
      <h1>
        <i class="fa-solid" :class="platform === 'macos' ? 'fa-apple' : 'fa-windows'"></i>
        {{ t('tutorial.title', { platform: platform === 'macos' ? 'macOS' : 'Windows' }) }}
      </h1>
    </div>

    <div class="steps-container">
      <template v-if="platform === 'macos'">
        <div class="step compact">
          <h2><i class="fa-solid fa-folder-open"></i> {{ t('tutorial.step1.macos.title') }}</h2>
          <div class="step-body">
            <div class="step-image">
              <img
                src="@/assets/screenshots/install_guide_mac_step_1.png"
                alt="Drag to Applications"
              />
            </div>
          </div>
        </div>

        <div class="step">
          <div class="heading-group">
            <h2>
              <i class="fa-solid fa-terminal"></i>
              {{ t('tutorial.step2.macos.title') }}
            </h2>
            <button class="help-icon" :title="t('tutorial.step2.macos.why_needed')">?</button>
            <div class="explanation-box">
              <span class="emphasis">{{ t('tutorial.step2.macos.explanation.title') }}</span>
              <br /><br />
              {{ t('tutorial.step2.macos.explanation.text') }}
              Otherwise, you will be seeing
              <a href="https://discussions.apple.com/thread/253714860?sortBy=rank" target="_blank"
                >this</a
              >. <br /><br />
              Apple has strict security measures for apps, which is great for safety but can be a
              challenge for smaller developers. The baseline requirement for bypassing these
              warnings is paying Apple's
              <a href="https://developer.apple.com/support/compare-memberships/" target="_blank"
                >$99 annual fee</a
              >. <br /><br />
              Since I don't have the resources for that yet, installing the app might take you an
              extra step. 😞 But don't worry, it's totally worth it!
              <br /><br />
              If you have further questions, feel free to reach out to
              <a href="mailto:theblinkblinkapp@gmail.com" target="_blank">me</a>. You can learn more
              about Apple's security measures
              <a
                href="https://support.apple.com/guide/security/protecting-against-malware-sec469d47bd8/web"
                target="_blank"
                >here</a
              >.
            </div>
          </div>
          <div class="step-body">
            <div class="step-content">
              <div class="step-instructions">
                <p data-step="1.">{{ t('tutorial.step2.macos.instructions.step1') }}</p>
                <p data-step="2.">{{ t('tutorial.step2.macos.instructions.step2') }}</p>
                <div class="command-box">
                  xattr -c /Applications/BlinkBlink.app
                  <button class="copy-button" @click="copyCommand">{{ copied ? t('tutorial.buttons.copied') : t('tutorial.buttons.copy') }}</button>
                </div>
                <p data-step="3.">{{ t('tutorial.step2.macos.instructions.step3') }}</p>
                <p data-step="4.">{{ t('tutorial.step2.macos.instructions.step4') }}</p>
              </div>
            </div>
            <div class="step-image">
              <img src="@/assets/screenshots/install_guide_mac_step_2.png" alt="Terminal command" />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="step compact">
          <h2><i class="fa-solid fa-folder-open"></i> {{ t('tutorial.step1.windows.title') }}</h2>
          <div class="step-body">
            <div class="step-content">
              <p>{{ t('tutorial.step1.windows.description', { version: '{version}' }) }}</p>
            </div>
          </div>
        </div>

        <div class="step">
          <div class="heading-group">
            <h2>
              <i class="fa-solid fa-shield"></i>
              {{ t('tutorial.step2.windows.title') }}
            </h2>
            <button class="help-icon" :title="t('tutorial.step2.windows.why_needed')">?</button>
            <div class="explanation-box">
              <span class="emphasis">🛡️ Why am I seeing this?</span>
              <br /><br />
              BlinkBlink is completely safe to use. However, because it’s not digitally signed with
              a code signing certificate—a costly process for small indie developers—Windows flags
              it as an extra precaution.
              <br /><br />
              To learn more about Microsoft Defender SmartScreen and how it works, visit
              <a
                href="https://learn.microsoft.com/en-us/windows/security/operating-system-security/virus-and-threat-protection/microsoft-defender-smartscreen/"
                target="_blank"
                >this official guide</a
              >.
            </div>
          </div>
          <div class="step-body">
            <div class="step-content">
              <div class="step-instructions">
                <p data-step="1.">On the "Windows protected your PC" screen, click "More info".</p>
                <p data-step="2.">
                  After clicking "More info," a "Run anyway" button will appear. Click it to
                  continue.
                </p>
                <p data-step="3.">
                  Follow the prompts in the installer to complete the installation.
                </p>
              </div>
            </div>
            <div class="step-image">
              <img
                src="@/assets/screenshots/install_guide_windows_step_2.png"
                alt="Windows security warning screen"
              />
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="tutorial-footer">
      <div class="help-text">
        {{ t('tutorial.footer.need_help') }}
        <a href="mailto:theblinkblinkapp@gmail.com">theblinkblinkapp@gmail.com</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/styles/TutorialOverlay.css'
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const copied = ref(false)

const props = defineProps<{
  platform: 'windows' | 'macos'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleKeydown(event: KeyboardEvent) {
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

function copyCommand() {
  navigator.clipboard.writeText('xattr -c /Applications/BlinkBlink.app')
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>
