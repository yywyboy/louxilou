<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMenuOpen = ref(false)
const containerRef = ref<HTMLElement>()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.dispatchEvent(new Event('glassmenuopen'))
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleSearchOpen = () => {
  if (isMenuOpen.value) {
    closeMenu()
  }
}

const menuItems = [
  { path: '/', name: '主页', icon: 'home' },
  { path: '/library', name: '藏书阁', icon: 'library' }
]

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.glass-menu') && isMenuOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('searchopen', handleSearchOpen)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('searchopen', handleSearchOpen)
})
</script>

<template>
  <div class="glass-menu">
    <div
      ref="containerRef"
      class="glass-container"
      :class="{ expanded: isMenuOpen }"
    >
      <div class="glass-content">
        <Transition name="fade">
          <div v-if="isMenuOpen" class="menu-inner">
            <div class="menu-card-header">楼西楼louxilou</div>
            
            <div class="menu-section">
              <RouterLink
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                class="nav-item"
                @click="closeMenu"
              >
                <svg viewBox="0 0 24 24" v-if="item.icon === 'home'">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <svg viewBox="0 0 24 24" v-else-if="item.icon === 'library'">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <span>{{ item.name }}</span>
              </RouterLink>
            </div>
          </div>
        </Transition>
      </div>

      <div class="glass-controls">
        <div class="right-controls">
          <div class="menu-trigger" :class="{ active: isMenuOpen }" @click.stop="toggleMenu">
            <div class="menu-icon">
              <span class="menu-bar"></span>
              <span class="menu-bar"></span>
              <span class="menu-bar"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-menu {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 1000;
}

.glass-container {
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: width 0.55s cubic-bezier(0.32, 0.72, 0, 1),
              transform 0.55s cubic-bezier(0.32, 0.72, 0, 1),
              opacity 0.55s cubic-bezier(0.32, 0.72, 0, 1),
              box-shadow 0.55s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
  width: 60px;
  height: auto;
  margin-left: auto;
}

.glass-container.expanded {
  width: 260px;
  transition: width 0.65s cubic-bezier(0.23, 1, 0.32, 1),
              transform 0.65s cubic-bezier(0.23, 1, 0.32, 1),
              opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 0.65s cubic-bezier(0.23, 1, 0.32, 1);
}

.glass-content {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transform: translateY(-15px) scale(0.92);
  transform-origin: bottom center;
  transition: max-height 0.45s cubic-bezier(0.55, 0, 1, 0.45),
              opacity 0.35s cubic-bezier(0.55, 0, 1, 0.45),
              transform 0.45s cubic-bezier(0.55, 0, 1, 0.45),
              padding 0.45s cubic-bezier(0.55, 0, 1, 0.45);
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.glass-container.expanded .glass-content {
  max-height: 650px;
  opacity: 1;
  padding: 24px 20px 0;
  transform: translateY(0) scale(1);
  transition: max-height 0.65s cubic-bezier(0.23, 1, 0.32, 1),
              opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1),
              transform 0.65s cubic-bezier(0.23, 1, 0.32, 1),
              padding 0.65s cubic-bezier(0.23, 1, 0.32, 1);
  transition-delay: 0.08s;
  width: 100%;
  box-sizing: border-box;
}

.glass-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  transition: all 0.55s cubic-bezier(0.32, 0.72, 0, 1);
  justify-content: flex-end;
  width: 100%;
  box-sizing: border-box;
}

.glass-container.expanded .glass-controls {
  padding: 12px 16px;
  transition: all 0.65s cubic-bezier(0.23, 1, 0.32, 1);
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.menu-icon {
  width: 22px;
  height: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.menu-trigger.active .menu-icon {
  gap: 0;
}

.menu-bar {
  width: 18px;
  height: 2px;
  background: var(--primary-color, #1a1a1a);
  border-radius: 1px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.menu-trigger.active .menu-bar:nth-child(1) {
  transform: rotate(45deg) translateY(3px);
}

.menu-trigger.active .menu-bar:nth-child(2) {
  opacity: 0;
}

.menu-trigger.active .menu-bar:nth-child(3) {
  transform: rotate(-45deg) translateY(-3px);
}

.menu-inner {
  padding-bottom: 12px;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  gap: 16px;
}

.menu-card-header {
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--secondary-color, #666666);
  text-transform: uppercase;
  margin-bottom: 0;
  font-weight: 600;
  padding-bottom: 16px;
  text-align: center;
}

.menu-section {
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--secondary-color, #666666);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin-bottom: 6px;
  width: 100%;
  box-sizing: border-box;
}

.nav-item:last-child {
  margin-bottom: 0;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--primary-color, #1a1a1a);
  transform: translateX(-4px);
}

.nav-item svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  flex-shrink: 0;
}

.nav-item span {
  font-size: 15px;
  font-weight: 500;
  text-align: right;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

@media (max-width: 768px) {
  .glass-menu {
    right: 16px;
    bottom: 16px;
  }

  .glass-controls {
    padding: 10px;
  }
}
</style>
