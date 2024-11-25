import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export function useSectionObserver(sections: string[]) {
  const activeSection = ref('home')
  const router = useRouter()
  let observers: IntersectionObserver[] = []

  const updateSection = (section: string) => {
    if (activeSection.value === section) return
    activeSection.value = section
    router.replace({
      hash: section === 'home' ? '' : `#${section}`,
      replace: true,
    })
  }

  onMounted(() => {
    const observerOptions = {
      rootMargin: '-50% 0px',
      threshold: 0,
    }

    sections.forEach((section) => {
      const element = document.getElementById(section)
      if (!element) return

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateSection(section)
          }
        })
      }, observerOptions)

      observer.observe(element)
      observers.push(observer)
    })
  })

  onUnmounted(() => {
    observers.forEach((observer) => observer.disconnect())
  })

  return { activeSection }
}
