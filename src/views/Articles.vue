<script setup lang="ts">
import { ref } from 'vue'

interface Article {
  id: string
  title: string
  content: string
  date: string
}

const articles = ref<Article[]>([
  {
    id: '1',
    title: '欢迎来到楼西楼louxilou！',
    date: '2026-05-10',
    content: '这是我的个人网站，这里可以看小说和图片，要联系我也可以！'
  }
])

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="articles-container">
    <h1 class="section-title">公告栏</h1>
    
    <div class="articles-list">
      <div v-if="articles.length === 0" class="empty-state">
        <p>暂无文章</p>
      </div>
      
      <div 
        v-for="article in articles" 
        :key="article.id" 
        class="article-card"
      >
        <h2 class="article-title">{{ article.title }}</h2>
        <p class="article-date">{{ formatDate(article.date) }}</p>
        <div class="article-content">
          <p>{{ article.content }}</p>
        </div>
      </div>
    </div>
    
    <div class="upload-guide">
      <h3>如何发布文章</h3>
      <p>文章直接在代码中定义，编辑 <code>src/views/Articles.vue</code> 文件：</p>
      <pre><code>const articles = ref([
  {
    id: '1',
    title: '文章标题',
    date: '2024-01-01',
    content: '文章内容...'
  }
])</code></pre>
    </div>
  </div>
</template>

<style scoped>
.articles-container {
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 16px;
  color: #6b7280;
}

.article-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
}

.article-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.article-date {
  color: #9ca3af;
  font-size: 14px;
  margin: 0 0 16px 0;
}

.article-content {
  color: #4b5563;
  line-height: 1.8;
}

.article-content p {
  margin: 0;
}

.upload-guide {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding: 24px;
  border-radius: 16px;
}

.upload-guide h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.upload-guide p {
  margin: 8px 0;
  color: #4b5563;
}

.upload-guide code {
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
}

.upload-guide pre {
  background: rgba(0, 0, 0, 0.1);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0 0 0;
}

.upload-guide pre code {
  background: none;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}

@media (prefers-color-scheme: dark) {
  .article-card {
    background: #1e293b;
  }
  
  .section-title,
  .article-title {
    color: #e2e8f0;
  }
  
  .article-content {
    color: #cbd5e1;
  }
  
  .article-date {
    color: #64748b;
  }
  
  .empty-state {
    background: rgba(129, 140, 248, 0.1);
    color: #94a3b8;
  }
  
  .upload-guide {
    background: linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(192, 132, 252, 0.15) 100%);
    color: #cbd5e1;
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