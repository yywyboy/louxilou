<template>
  <div class="page-container">
    <div class="page-content">
      <h1>📋 公告栏</h1>
      <p>这里是发布重要通知和公告的地方</p>
      
      <div class="announcement-list">
        <div 
          v-for="announcement in sortedAnnouncements" 
          :key="announcement.id" 
          class="announcement-card"
          :class="{ pinned: announcement.pinned, expanded: expandedId === announcement.id }"
          @click="toggleExpand(announcement.id)"
        >
          <div class="announcement-header">
            <div class="title-wrapper">
              <span v-if="announcement.pinned" class="pin-badge">📌</span>
              <span class="announcement-title">{{ announcement.title }}</span>
            </div>
            <div class="header-right">
              <span class="announcement-date">{{ announcement.date }}</span>
              <span class="expand-icon-wrapper">
                <span class="expand-icon"></span>
              </span>
            </div>
          </div>
          <div class="announcement-content-container" :class="{ expanded: expandedId === announcement.id }">
            <div class="announcement-content-wrapper">
              <p class="announcement-content">{{ announcement.content }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="announcements.length === 0" class="upload-guide">
        <h3>📝 如何发布文章</h3>
        <p>文章直接在 <code>src/views/ReadingRoom.vue</code> 文件的 announcements 数组中添加。</p>
        <pre><code>const announcements = [
  {
    id: '1',
    title: '文章标题',
    date: '2024-02-14',
    content: '文章内容...',
    pinned: false
  }
]</code></pre>
        <p><strong>置顶文章</strong>：设置 <code>pinned: true</code></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Announcement {
  id: string
  title: string
  date: string
  content: string
  pinned: boolean
}

const announcements = ref<Announcement[]>([
  {
    id: '1',
    title: '欢迎来到楼西楼louxilou！',
    date: '2026-05-10',
    content: '这是我的个人网站，这里可以看小说和图片，要联系我也可以！',
    pinned: true
  },
  {
    id: '2',
    title: '新增图片检索功能',
    date: '2026-05-18',
    content: '观景台页面新增了图片类型检索功能，可以快速筛选不同类型的图片。',
    pinned: false
  },
  {
    id: '3',
    title: '联系方式更新',
    date: '2026-05-21',
    content: '联系页面新增了抖音账号，欢迎关注！点击邮箱和电话卡片可以直接复制。',
    pinned: false
  }
])

const expandedId = ref<string | null>(null)

const sortedAnnouncements = computed(() => {
  return [...announcements.value].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}
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
  margin-bottom: 2rem;
}

.announcement-card {
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.announcement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.announcement-card.expanded {
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
}

.announcement-card.pinned {
  border-left-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pin-badge {
  font-size: 1rem;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.announcement-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text, #1a1a1a);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.announcement-date {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #666);
  background: var(--color-bg, #f0f0f0);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.expand-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-bg, #f0f0f0);
  transition: all 0.3s ease;
}

.announcement-card:hover .expand-icon-wrapper,
.announcement-card.expanded .expand-icon-wrapper {
  background: #667eea;
}

.expand-icon {
  width: 10px;
  height: 10px;
  border-right: 2px solid var(--color-text-secondary, #666);
  border-bottom: 2px solid var(--color-text-secondary, #666);
  transform: rotate(45deg);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.announcement-card:hover .expand-icon,
.announcement-card.expanded .expand-icon {
  border-color: #fff;
}

.announcement-card.expanded .expand-icon {
  transform: rotate(-135deg) translateY(2px);
}

.announcement-content-container {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  opacity: 0;
}

.announcement-content-container.expanded {
  max-height: 300px;
  opacity: 1;
}

.announcement-content-wrapper {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border, #e5e7eb);
  animation: contentFadeIn 0.4s ease forwards;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.announcement-content {
  font-size: 1rem;
  color: var(--color-text-secondary, #666);
  line-height: 1.7;
  margin: 0;
  animation: textReveal 0.5s ease forwards;
}

@keyframes textReveal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.upload-guide {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding: 20px;
  border-radius: 12px;
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.upload-guide h3 {
  margin: 0 0 12px 0;
  font-size: 1rem;
}

.upload-guide p {
  margin: 8px 0;
  font-size: 0.9rem;
  text-align: left;
}

.upload-guide code {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.upload-guide pre {
  background: rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 6px 0 0 0;
  font-size: 0.8rem;
}

[data-theme="dark"] .announcement-card {
  background: rgba(30, 30, 40, 0.85);
}

[data-theme="dark"] .announcement-card.pinned {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, transparent 100%);
}

[data-theme="dark"] .announcement-date {
  background: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .expand-icon-wrapper {
  background: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .announcement-content-wrapper {
  border-top-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .upload-guide {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(192, 132, 252, 0.15) 100%);
}

[data-theme="dark"] .upload-guide code,
[data-theme="dark"] .upload-guide pre {
  background: rgba(255, 255, 255, 0.08);
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
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>