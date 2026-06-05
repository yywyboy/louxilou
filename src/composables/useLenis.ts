/* Lenis smooth scroll — global instance */

declare const Lenis: any

let lenis: any = null

export function initLenis() {
  if (typeof Lenis === 'undefined') return null

  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 1.5,
    infinite: false,
  })

  // Sync with GSAP ScrollTrigger
  lenis.on('scroll', (window as any).__lenisScrollCallback || (() => {}))

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  return lenis
}

export function getLenis() {
  return lenis
}

export function scrollTo(target: string | number, options?: any) {
  if (lenis) lenis.scrollTo(target, options)
}