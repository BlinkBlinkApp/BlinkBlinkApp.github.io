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
              href="https://snapcraft.io/blinkblink"
              target="_blank"
              rel="noopener noreferrer"
              class="button icon solid fa-download"
            >
              {{ t('download.downloadButton.linux') }}
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

interface GitHubRelease {
  tag_name: string
  published_at: string
  assets: Array<{
    name: string
    browser_download_url: string
    download_count?: number
  }>
}

const latestVersion = ref('')
const releaseDate = ref('')
const totalDownloads = ref(0)
const isLoading = reactive({
  windows: false,
  macos: false,
})

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

async function getAllReleasesFromGitHub(): Promise<GitHubRelease[]> {
  const response = await fetch(
    'https://api.github.com/repos/frozen0601/BlinkBlink-Releases/releases?per_page=100',
  )
  if (!response.ok) {
    throw new Error('Failed to fetch releases')
  }
  return (await response.json()) as GitHubRelease[]
}

async function getLatestReleaseFromGitHub(): Promise<GitHubRelease> {
  const releases = await getAllReleasesFromGitHub()
  if (!releases.length) {
    throw new Error('No releases found')
  }
  releases.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  return releases[0]
}

onMounted(async () => {
  try {
    const releases = await getAllReleasesFromGitHub()
    const latestRelease = releases[0]

    // Set latest version info
    latestVersion.value = latestRelease.tag_name
    releaseDate.value = new Date(latestRelease.published_at).toLocaleDateString()

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
const pendingDownload = ref<'windows' | 'macos' | null>(null)

async function handleDownload(platform: 'windows' | 'macos') {
  pendingDownload.value = platform
  showDonationPopup.value = true
}

async function proceedWithDownload() {
  if (!pendingDownload.value) return

  const platform = pendingDownload.value
  showDonationPopup.value = false
  isLoading[platform] = true

  try {
    const release = await getLatestReleaseFromGitHub()
    const assetExtension = platform === 'windows' ? '.exe' : '.dmg'
    const asset = release.assets.find((a) => a.name.endsWith(assetExtension))

    if (!asset) {
      throw new Error(`No ${platform} version available`)
    }

    selectedPlatform.value = platform
    showTutorial.value = true

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
