<template>
  <Transition name="loader" mode="out-in">
    <div v-if="isLoading" class="loader-overlay" :class="{ dark: isDark }">
      <div class="loader-container">
        <div class="loader-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="loader-text">楼西楼</div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const isLoading = ref(false)
const isDark = ref(false)

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
    }, 300)
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-overlay.dark {
  background: rgba(10, 10, 10, 0.95);
}

.loader-overlay.dark .loader-ring div {
  border-top-color: #ffffff;
}

.loader-overlay.dark .loader-ring div:nth-child(2) {
  border-top-color: #888888;
}

.loader-overlay.dark .loader-ring div:nth-child(3) {
  border-top-color: #aaaaaa;
}

.loader-overlay.dark .loader-text {
  color: #ffffff;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.loader-ring {
  width: 60px;
  height: 60px;
  position: relative;
}

.loader-ring div {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #1a1a1a;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.loader-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.loader-ring div:nth-child(2) {
  animation-delay: -0.3s;
  border-top-color: #666666;
}

.loader-ring div:nth-child(3) {
  animation-delay: -0.15s;
  border-top-color: #999999;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader-text {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  color: #1a1a1a;
}

.loader-enter-active,
.loader-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}

.loader-enter-from .loader-container,
.loader-leave-to .loader-container {
  transform: scale(0.9);
  opacity: 0;
}
</style>
