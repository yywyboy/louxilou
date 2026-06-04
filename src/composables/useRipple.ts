import { gsap } from 'gsap'

export interface RippleOptions {
  color?: string
  duration?: number
}

export function initRipple(target: HTMLElement, options: RippleOptions = {}) {
  const { color = 'rgba(201, 169, 110, 0.25)', duration = 0.8 } = options

  function createCircle(x: number, y: number) {
    const rect = target.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2.5
    const circle = document.createElement('span')
    circle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      background: ${color};
      border-radius: 50%;
      transform: scale(0);
      pointer-events: none;
      z-index: 0;
    `
    return circle
  }

  function onEnter(e: MouseEvent) {
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    target.style.position = target.style.position || 'relative'
    target.style.overflow = 'hidden'

    const circle = createCircle(x, y)
    target.appendChild(circle)

    gsap.to(circle, {
      scale: 1,
      duration: duration * 0.6,
      ease: 'power2.out',
    })
  }

  function onLeave() {
    const circles = target.querySelectorAll('span[style*="border-radius: 50%"]')
    circles.forEach((circle) => {
      gsap.to(circle, {
        scale: 0,
        opacity: 0,
        duration: duration * 0.4,
        ease: 'power2.in',
        onComplete: () => circle.remove(),
      })
    })
  }

  target.addEventListener('mouseenter', onEnter)
  target.addEventListener('mouseleave', onLeave)

  return () => {
    target.removeEventListener('mouseenter', onEnter)
    target.removeEventListener('mouseleave', onLeave)
  }
}