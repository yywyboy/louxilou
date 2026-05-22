<script setup lang="ts">
import { ref } from 'vue'
import { articles } from '../data/articles'

const expandedArticles = ref<Set<string>>(new Set())

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const toggleExpand = (id: string) => {
  if (expandedArticles.value.has(id)) {
    expandedArticles.value.delete(id)
  } else {
    expandedArticles.value.add(id)
  }
}

const isExpanded = (id: string) => {
  return expandedArticles.value.has(id)
}
</script>

<template>
  <div class="articles-container">
    <h1 class="section-title">📋 公告栏</h1>
    <p class="section-desc">这里是发布重要通知和公告的地方</p>

    <div class="articles-list">
      <div v-if="articles.length === 0" class="empty-state">
        <p>暂无文章</p>
      </div>

      <div
        v-for="article in articles"
        :key="article.id"
        class="article-card"
        :class="{ pinned: article.pinned }"
      >
        <div class="article-header" @click="toggleExpand(article.id)">
          <div class="article-title-wrapper">
            <span v-if="article.pinned" class="pin-badge">📌</span>
            <h2 class="article-title">{{ article.title }}</h2>
          </div>
          <div class="article-meta">
            <span class="article-date">{{ formatDate(article.date) }}</span>
            <span class="expand-icon">{{ isExpanded(article.id) ? '▲' : '▼' }}</span>
          </div>
        </div>
        
        <Transition name="collapse">
          <div v-show="isExpanded(article.id) || article.pinned" class="article-content">
            <p v-for="(line, idx) in article.content.split('\n')" :key="idx">{{ line }}</p>
          </div>
        </Transition>
      </div>
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
  margin: 0 0 8px 0;
}

.section-desc {
  color: #6b7280;
  margin: 0 0 30px 0;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.article-card:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
}

.article-card.pinned {
  border-left: 4px solid #667eea;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  cursor: pointer;
}

.article-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pin-badge {
  font-size: 16px;
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.article-date {
  color: #9ca3af;
  font-size: 14px;
}

.expand-icon {
  font-size: 12px;
  color: #9ca3af;
  transition: transform 0.3s ease;
}

.article-content {
  padding: 0 24px 20px;
  color: #4b5563;
  line-height: 1.8;
}

.article-content p {
  margin: 0 0 12px 0;
}

.article-content p:last-child {
  margin-bottom: 0;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 500px;
}

@media (prefers-color-scheme: dark) {
  .article-card {
    background: #1e293b;
  }

  .section-title {
    color: #e2e8f0;
  }

  .section-desc {
    color: #94a3b8;
  }

  .article-title {
    color: #e2e8f0;
  }

  .article-content {
    color: #cbd5e1;
  }

  .article-date {
    color: #64748b;
  }

  .expand-icon {
    color: #64748b;
  }

  .empty-state {
    background: rgba(129, 140, 248, 0.1);
    color: #94a3b8;
  }
}
</style>
