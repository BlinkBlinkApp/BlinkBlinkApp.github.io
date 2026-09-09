<template>
  <section id="download" class="download-section">
    <div class="download-wrapper">
      <h2>{{ t('download.title') }}</h2>

      <div class="features-ticker">
        <div class="ticker-content" style="running">
          <div
            class="feature"
            v-for="(feature, index) in [...computedFeatures, ...computedFeatures]"
            :key="index"
          >
            <i :class="feature.icon"></i>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <!--
        One column per platform, each built the same way: a primary button that
        serves the right build without asking, and an identical disclosure
        underneath for the cases where the default is wrong. Keeping the three
        identical matters more than packing every format into view.
      -->
      <ul class="actions special">
        <div class="primary-downloads">
          <li v-for="platform in PLATFORMS" :key="platform" class="platform">
            <a
              @click="requestDownload(primaryTarget(platform))"
              :class="['button', 'icon', 'solid', 'fa-download', { loading: isLoading[platform] }]"
              :disabled="isLoading[platform]"
            >
              {{
                isLoading[platform]
                  ? t('download.downloadButton.preparing')
                  : t(`download.downloadButton.${platform}`)
              }}
            </a>

            <button
              class="options-toggle"
              type="button"
              :aria-expanded="openPanel === platform"
              :aria-controls="`options-${platform}`"
              @click="togglePanel(platform)"
            >
              {{ t('download.options.toggle') }}
              <span class="chevron" :class="{ open: openPanel === platform }" aria-hidden="true"
                >&#9662;</span
              >
            </button>

            <div class="options-panel" :id="`options-${platform}`" v-show="openPanel === platform">
              <p class="options-note" v-if="platform === 'windows'">
                {{ t('download.options.windowsNote') }}
              </p>

              <button
                v-for="option in optionsFor(platform)"
                :key="option.key"
                class="option"
                type="button"
                @click="requestDownload(option.target)"
              >
                <span class="option-label">
                  {{ option.label }}
                  <span class="option-badge" v-if="option.recommended">{{
                    t('download.options.recommended')
                  }}</span>
                </span>
                <span class="option-hint">{{ option.hint }}</span>
              </button>

              <!--
                An external store rather than a release asset, so it is a plain
                link and stays available even for releases that carry no Linux
                builds at all.
              -->
              <a
                v-if="platform === 'linux'"
                class="option"
                href="https://snapcraft.io/blinkblink"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="option-label">{{ t('download.options.snap') }}</span>
                <span class="option-hint">{{ t('download.options.snapHint') }}</span>
              </a>
            </div>
          </li>
        </div>
      </ul>

      <div class="version-info" v-if="latestVersion">
        <span
          >{{ t('download.versionInfo.latest') }}:
          <span class="version">{{ latestVersion }}</span></span
        >
        <span class="dot-separator">•</span>
        <span class="date">{{ t('download.versionInfo.releaseDate') }}: {{ releaseDate }}</span>
        <span class="dot-separator">•</span>
        <span class="downloads"
          >{{ totalDownloads.toLocaleString() }} {{ t('download.versionInfo.downloads') }}</span
        >
      </div>

      <!-- Add the donation popup -->
      <DonationPopup
        v-if="showDonationPopup"
        @close="showDonationPopup = false"
        @proceed="proceedWithDownload"
      />

      <!-- Move the TutorialOverlay inside download-wrapper -->
      <TutorialOverlay
        v-if="showTutorial"
        :platform="selectedPlatform"
        @close="showTutorial = false"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import '@/assets/styles/Download.css'
import TutorialOverlay from '@/components/TutorialOverlay.vue'
import DonationPopup from '@/components/DonationPopup.vue'

const { t } = useI18n()

interface GitHubAsset {
  name: string
  browser_download_url: string
  download_count?: number
}

interface GitHubRelease {
  tag_name: string
  published_at: string
  draft?: boolean
  prerelease?: boolean
  assets: GitHubAsset[]
}

type Arch = 'arm64' | 'x64'
type Platform = 'windows' | 'macos' | 'linux'

/** What a click should fetch, resolved against the release once it loads. */
interface DownloadTarget {
  platform: Platform
  extension: string
  arch: Arch
  /** Opened instead when the release carries no such asset. */
  fallbackHref?: string
}

interface DownloadOption {
  key: string
  label: string
  hint: string
  recommended?: boolean
  target: DownloadTarget
}

/**
 * The slice of the User-Agent Client Hints API used below. Not in TypeScript's
 * DOM lib, since it is not implemented outside Chromium.
 */
interface UserAgentData {
  getHighEntropyValues(hints: string[]): Promise<{ architecture?: string }>
}

const PLATFORMS: Platform[] = ['windows', 'macos', 'linux']

const SNAP_URL = 'https://snapcraft.io/blinkblink'

const LINUX_FORMATS = [
  { key: 'appimage', extension: '.AppImage' },
  { key: 'deb', extension: '.deb' },
  { key: 'rpm', extension: '.rpm' },
] as const

const latestRelease = ref<GitHubRelease | null>(null)
const latestVersion = ref('')
const releaseDate = ref('')
const totalDownloads = ref(0)
const isLoading = reactive<Record<Platform, boolean>>({
  windows: false,
  macos: false,
  linux: false,
})

/** Detected once at mount, and only ever used to mark a recommendation. */
const detectedArch = ref<Arch>('arm64')

const openPanel = ref<Platform | null>(null)

const showTutorial = ref(false)
const selectedPlatform = ref<'windows' | 'macos'>('windows')

// Replace the features array with a computed property
const computedFeatures = computed(() => [
  {
    icon: 'fa-solid fa-rocket',
    title: t('download.features.autoStart.title'),
    description: t('download.features.autoStart.description'),
  },
  {
    icon: 'fa-solid fa-stopwatch',
    title: t('download.features.smartScheduling.title'),
    description: t('download.features.smartScheduling.description'),
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: t('download.features.trackProgress.title'),
    description: t('download.features.trackProgress.description'),
  },
  {
    icon: 'fa-solid fa-eye',
    title: t('download.features.breakReminders.title'),
    description: t('download.features.breakReminders.description'),
  },
  {
    icon: 'fa-solid fa-user-md',
    title: t('download.features.rule.title'),
    description: t('download.features.rule.description'),
  },
  {
    icon: 'fa-solid fa-arrows-rotate',
    title: t('download.features.autoUpdates.title'),
    description: t('download.features.autoUpdates.description'),
  },
  {
    icon: 'fa-solid fa-shield',
    title: t('download.features.privacyFirst.title'),
    description: t('download.features.privacyFirst.description'),
  },
  {
    icon: 'fa-solid fa-desktop',
    title: t('download.features.multiScreen.title'),
    description: t('download.features.multiScreen.description'),
  },
  {
    icon: 'fa-solid fa-brush',
    title: t('download.features.cleanInterface.title'),
    description: t('download.features.cleanInterface.description'),
  },
  {
    icon: 'fa-solid fa-moon',
    title: t('download.features.themeSync.title'),
    description: t('download.features.themeSync.description'),
  },
])

/** Parses a `v1.2.3` tag into comparable parts, or null if unparseable. */
function parseVersion(value: string): [number, number, number] | null {
  const match = /^v?(\d+)\.(\d+)\.(\d+)/.exec(value.trim())
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null
}

/** True when `candidate` is a strictly higher version than `current`. */
function isNewerVersion(candidate: string, current: string): boolean {
  const a = parseVersion(candidate)
  const b = parseVersion(current)
  if (!a || !b) return false
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return true
    if (a[i] < b[i]) return false
  }
  return false
}

/**
 * Best-effort processor detection for macOS.
 *
 * `userAgentData` is Chromium-only, and Safari deliberately does not
 * distinguish Apple Silicon in its User-Agent, so the WebGL renderer string is
 * the practical fallback.
 *
 * This only decides which option is labelled as recommended. Nothing is chosen
 * on the visitor's behalf, so a wrong guess costs them nothing — which matters,
 * because an arm64 build on an Intel Mac does not launch at all.
 */
async function detectMacArch(): Promise<Arch> {
  const uaData = (navigator as unknown as { userAgentData?: UserAgentData }).userAgentData
  if (uaData?.getHighEntropyValues) {
    try {
      const { architecture } = await uaData.getHighEntropyValues(['architecture'])
      if (architecture === 'arm') return 'arm64'
      if (architecture === 'x86') return 'x64'
    } catch {
      /* fall through to the WebGL probe */
    }
  }

  try {
    const gl = document.createElement('canvas').getContext('webgl')
    const info = gl?.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl?.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    if (/Apple\s+M\d/i.test(renderer)) return 'arm64'
  } catch {
    /* fall through to the default */
  }

  // Every Mac sold since 2020 is Apple Silicon.
  return 'arm64'
}

/**
 * Picks the asset matching an architecture.
 *
 * A release may carry one universal macOS build or one per architecture; both
 * shapes have shipped. The unsuffixed fallback is what makes a universal build,
 * and every release published before 0.2.0, resolve correctly.
 */
function pickAsset(assets: GitHubAsset[], extension: string, arch: Arch): GitHubAsset | undefined {
  const candidates = assets.filter((a) => a.name.toLowerCase().endsWith(extension.toLowerCase()))
  return (
    candidates.find((a) => new RegExp(`[-_.]${arch}\\b`, 'i').test(a.name)) ??
    candidates.find((a) => !/[-_.](arm64|x64|x86_64|amd64|aarch64)\b/i.test(a.name)) ??
    candidates[0]
  )
}

/** True when the loaded release carries an asset of this type and architecture. */
function hasAsset(extension: string, arch?: Arch): boolean {
  const assets = latestRelease.value?.assets ?? []
  return assets.some(
    (a) =>
      a.name.toLowerCase().endsWith(extension.toLowerCase()) &&
      (!arch || new RegExp(`[-_.]${arch}\\b`, 'i').test(a.name)),
  )
}

/**
 * The options shown under a platform's button, derived from what the release
 * actually contains rather than from a fixed list — so the page can never offer
 * a download that does not exist, and picks up a new build shape on its own.
 */
function optionsFor(platform: Platform): DownloadOption[] {
  if (platform === 'windows') return []

  if (platform === 'macos') {
    // Per-architecture DMGs: name the chip, never the architecture string.
    if (hasAsset('.dmg', 'arm64') && hasAsset('.dmg', 'x64')) {
      return (['arm64', 'x64'] as Arch[]).map((arch) => ({
        key: arch,
        label: t(arch === 'arm64' ? 'download.options.appleSilicon' : 'download.options.intel'),
        hint: t(
          arch === 'arm64' ? 'download.options.appleSiliconHint' : 'download.options.intelHint',
        ),
        recommended: arch === detectedArch.value,
        target: { platform, extension: '.dmg', arch },
      }))
    }

    // One build for both chips, which is worth saying plainly rather than
    // leaving the visitor to wonder whether it runs on theirs.
    return hasAsset('.dmg')
      ? [
          {
            key: 'universal',
            label: t('download.options.universal'),
            hint: t('download.options.universalHint'),
            target: { platform, extension: '.dmg', arch: detectedArch.value },
          },
        ]
      : []
  }

  return LINUX_FORMATS.filter((format) => hasAsset(format.extension)).map((format) => ({
    key: format.key,
    label: t(`download.options.${format.key}`),
    hint: t(`download.options.${format.key}Hint`),
    target: { platform, extension: format.extension, arch: 'x64' as Arch },
  }))
}

/**
 * What the big button serves.
 *
 * Windows ships x64 only, deliberately: electron-updater's latest.yml has no
 * per-architecture entry, so publishing both would hand ARM64 installers to x64
 * machines on auto-update. Windows on ARM emulates x64.
 *
 * Linux falls back to the Snap Store, which is a real page even for the
 * releases that carry no Linux assets at all — everything before 0.2.0.
 */
function primaryTarget(platform: Platform): DownloadTarget {
  if (platform === 'windows') return { platform, extension: '.exe', arch: 'x64' }
  if (platform === 'macos') return { platform, extension: '.dmg', arch: detectedArch.value }
  return { platform, extension: '.AppImage', arch: 'x64', fallbackHref: SNAP_URL }
}

async function togglePanel(platform: Platform) {
  const opening = openPanel.value !== platform
  openPanel.value = opening ? platform : null
  if (!opening) return

  // The nav bar is fixed to the bottom of the viewport, so a panel opened near
  // it lands underneath and looks like nothing happened. `scroll-margin-bottom`
  // on the panel is what keeps this scroll clear of the bar.
  await nextTick()
  document
    .getElementById(`options-${platform}`)
    ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

async function getAllReleasesFromGitHub(): Promise<GitHubRelease[]> {
  const response = await fetch(
    'https://api.github.com/repos/frozen0601/BlinkBlink-Releases/releases?per_page=100',
  )
  if (!response.ok) {
    throw new Error('Failed to fetch releases')
  }
  return (await response.json()) as GitHubRelease[]
}

/**
 * The newest published release.
 *
 * Sorted by version rather than publication date, so that re-publishing an old
 * release cannot advertise it as current, and drafts and prereleases are
 * excluded outright.
 */
function pickLatestRelease(releases: GitHubRelease[]): GitHubRelease {
  const usable = releases
    .filter((r) => !r.draft && !r.prerelease && parseVersion(r.tag_name) !== null)
    .sort((a, b) => (isNewerVersion(a.tag_name, b.tag_name) ? -1 : 1))

  if (!usable.length) {
    throw new Error('No releases found')
  }
  return usable[0]
}

async function getLatestReleaseFromGitHub(): Promise<GitHubRelease> {
  return latestRelease.value ?? pickLatestRelease(await getAllReleasesFromGitHub())
}

onMounted(async () => {
  detectMacArch().then((arch) => {
    detectedArch.value = arch
  })

  try {
    const releases = await getAllReleasesFromGitHub()
    // Reuse the filtered, version-sorted path: reading releases[0] straight
    // from the API could advertise a prerelease, or an old release that was
    // re-published, as the current version.
    const newest = pickLatestRelease(releases)

    latestRelease.value = newest
    latestVersion.value = newest.tag_name
    releaseDate.value = new Date(newest.published_at).toLocaleDateString()

    // Calculate total downloads across all releases
    totalDownloads.value = releases.reduce(
      (sum, release) =>
        sum + release.assets.reduce((assetSum, asset) => assetSum + (asset.download_count || 0), 0),
      0,
    )
  } catch (error) {
    console.error('Failed to fetch release info:', error)
  }
})

const showDonationPopup = ref(false)
const pendingDownload = ref<DownloadTarget | null>(null)

/**
 * Every download goes through here, primary button and option alike, so the
 * donation prompt and the macOS install guide appear whichever one was clicked.
 * The install guide matters most to the visitors who went looking for a
 * specific build, which is exactly who the options are for.
 */
function requestDownload(target: DownloadTarget) {
  pendingDownload.value = target
  showDonationPopup.value = true
}

async function proceedWithDownload() {
  const target = pendingDownload.value
  if (!target) return

  const { platform } = target
  showDonationPopup.value = false
  isLoading[platform] = true

  try {
    const release = await getLatestReleaseFromGitHub()
    const asset = pickAsset(release.assets, target.extension, target.arch)

    if (!asset) {
      // A release without this build is a normal state, not a failure: the
      // Linux packages only exist from 0.2.0 onwards.
      if (target.fallbackHref) {
        window.open(target.fallbackHref, '_blank', 'noopener')
        return
      }
      throw new Error(`No ${platform} build in ${release.tag_name}`)
    }

    if (platform !== 'linux') {
      selectedPlatform.value = platform
      showTutorial.value = true
    }

    window.location.href = asset.browser_download_url
  } catch (error) {
    console.error('Download error:', error)
    alert(t('download.options.unavailable'))
  } finally {
    isLoading[platform] = false
    pendingDownload.value = null
  }
}
</script>
