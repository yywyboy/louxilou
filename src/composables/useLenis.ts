import { onMounted, onUnmounted } from 'vue'

declare global {
  interface Window {
    Lenis: any
  }
}

export function useLenis() {
  let lenis: any = null

  onMounted(() => {
    if (!window.Lenis) return

    lenis = new window.Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  })

  onUnmounted(() => {
    lenis?.destroy()
  })

  return {
    getLenis: () => lenis
  }
}
