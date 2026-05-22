<template>
  <div class="post-detail-container">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="!post" class="error-state">
      <div class="error-icon">😢</div>
      <p>文章不存在或已被删除</p>
      <button class="back-btn" @click="goBack">返回博客</button>
    </div>

    <article v-else class="post-article">
      <button class="back-btn" @click="goBack">← 返回</button>

      <header class="post-header">
        <div class="post-meta">
          <span class="post-category">{{ getCategoryName(post.category) }}</span>
          <span class="post-date">{{ formatDate(post.created_at) }}</span>
          <span class="post-views">👁️ {{ post.view_count || 0 }}</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-tags">
          <span v-for="tag in (post.tags || [])" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </header>

      <div v-if="post.cover" class="post-cover">
        <img :src="post.cover" :alt="post.title" />
      </div>

      <div class="post-content" v-html="renderedContent"></div>

      <div class="post-actions">
        <button
          class="like-btn"
          :class="{ liked: hasLiked }"
          @click="handleLike"
        >
          {{ hasLiked ? '❤️' : '🤍' }} {{ likeCount }}
        </button>
      </div>

      <section class="comments-section">
        <h2 class="comments-title">评论 ({{ comments.length }})</h2>

        <div class="comment-form">
          <input
            v-model="commentName"
            type="text"
            placeholder="你的名字"
            class="comment-name-input"
          />
          <textarea
            v-model="commentContent"
            placeholder="写下你的评论..."
            class="comment-textarea"
            rows="3"
          ></textarea>
          <button class="submit-comment-btn" @click="submitComment">
            发布评论
          </button>
        </div>

        <div class="comments-list">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-avatar">
              {{ comment.user_avatar || comment.user_name?.charAt(0) || '?' }}
            </div>
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-author">{{ comment.user_name }}</span>
                <span class="comment-date">{{ formatCommentDate(comment.created_at) }}</span>
              </div>
              <p class="comment-content">{{ comment.content }}</p>
            </div>
          </div>
        </div>

        <div v-if="comments.length === 0" class="no-comments">
          还没有评论，来抢沙发吧！
        </div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  getPost,
  getComments,
  addComment,
  toggleLike,
  hasUserLiked,
  getLikeCount,
  subscribeToComments,
  formatDate,
  type Post,
  type Comment
} from '../lib/blog'

const router = useRouter()
const route = useRoute()

const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)
const hasLiked = ref(false)
const likeCount = ref(0)
const commentName = ref('')
const commentContent = ref('')

let unsubscribeComments: (() => void) | null = null

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return renderMarkdown(post.value.content)
})

function renderMarkdown(content: string): string {
  let html = content
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  html = html.replace(codeBlockRegex, (_, lang, code) => {
    const highlighted = highlightCode(code.trim(), lang)
    return `<pre class="code-block" data-lang="${lang || ''}"><code>${highlighted}</code></pre>`
  })

  html = html.replace(/\n\n/g, '</p><p>')
  html = '<p>' + html + '</p>'
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>(<h[1-3]>)/g, '$1')
  html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<pre)/g, '$1')
  html = html.replace(/(<\/pre>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ul)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ol)/g, '$1')
  html = html.replace(/(<\/ol>)<\/p>/g, '$1')
  html = html.replace(/<p>(<li)/g, '$1')
  html = html.replace(/(<\/li>)<\/p>/g, '$1')
  html = html.replace(/<p>(<blockquote)/g, '$1')
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')

  return html
}

function highlightCode(code: string, lang: string): string {
  if (lang === 'js' || lang === 'javascript') {
    code = code
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g, '<span class="keyword">$1</span>')
      .replace(/(['"`])([^'"`"]*)\1/g, '<span class="string">$1$2$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
  } else if (lang === 'css' || lang === 'html') {
    code = code
      .replace(/([.#]?[\w-]+)\s*\{/g, '<span class="selector">$1</span> {')
      .replace(/([\w-]+):/g, '<span class="property">$1</span>:')
  }
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    tech: '技术',
    life: '生活',
    reading: '读书',
    thoughts: '随想'
  }
  return categoryMap[category] || category || '随笔'
}

function formatCommentDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  return formatDate(dateString)
}

function getUserId(): string {
  let userId = localStorage.getItem('blog_user_id')
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('blog_user_id', userId)
  }
  return userId
}

async function loadPost() {
  loading.value = true
  const id = route.params.id as string
  try {
    post.value = await getPost(id)
    if (post.value) {
      document.title = `${post.value.title} - 楼西楼博客`
      await loadComments()
      await loadLikeStatus()
      setupCommentSubscription()
    }
  } catch (e) {
    console.error('加载文章失败:', e)
  } finally {
    loading.value = false
  }
}

async function loadComments() {
  const id = route.params.id as string
  comments.value = await getComments(id)
}

async function loadLikeStatus() {
  const id = route.params.id as string
  const userId = getUserId()
  hasLiked.value = await hasUserLiked(id, userId)
  likeCount.value = await getLikeCount(id)
}

async function handleLike() {
  const id = route.params.id as string
  const userId = getUserId()
  const newState = await toggleLike(id, userId)
  hasLiked.value = newState
  likeCount.value += newState ? 1 : -1
}

async function submitComment() {
  if (!commentName.value.trim() || !commentContent.value.trim()) {
    alert('请填写名字和评论内容')
    return
  }
  const id = route.params.id as string
  const newComment = await addComment(id, commentName.value.trim(), commentContent.value.trim())
  if (newComment) {
    comments.value.push(newComment)
    commentContent.value = ''
  }
}

function setupCommentSubscription() {
  const id = route.params.id as string
  unsubscribeComments = subscribeToComments(id, (comment) => {
    comments.value.push(comment)
  })
}

function goBack() {
  router.push('/blog')
}

onMounted(() => {
  loadPost()
})

onUnmounted(() => {
  if (unsubscribeComments) {
    unsubscribeComments()
  }
  document.title = '楼西楼louxilou'
})
</script>

<style scoped>
.post-detail-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.loading-state,
.error-state {
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

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-state p {
  color: var(--color-text-secondary, #666);
  margin-bottom: 1.5rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(102, 126, 234, 0.3);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  color: var(--color-text-secondary, #666);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.post-article {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 2rem;
}

.post-header {
  margin-bottom: 2rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.post-category {
  font-size: 0.8rem;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.post-date,
.post-views {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #999);
}

.post-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--color-text, #1a1a1a);
  line-height: 1.3;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #666);
  background: rgba(102, 126, 234, 0.08);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.post-cover {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: auto;
  display: block;
}

.post-content {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text, #333);
  margin-bottom: 2rem;
}

.post-content :deep(h1) {
  font-size: 1.8rem;
  margin: 1.5rem 0 1rem;
  color: var(--color-text, #1a1a1a);
}

.post-content :deep(h2) {
  font-size: 1.5rem;
  margin: 1.3rem 0 0.9rem;
  color: var(--color-text, #1a1a1a);
}

.post-content :deep(h3) {
  font-size: 1.2rem;
  margin: 1.1rem 0 0.7rem;
  color: var(--color-text, #1a1a1a);
}

.post-content :deep(p) {
  margin: 0 0 1rem;
}

.post-content :deep(strong) {
  font-weight: 600;
}

.post-content :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
}

.post-content :deep(.code-block) {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.post-content :deep(.code-block code) {
  background: transparent;
  color: #d4d4d4;
  padding: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.post-content :deep(.code-block .keyword) {
  color: #569cd6;
}

.post-content :deep(.code-block .string) {
  color: #ce9178;
}

.post-content :deep(.code-block .number) {
  color: #b5cea8;
}

.post-content :deep(.code-block .selector) {
  color: #d7ba7d;
}

.post-content :deep(.code-block .property) {
  color: #9cdcfe;
}

.post-content :deep(a) {
  color: #667eea;
  text-decoration: none;
}

.post-content :deep(a:hover) {
  text-decoration: underline;
}

.post-content :deep(blockquote) {
  border-left: 4px solid #667eea;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.05);
  color: var(--color-text-secondary, #666);
}

.post-content :deep(ul),
.post-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.post-content :deep(li) {
  margin: 0.3rem 0;
}

.post-actions {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
}

.like-btn {
  border: none;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.like-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.like-btn.liked {
  background: rgba(255, 100, 100, 0.1);
}

.comments-section {
  margin-top: 2rem;
}

.comments-title {
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  color: var(--color-text, #1a1a1a);
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-name-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  outline: none;
  transition: border-color 0.3s;
}

.comment-name-input:focus {
  border-color: #667eea;
}

.comment-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  font-size: 0.95rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s;
  font-family: inherit;
}

.comment-textarea:focus {
  border-color: #667eea;
}

.submit-comment-btn {
  margin-top: 0.75rem;
  padding: 0.6rem 1.5rem;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.submit-comment-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.3rem;
}

.comment-author {
  font-weight: 600;
  color: var(--color-text, #1a1a1a);
  font-size: 0.95rem;
}

.comment-date {
  font-size: 0.8rem;
  color: var(--color-text-secondary, #999);
}

.comment-content {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text, #333);
  line-height: 1.5;
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary, #999);
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
}

@media (max-width: 640px) {
  .post-detail-container {
    padding: 1rem;
  }

  .post-article {
    padding: 1.5rem;
  }

  .post-title {
    font-size: 1.5rem;
  }

  .post-meta {
    flex-wrap: wrap;
  }
}
</style>