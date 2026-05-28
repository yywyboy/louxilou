export interface RippleOptions {
  color?: string
  duration?: string
  scale?: number
}

export function createRipple(event: MouseEvent | Touch, options: RippleOptions = {}) {
  const { color = '#9F353A', duration = '0.5s', scale = 2.5 } = options
  let raw = (event.currentTarget || (event as Touch).target) as HTMLElement
  if (!raw) return
  const target = raw.closest('.btn-ripple') as HTMLElement || raw

  if (!target) return

  const existingRipples = target.querySelectorAll('.ripple-effect')
  existingRipples.forEach(r => r.remove())

  const rect = target.getBoundingClientRect()
  const clientX = 'clientX' in event ? event.clientX : (event as Touch).clientX
  const clientY = 'clientY' in event ? event.clientY : (event as Touch).clientY
  const x = clientX - rect.left
  const y = clientY - rect.top

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
  `

  ripple.appendChild(circle)
  target.appendChild(ripple)

  requestAnimationFrame(() => {
    circle.style.transform = 'scale(1)'
    circle.style.opacity = '1'
  })

  setTimeout(() => {
    circle.style.transform = 'scale(0)'
    circle.style.opacity = '0'
    setTimeout(() => {
      ripple.remove()
    }, parseFloat(duration) * 1000)
  }, parseFloat(duration) * 500)
}

export function handleRipple(event: MouseEvent | Touch, options?: RippleOptions) {
  createRipple(event, options)
}
