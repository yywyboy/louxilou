import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

gsap.registerPlugin(ScrollTrigger)

/* ─── Text Scramble ─── */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'

export function scrambleText(el: HTMLElement, finalText: string, options: { duration?: number; delay?: number } = {}) {
  const { duration = 1.2, delay = 0 } = options
  const chars = finalText.split('')
  const iterations = { value: 0 }
  const totalIterations = chars.length * 3

  gsap.to(iterations, {
    value: totalIterations,
    duration,
    delay,
    ease: 'power2.out',
    onUpdate: () => {
      const progress = iterations.value / totalIterations
      el.textContent = chars
        .map((ch, i) => {
          if (i / chars.length < progress) return ch
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join('')
    },
    onComplete: () => {
      el.textContent = finalText
    },
  })
}

/* ─── Magnetic Effect ─── */
export function initMagnetic(el: HTMLElement, options: { strength?: number; ease?: string } = {}) {
  const { strength = 0.3, ease = 'power3.out' } = options
  let bounds: DOMRect

  function onEnter() {
    bounds = el.getBoundingClientRect()
  }

  function onMove(e: MouseEvent) {
    const dx = e.clientX - bounds.left - bounds.width / 2
    const dy = e.clientY - bounds.top - bounds.height / 2
    gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.4, ease })
  }

  function onLeave() {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  el.addEventListener('mouseenter', onEnter)
  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)

  return () => {
    el.removeEventListener('mouseenter', onEnter)
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  }
}

/* ─── Scroll-based background color transition ─── */
export function initScrollColor(
  sections: Array<{ trigger: string; color: string }>,
  defaultColor: string = '#0a0a0a'
) {
  sections.forEach(({ trigger, color }) => {
    ScrollTrigger.create({
      trigger,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => gsap.to('body', { backgroundColor: color, duration: 0.8, ease: 'power2.inOut' }),
      onLeaveBack: () => gsap.to('body', { backgroundColor: defaultColor, duration: 0.8, ease: 'power2.inOut' }),
    })
  })
}

/* ─── useScrollReveal ─── */
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
      opacity: 1, y: 0, duration, delay, ease,
      scrollTrigger: { trigger: target, start: 'top 88%', toggleActions: 'play none none none' },
    })
    st = tween.scrollTrigger || null
  })

  onUnmounted(() => { if (st) st.kill() })
}

/* ─── useParallax ─── */
export function useParallax(el: Ref<HTMLElement | null>, speed: number = 0.3) {
  let st: ScrollTrigger | null = null

  onMounted(() => {
    const target = el.value
    if (!target) return

    const tween = gsap.to(target, {
      yPercent: speed * 100, ease: 'none',
      scrollTrigger: { trigger: target, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    st = tween.scrollTrigger || null
  })

  onUnmounted(() => { if (st) st.kill() })
}

/* ─── createRipple ─── */
export function createRipple(e: MouseEvent, el: HTMLElement, color: string = 'rgba(201, 169, 110, 0.3)') {
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2.5
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.style.cssText = `
    position: absolute; width: ${size}px; height: ${size}px;
    left: ${x}px; top: ${y}px;
    background: ${color}; border-radius: 50%;
    transform: scale(0); pointer-events: none; z-index: 0;
  `
  el.style.position = el.style.position || 'relative'
  el.style.overflow = 'hidden'
  el.appendChild(ripple)

  gsap.to(ripple, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() })
}

export { gsap, ScrollTrigger }