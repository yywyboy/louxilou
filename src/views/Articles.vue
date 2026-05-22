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
    date: '2026-05-22',
    content: `这是我的个人网站，以下是各个功能区的介绍：

📚 藏书阁
收藏各种珍贵书籍，支持在线阅读和TXT下载。阅读器支持多种文本编码（UTF-8、GBK、GB18030、GB2312、Shift_JIS、Big5），自动检测最佳编码解决乱码问题。点击书籍可直接进入阅读，页面切换流畅无需等待加载动画。

🏠 观景台
展示个人照片画廊，可以欣赏风景和日常照片。

📋 公告栏
网站更新日志和功能介绍，所有网站动态都会在这里公布。

📞 联系我
可以通过这里与我取得联系，有什么问题或建议都可以留言。

希望你能在这里找到喜欢的内容！`
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
          <p v-for="(line, idx) in article.content.split('\n')" :key="idx">{{ line }}</p>
        </div>
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
  margin: 0 0 12px 0;
}

.article-content p:last-child {
  margin-bottom: 0;
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
}
</style>
