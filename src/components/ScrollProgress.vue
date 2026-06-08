<script setup lang="ts">
defineProps<{ progress: number }>()
const emit = defineEmits<{ click: [] }>()

const circleR = 18
const circleC = 2 * Math.PI * circleR
</script>

<template>
  <div class="progress-ring interactive" @click="emit('click')" title="回到顶部">
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" :r="circleR" fill="none" stroke="var(--border)" stroke-width="1.5" />
      <circle cx="22" cy="22" :r="circleR" fill="none" stroke="#9F353A" stroke-width="1.5"
        stroke-linecap="round" :stroke-dasharray="circleC" :stroke-dashoffset="circleC - (progress / 100) * circleC"
        transform="rotate(-90 22 22)" style="transition: stroke-dashoffset 0.1s linear" />
    </svg>
    <span class="progress-pct">{{ Math.round(progress) }}</span>
  </div>
</template>

<style scoped>
.progress-ring { position: fixed; bottom: 2rem; right: 2rem; z-index: 100; cursor: pointer; opacity: 0; transition: opacity 0.3s; }
.progress-ring { opacity: 1; }
.progress-pct { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-family: var(--font-mono); color: var(--ink-ghost); }
</style>
