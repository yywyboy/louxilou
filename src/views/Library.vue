<template>
  <div class="page-container">
    <div class="page-content">
      <h1>📚 藏书阁</h1>
      <p>这里收藏着各种珍贵的书籍和文献，等待您来探索。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-content {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-text, #333);
}

p {
  font-size: 1.2rem;
  color: var(--color-text-secondary, #666);
}
</style>
