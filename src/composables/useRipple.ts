export interface RippleOptions {
  color?: string
  duration?: string
}

export function initRipple(target: HTMLElement, options: RippleOptions = {}) {
  const { color = '#9F353A', duration = '0.4s' } = options

  let rippleEl: HTMLSpanElement | null = null
  let circleEl: HTMLSpanElement | null = null

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
      opacity: 0.6;
      transition: transform ${duration} cubic-bezier(0.4, 0, 0.2, 1),
                  opacity ${duration} cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    `
    return circle
  }

  function getRipple(): HTMLSpanElement {
    if (rippleEl) return rippleEl
    const r = document.createElement('span')
    r.className = 'ripple-effect'
    r.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    `
    target.appendChild(r)
    rippleEl = r
    return r
  }

  function onEnter(e: MouseEvent) {
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (circleEl) {
      circleEl.remove()
    }

    const ripple = getRipple()
    const circle = createCircle(x, y)
    ripple.appendChild(circle)
    circleEl = circle

    requestAnimationFrame(() => {
      circle.style.transform = 'scale(1)'
      circle.style.opacity = '0.6'
    })
  }

  function onLeave(e: MouseEvent) {
    if (!circleEl) return
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const size = Math.max(rect.width, rect.height) * 2.5

    circleEl.style.left = `${x - size / 2}px`
    circleEl.style.top = `${y - size / 2}px`
    circleEl.style.transform = 'scale(0)'
    circleEl.style.opacity = '0'

    const old = circleEl
    circleEl = null
    setTimeout(() => {
      old.remove()
    }, parseFloat(duration) * 1000)
  }

  function onTap(e: Touch) {
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (circleEl) {
      circleEl.remove()
    }

    const ripple = getRipple()
    const circle = createCircle(x, y)
    ripple.appendChild(circle)
    circleEl = circle

    requestAnimationFrame(() => {
      circle.style.transform = 'scale(1)'
      circle.style.opacity = '0.6'
    })

    setTimeout(() => {
      circle.style.transform = 'scale(0)'
      circle.style.opacity = '0'
      const old = circleEl
      circleEl = null
      setTimeout(() => {
        old?.remove()
      }, parseFloat(duration) * 1000)
    }, parseFloat(duration) * 800)
  }

  target.addEventListener('mouseenter', onEnter)
  target.addEventListener('mouseleave', onLeave)
  target.addEventListener('touchstart', (e) => onTap(e.touches[0]), { passive: true })

  return () => {
    target.removeEventListener('mouseenter', onEnter)
    target.removeEventListener('mouseleave', onLeave)
    rippleEl?.remove()
  }
}
