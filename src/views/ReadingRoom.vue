<template>
  <div class="page-container">
    <div class="page-content">
      <h1>📋 公告栏</h1>
      <p>这里是发布重要通知和公告的地方</p>
      
      <div class="announcement-list">
        <div v-for="announcement in announcements" :key="announcement.id" class="announcement-card">
          <div class="announcement-header">
            <span class="announcement-title">{{ announcement.title }}</span>
            <span class="announcement-date">{{ announcement.date }}</span>
          </div>
          <p class="announcement-content">{{ announcement.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const announcements = [
  {
    id: 1,
    title: '网站正式上线',
    date: '2026-05-17',
    content: '欢迎来到楼西楼！这是我的个人主页，包含了我的作品集、联系方式等信息。'
  },
  {
    id: 2,
    title: '新增图片检索功能',
    date: '2026-05-18',
    content: '观景台页面新增了图片类型检索功能，可以快速筛选不同类型的图片。'
  },
  {
    id: 3,
    title: '联系方式更新',
    date: '2026-05-21',
    content: '联系页面新增了抖音账号，欢迎关注！点击邮箱和电话卡片可以直接复制。'
  }
]
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 2rem;
}

.page-content {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-text, #333);
    text-align: center;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--color-text-secondary, #666);
    text-align: center;
    margin-bottom: 2rem;
  }

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.announcement-card {
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.announcement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.announcement-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-text, #1a1a1a);
  }
  
  .announcement-date {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    background: var(--color-bg, #f0f0f0);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  }
  
  .announcement-content {
    font-size: 1rem;
    color: var(--color-text-secondary, #666);
    line-height: 1.6;
    text-align: left;
    margin-bottom: 0;
  }

[data-theme="dark"] .announcement-card {
  background: rgba(30, 30, 40, 0.85);
}

[data-theme="dark"] .announcement-date {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .announcement-card {
    padding: 1.25rem;
  }
  
  .announcement-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
