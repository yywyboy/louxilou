<script setup lang="ts">
defineProps<{
  src: string
  visible: boolean
}>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="lb" @click.self="emit('close')">
        <button class="lb-close interactive" @click="emit('close')">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <img :src="src" class="lb-img" alt="" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lb { position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.92); display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
.lb-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: #fff; opacity: 0.7; cursor: pointer; z-index: 2; padding: 0.5rem; }
.lb-close:hover { opacity: 1; }
.lb-img { max-width: 92vw; max-height: 92vh; object-fit: contain; border-radius: 4px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
