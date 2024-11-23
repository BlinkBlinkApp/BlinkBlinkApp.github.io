<template>
  <div class="tutorial-overlay">
    <button class="close-button" @click="$emit('close')">
      <i class="fa-solid fa-times">X</i>
    </button>

    <div class="tutorial-header">
      <h1>
        <i class="fa-solid" :class="platform === 'macos' ? 'fa-apple' : 'fa-windows'"></i>
        Installing BlinkBlink on {{ platform === 'macos' ? 'macOS' : 'Windows' }}
      </h1>
    </div>

    <div class="steps-container">
      <template v-if="platform === 'macos'">
        <div class="step compact">
          <h2><i class="fa-solid fa-folder-open"></i> Step 1: Drag & Drop</h2>
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
              Step 2: Remove Security Restrictions
            </h2>
            <button class="help-icon" title="Why is this needed?">?</button>
            <div class="explanation-box">
              <span class="emphasis">🧠 Why is this needed?</span>
              <br /><br />
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
                <p data-step="1.">Open Terminal (press ⌘+Space and type "Terminal")</p>
                <p data-step="2.">Copy and paste the following command to the Terminal</p>
                <div class="command-box">
                  xattr -c /Applications/BlinkBlink.app
                  <button class="copy-button" @click="copyCommand">Copy</button>
                </div>
                <p data-step="3.">hit Return (⏎) to run the command</p>
                <p data-step="4.">Open BlinkBlink and enjoy! 🎉</p>
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
          <h2><i class="fa-solid fa-folder-open"></i> Step 1: Launch the Installer</h2>
          <div class="step-body">
            <div class="step-content">
              <p>
                After downloading the BlinkBlink installer, locate the
                <code>BlinkBlink-Setup.{version}.exe</code> file in your downloads folder and
                double-click it to start the installation process.
              </p>
            </div>
          </div>
        </div>

        <div class="step">
          <div class="heading-group">
            <h2>
              <i class="fa-solid fa-shield"></i>
              Step 2: Handle the Security Warning
            </h2>
            <button class="help-icon" title="Why is this needed?">?</button>
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
        Need help? Contact support at
        <a href="mailto:theblinkblinkapp@gmail.com">theblinkblinkapp@gmail.com</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/styles/TutorialOverlay.css'
import { onMounted, onUnmounted } from 'vue'

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
  const button = document.querySelector('.copy-button') as HTMLButtonElement
  button.textContent = 'Copied!'
  setTimeout(() => {
    button.textContent = 'Copy'
  }, 2000)
}
</script>
