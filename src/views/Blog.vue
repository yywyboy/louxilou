<template>
  <div class="blog-container">
    <div class="blog-header">
      <h1>📝 博客</h1>
      <p>记录想法、分享技术、留住生活</p>

      <div class="search-box">
        <div class="search-icon">🔍</div>
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索文章..."
          class="search-input"
          @input="handleSearch"
        />
        <button v-if="searchKeyword" class="clear-btn" @click="clearSearch">✕</button>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-bar">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="category-tag"
        :class="{ active: activeCategory === cat.value }"
        @click="switchCategory(cat.value)"
      >
        {{ cat.icon }} {{ cat.label }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 文章列表 -->
    <div v-else-if="posts.length > 0" class="post-list">
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-card"
        @click="navigateToPost(post.id)"
      >
        <div v-if="post.cover" class="post-cover">
          <img :src="post.cover" :alt="post.title" loading="lazy" />
        </div>
        <div class="post-body">
          <div class="post-meta">
            <span class="post-category">{{ post.category || '随笔' }}</span>
            <span class="post-date">{{ formatDate(post.created_at) }}</span>
          </div>
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-summary">{{ post.summary }}</p>
          <div class="post-footer">
            <div class="post-tags">
              <span v-for="tag in (post.tags || []).slice(0, 3)" :key="tag" class="tag">#{{ tag }}</span>
            </div>
            <div class="post-stats">
              <span class="stat">👁️ {{ post.view_count || 0 }}</span>
              <span class="stat">⏱️ {{ estimateReadTime(post.content) }} 分钟</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">✍️</div>
      <p v-if="searchKeyword">没有找到匹配的文章</p>
      <p v-else>还没有文章，敬请期待</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts, searchPosts, formatDate, estimateReadTime, type Post } from '../lib/blog'

const router = useRouter()
const posts = ref<Post[]>([])
const loading = ref(true)
const searchKeyword = ref('')
const activeCategory = ref('all')

const categories = [
  { value: 'all', label: '全部', icon: '📋' },
  { value: 'tech', label: '技术', icon: '💻' },
  { value: 'life', label: '生活', icon: '🌿' },
  { value: 'reading', label: '读书', icon: '📖' },
  { value: 'thoughts', label: '随想', icon: '💭' }
]

let searchTimer: ReturnType<typeof setTimeout> | null = null

async function loadPosts(category?: string) {
  loading.value = true
  try {
    const opts: any = { limit: 20 }
    if (category && category !== 'all') opts.category = category
    posts.value = await getPosts(opts)
  } catch (e) {
    console.error('加载文章失败:', e)
    posts.value = []
  } finally {
    loading.value = false
  }
}

function switchCategory(cat: string) {
  activeCategory.value = cat
  searchKeyword.value = ''
  loadPosts(cat)
}

function handleSearch() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    if (!searchKeyword.value.trim()) {
      loadPosts(activeCategory.value)
      return
    }
    loading.value = true
    try {
      posts.value = await searchPosts(searchKeyword.value.trim())
    } catch (e) {
      console.error('搜索失败:', e)
    } finally {
      loading.value = false
    }
  }, 300)
}

function clearSearch() {
  searchKeyword.value = ''
  loadPosts(activeCategory.value)
}

function navigateToPost(id: string) {
  router.push(`/blog/${id}`)
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.blog-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.blog-header {
  text-align: center;
  margin-bottom: 2rem;
}

.blog-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.blog-header p {
  font-size: 1.1rem;
  color: var(--color-text-secondary, #666);
  margin: 0 0 1.5rem 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 0.6rem 1rem;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.search-icon {
  font-size: 1rem;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  outline: none;
  color: var(--color-text, #333);
}

.search-input::placeholder {
  color: var(--color-text-secondary, #999);
}

.clear-btn {
  border: none;
  background: rgba(0, 0, 0, 0.08);
  color: #999;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  color: #666;
}

.category-bar {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.category-tag {
  border: 1px solid rgba(102, 126, 234, 0.3);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  color: var(--color-text-secondary, #666);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.category-tag:hover {
  border-color: #667eea;
  color: #667eea;
}

.category-tag.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--color-text-secondary, #666);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.post-card {
  display: flex;
  gap: 1.2rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.post-cover {
  flex-shrink: 0;
  width: 140px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-body {
  flex: 1;
  min-width: 0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.post-category {
  font-size: 0.75rem;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.post-date {
  font-size: 0.8rem;
  color: var(--color-text-secondary, #999);
}

.post-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 0.4rem 0;
  color: var(--color-text, #1a1a1a);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-summary {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #666);
  margin: 0 0 0.6rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.post-stats {
  display: flex;
  gap: 0.75rem;
}

.stat {
  font-size: 0.8rem;
  color: var(--color-text-secondary, #999);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--color-text-secondary, #666);
  font-size: 1rem;
}

@media (max-width: 640px) {
  .blog-container {
    padding: 1rem;
  }

  .post-card {
    flex-direction: column;
  }

  .post-cover {
    width: 100%;
    height: 150px;
  }
}
</style>
