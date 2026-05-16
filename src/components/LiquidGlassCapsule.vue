<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)
const isDarkMode = ref(false)
const containerRef = ref<HTMLElement>()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const menuItems = [
  { path: '/', name: '待客厅', icon: 'lounge' },
  { path: '/about', name: '藏书阁', icon: 'library' },
  { path: '/articles', name: '观景台', icon: 'view' },
  { path: '/contact', name: '阅读区', icon: 'reading' },
  { path: '/', name: '聊天室', icon: 'chat' }
]

const bottomItems = [
  { path: '/', name: '个人', icon: 'user' },
  { path: '/', name: '设置', icon: 'settings' }
]

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.glass-menu') && isMenuOpen.value) {
    closeMenu()
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
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
                <svg viewBox="0 0 24 24" v-if="item.icon === 'lounge'">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <svg viewBox="0 0 24 24" v-else-if="item.icon === 'library'">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <svg viewBox="0 0 24 24" v-else-if="item.icon === 'view'">
                  <path d="M1 12s4-8 11-8 11 8-11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg viewBox="0 0 24 24" v-else-if="item.icon === 'reading'">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <svg viewBox="0 0 24 24" v-else-if="item.icon === 'chat'">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{{ item.name }}</span>
              </RouterLink>
            </div>
          </div>
        </Transition>
      </div>

      <div class="glass-controls">
        <Transition name="fade">
          <div v-if="isMenuOpen" class="bottom-nav">
            <RouterLink
              v-for="item in bottomItems"
              :key="item.path"
              :to="item.path"
              class="bottom-nav-item"
              @click="closeMenu"
            >
              <svg viewBox="0 0 24 24" v-if="item.icon === 'user'">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <svg viewBox="0 0 24 24" v-else-if="item.icon === 'settings'">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
              <span>{{ item.name }}</span>
            </RouterLink>
          </div>
        </Transition>
        
        <div class="divider" v-if="isMenuOpen"></div>
        
        <div class="right-controls">
          <div class="menu-trigger" :class="{ active: isMenuOpen }" @click.stop="toggleMenu">
            <div class="menu-icon">
              <span class="menu-bar"></span>
              <span class="menu-bar"></span>
              <span class="menu-bar"></span>
            </div>
          </div>
          <div class="avatar-trigger" @click.stop="toggleDarkMode">
            <span class="mode-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
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
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  width: auto;
  height: auto;
  margin-left: auto;
}

.glass-container.expanded {
  min-width: 240px;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.glass-content {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0s;
  width: 100%;
  box-sizing: border-box;
}

.glass-container.expanded .glass-content {
  max-height: 650px;
  opacity: 1;
  padding: 24px 20px 0;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.1s;
  width: 100%;
  box-sizing: border-box;
}

.glass-controls {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 12px 12px 12px 20px;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.glass-container.expanded .glass-controls {
  padding: 12px 20px 16px;
}

.bottom-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bottom-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--secondary-color, #666666);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-size: 14px;
  font-weight: 500;
}

.bottom-nav-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--primary-color, #1a1a1a);
}

.bottom-nav-item svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  flex-shrink: 0;
}

.divider {
  width: 1px;
  height: 32px;
  background: var(--border-color, #e0e0e0);
  margin: 0 12px;
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

.avatar-trigger {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.avatar-trigger::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    #ff6b6b, #feca57, #48dbfb, #ff9ff3,
    #54a0ff, #5f27cd, #ff6b6b
  );
  animation: rotate 3s linear infinite;
}

.avatar-trigger::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  z-index: 1;
}

.avatar-trigger .mode-icon {
  position: relative;
  z-index: 2;
  font-size: 18px;
  color: var(--primary-color, #1a1a1a);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.avatar-trigger:hover {
  transform: scale(1.15);
  box-shadow: 0 8px 30px rgba(255, 107, 107, 0.4);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

/* Dark mode styles */
:global([data-theme="dark"]) .glass-container {
  background: rgba(20, 20, 20, 0.85);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

:global([data-theme="dark"]) .menu-bar {
  background: #ffffff;
}

:global([data-theme="dark"]) .avatar-trigger::after {
  background: #0a0a0a;
}

:global([data-theme="dark"]) .mode-icon {
  color: #ffffff;
}

:global([data-theme="dark"]) .menu-card-header {
  color: #a0a0a0;
}

:global([data-theme="dark"]) .menu-section {
  border-color: #333333;
  background: rgba(255, 255, 255, 0.03);
}

:global([data-theme="dark"]) .nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

:global([data-theme="dark"]) .divider {
  background: #333333;
}

:global([data-theme="dark"]) .bottom-nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

@media (max-width: 768px) {
  .glass-menu {
    right: 16px;
    bottom: 16px;
  }

  .glass-controls {
    padding: 10px 10px 10px 16px;
  }

  .avatar-trigger {
    width: 36px;
    height: 36px;
  }

  .bottom-nav-item {
    padding: 6px 10px;
    font-size: 13px;
  }

  .divider {
    margin: 0 8px;
  }
}
</style>
