<template>
  <div class="tutorial-overlay">
    <button class="close-button" @click="$emit('close')">
      <i class="fa-solid fa-times">X</i>
    </button>

    <div class="tutorial-header">
      <h1>
        <i class="fa-solid" :class="platform === 'macos' ? 'fa-apple' : 'fa-windows'"></i>
        {{ t('tutorial.common.title', { platform: platform === 'macos' ? 'macOS' : 'Windows' }) }}
      </h1>
    </div>

    <div class="steps-container">
      <template v-if="platform === 'macos'">
        <div class="step compact">
          <h2><i class="fa-solid fa-folder-open"></i> {{ t('tutorial.mac.step1.title') }}</h2>
          <div class="step-body">
            <div class="step-image">
              <img
                src="@/assets/screenshots/install_guide_mac_step_1.png"
                alt="Drag to Applications Folder"
              />
            </div>
          </div>
        </div>

        <div class="step">
          <div class="heading-group">
            <h2>
              <i class="fa-solid fa-terminal"></i>
              {{ t('tutorial.mac.step2.title') }}
            </h2>
            <button class="help-icon" :title="t('tutorial.mac.step2.why_needed')">?</button>
            <div class="explanation-box">
              <span class="emphasis">{{ t('tutorial.mac.step2.explanation.title') }}</span>
              <br /><br />
              <span>
                {{ t('tutorial.mac.step2.explanation.content.prefix') }}
                <a :href="t('tutorial.mac.step2.explanation.links.discussion')" target="_blank">
                  {{ t('tutorial.mac.step2.explanation.link_texts.discussion') }}
                </a>
                {{ t('tutorial.mac.step2.explanation.content.middle1') }}
                <a :href="t('tutorial.mac.step2.explanation.links.membership')" target="_blank">
                  {{ t('tutorial.mac.step2.explanation.link_texts.membership') }}
                </a>
                {{ t('tutorial.mac.step2.explanation.content.middle2') }}
                <a :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>
                {{ t('tutorial.mac.step2.explanation.content.middle3') }}
                <a :href="t('tutorial.mac.step2.explanation.links.security')" target="_blank">
                  {{ t('tutorial.mac.step2.explanation.link_texts.security') }}
                </a>
                {{ t('tutorial.mac.step2.explanation.content.suffix') }}
              </span>
            </div>
          </div>
          <div class="step-body">
            <div class="step-content">
              <div class="step-instructions">
                <p data-step="1.">{{ t('tutorial.mac.step2.instructions.step1') }}</p>
                <p data-step="2.">{{ t('tutorial.mac.step2.instructions.step2') }}</p>
                <div class="command-box">
                  xattr -c /Applications/BlinkBlink.app
                  <button class="copy-button" @click="copyCommand">
                    {{
                      copied
                        ? t('tutorial.common.buttons.copied')
                        : t('tutorial.common.buttons.copy')
                    }}
                  </button>
                </div>
                <p data-step="3.">{{ t('tutorial.mac.step2.instructions.step3') }}</p>
                <p data-step="4.">{{ t('tutorial.mac.step2.instructions.step4') }}</p>
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
          <h2><i class="fa-solid fa-folder-open"></i> {{ t('tutorial.windows.step1.title') }}</h2>
          <div class="step-body">
            <div class="step-content">
              <p>{{ t('tutorial.windows.step1.description', { version: '{version}' }) }}</p>
            </div>
          </div>
        </div>

        <div class="step">
          <div class="heading-group">
            <h2>
              <i class="fa-solid fa-shield"></i>
              {{ t('tutorial.windows.step2.title') }}
            </h2>
            <button class="help-icon" :title="t('tutorial.windows.step2.why_needed')">?</button>
            <div class="explanation-box">
              <span class="emphasis">{{ t('tutorial.windows.step2.explanation.title') }}</span>
              <br /><br />
              <i18n-t keypath="tutorial.windows.step2.explanation.content" tag="span">
                <template #smartscreen>
                  <a :href="t('tutorial.windows.step2.explanation.links.smartscreen')" target="_blank">
                    {{ t('tutorial.windows.step2.explanation.link_texts.smartscreen') }}
                  </a>
                </template>
              </i18n-t>
            </div>
          </div>
          <div class="step-body">
            <div class="step-content">
              <div class="step-instructions">
                <p data-step="1.">{{ t('tutorial.windows.step2.instructions.step1') }}</p>
                <p data-step="2.">{{ t('tutorial.windows.step2.instructions.step2') }}</p>
                <p data-step="3.">{{ t('tutorial.windows.step2.instructions.step3') }}</p>
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
        {{ t('tutorial.common.footer.need_help') }}
        <a :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>
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
const supportEmail = 'theblinkblinkapp@gmail.com'

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
