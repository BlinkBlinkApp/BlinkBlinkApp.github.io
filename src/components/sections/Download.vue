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
        One button per platform, and nothing underneath. A button used to start
        a download on the spot, silently picking a format — an AppImage for
        someone on Fedora who wanted the rpm — with the alternatives folded away
        in a disclosure most people never opened. The choice now happens inside
        the flow, where it is the first thing asked.
      -->
      <ul class="actions special">
        <div class="primary-downloads">
          <li v-for="platform in PLATFORMS" :key="platform" class="platform">
            <a
              @click="openFlow(platform)"
              :class="['button', 'icon', 'solid', 'fa-download', { loading: isLoading[platform] }]"
              :disabled="isLoading[platform]"
            >
              {{
                isLoading[platform]
                  ? t('download.downloadButton.preparing')
                  : t(`download.downloadButton.${platform}`)
              }}
            </a>
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

      <DownloadFlow
        v-if="flow.platform"
        :platform="flow.platform"
        :step="flow.step"
        :options="flow.options"
        :chosen="flow.chosen"
        :version="latestVersion"
        @close="closeFlow"
        @pick="choose"
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
import DownloadFlow, { type FlowOption, type FlowStep } from '@/components/DownloadFlow.vue'

const { t } = useI18n()

interface GitHubAsset {
  name: string
  browser_download_url: string
  download_count?: number
  /** Bytes. Shown in the flow so nobody is surprised by a 100 MB download. */
  size?: number
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

interface DownloadOption extends FlowOption {
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
 * What a platform offers, derived from the assets the release actually carries
 * rather than from a fixed list — so the flow can never offer a build that does
 * not exist, and picks up a new build shape on its own.
 *
 * Before the release has loaded the fixed list stands in. Nothing is lost by
 * it: `pickAsset` falls back to an unsuffixed asset, so a choice of "Apple
 * Silicon" against a universal release still resolves to the one DMG there is.
 */
function optionsFor(platform: Platform): DownloadOption[] {
  const loaded = latestRelease.value !== null

  if (platform === 'windows') {
    return [
      {
        key: 'exe',
        label: t('download.options.windowsInstaller'),
        hint: t('download.options.windowsNote'),
        ...describe('.exe', 'x64'),
        target: { platform, extension: '.exe', arch: 'x64' },
      },
    ]
  }

  if (platform === 'macos') {
    // Per-architecture DMGs: name the chip, never the architecture string.
    if (!loaded || (hasAsset('.dmg', 'arm64') && hasAsset('.dmg', 'x64'))) {
      return (['arm64', 'x64'] as Arch[]).map((arch) => ({
        key: arch,
        label: t(arch === 'arm64' ? 'download.options.appleSilicon' : 'download.options.intel'),
        hint: t(
          arch === 'arm64' ? 'download.options.appleSiliconHint' : 'download.options.intelHint',
        ),
        recommended: arch === detectedArch.value,
        ...describe('.dmg', arch),
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
            ...describe('.dmg', detectedArch.value),
            target: { platform, extension: '.dmg', arch: detectedArch.value },
          },
        ]
      : []
  }

  const packages: DownloadOption[] = LINUX_FORMATS.filter(
    (format) => !loaded || hasAsset(format.extension),
  ).map((format) => ({
    key: format.key,
    label: t(`download.options.${format.key}`),
    hint: t(`download.options.${format.key}Hint`),
    ...describe(format.extension, 'x64'),
    target: { platform, extension: format.extension, arch: 'x64' as Arch },
  }))

  // The Snap Store is a page rather than a release asset, so it is offered even
  // for the releases that carry no Linux builds at all.
  return [
    ...packages,
    {
      key: 'snap',
      label: t('download.options.snap'),
      hint: t('download.options.snapHint'),
      external: true,
      target: { platform, extension: '', arch: 'x64', fallbackHref: SNAP_URL },
    },
  ]
}

/** The filename and size an option resolves to, when the release is known. */
function describe(extension: string, arch: Arch): { fileName?: string; fileSize?: number } {
  const assets = latestRelease.value?.assets
  if (!assets) return {}
  const asset = pickAsset(assets, extension, arch)
  return asset ? { fileName: asset.name, fileSize: asset.size } : {}
}

/* The download flow ---------------------------------------------------- */

const flow = reactive<{
  platform: Platform | null
  step: FlowStep
  options: DownloadOption[]
  chosen: DownloadOption | null
}>({ platform: null, step: 'choose', options: [], chosen: null })

/**
 * Opens the flow on the step that has something to ask.
 *
 * A platform with one build has nothing to choose, and a dialog that asks a
 * question with a single answer is worse than no dialog at all — Windows starts
 * on the support step with the file it is about to fetch named in the header.
 */
function openFlow(platform: Platform) {
  const options = optionsFor(platform)
  flow.platform = platform
  flow.options = options
  flow.chosen = options.length === 1 ? options[0] : null
  flow.step = options.length === 1 ? 'support' : 'choose'
}

function closeFlow() {
  flow.platform = null
  flow.chosen = null
  flow.options = []
}

function choose(option: FlowOption) {
  const picked = flow.options.find((candidate) => candidate.key === option.key)
  if (!picked) return

  if (picked.external) {
    window.open(picked.target.fallbackHref ?? SNAP_URL, '_blank', 'noopener')
    closeFlow()
    return
  }

  flow.chosen = picked
  flow.step = 'support'
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

/**
 * Fetches the chosen build and, for Linux, shows how to install it.
 *
 * Windows and macOS hand over to the full install guide, which has screenshots
 * and a great deal more to say; the Linux packages need two lines and a command,
 * so they stay in the flow rather than opening a second overlay.
 */
async function proceedWithDownload() {
  const target = flow.chosen?.target
  const platform = flow.platform
  if (!target || !platform) return

  isLoading[platform] = true

  try {
    const release = await getLatestReleaseFromGitHub()
    const asset = pickAsset(release.assets, target.extension, target.arch)

    if (!asset) {
      // A release without this build is a normal state, not a failure: the
      // Linux packages only exist from 0.2.0 onwards.
      if (target.fallbackHref) {
        window.open(target.fallbackHref, '_blank', 'noopener')
        closeFlow()
        return
      }
      throw new Error(`No ${platform} build in ${release.tag_name}`)
    }

    // Name the file that is actually arriving, which for a stale first guess is
    // not always the one the option advertised.
    if (flow.chosen) {
      flow.chosen.fileName = asset.name
      flow.chosen.fileSize = asset.size
    }

    window.location.href = asset.browser_download_url

    if (platform === 'linux') {
      flow.step = 'guide'
    } else {
      selectedPlatform.value = platform
      showTutorial.value = true
      closeFlow()
    }
  } catch (error) {
    console.error('Download error:', error)
    alert(t('download.options.unavailable'))
    closeFlow()
  } finally {
    isLoading[platform] = false
  }
}
</script>
