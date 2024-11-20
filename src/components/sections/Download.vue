<template>
  <section id="download" class="section">
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
              :class="['button', 'icon', 'solid', 'fa-download', { loading: isLoading }]"
            >
              Download for Windows
            </a>
          </li>
          <li>
            <a
              @click="handleDownload('macos')"
              :class="['button', 'icon', 'solid', 'fa-download', { loading: isLoading }]"
            >
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
interface GitHubRelease {
  tag_name: string
  published_at: string
  assets: Array<{
    name: string
    browser_download_url: string
  }>
}

import { ref } from 'vue'

const isLoading = ref(false)

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
    isLoading.value = true
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
    isLoading.value = false
  }
}
</script>

<style scoped>
.section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  text-align: center;
  padding: 6rem 2rem;
}

.major {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 3rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
  list-style: none;
}

.button {
  background: white;
  color: var(--primary-color);
  padding: 1rem 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.button.primary {
  background: var(--accent-color);
  color: white;
}

.icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .button {
    justify-content: center;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.feature {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.feature i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature h3 {
  margin-bottom: 0.5rem;
}

.button.loading {
  opacity: 0.7;
  cursor: wait;
}

.button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
