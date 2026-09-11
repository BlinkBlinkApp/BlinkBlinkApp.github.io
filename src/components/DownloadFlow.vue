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
    Teleported to the body, then positioned back over the download card.

    It cannot simply live inside that card: `.download-wrapper` carries
    `backdrop-filter: blur(20px)`, and any backdrop-filter other than `none`
    makes an element the containing block for `position: fixed` descendants — so
    the dialog was trapped inside it and sized to it. Measuring the card and
    pinning the backdrop to its box keeps the effect the site had: the dim stops
    at the card's rounded edge instead of washing the whole page.
  -->
  <Teleport to="body">
    <div
      class="flow-backdrop"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="headingId"
      :style="backdropStyle"
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
          <span class="flow-mascot" aria-hidden="true">
            <svg viewBox="0 0 100 100" focusable="false">
              <path
                fill-rule="evenodd"
                d="M57.1 0L51.2 0.6L43.7 3.1L36.5 7.5L29.8 12.7L26.9 13.5L24.3 13.5L22.7 12.9L21.6 12.4L19.7 10.5L18.3 7.5L18.3 2.8L17.3 2L15.7 2.4L14.4 3.6L11.9 7.9L10.9 11.9L11.1 17.5L13.4 23L15 25.2L16.8 26.8L16.8 27.5L10.5 39.3L7.2 47L4.4 55.4L3.8 59.5L4.7 60.4L5.7 60.2L6.5 59.2L7 59.5L6.6 62.3L6.8 68.5L7.3 69L8.2 69L8.6 68.6L9.1 68.9L10.7 72.8L13.8 77.7L20.2 84.3L24.7 87.5L26.1 88L26.8 88.9L27 90.7L26.5 91.2L25.1 91.2L22.4 92.4L19.1 95L18.1 96.6L18.1 97.7L19.2 98.6L24.9 100L33.7 99.8L38.8 98.4L40.6 97.5L41.7 96.2L42.5 93.9L46.9 94.5L53.7 94.5L54.7 94.1L57.8 93.9L58.5 96L60.6 98L62.9 99L68.4 100L76.5 99.8L80.6 98.8L81.6 98.4L82.1 97.7L81.9 95.8L79.8 93.5L76.3 91.6L73.7 91L73.2 90.5L73.6 88.3L78.4 85.3L81.4 82.9L86 77.9L89.3 72.6L90.7 68.9L91.4 68.6L92.5 69L93.2 68.1L93.4 62.3L93 59.7L93.5 59.4L94.1 60.2L94.9 60.4L95.5 60.2L96.2 59.1L94.8 53L91.7 44.6L86.8 34.2L83.4 27.9L81.9 25.8L81.9 25L83.4 23L85.6 17.9L86 14.8L85.6 9.9L84.8 7.5L83.2 4.8L81 2.4L79.4 2L78.5 2.6L78.5 7L77.2 10.3L74.7 12.5L73.1 13.1L71.8 13.1L67.5 10.4L63.7 8.6L58.4 7.1L56.7 7.1L56.4 6.4L57.3 5.5L61.4 3.9L62.3 3L62.3 1.7L61.4 0.8L57.1 0ZM44.8 20.3L50.2 20.2L52.4 20.6L56.7 22L60.2 23.9L64 27.4L66 30.1L67.4 33L68.3 36.6L68.3 37L67.9 37L67 34.4L65.7 32.7L65.4 33L66 35.4L66 41.5L64.6 46.4L63.2 49.1L61.3 51.9L58 54.9L53.5 57.6L49.8 58.6L47.3 58.6L43.5 57.8L40.6 56.7L37.1 54.3L32.6 49.5L30.3 44.4L29.5 40.7L29.5 36.8L30.3 32.8L29.5 33.2L28.3 34.8L27.4 37.2L27 37.2L27.9 33.2L28.9 31.1L31.1 27.7L33.7 24.9L38.8 21.8L41.8 20.8L44.8 20.3ZM46.7 22.9L42.9 23.7L40.6 24.7L37.6 26.7L35 29.3L34 30.7L32.3 34.8L31.9 40.7L32.5 43.6L34 47.2L37.5 51.2L39.4 52.5L43.5 54.3L46.5 54.9L49.2 54.9L52.7 54.1L55.9 52.7L57.6 51.6L60.3 48.9L61.7 47L63.2 43.2L63.8 38.1L62.6 32.8L60.9 29.7L58.4 27.1L56.1 25.3L53.3 23.9L50.6 23.1L46.7 22.9ZM46.6 31.7L48.8 31.6L51.2 32.5L53.2 35L54 37L54 38.7L52.6 41.9L51 43.3L48.2 44.3L45.5 43.7L44.3 42.9L42.8 41.3L42.1 39.3L42.1 37L42.6 35L45.1 32L46.6 31.7ZM76 47.7L77.8 47.8L79 48.4L79.9 49.5L79.4 49.8L78 48.6L76.7 48.2L76.1 48.4L75.8 48.1L76 47.7ZM74 52.5L75.7 52.4L77.2 53.2L72.8 58.7L71.3 61.3L69.7 69.9L67.8 73.1L65.7 73.9L64.1 73.7L59.2 72.2L56.3 70.8L53.9 70.2L51.8 70.2L49.4 70.8L47.1 72L41 76.9L38.6 78.2L37.6 78.4L35.9 78L34.4 76.6L30.1 69.1L24.4 63.4L19.7 57.2L20.8 56.3L25.3 55.5L26.7 54.7L26 56L24 57.9L23.8 58.9L25.5 60.8L27.8 62.5L31.8 64.5L36.3 65.9L42 66.7L46.9 66.7L53.5 65.5L60.6 62.5L66.3 59.2L69.2 57.1L74 52.5ZM68.8 59L61.4 63.9L55.5 66.7L55 67.5L56.5 68.8L62.7 71.8L64.9 72.4L66.7 72.2L68.1 70.1L68.9 66.8L69.5 59.1L68.8 59ZM31.4 66.3L31.1 66.6L31.3 67.5L32.6 70.7L35.4 75.4L37.1 76.9L38.6 76.7L40.2 75.7L43.7 72.7L47 69.3L46.5 68.6L37.8 67.8L31.4 66.3Z"
              />
            </svg>
          </span>
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
  { key: 'buyMeACoffee', url: 'donation.buyMeACoffeeUrl' },
  { key: 'kofi', url: 'donation.kofiUrl' },
  { key: 'paypal', url: 'donation.paypalUrl' },
] as const

/** The element the dim is confined to; the whole viewport if it is not found. */
const SCOPE_SELECTOR = '.download-wrapper'
/** Below this, the section has too little of itself on screen to hold a dialog. */
const MIN_SCOPE_HEIGHT = 420

const headingId = 'download-flow-heading'
const thanked = ref(false)
const copied = ref(false)
const card = ref<HTMLElement | null>(null)
const backdropStyle = ref<Record<string, string>>({})

/**
 * Pins the backdrop over the visible part of the download section.
 *
 * Clamped to the viewport, because the section is taller than most screens and
 * a dialog centred in the whole of it would sit off the bottom. If what is left
 * on screen is too small to hold the dialog, the viewport takes over — better a
 * page-wide dim than a dialog squeezed into a sliver.
 */
function measureScope() {
  const scope = document.querySelector(SCOPE_SELECTOR)
  if (!scope) return

  const box = scope.getBoundingClientRect()
  const top = Math.max(0, box.top)
  const bottom = Math.min(window.innerHeight, box.bottom)

  if (bottom - top < MIN_SCOPE_HEIGHT) {
    backdropStyle.value = {}
    return
  }

  backdropStyle.value = {
    top: `${top}px`,
    left: `${Math.max(0, box.left)}px`,
    width: `${Math.min(window.innerWidth, box.width)}px`,
    height: `${bottom - top}px`,
    borderRadius: getComputedStyle(scope).borderRadius,
  }
}

let pending = 0
function remeasure() {
  cancelAnimationFrame(pending)
  pending = requestAnimationFrame(measureScope)
}

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
  measureScope()
  window.addEventListener('resize', remeasure)
  window.addEventListener('scroll', remeasure, { passive: true })
  document.addEventListener('keydown', handleKeydown)
  // The card takes focus so Escape and Tab work without a click first, and so
  // a screen reader lands inside the dialog rather than behind it.
  card.value?.focus()
})

onUnmounted(() => {
  cancelAnimationFrame(pending)
  window.removeEventListener('resize', remeasure)
  window.removeEventListener('scroll', remeasure)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.flow-backdrop {
  position: fixed;
  /* Overridden inline with the download section's own box; `inset` is the
     fallback for a page that does not have one. */
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

/*
 * The mascot, not a platform logo. The site loads no icon font — every
 * `<i class="fa-...">` on it renders as nothing — so a platform glyph here was
 * an empty circle. The heading says which platform in words anyway.
 */
.flow-mascot {
  flex: 0 0 auto;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(76, 123, 243, 0.16);
}

.flow-mascot svg {
  width: 1.6rem;
  height: 1.6rem;
  fill: #6f97ff;
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
