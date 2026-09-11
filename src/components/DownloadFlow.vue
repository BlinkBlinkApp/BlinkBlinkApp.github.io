<!--
  The download flow.

  One card that stays on screen from "which build?" to "it is downloading, here
  is how to install it", rather than a download that starts the moment a button
  is pressed and a guide that appears afterwards. The middle step is the support
  ask, which used to be the whole dialog.

  Every step names the actual file and its size. That is the most useful thing
  this dialog can say — people want to know what they are about to spend 100 MB
  on — and it comes from the release itself, so it cannot drift.
-->
<template>
  <!--
    Teleported out of the download section on purpose. The section is a
    transformed, rounded card, and a transformed ancestor becomes the containing
    block for `position: fixed` — the dialog would be trapped inside it, sized to
    it rather than to the viewport.
  -->
  <Teleport to="body">
    <div
      class="flow-backdrop"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="headingId"
      @click.self="emit('close')"
    >
      <div class="flow-card" ref="card">
        <button
          class="flow-close"
          type="button"
          :aria-label="t('download.flow.close')"
          @click="emit('close')"
        >
          <span aria-hidden="true">&#10005;</span>
        </button>

        <div class="flow-head">
          <span class="flow-platform" aria-hidden="true"><i :class="platformIcon"></i></span>
          <div class="flow-head-text">
            <h3 :id="headingId">{{ t(`download.downloadButton.${platform}`) }}</h3>
            <p class="flow-file" v-if="chosen">{{ fileLine(chosen) }}</p>
            <p class="flow-file" v-else-if="version">{{ version }}</p>
          </div>
        </div>

        <!-- Step 1: which build --------------------------------------------->
        <div class="flow-body" v-if="step === 'choose'">
          <p class="flow-lead">{{ t(`download.flow.lead.${platform}`) }}</p>

          <div class="picks">
            <button
              v-for="option in options"
              :key="option.key"
              class="pick"
              type="button"
              @click="emit('pick', option)"
            >
              <span class="pick-top">
                <span class="pick-label">{{ option.label }}</span>
                <span class="pick-badge" v-if="option.recommended">
                  {{ t('download.options.recommended') }}
                </span>
                <span class="pick-external" v-if="option.external" aria-hidden="true">&#8599;</span>
              </span>
              <span class="pick-hint">{{ option.hint }}</span>
              <span class="pick-file" v-if="fileLine(option)">{{ fileLine(option) }}</span>
            </button>
          </div>
        </div>

        <!-- Step 2: the support ask ------------------------------------------>
        <div class="flow-body" v-else-if="step === 'support'">
          <p class="flow-lead">{{ t('donation.description') }}</p>

          <div class="support" v-if="!thanked">
            <a
              v-for="link in DONATION_LINKS"
              :key="link.key"
              class="support-link"
              :class="link.key"
              :href="t(link.url)"
              target="_blank"
              rel="noopener noreferrer"
              @click="thanked = true"
            >
              <i :class="link.icon" aria-hidden="true"></i>
              {{ t(`donation.buttons.${link.key}`) }}
            </a>
          </div>
          <p class="support-thanks" v-else>{{ t('donation.thankYou') }}</p>

          <button class="flow-go" type="button" @click="emit('proceed')">
            {{ t('donation.skipButton') }}
          </button>
        </div>

        <!-- Step 3: installing, Linux only ----------------------------------->
        <div class="flow-body" v-else-if="step === 'guide' && chosen">
          <p class="flow-lead">{{ t('download.flow.started') }}</p>

          <ol class="guide">
            <li v-for="(line, index) in guideSteps" :key="index">{{ line }}</li>
          </ol>

          <div class="command" v-if="guideCommand">
            <div class="command-scroll">
              <code>{{ guideCommand }}</code>
            </div>
            <button class="command-copy" type="button" @click="copy">
              {{ copied ? t('tutorial.common.buttons.copied') : t('tutorial.common.buttons.copy') }}
            </button>
          </div>

          <button class="flow-go" type="button" @click="emit('close')">
            {{ t('download.flow.done') }}
          </button>
        </div>

        <div class="flow-foot">
          {{ t('tutorial.common.footer.need_help') }}
          <a :href="`mailto:${SUPPORT_EMAIL}`">{{ SUPPORT_EMAIL }}</a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
// A plain block, because `<script setup>` cannot carry exports and the parent
// builds these shapes.
export type FlowStep = 'choose' | 'support' | 'guide'

export interface FlowOption {
  key: string
  label: string
  hint: string
  recommended?: boolean
  /** Opens a store page instead of downloading a file. */
  external?: boolean
  /** The asset this option resolves to, when the release carries one. */
  fileName?: string
  fileSize?: number
}
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  platform: 'windows' | 'macos' | 'linux'
  step: FlowStep
  options: FlowOption[]
  chosen: FlowOption | null
  version: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'pick', option: FlowOption): void
  (e: 'proceed'): void
}>()

const { t } = useI18n()

const SUPPORT_EMAIL = 'theblinkblinkapp@gmail.com'

const DONATION_LINKS = [
  { key: 'buyMeACoffee', url: 'donation.buyMeACoffeeUrl', icon: 'fa-solid fa-coffee' },
  { key: 'kofi', url: 'donation.kofiUrl', icon: 'fa-solid fa-mug-hot' },
  { key: 'paypal', url: 'donation.paypalUrl', icon: 'fa-brands fa-paypal' },
] as const

const headingId = 'download-flow-heading'
const thanked = ref(false)
const copied = ref(false)
const card = ref<HTMLElement | null>(null)

const platformIcon = computed(
  () =>
    ({
      windows: 'fa-brands fa-windows',
      macos: 'fa-brands fa-apple',
      linux: 'fa-brands fa-linux',
    })[props.platform],
)

/** "BlinkBlink-0.2.4-x86_64.AppImage · 104 MB", or just the version. */
function fileLine(option: FlowOption | null): string {
  if (!option?.fileName) return ''
  if (!option.fileSize) return option.fileName
  return `${option.fileName} · ${Math.round(option.fileSize / 1024 / 1024)} MB`
}

/** The download path for the file the browser has just saved. */
const downloadedPath = computed(() => `~/Downloads/${props.chosen?.fileName ?? ''}`)

const guideSteps = computed<string[]>(() => {
  const key = props.chosen?.key
  if (key === 'appimage') {
    return [t('download.flow.guide.appimage.step1'), t('download.flow.guide.appimage.step2')]
  }
  if (key === 'deb' || key === 'rpm') {
    return [t(`download.flow.guide.${key}.step1`), t('download.flow.guide.common.launch')]
  }
  return []
})

const guideCommand = computed(() => {
  const path = downloadedPath.value
  switch (props.chosen?.key) {
    case 'appimage':
      return `chmod +x ${path} && ${path}`
    case 'deb':
      return `sudo apt install ${path}`
    case 'rpm':
      return `sudo dnf install ${path}`
    default:
      return ''
  }
})

function copy() {
  navigator.clipboard.writeText(guideCommand.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  // The card takes focus so Escape and Tab work without a click first, and so
  // a screen reader lands inside the dialog rather than behind it.
  card.value?.focus()
})

onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.flow-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(8, 9, 16, 0.72);
  backdrop-filter: blur(10px);
  animation: flow-fade 0.16s ease-out;
}

.flow-card {
  position: relative;
  width: min(30rem, 100%);
  max-height: calc(100vh - 2.5rem);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 1.75rem 1.75rem 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #10121b;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
  color: #e4e7f0;
  animation: flow-rise 0.18s ease-out;
}

@keyframes flow-fade {
  from {
    opacity: 0;
  }
}

@keyframes flow-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .flow-backdrop,
  .flow-card {
    animation: none;
  }
}

.flow-close {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.flow-close:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

/* Header ------------------------------------------------------------- */

/*
 * Plain divs, not <header>/<footer>. The site styles those elements globally —
 * `header { min-height: 100vh }` builds the hero — and a dialog that borrows a
 * hero's height pushes its own content out of sight.
 */
.flow-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding-right: 2.25rem;
}

.flow-platform {
  flex: 0 0 auto;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(76, 123, 243, 0.16);
  color: #6f97ff;
  font-size: 1.3rem;
}

.flow-head-text {
  min-width: 0;
}

.flow-head h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.25;
}

.flow-file {
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  color: rgba(228, 231, 240, 0.55);
  word-break: break-all;
}

/* Body --------------------------------------------------------------- */

.flow-body {
  margin-top: 1.35rem;
}

.flow-lead {
  margin: 0 0 0.9rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(228, 231, 240, 0.82);
}

.picks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pick {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  width: 100%;
  padding: 0.75rem 0.9rem;
  text-align: left;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.pick:hover {
  background: rgba(76, 123, 243, 0.16);
  border-color: rgba(111, 151, 255, 0.55);
}

.pick-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pick-label {
  font-size: 0.98rem;
  font-weight: 600;
  color: #fff;
}

.pick-badge {
  padding: 0.1rem 0.45rem;
  border-radius: 100px;
  background: rgba(111, 151, 255, 0.9);
  color: #0b0d16;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.pick-external {
  margin-left: auto;
  color: rgba(228, 231, 240, 0.5);
}

.pick-hint {
  font-size: 0.82rem;
  color: rgba(228, 231, 240, 0.68);
}

.pick-file {
  margin-top: 0.25rem;
  font-size: 0.72rem;
  color: rgba(228, 231, 240, 0.42);
  word-break: break-all;
}

/* Support ------------------------------------------------------------ */

.support {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.support-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: filter 0.15s ease;
}

.support-link:hover {
  filter: brightness(1.08);
}

.support-link.buyMeACoffee {
  background: #ffdd00;
  color: #000;
}

.support-link.kofi {
  background: #29abe0;
  color: #fff;
}

.support-link.paypal {
  background: #003087;
  color: #fff;
}

.support-thanks {
  margin: 0;
  padding: 1rem;
  border-radius: var(--radius-sm);
  background: rgba(255, 92, 168, 0.14);
  border: 1px solid rgba(255, 92, 168, 0.3);
  font-size: 0.92rem;
  line-height: 1.5;
}

.flow-go {
  width: 100%;
  margin-top: 0.9rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.flow-go:hover {
  background: rgba(255, 255, 255, 0.16);
}

/* Guide -------------------------------------------------------------- */

.guide {
  margin: 0 0 0.9rem;
  padding-left: 1.15rem;
  font-size: 0.92rem;
  line-height: 1.6;
  color: rgba(228, 231, 240, 0.86);
}

.guide li + li {
  margin-top: 0.35rem;
}

.command {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.8rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(76, 123, 243, 0.35);
  background: rgba(0, 0, 0, 0.35);
}

/* The command scrolls; the copy button must not scroll away with it. */
.command-scroll {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
}

.command code {
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.8rem;
  color: #8fb0ff;
  white-space: nowrap;
}

.command-copy {
  flex: 0 0 auto;
  padding: 0.35rem 0.7rem;
  border: none;
  border-radius: 6px;
  background: #4c7bf3;
  color: #fff;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.command-copy:hover {
  filter: brightness(1.1);
}

/* Footer ------------------------------------------------------------- */

.flow-foot {
  margin-top: 1.4rem;
  padding-top: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.76rem;
  color: rgba(228, 231, 240, 0.45);
}

.flow-foot a {
  color: rgba(143, 176, 255, 0.9);
}

.pick:focus-visible,
.flow-go:focus-visible,
.flow-close:focus-visible,
.support-link:focus-visible,
.command-copy:focus-visible {
  outline: 2px solid #6f97ff;
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .flow-card {
    padding: 1.5rem 1.15rem 1rem;
  }

  .flow-head h3 {
    font-size: 1.08rem;
  }
}
</style>
