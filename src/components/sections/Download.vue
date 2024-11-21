<template>
  <section id="download" class="section download-section">
    <div class="container">
      <h2>Get Started with BlinkBlink</h2>
      <p class="subtitle">Available for all major platforms</p>

      <div class="features-ticker" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
        <div class="ticker-track" :style="{ animationPlayState: isPaused ? 'paused' : 'running' }">
          <!-- First set of features -->
          <div class="feature">
            <i class="fa-solid fa-rocket"></i>
            <h3>Auto Start</h3>
            <p>Launches automatically with your system</p>
          </div>
          <div class="feature">
            <i class="fa-solid fa-arrows-rotate"></i>
            <h3>Auto Update</h3>
            <p>Always get the latest features</p>
          </div>
          <div class="feature">
            <i class="fa-solid fa-shield"></i>
            <h3>Privacy First</h3>
            <p>Your data stays on your device</p>
          </div>
        </div>
      </div>

      <div class="download-stats">
        <div class="stat">
          <span class="number">{{ totalDownloads.toLocaleString() }}+</span>
          <span class="label">Total Downloads</span>
        </div>
      </div>

      <ul class="actions special">
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
        <li>
          <a class="button icon solid fa-download disabled"> Download for Linux (Coming Soon) </a>
        </li>
      </ul>
      <div class="version-info" v-if="latestVersion">
        Latest version: <span class="version">{{ latestVersion }}</span>
        <span class="dot-separator">•</span>
        <span class="date">{{ releaseDate }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import '@/assets/styles/Download.css'

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

const isPaused = ref(false)

const pauseScroll = () => {
  isPaused.value = true
}

const resumeScroll = () => {
  isPaused.value = false
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
  } catch (error) {
    console.error('Download error:', error)
    alert('Failed to get download link. Please try again later.')
  } finally {
    isLoading[platform] = false
  }
}
</script>
