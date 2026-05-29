<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { skipNextTransition } from './router'
import { initRipple } from './composables/useRipple'
import { getActiveAnnouncement } from './lib/blog'
import type { Announcement } from './lib/blog'

const route = useRoute()
const loadingRef = ref()
const isTransitioning = ref(false)

const cursorRef = ref<HTMLElement | null>(null)
let animationFrameId: number

const isMobileDevice = ref(false)
const announcement = ref<Announcement | null>(null)
const showAnnouncementModal = ref(false)

function checkMobile() {
  isMobileDevice.value = window.innerWidth <= 768
}

const vRipple = {
  mounted(el: HTMLElement) {
    initRipple(el)
  }
}

const navItems = [
  { path: '/', name: '主页', icon: 'home' },
  { path: '/library', name: '藏书阁', icon: 'library' },
  { path: '/gallery', name: '图片库', icon: 'gallery' }
]

const activeNavIndex = computed(() => {
  const idx = navItems.findIndex(item => {
    if (item.path === '/') return route.path === '/'
    return route.path.startsWith(item.path)
  })
  return idx >= 0 ? idx : 0
})

const sliderLeft = ref(0)
const sliderWidth = ref(0)
const navLinksRef = ref<HTMLElement | null>(null)
const hoverIndex = ref(-1)

function updateSliderPosition(index: number) {
  if (!navLinksRef.value) return
  const links = navLinksRef.value.querySelectorAll('.nav-link')
  const link = links[index] as HTMLElement
  if (!link) return
  sliderLeft.value = link.offsetLeft
  sliderWidth.value = link.offsetWidth
}

function onNavHover(index: number) {
  hoverIndex.value = index
  updateSliderPosition(index)
}

function onNavLeave() {
  hoverIndex.value = -1
  updateSliderPosition(activeNavIndex.value)
}

watch(() => route.path, () => {
  nextTick(() => updateSliderPosition(activeNavIndex.value))
}, { immediate: true })

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  if (loadingRef.value) {
    loadingRef.value.forceHide()
  }

  if (!isMobileDevice.value) {
    cursorRef.value = document.createElement('div')
    cursorRef.value.className = 'custom-cursor'
    document.body.appendChild(cursorRef.value)
    document.addEventListener('mousemove', handleMouseMove)
    animationFrameId = requestAnimationFrame(animate)
  }

  loadAnnouncement()

  nextTick(() => updateSliderPosition(activeNavIndex.value))
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('mousemove', handleMouseMove)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (cursorRef.value && cursorRef.value.parentNode) {
    cursorRef.value.parentNode.removeChild(cursorRef.value)
  }
})

async function loadAnnouncement() {
  try {
    announcement.value = await getActiveAnnouncement()
    if (isMobileDevice.value && announcement.value) {
      const hasShown = sessionStorage.getItem('announcement_shown')
      if (!hasShown) {
        setTimeout(() => {
          showAnnouncementModal.value = true
          sessionStorage.setItem('announcement_shown', 'true')
        }, 500)
      }
    }
  } catch (error) {
    console.error('Failed to load announcement:', error)
  }
}

function closeAnnouncementModal() {
  showAnnouncementModal.value = false
}

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

let lastHoveredButton: HTMLElement | null = null

function animate() {
  const buttons = document.querySelectorAll('.btn-ripple, .nav-link, .quick-link, .friend-link, .post-card, .rss-link, .rss-feed-item, .tab-btn, .category-btn, .control-btn')

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
</script>

<template>
  <div class="app-container">
    <nav class="top-nav">
      <div class="nav-content">
        <img src="/logo.png" alt="Logo" class="site-logo" />
        <div class="nav-links" ref="navLinksRef">
          <div
            class="nav-slider"
            :style="{ left: sliderLeft + 'px', width: sliderWidth + 'px' }"
          ></div>
          <RouterLink
            v-for="(item, index) in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :style="{ color: (hoverIndex === index || (hoverIndex === -1 && activeNavIndex === index)) ? 'white' : '#000' }"
            @mouseenter="onNavHover(index)"
            @mouseleave="onNavLeave"
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
          :name="isMobileDevice ? 'fade' : 'page'"
          @before-leave="handleBeforeLeave"
          @after-enter="handleAfterEnter"
        >
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAnnouncementModal" class="announcement-overlay" @click="closeAnnouncementModal">
          <div class="announcement-modal" @click.stop>
            <button class="announcement-close" @click="closeAnnouncementModal">×</button>
            <h3 class="announcement-title">网站公告</h3>
            <p class="announcement-body">
              {{ announcement?.content || '欢迎访问我的博客！' }}
            </p>
            <button class="announcement-btn" v-ripple @click="closeAnnouncementModal">知道了</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style>
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
  position: relative;
  border: 3px solid #000;
}

.nav-slider {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #9F353A;
  z-index: 0;
  transition: left 0.35s cubic-bezier(0.32, 0.72, 0, 1),
              width 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  pointer-events: none;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 0;
  border: none;
  text-decoration: none;
  color: #000;
  font-weight: 500;
  overflow: hidden;
  background: transparent;
  transition: color 0.3s ease;
  z-index: 1;
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
  z-index: 1;
  transition: border-color 0.3s ease;
}

.btn-ripple > *:not(.ripple-effect) {
  position: relative;
  z-index: 1;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.announcement-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.announcement-modal {
  background: #fff;
  border: 3px solid #000;
  padding: 1.5rem;
  max-width: 320px;
  width: 100%;
  position: relative;
}

.announcement-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #000;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.announcement-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #000;
}

.announcement-body {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 1.25rem 0;
  color: #333;
}

.announcement-btn {
  width: 100%;
  padding: 0.6rem;
  background: #9F353A;
  color: white;
  border: 2px solid #000;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.announcement-btn:hover {
  color: white;
}

@media (max-width: 768px) {
  .top-nav {
    height: 50px;
  }

  .nav-content {
    padding: 0 1rem;
  }

  .site-logo {
    height: 48px;
  }

  .nav-links {
    gap: 0;
  }

  .nav-link {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
  }

  .nav-text {
    display: none;
  }

  .nav-icon {
    width: 18px;
    height: 18px;
  }

  .main-content {
    padding-top: 56px;
  }
}
</style>
