<template>
  <section id="download" class="download-section">
    <div class="container">
      <header class="major">
        <h2>Get Started with BlinkBlink</h2>
        <p class="subtitle">Available for all major platforms</p>
      </header>

      <div class="features-grid">
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

      <footer class="major">
        <ul class="actions special">
          <li>
            <a
              @click="handleDownload('windows')"
              :class="['button', 'icon', 'solid', 'fa-download']"
            >
              Download for Windows
            </a>
          </li>
          <li>
            <a @click="handleDownload('macos')" :class="['button', 'icon', 'solid', 'fa-download']">
              Download for macOS
            </a>
          </li>
          <li>
            <a class="button icon solid fa-download disabled"> Download for Linux (Coming Soon) </a>
          </li>
        </ul>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import '@/assets/styles/Download.css'

interface GitHubRelease {
  tag_name: string
  published_at: string
  assets: Array<{
    name: string
    browser_download_url: string
  }>
}

async function getLatestReleaseFromGitHub(): Promise<GitHubRelease> {
  const response = await fetch(
    'https://api.github.com/repos/frozen0601/BlinkBlink-Releases/releases',
  )
  if (!response.ok) {
    throw new Error('Failed to fetch releases')
  }
  const releases = (await response.json()) as GitHubRelease[]
  if (!releases.length) {
    throw new Error('No releases found')
  }
  releases.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  return releases[0]
}

async function handleDownload(platform: 'windows' | 'macos') {
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
  }
}
</script>
