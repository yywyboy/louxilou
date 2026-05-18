<template>
  <div class="page-container">
    <div class="page-content">
      <h1>👤 个人中心</h1>
      <p>管理您的个人资料和账户设置。</p>
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
  color: var(--text-color, #333);
}

p {
  font-size: 1.2rem;
  color: var(--text-secondary, #666);
}
</style>
