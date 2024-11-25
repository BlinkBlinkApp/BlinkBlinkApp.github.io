
import { watch } from 'vue'
import type { Ref } from 'vue'

export function useNavScroll(activeSection: Ref<string>) {
  const scrollActiveNavItemIntoView = () => {
    const activeNavItem = document.querySelector(`.nav-content a.active`) as HTMLElement
    const navContent = document.querySelector('.nav-content') as HTMLElement

    if (!activeNavItem || !navContent) return

    const navRect = navContent.getBoundingClientRect()
    const activeRect = activeNavItem.getBoundingClientRect()

    const isFullyVisible =
      activeRect.left >= navRect.left &&
      activeRect.right <= navRect.right

    if (!isFullyVisible) {
      const scrollOffset =
        activeRect.left -
        navRect.left -
        (navRect.width - activeRect.width) / 2

      navContent.scrollTo({
        left: navContent.scrollLeft + scrollOffset,
        behavior: 'smooth'
      })
    }
  }

  watch(() => activeSection.value, scrollActiveNavItemIntoView, { flush: 'post' })

  return { scrollActiveNavItemIntoView }
}
