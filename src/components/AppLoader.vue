<script setup lang="ts">
defineProps<{ show: boolean }>()
</script>

<template>
  <div v-if="show" class="loader-screen">
    <div class="loader-brand">
      <span v-for="(ch, i) in 'LOUXILOU'.split('')" :key="i" class="loader-char">{{ ch }}</span>
    </div>
  </div>
</template>

<style scoped>
.loader-screen { position: fixed; inset: 0; z-index: 99999; background: var(--bg); display: flex; align-items: center; justify-content: center; }
.loader-brand { display: flex; gap: 0.15em; }
.loader-char { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; letter-spacing: 0.08em; color: var(--ink); }
</style>
