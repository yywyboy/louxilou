<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import LiquidGlassCapsule from './components/LiquidGlassCapsule.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'

const loadingRef = ref()

onMounted(() => {
  if (loadingRef.value) {
    loadingRef.value.hide()
  }
})
</script>

<template>
  <div>
    <LoadingSpinner ref="loadingRef" />
    <RouterView v-slot="{ Component, route }">
      <Transition
        name="page"
        mode="out-in"
        @before-leave="() => loadingRef?.show()"
        @after-enter="() => loadingRef?.hide()"
      >
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
    <LiquidGlassCapsule />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
