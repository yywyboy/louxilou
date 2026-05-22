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
import { ref, onMounted } from 'vue'

interface Announcement {
  id: string
  title: string
  date: string
  content: string
}

const announcements = ref<Announcement[]>([])

const parseMarkdown = (content: string) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { title: '未命名', date: '未知', body: content }
  }
  
  const frontmatter = match[1]
  const body = match[2]
  
  const titleMatch = frontmatter.match(/title:\s*(.+)/)
  const dateMatch = frontmatter.match(/date:\s*(\d{4}-\d{2}-\d{2})/)
  
  return {
    title: titleMatch ? titleMatch[1].trim() : '未命名',
    date: dateMatch ? dateMatch[1].trim() : '未知',
    body: body.trim()
  }
}

const loadAnnouncements = async () => {
  const articleFiles = import.meta.glob('../articles/*.md')
  
  const announcementList: Announcement[] = []
  
  for (const [path, resolver] of Object.entries(articleFiles)) {
    const module = await resolver()
    const content = (module as { default: string }).default
    const parsed = parseMarkdown(content)
    const id = path.split('/').pop()?.replace('.md', '') || ''
    
    announcementList.push({
      id,
      title: parsed.title,
      date: parsed.date,
      content: parsed.body
    })
  }
  
  announcementList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  announcements.value = announcementList
}

onMounted(() => {
  loadAnnouncements()
})
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