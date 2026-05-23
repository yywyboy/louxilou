export interface RippleOptions {
  color?: string
  duration?: string
  scale?: number
}

export function createRipple(event: MouseEvent, options: RippleOptions = {}) {
  const { color = '#9F353A', duration = '0.5s', scale = 2.5 } = options
  const target = event.currentTarget as HTMLElement

  const existingRipples = target.querySelectorAll('.ripple-effect')
  existingRipples.forEach(r => r.remove())

  const rect = target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const ripple = document.createElement('span')
  ripple.className = 'ripple-effect'
  ripple.style.cssText = `
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  `

  const circle = document.createElement('span')
  const size = Math.max(rect.width, rect.height) * scale
  circle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    background: ${color};
    border-radius: 50%;
    transform: scale(0);
    opacity: 1;
    transition: transform ${duration} cubic-bezier(0.4, 0, 0.2, 1),
                opacity ${duration} cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
  `

  ripple.appendChild(circle)
  target.appendChild(ripple)

  requestAnimationFrame(() => {
    circle.style.transform = 'scale(1)'
    circle.style.opacity = '1'
  })

  const handleMouseLeave = (e: MouseEvent) => {
    const leaveX = e.clientX - rect.left
    const leaveY = e.clientY - rect.top

    circle.style.left = `${leaveX - size / 2}px`
    circle.style.top = `${leaveY - size / 2}px`
    circle.style.transform = 'scale(1)'
    circle.style.opacity = '1'
    circle.style.transition = `left ${duration} cubic-bezier(0.4, 0, 0.2, 1), top ${duration} cubic-bezier(0.4, 0, 0.2, 1), transform ${duration} cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration} cubic-bezier(0.4, 0, 0.2, 1)`

    requestAnimationFrame(() => {
      circle.style.transform = 'scale(0)'
      circle.style.opacity = '0'
    })

    setTimeout(() => {
      ripple.remove()
    }, parseFloat(duration) * 1000)
  }

  target.addEventListener('mouseleave', handleMouseLeave, { once: true })

  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.remove()
    }
  }, 5000)
}

export function handleMouseEnter(e: MouseEvent, options?: RippleOptions) {
  createRipple(e, options)
}
