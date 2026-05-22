<template>
  <Transition name="loader" mode="out-in">
    <div v-if="isLoading" class="loader-overlay" :class="{ dark: isDark }">
      <div class="loader-content">
        <div class="floating-text">
          <span 
            v-for="(letter, index) in letters" 
            :key="index" 
            class="letter"
            :style="{ 
              animationDelay: `${index * 0.15}s`,
              '--letter-index': index
            }"
          >
            {{ letter }}
          </span>
        </div>
        
        <div class="subtitle">
          <span class="subtitle-text">loading...</span>
        </div>
        
        <div class="floating-particles">
          <div 
            v-for="i in 8" 
            :key="i" 
            class="particle"
            :style="{ 
              animationDelay: `${i * 0.3}s`,
              '--particle-index': i
            }"
          ></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const isLoading = ref(false)
const isDark = ref(false)
const letters = 'louxilou'.split('')

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
    }, 500)
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
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
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
  background: 
    radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(240, 147, 251, 0.05) 0%, transparent 60%);
}

.loader-overlay.dark {
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
}

.loader-overlay.dark::before {
  background: 
    radial-gradient(circle at 20% 30%, rgba(129, 140, 248, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(192, 132, 252, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(244, 114, 182, 0.08) 0%, transparent 60%);
}

.loader-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 40px;
}

.floating-text {
  display: flex;
  gap: 8px;
  font-size: 48px;
  font-weight: 700;
  letter-spacing: 4px;
  position: relative;
}

.loader-overlay:not(.dark) .letter {
  color: #2d3748;
}

.loader-overlay.dark .letter {
  color: #e2e8f0;
}

.letter {
  display: inline-block;
  opacity: 0;
  animation: floatBlur 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes floatBlur {
  0% {
    opacity: 0;
    filter: blur(8px);
    transform: translateY(20px) scale(0.8);
  }
  15% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }
  35% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(-10px) scale(1.1);
  }
  55% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }
  75% {
    opacity: 0.5;
    filter: blur(4px);
    transform: translateY(10px) scale(0.95);
  }
  100% {
    opacity: 0;
    filter: blur(8px);
    transform: translateY(20px) scale(0.8);
  }
}

.subtitle {
  font-size: 16px;
  opacity: 0.6;
  animation: fadeInOut 2s ease-in-out infinite;
}

.loader-overlay:not(.dark) .subtitle-text {
  color: #718096;
}

.loader-overlay.dark .subtitle-text {
  color: #94a3b8;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.4;
    letter-spacing: 2px;
  }
  50% {
    opacity: 0.8;
    letter-spacing: 6px;
  }
}

.floating-particles {
  position: absolute;
  width: 300px;
  height: 100px;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.loader-overlay:not(.dark) .particle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loader-overlay.dark .particle {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
}

.particle:nth-child(1) { left: 10%; top: 30%; }
.particle:nth-child(2) { left: 25%; top: 70%; }
.particle:nth-child(3) { left: 40%; top: 20%; }
.particle:nth-child(4) { left: 55%; top: 80%; }
.particle:nth-child(5) { left: 70%; top: 40%; }
.particle:nth-child(6) { left: 85%; top: 60%; }
.particle:nth-child(7) { left: 30%; top: 50%; }
.particle:nth-child(8) { left: 75%; top: 25%; }

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  20% {
    opacity: 0.8;
    transform: translateY(-20px) scale(1);
  }
  40% {
    opacity: 0.6;
    transform: translateY(-40px) scale(0.8);
  }
  60% {
    opacity: 0.4;
    transform: translateY(-20px) scale(0.6);
  }
  80% {
    opacity: 0.2;
    transform: translateY(0) scale(0.4);
  }
  100% {
    opacity: 0;
    transform: translateY(20px) scale(0);
  }
}

.loader-enter-active {
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.loader-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}

.loader-enter-from .loader-content {
  transform: translateY(30px);
  filter: blur(10px);
}

.loader-leave-to .loader-content {
  transform: translateY(-30px);
  filter: blur(10px);
}

.loader-enter-active .loader-content,
.loader-leave-active .loader-content {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>