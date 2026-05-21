<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import LiquidGlassCapsule from './components/LiquidGlassCapsule.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'

const loadingRef = ref()
const isTransitioning = ref(false)

onMounted(() => {
  if (loadingRef.value) {
    loadingRef.value.hide()
  }
})

const handleBeforeLeave = () => {
  isTransitioning.value = true
  document.dispatchEvent(new Event('pageleave'))
}

const handleAfterEnter = () => {
  isTransitioning.value = false
  document.dispatchEvent(new Event('pageenter'))
}
</script>

<template>
  <div class="app-container">
    <LoadingSpinner ref="loadingRef" />
    <RouterView v-slot="{ Component, route }">
      <Transition 
        name="page"
        @before-leave="handleBeforeLeave"
        @after-enter="handleAfterEnter"
      >
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
    <LiquidGlassCapsule :class="{ 'transition-hide': isTransitioning }" />
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.35s cubic-bezier(0.32, 0.72, 0, 1),
              transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 100vh;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.transition-hide {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
</style>
