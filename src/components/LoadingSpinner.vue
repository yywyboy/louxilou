<template>
  <Transition name="loader" mode="out-in">
    <div v-if="isLoading" class="loader-overlay" :class="{ dark: isDark }">
      <div class="loader-content">
        <div class="loader-visual">
          <div class="loader-ring ring-outer">
            <div class="ring-track"></div>
            <div class="ring-progress"></div>
          </div>
          <div class="loader-ring ring-middle">
            <div class="ring-track"></div>
            <div class="ring-progress"></div>
          </div>
          <div class="loader-ring ring-inner">
            <div class="ring-track"></div>
            <div class="ring-progress"></div>
          </div>
          <div class="loader-center">
            <div class="center-dot"></div>
          </div>
        </div>
        
        <div class="loader-text-container">
          <div class="loader-title">
            <span 
              v-for="(char, index) in titleChars" 
              :key="index" 
              class="title-char"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              {{ char }}
            </span>
          </div>
          <div class="loader-subtitle">
            <span class="subtitle-text">正在加载...</span>
          </div>
        </div>
        
        <div class="loader-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const isLoading = ref(false)
const isDark = ref(false)
const titleChars = '楼西楼'.split('')

const checkTheme = () => {
  isDark.value = document.documentElement.getAttribute('data-theme') === 'dark'
}

onMounted(() => {
  checkTheme()
  document.addEventListener('themechange', checkTheme)
})

watch(isLoading, (newVal) => {
  if (newVal) {
    checkTheme()
  }
})

defineExpose({
  show: () => {
    checkTheme()
    isLoading.value = true
  },
  hide: () => {
    setTimeout(() => {
      isLoading.value = false
    }, 400)
  }
})
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

.loader-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(100, 150, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(150, 100, 255, 0.1) 0%, transparent 50%);
}

.loader-overlay.dark {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.loader-overlay.dark::before {
  background: radial-gradient(circle at 30% 20%, rgba(100, 150, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(150, 100, 255, 0.15) 0%, transparent 50%);
}

.loader-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 40px;
}

.loader-visual {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader-ring {
  position: absolute;
  border-radius: 50%;
}

.ring-outer {
  width: 120px;
  height: 120px;
}

.ring-middle {
  width: 90px;
  height: 90px;
}

.ring-inner {
  width: 60px;
  height: 60px;
}

.ring-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: transparent;
}

.loader-overlay:not(.dark) .ring-track {
  border: 2px solid rgba(100, 120, 140, 0.15);
}

.loader-overlay.dark .ring-track {
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.ring-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, currentColor);
  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 2px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 2px));
  animation: spin 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.loader-overlay:not(.dark) .ring-outer .ring-progress {
  color: #667eea;
  opacity: 0.9;
}

.loader-overlay:not(.dark) .ring-middle .ring-progress {
  color: #764ba2;
  opacity: 0.7;
  animation-direction: reverse;
  animation-duration: 2.5s;
}

.loader-overlay:not(.dark) .ring-inner .ring-progress {
  color: #f093fb;
  opacity: 0.8;
  animation-duration: 1.8s;
}

.loader-overlay.dark .ring-outer .ring-progress {
  color: #818cf8;
  opacity: 0.9;
}

.loader-overlay.dark .ring-middle .ring-progress {
  color: #c084fc;
  opacity: 0.7;
  animation-direction: reverse;
  animation-duration: 2.5s;
}

.loader-overlay.dark .ring-inner .ring-progress {
  color: #f472b6;
  opacity: 0.8;
  animation-duration: 1.8s;
}

.loader-center {
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.center-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.loader-overlay:not(.dark) .center-dot {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loader-overlay.dark .center-dot {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
}

.loader-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loader-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 8px;
  display: flex;
  gap: 4px;
}

.loader-overlay:not(.dark) .loader-title {
  color: #2d3748;
}

.loader-overlay.dark .loader-title {
  color: #e2e8f0;
}

.title-char {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.loader-subtitle {
  font-size: 14px;
  opacity: 0;
  animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
}

.loader-overlay:not(.dark) .subtitle-text {
  color: #718096;
}

.loader-overlay.dark .subtitle-text {
  color: #94a3b8;
}

.loader-progress {
  width: 180px;
  opacity: 0;
  animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
}

.progress-bar {
  height: 3px;
  border-radius: 2px;
  overflow: hidden;
}

.loader-overlay:not(.dark) .progress-bar {
  background: rgba(100, 120, 140, 0.15);
}

.loader-overlay.dark .progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  animation: progress 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.loader-overlay:not(.dark) .progress-fill {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.loader-overlay.dark .progress-fill {
  background: linear-gradient(90deg, #818cf8 0%, #c084fc 100%);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes progress {
  0% {
    width: 0%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 100%;
  }
}

.loader-enter-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.loader-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}

.loader-enter-from .loader-content {
  transform: scale(0.95) translateY(20px);
}

.loader-leave-to .loader-content {
  transform: scale(0.95) translateY(-20px);
}

.loader-enter-active .loader-content,
.loader-leave-active .loader-content {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>