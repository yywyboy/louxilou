import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal(
  el: Ref<HTMLElement | null> | HTMLElement | null,
  options: { y?: number; duration?: number; delay?: number; ease?: string } = {}
) {
  const { y = 40, duration = 1, delay = 0, ease = 'power3.out' } = options
  let st: ScrollTrigger | null = null

  onMounted(() => {
    const target = el instanceof HTMLElement ? el : el?.value
    if (!target) return

    gsap.set(target, { opacity: 0, y })
    const tween = gsap.to(target, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: target,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })
    st = tween.scrollTrigger || null
  })

  onUnmounted(() => { if (st) st.kill() })
}

export function useStaggerReveal(
  container: Ref<HTMLElement | null>,
  childSelector: string,
  options: { y?: number; duration?: number; stagger?: number; ease?: string } = {}
) {
  const { y = 30, duration = 0.8, stagger = 0.1, ease = 'power3.out' } = options
  let st: ScrollTrigger | null = null

  onMounted(() => {
    const wrap = container.value
    if (!wrap) return

    const children = wrap.querySelectorAll(childSelector)
    if (!children.length) return

    gsap.set(children, { opacity: 0, y })
    const tween = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: wrap,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })
    st = tween.scrollTrigger || null
  })

  onUnmounted(() => { if (st) st.kill() })
}

export function useParallax(el: Ref<HTMLElement | null>, speed: number = 0.3) {
  let st: ScrollTrigger | null = null

  onMounted(() => {
    const target = el.value
    if (!target) return

    const tween = gsap.to(target, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    st = tween.scrollTrigger || null
  })

  onUnmounted(() => { if (st) st.kill() })
}

export function createRipple(e: MouseEvent, el: HTMLElement, color: string = 'rgba(201, 169, 110, 0.3)') {
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2.5
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: ${color};
    border-radius: 50%;
    transform: scale(0);
    pointer-events: none;
    z-index: 0;
  `

  el.style.position = el.style.position || 'relative'
  el.style.overflow = 'hidden'
  el.appendChild(ripple)

  gsap.to(ripple, {
    scale: 1,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => ripple.remove(),
  })
}

export { gsap, ScrollTrigger }