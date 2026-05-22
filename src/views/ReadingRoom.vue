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
      
      <div v-if="articles.length === 0" class="upload-guide">
        <h3>📝 如何发布文章</h3>
        <p>文章直接在 <code>src/data/articles.ts</code> 文件中添加。</p>
        <pre><code>const articles = [
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
import { articles } from '../data/articles'

const expandedId = ref<string | null>(null)

const sortedAnnouncements = computed(() => {
  return [...articles].sort((a, b) => {
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
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 32px;
  margin: 0 0 8px 0;
}

.page-content > p {
  color: #666;
  margin: 0 0 30px 0;
}

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.announcement-card {
  background: #f8f9fa;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.announcement-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.announcement-card.pinned {
  border-left: 4px solid #667eea;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pin-badge {
  font-size: 16px;
}

.announcement-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.announcement-date {
  font-size: 14px;
  color: #999;
}

.expand-icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-icon {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #999;
  transition: transform 0.3s ease;
}

.announcement-card.expanded .expand-icon {
  transform: rotate(180deg);
}

.announcement-content-container {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}

.announcement-content-container.expanded {
  max-height: 500px;
}

.announcement-content-wrapper {
  padding: 0 20px 20px;
}

.announcement-content {
  margin: 0;
  color: #555;
  line-height: 1.8;
  white-space: pre-wrap;
}

.upload-guide {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
}

.upload-guide h3 {
  margin: 0 0 10px 0;
}

.upload-guide p {
  margin: 5px 0;
  color: #666;
}

.upload-guide code {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
}

.upload-guide pre {
  background: rgba(0, 0, 0, 0.08);
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 10px 0;
}

.upload-guide pre code {
  background: none;
  padding: 0;
}

@media (prefers-color-scheme: dark) {
  .page-container {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }
  
  .page-content {
    background: #1e293b;
  }
  
  h1 {
    color: #e2e8f0;
  }
  
  .page-content > p {
    color: #94a3b8;
  }
  
  .announcement-card {
    background: #334155;
  }
  
  .announcement-title {
    color: #e2e8f0;
  }
  
  .announcement-date {
    color: #64748b;
  }
  
  .expand-icon {
    border-top-color: #64748b;
  }
  
  .announcement-content {
    color: #cbd5e1;
  }
  
  .upload-guide {
    background: rgba(129, 140, 248, 0.15);
  }
  
  .upload-guide p {
    color: #cbd5e1;
  }
  
  .upload-guide code {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .upload-guide pre {
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>
