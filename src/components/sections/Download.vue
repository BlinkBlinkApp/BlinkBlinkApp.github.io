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

      <ul class="actions special">
        <div class="primary-downloads">
          <li>
            <a
              @click="handleDownload('windows')"
              :class="['button', 'icon', 'solid', 'fa-download', { loading: isLoading.windows }]"
              :disabled="isLoading.windows"
            >
              {{
                isLoading.windows
                  ? t('download.downloadButton.preparing')
                  : t('download.downloadButton.windows')
              }}
            </a>
          </li>
          <li>
            <a
              @click="handleDownload('macos')"
              :class="['button', 'icon', 'solid', 'fa-download', { loading: isLoading.macos }]"
              :disabled="isLoading.macos"
            >
              {{
                isLoading.macos
                  ? t('download.downloadButton.preparing')
                  : t('download.downloadButton.macos')
              }}
            </a>
          </li>
          <li>
            <a
              @click="handleDownload('linux')"
              :class="['button', 'icon', 'solid', 'fa-download', { loading: isLoading.linux }]"
              :disabled="isLoading.linux"
            >
              {{
                isLoading.linux
                  ? t('download.downloadButton.preparing')
                  : t('download.downloadButton.linux')
              }}
            </a>
          </li>
        </div>
      </ul>

      <!--
        Releases carry deb and rpm alongside the AppImage the button serves.
        Fedora in particular cannot use a snap without setting one up first.
      -->
      <p class="linux-formats">
        {{ t('download.linuxFormats.label') }}
        <a
          v-for="format in LINUX_FORMATS"
          :key="format.key"
          @click="downloadLinuxFormat(format.extension)"
        >
          {{ format.label }}
        </a>
        <a href="https://snapcraft.io/blinkblink" target="_blank" rel="noopener noreferrer">
          {{ t('download.linuxFormats.snap') }}
        </a>
      </p>
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

      <!--
        Processor detection is a heuristic, so say which build was served and
        always leave a way to the other one.
      -->
      <p class="arch-note" v-if="downloadedArch">
        {{
          t('download.archNote.served', {
            arch:
              downloadedArch === 'arm64'
                ? t('download.archNote.appleSilicon')
                : t('download.archNote.intel'),
          })
        }}
        <a
          href="https://github.com/frozen0601/BlinkBlink-Releases/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('download.archNote.other') }}
        </a>
      </p>

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
import { ref, reactive, onMounted, computed } from 'vue'
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

/**
 * The slice of the User-Agent Client Hints API used below. Not in TypeScript's
 * DOM lib, since it is not implemented outside Chromium.
 */
interface UserAgentData {
  getHighEntropyValues(hints: string[]): Promise<{ architecture?: string }>
}

/** Linux formats offered alongside the primary AppImage download. */
const LINUX_FORMATS = [
  { key: 'deb', extension: '.deb', label: '.deb' },
  { key: 'rpm', extension: '.rpm', label: '.rpm' },
] as const

const latestVersion = ref('')
const releaseDate = ref('')
const totalDownloads = ref(0)
const isLoading = reactive({
  windows: false,
  macos: false,
  linux: false,
})

/** Which macOS build the last download served, so the other can be offered. */
const downloadedArch = ref<Arch | null>(null)

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
 * Picks the asset matching this machine's architecture.
 *
 * Releases carry both an Intel and an Apple Silicon macOS build, and an arm64
 * build will not launch at all on an Intel Mac — so matching matters more than
 * simply finding a file of the right type.
 */
function pickAsset(assets: GitHubAsset[], extension: string, arch: Arch): GitHubAsset | undefined {
  const candidates = assets.filter((a) => a.name.toLowerCase().endsWith(extension.toLowerCase()))
  return (
    candidates.find((a) => new RegExp(`[-_.]${arch}\\b`, 'i').test(a.name)) ??
    // A release published before architectures appeared in the filenames.
    candidates.find((a) => !/[-_.](arm64|x64|x86_64|amd64|aarch64)\b/i.test(a.name)) ??
    candidates[0]
  )
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
async function getLatestReleaseFromGitHub(): Promise<GitHubRelease> {
  const usable = (await getAllReleasesFromGitHub())
    .filter((r) => !r.draft && !r.prerelease && parseVersion(r.tag_name) !== null)
    .sort((a, b) => (isNewerVersion(a.tag_name, b.tag_name) ? -1 : 1))

  if (!usable.length) {
    throw new Error('No releases found')
  }
  return usable[0]
}

onMounted(async () => {
  try {
    const releases = await getAllReleasesFromGitHub()
    // Reuse the filtered, version-sorted path: reading releases[0] straight
    // from the API could advertise a prerelease, or an old release that was
    // re-published, as the current version.
    const newest = await getLatestReleaseFromGitHub()

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
const pendingDownload = ref<Platform | null>(null)

async function handleDownload(platform: Platform) {
  pendingDownload.value = platform
  showDonationPopup.value = true
}

/** Opens a specific Linux package format directly, bypassing the popup. */
async function downloadLinuxFormat(extension: string) {
  try {
    const release = await getLatestReleaseFromGitHub()
    const asset = pickAsset(release.assets, extension, 'x64')
    if (!asset) throw new Error(`No ${extension} build available`)
    window.location.href = asset.browser_download_url
  } catch (error) {
    console.error('Download error:', error)
    alert('Failed to get download link. Please try again later.')
  }
}

async function proceedWithDownload() {
  if (!pendingDownload.value) return

  const platform = pendingDownload.value
  showDonationPopup.value = false
  isLoading[platform] = true

  try {
    const release = await getLatestReleaseFromGitHub()

    // Windows ships x64 only, deliberately: electron-updater's latest.yml has
    // no per-architecture entry, so publishing both would hand ARM64
    // installers to x64 machines on auto-update. Windows on ARM emulates x64.
    const extension = platform === 'windows' ? '.exe' : platform === 'linux' ? '.AppImage' : '.dmg'
    const arch: Arch = platform === 'macos' ? await detectMacArch() : 'x64'
    const asset = pickAsset(release.assets, extension, arch)

    if (!asset) {
      throw new Error(`No ${platform} version available`)
    }

    // Detection is a heuristic, so record what was served and offer the other.
    downloadedArch.value = platform === 'macos' ? arch : null

    if (platform !== 'linux') {
      selectedPlatform.value = platform
      showTutorial.value = true
    }

    window.location.href = asset.browser_download_url
  } catch (error) {
    console.error('Download error:', error)
    alert('Failed to get download link. Please try again later.')
  } finally {
    isLoading[platform] = false
    pendingDownload.value = null
  }
}
</script>
