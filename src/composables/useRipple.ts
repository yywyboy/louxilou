export interface RippleOptions {
  color?: string
  duration?: string
  scale?: number
}

let globalCircle: HTMLSpanElement | null = null
let globalRipple: HTMLSpanElement | null = null

export function createRipple(event: MouseEvent, options: RippleOptions = {}) {
  const { color = '#9F353A', duration = '0.5s', scale = 2.5 } = options
  const target = event.currentTarget as HTMLElement

  const existingRipples = target.querySelectorAll('.ripple-effect')
  existingRipples.forEach(r => r.remove())

  const modalBtn = document.querySelector('.modal-btn') as HTMLElement
  if (modalBtn && !target.classList.contains('modal-btn')) {
    const modalOverlay = document.querySelector('.modal-overlay')
    if (modalOverlay && window.getComputedStyle(modalOverlay).display !== 'none') {
      attachRippleToModalBtn(color, duration, scale)
      return
    }
  }

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
}

function attachRippleToModalBtn(color: string, duration: string, scale: number) {
  const modalBtn = document.querySelector('.modal-btn') as HTMLElement
  if (!modalBtn) return

  const existingRipples = modalBtn.querySelectorAll('.ripple-effect')
  existingRipples.forEach(r => r.remove())

  const rect = modalBtn.getBoundingClientRect()
  const x = rect.width / 2
  const y = rect.height / 2

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
  modalBtn.appendChild(ripple)

  requestAnimationFrame(() => {
    circle.style.transform = 'scale(1)'
    circle.style.opacity = '1'
  })

  const handleMouseLeave = () => {
    circle.style.transform = 'scale(0)'
    circle.style.opacity = '0'
    setTimeout(() => {
      ripple.remove()
    }, parseFloat(duration) * 1000)
  }

  modalBtn.addEventListener('mouseleave', handleMouseLeave, { once: true })
}

export function handleMouseEnter(e: MouseEvent, options?: RippleOptions) {
  createRipple(e, options)
}
