<template>
  <section id="download" class="download-section">
    <div class="download-wrapper">
      <h2>Download & Get Started!</h2>

      <div class="features-ticker">
        <div class="ticker-content" style="running">
          <div class="feature" v-for="(feature, index) in [...features, ...features]" :key="index">
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
              {{ isLoading.windows ? 'Preparing Download...' : 'Download for Windows' }}
            </a>
          </li>
          <li>
            <a
              @click="handleDownload('macos')"
              :class="['button', 'icon', 'solid', 'fa-download', { loading: isLoading.macos }]"
              :disabled="isLoading.macos"
            >
              {{ isLoading.macos ? 'Preparing Download...' : 'Download for macOS' }}
            </a>
          </li>
        </div>
      </ul>

      <!-- Add tutorial overlay -->
      <TutorialOverlay
        v-if="showTutorial"
        :platform="selectedPlatform"
        @close="showTutorial = false"
      />

      <span class="coming-soon-label">Linux Coming Soon</span>
      <div class="version-info" v-if="latestVersion">
        <span
          >Latest Version: <span class="version">{{ latestVersion }}</span></span
        >
        <span class="dot-separator">•</span>
        <span class="date">Release Date: {{ releaseDate }}</span>
        <span class="dot-separator">•</span>
        <span class="downloads">{{ totalDownloads.toLocaleString() }} Downloads</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import '@/assets/styles/Download.css'
import TutorialOverlay from '@/components/TutorialOverlay.vue'

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

const features = [
  { icon: 'fa-solid fa-rocket', title: 'Auto Start', description: 'Launches with your system' },
  {
    icon: 'fa-solid fa-stopwatch',
    title: 'Smart Scheduling',
    description: 'Custom timers and breaks',
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: 'Track Progress',
    description: 'Insights to improve habits',
  },
  {
    icon: 'fa-solid fa-eye',
    title: 'Break Reminders',
    description: 'Reduce eye strain with prompts',
  },
  {
    icon: 'fa-solid fa-user-md',
    title: '20·20·20 Rule',
    description: 'Encourages healthy eye habits',
  },
  {
    icon: 'fa-solid fa-arrows-rotate',
    title: 'Auto Updates',
    description: 'Stay up-to-date effortlessly',
  },
  { icon: 'fa-solid fa-shield', title: 'Privacy First', description: 'Data stays on your device' },
  {
    icon: 'fa-solid fa-desktop',
    title: 'Multi-Screen Support',
    description: 'Works across all screens',
  },
  {
    icon: 'fa-solid fa-brush',
    title: 'Clean Interface',
    description: 'Simple and beautiful design',
  },
  {
    icon: 'fa-solid fa-moon',
    title: 'System Theme Sync',
    description: 'Matches light or dark mode',
  },
]

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

async function handleDownload(platform: 'windows' | 'macos') {
  isLoading[platform] = true
  try {
    const release = await getLatestReleaseFromGitHub()
    const assetExtension = platform === 'windows' ? '.exe' : '.dmg'
    const asset = release.assets.find((a) => a.name.endsWith(assetExtension))

    if (!asset) {
      throw new Error(`No ${platform} version available`)
    }

    window.location.href = asset.browser_download_url
    selectedPlatform.value = platform
    showTutorial.value = true
  } catch (error) {
    console.error('Download error:', error)
    alert('Failed to get download link. Please try again later.')
  } finally {
    isLoading[platform] = false
  }
}
</script>
