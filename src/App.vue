<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { skipNextTransition } from './router'

const loadingRef = ref()
const isTransitioning = ref(false)

const cursorRef = ref<HTMLElement | null>(null)
let animationFrameId: number

onMounted(() => {
  if (loadingRef.value) {
    loadingRef.value.forceHide()
  }

  cursorRef.value = document.createElement('div')
  cursorRef.value.className = 'custom-cursor'
  document.body.appendChild(cursorRef.value)

  document.addEventListener('mousemove', handleMouseMove)

  animationFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (cursorRef.value && cursorRef.value.parentNode) {
    cursorRef.value.parentNode.removeChild(cursorRef.value)
  }
})

let mouseX = 0
let mouseY = 0
let circleX = 0
let circleY = 0
let isAttached = false
let attachedButton: HTMLElement | null = null

function handleMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

interface RippleOptions {
  color?: string
  duration?: string
  scale?: number
}

function createRipple(event: MouseEvent, options: RippleOptions = {}) {
  const { color = '#9F353A', duration = '0.5s', scale = 2.5 } = options
  const target = event.currentTarget as HTMLElement

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

let lastHoveredButton: HTMLElement | null = null

function animate() {
  const buttons = document.querySelectorAll('.btn-ripple, .nav-link, .quick-link, .post-card')

  let nearestButton: HTMLElement | null = null
  let minDistance = Infinity

  buttons.forEach(btn => {
    const rect = btn.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    )

    if (distance < minDistance && distance < 100) {
      minDistance = distance
      nearestButton = btn as HTMLElement
    }
  })

  if (nearestButton && minDistance < 100) {
    const rect = nearestButton.getBoundingClientRect()
    const attachX = rect.left + rect.width / 2
    const attachY = rect.top + rect.height / 2

    if (!isAttached) {
      isAttached = true
      attachedButton = nearestButton
    }

    const distToButton = Math.sqrt(
      Math.pow(circleX - attachX, 2) + Math.pow(circleY - attachY, 2)
    )

    if (distToButton < 5 && lastHoveredButton !== nearestButton) {
      if (lastHoveredButton) {
        lastHoveredButton.style.borderColor = '#000'
      }
      nearestButton.style.borderColor = '#9F353A'
      lastHoveredButton = nearestButton
    }

    circleX += (attachX - circleX) * 0.05
    circleY += (attachY - circleY) * 0.05

    if (cursorRef.value) {
      cursorRef.value.style.left = `${circleX - 7.5}px`
      cursorRef.value.style.top = `${circleY - 7.5}px`
      cursorRef.value.style.opacity = distToButton < 5 ? '0' : '1'
    }
  } else {
    if (isAttached && attachedButton) {
      const rect = attachedButton.getBoundingClientRect()
      const startX = rect.left + rect.width / 2
      const startY = rect.top + rect.height / 2
      circleX = startX
      circleY = startY
    }

    if (lastHoveredButton) {
      lastHoveredButton.style.borderColor = '#000'
      lastHoveredButton = null
    }

    isAttached = false
    attachedButton = null

    circleX += (mouseX - circleX) * 0.05
    circleY += (mouseY - circleY) * 0.05

    if (cursorRef.value) {
      cursorRef.value.style.left = `${circleX - 7.5}px`
      cursorRef.value.style.top = `${circleY - 7.5}px`
      cursorRef.value.style.opacity = '1'
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

const handleBeforeLeave = () => {
  if (skipNextTransition) {
    return
  }

  isTransitioning.value = true
  if (loadingRef.value) {
    loadingRef.value.show()
  }
  document.dispatchEvent(new Event('pageleave'))
}

const handleAfterEnter = () => {
  isTransitioning.value = false
  document.dispatchEvent(new Event('pageenter'))

  if (loadingRef.value) {
    loadingRef.value.forceHide()
  }
}

const navItems = [
  { path: '/', name: '主页', icon: 'home' },
  { path: '/library', name: '藏书阁', icon: 'library' },
  { path: '/gallery', name: '图片库', icon: 'gallery' }
]
</script>

<template>
  <div class="app-container">
    <nav class="top-nav">
      <div class="nav-content">
        <img src="/logo.png" alt="Logo" class="site-logo" />
        <div class="nav-links">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link btn-ripple"
            :class="{ active: $route.path === item.path }"
            @mouseenter="(e) => createRipple(e, { color: '#9F353A', duration: '0.5s', scale: 2.5 })"
          >
            <svg viewBox="0 0 24 24" v-if="item.icon === 'home'" class="nav-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <svg viewBox="0 0 24 24" v-else-if="item.icon === 'library'" class="nav-icon">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <svg viewBox="0 0 24 24" v-else-if="item.icon === 'gallery'" class="nav-icon">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span class="nav-text">{{ item.name }}</span>
          </RouterLink>
        </div>
      </div>
    </nav>
    <LoadingSpinner ref="loadingRef" />
    <div class="main-content">
      <RouterView v-slot="{ Component, route }">
        <Transition
          name="page"
          @before-leave="handleBeforeLeave"
          @after-enter="handleAfterEnter"
        >
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style>
:root {
  --color-bg: #BDC0BA;
  --color-accent: #9F353A;
  --color-text: #333;
  --color-text-secondary: #666;
}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--color-bg);
  margin: 0;
  padding: 0;
}

.custom-cursor {
  position: fixed;
  width: 15px;
  height: 15px;
  background: #9F353A;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: opacity 0.3s ease;
}

.app-container {
  min-height: 100vh;
  position: relative;
  background-color: var(--color-bg);
}

.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  border-bottom: 3px solid #000;
  height: 60px;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-logo {
  height: 58px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.nav-links {
  display: flex;
  gap: 0;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 0;
  border: 3px solid #000;
  border-left: none;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  overflow: hidden;
  background: #fff;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.nav-link:hover {
  color: white;
}

.nav-link:first-child {
  border-left: 3px solid #000;
}

.nav-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.nav-text {
  position: relative;
  z-index: 2;
}

.main-content {
  padding-top: 70px;
  background-color: var(--color-bg);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.35s cubic-bezier(0.32, 0.72, 0, 1),
              transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.btn-ripple {
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.ripple-effect {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.ripple-effect span {
  position: absolute;
  z-index: 0;
}
</style>
