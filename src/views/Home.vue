<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts, getActiveAnnouncement } from '../lib/blog'
import { initRipple } from '../composables/useRipple'

const vRipple = {
  mounted(el: HTMLElement) {
    initRipple(el)
  }
}
import type { Post } from '../lib/types'
import type { Announcement } from '../lib/blog'

const router = useRouter()
const posts = ref<Post[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const filteredPosts = ref<Post[]>([])
const announcement = ref<Announcement | null>(null)
const musicLoaded = ref(false)
const musicError = ref(false)

interface RSSItem {
  title: string
  link: string
  pubDate: string
  description: string
}

interface RSSFeed {
  title: string
  url: string
  items: RSSItem[]
}

const rssFeeds = ref<RSSFeed[]>([])
const rssLoading = ref(false)
const rssError = ref(false)
const activeTab = ref<'posts' | 'rss'>('posts')

const presetFeeds = [
  { title: '阮一峰', url: 'https://www.ruanyifeng.com/blog/atom.xml' },
  { title: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
  { title: '少数派', url: 'https://sspai.com/feed' },
  { title: 'V2EX', url: 'https://www.v2ex.com/feed/tab/tech.xml' },
  { title: '36氪', url: 'https://36kr.com/feed' },
  { title: '掘金', url: 'https://juejin.cn/rss' },
  { title: 'InfoQ', url: 'https://www.infoq.cn/feed' }
]

async function loadPosts() {
  loading.value = true
  try {
    posts.value = await getPosts()
    filteredPosts.value = posts.value
  } catch (error) {
    console.error('Failed to load posts:', error)
    posts.value = []
    filteredPosts.value = []
  }
  loading.value = false
}

async function loadAnnouncement() {
  try {
    announcement.value = await getActiveAnnouncement()
  } catch (error) {
    console.error('Failed to load announcement:', error)
  }
}

async function fetchRSSFeed(feedUrl: string): Promise<RSSFeed> {
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`
  const response = await fetch(apiUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.statusText}`)
  }
  const data = await response.json()
  
  if (data.status !== 'ok') {
    throw new Error('RSS feed returned error')
  }

  return {
    title: data.feed?.title || 'Unknown Feed',
    url: feedUrl,
    items: (data.items || []).slice(0, 3).map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      description: item.description || item.content || ''
    }))
  }
}

async function loadAllFeeds() {
  rssLoading.value = true
  rssError.value = false
  rssFeeds.value = []

  try {
    const results = await Promise.allSettled(
      presetFeeds.map(feed => fetchRSSFeed(feed.url))
    )

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        rssFeeds.value.push(result.value)
      } else {
        console.error(`Failed to load ${presetFeeds[index].title}:`, result.reason)
      }
    })
  } catch (err) {
    rssError.value = true
  } finally {
    rssLoading.value = false
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

function handleSearch() {
  if (!searchKeyword.value.trim()) {
    filteredPosts.value = posts.value
    return
  }
  filteredPosts.value = posts.value.filter(post =>
    post.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    (post.content && post.content.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  )
}

function navigateToPost(postId: string) {
  router.push(`/blog/${postId}`)
}

onMounted(() => {
  document.title = '楼西楼的博客 - 技术、生活与阅读'
  loadPosts()
  loadAnnouncement()
  loadAllFeeds()
})
</script>

<template>
  <div class="home-container">
    <aside class="left-sidebar">
      <div class="sidebar-section announcement-desktop">
        <h3 class="sidebar-title">网站公告</h3>
        <p v-if="announcement" class="sidebar-text">{{ announcement.content }}</p>
        <p v-else class="sidebar-text">欢迎访问我的博客！这里会发布最新的更新公告和功能介绍。</p>
      </div>

      <div class="sidebar-section music-section">
        <h3 class="sidebar-title">音乐</h3>
        <iframe 
          frameborder="no" 
          border="0" 
          marginwidth="0" 
          marginheight="0" 
          width="100%"
          height="450" 
          src="//music.163.com/outchain/player?type=0&id=17982886763&auto=0&height=430"
          class="music-player"
          @load="musicLoaded = true"
          @error="musicError = true"
        ></iframe>
        <div v-if="!musicLoaded && !musicError" class="music-loading">
          <div class="loading-spinner"></div>
          <p>音乐加载中...</p>
        </div>
        <div v-if="musicError" class="music-error">
          <p>音乐加载失败，请刷新页面重试</p>
        </div>
      </div>
    </aside>

    <aside class="right-sidebar">
      <div class="sidebar-section">
        <h3 class="sidebar-title">快速链接</h3>
        <div class="quick-links">
          <a
            href="https://github.com/yywyboy"
            target="_blank"
            class="quick-link btn-ripple"
            v-ripple
>
            <span class="link-text">GitHub</span>
          </a>
          <a
            href="https://space.bilibili.com/603244446"
            target="_blank"
            class="quick-link btn-ripple"
            v-ripple
>
            <span class="link-text">Bilibili</span>
          </a>
          <a
            href="mailto:17766710131@163.com"
            class="quick-link btn-ripple"
            v-ripple
>
            <span class="link-text">邮件联系</span>
          </a>
        </div>
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">友情链接</h3>
        <div class="friend-links">
          <a
            href="https://louxilou.com.cn"
            target="_blank"
            class="friend-link btn-ripple"
            v-ripple
>
            <span class="link-text">楼西楼</span>
          </a>
        </div>
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">RSS订阅</h3>
        <div class="rss-subscribe">
          <p class="rss-desc">订阅我的博客，获取最新文章更新</p>
          <a
            href="/feed.xml"
            target="_blank"
            class="rss-link"
            v-ripple
>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="rss-icon">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.37 20 6.18 20C5 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z"/>
            </svg>
            <span>订阅 RSS</span>
          </a>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div class="content-header">
        <div class="tab-buttons">
          <button 
            class="tab-btn btn-ripple" 
            :class="{ active: activeTab === 'posts' }"
            @click="activeTab = 'posts'"
            v-ripple
>
            <span class="btn-text">文章</span>
          </button>
          <button 
            class="tab-btn btn-ripple" 
            :class="{ active: activeTab === 'rss' }"
            @click="activeTab = 'rss'"
            v-ripple
>
            <span class="btn-text">RSS</span>
          </button>
        </div>
        <div v-if="activeTab === 'posts'" class="search-box">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索文章..."
            class="search-input"
            @input="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'posts'">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="filteredPosts.length === 0" class="empty-state">
          <p>还没有文章，敬请期待</p>
        </div>

        <div v-else class="post-list">
          <article
            v-for="post in filteredPosts"
            :key="post.id"
            class="post-card btn-ripple"
            @click="navigateToPost(post.id)"
            v-ripple
>
            <div class="post-body">
              <span class="post-category">{{ post.category }}</span>
              <h2 class="post-title">{{ post.title }}</h2>
              <p class="post-excerpt">{{ post.summary || (post.content || '').substring(0, 100) }}...</p>
              <div class="post-meta">
                <span class="post-date">{{ new Date(post.created_at).toLocaleDateString() }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-else class="rss-content">
        <div v-if="rssLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载 RSS 订阅中...</p>
        </div>

        <div v-else-if="rssError" class="empty-state">
          <p>RSS 加载失败，请稍后重试</p>
        </div>

        <div v-else class="rss-feeds">
          <div v-for="feed in rssFeeds" :key="feed.url" class="rss-feed-section">
            <h3 class="rss-feed-title">{{ feed.title }}</h3>
            <div class="rss-feed-items">
              <a
                v-for="item in feed.items"
                :key="item.link"
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="rss-feed-item btn-ripple"
                v-ripple
>
                <div class="rss-item-content">
                  <h4 class="rss-item-title">{{ item.title }}</h4>
                  <p class="rss-item-desc">{{ stripHtml(item.description).substring(0, 80) }}...</p>
                  <span class="rss-item-date">{{ formatDate(item.pubDate) }}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: #BDC0BA;
  max-width: 1200px;
  margin: 0 auto;
  display: block;
}

.left-sidebar {
  width: 250px;
  float: left;
  position: sticky;
  top: 80px;
  height: fit-content;
}

.main-content {
  margin-left: 270px;
  margin-right: 270px;
  border: 3px solid #000;
  background: #fff;
  padding: 1.5rem;
}

.right-sidebar {
  width: 250px;
  float: right;
  position: sticky;
  top: 80px;
  height: fit-content;
}

.sidebar-section {
  background: #fff;
  border-radius: 0;
  padding: 1.5rem;
  border: 3px solid #000;
  margin-bottom: 1.5rem;
}

.sidebar-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.sidebar-text {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.music-section {
  padding: 1.5rem;
  position: relative;
}

.music-player {
  border: none;
  width: calc(100% + 3rem);
  height: 450px;
  display: block;
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  margin-bottom: -1.5rem;
}

.music-loading,
.music-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 1;
}

.music-loading p,
.music-error p {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #fff;
  border: 3px solid #000;
  border-radius: 0;
  padding: 1.5rem;
  max-width: 400px;
  width: 100%;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
}

.modal-close:hover {
  color: #9F353A;
}

.modal-title {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.modal-body {
  margin: 0 0 1.5rem 0;
  color: #666;
  line-height: 1.6;
}

.modal-btn {
  position: relative;
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: #9F353A;
  color: white;
  border: 3px solid #000;
  border-radius: 0;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.modal-btn:hover {
  background: #000;
  color: #000;
  border-color: #9F353A;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.quick-link {
  position: relative;
  display: block;
  padding: 0.5rem 0.75rem;
  background: #fff;
  border-radius: 0;
  border: 3px solid #000;
  border-top: none;
  text-decoration: none;
  color: #333;
  font-size: 0.9rem;
  overflow: hidden;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.quick-link .link-text {
  position: relative;
  z-index: 2;
}

.quick-link:hover {
  color: white;
}

.quick-link:first-child {
  border-top: 3px solid #000;
}

.friend-links {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.friend-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: #fff;
  border-radius: 0;
  border: 3px solid #000;
  border-top: none;
  text-decoration: none;
  color: #333;
  font-size: 0.9rem;
  overflow: hidden;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.friend-link .link-icon,
.friend-link .link-text {
  position: relative;
  z-index: 2;
}

.friend-link:hover {
  color: white;
}

.friend-link:first-child {
  border-top: 3px solid #000;
}

.rss-subscribe {
  padding: 0.75rem;
  background: #fff;
  border: 3px solid #000;
}

.rss-desc {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.rss-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #9F353A;
  color: white;
  border: 2px solid #000;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  overflow: hidden;
}

.rss-link:hover {
  background: #000;
}

.rss-icon {
  flex-shrink: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.75rem;
}

.tab-buttons {
  display: flex;
  gap: 0;
}

.tab-btn {
  position: relative;
  padding: 0.5rem 1rem;
  background: #fff;
  color: #333;
  border: 3px solid #000;
  border-right: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-btn .btn-text {
  position: relative;
  z-index: 2;
}

.tab-btn:last-child {
  border-right: 3px solid #000;
}

.tab-btn.active {
  background: #9F353A;
  color: white;
}

.tab-btn:hover {
  background: #9F353A;
  color: white;
}

.search-box {
  flex: 1;
  max-width: 300px;
  display: flex;
  gap: 0;
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 3px solid #000;
  border-right: none;
  border-radius: 0;
  font-size: 0.9rem;
  background: #fff;
  transition: border-color 0.3s ease;
  height: 38px;
}

.search-input:focus {
  outline: none;
  border-color: #9F353A;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: #fff;
  border: 3px solid #000;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.search-btn:hover {
  background: #9F353A;
  color: white;
  border-color: #9F353A;
}

.rss-content {
  min-height: 300px;
}

.rss-feeds {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rss-feed-section {
  background: #fff;
  padding: 1.25rem;
}

.rss-feed-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  padding-bottom: 0.75rem;
  padding-left: 1.5rem;
  border-bottom: 2px solid #000;
  position: relative;
  display: flex;
  align-items: center;
}

.rss-feed-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 10px;
  height: 10px;
  border: 3px solid #9F353A;
  border-radius: 50%;
  background: transparent;
}

.rss-feed-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rss-feed-item {
  display: block;
  text-decoration: none;
  border: 2px solid #000;
  padding: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.rss-feed-item:hover {
  background: #9F353A;
  border-color: #9F353A;
}

.rss-feed-item:hover .rss-item-title,
.rss-feed-item:hover .rss-item-desc,
.rss-feed-item:hover .rss-item-date {
  color: white;
}

.rss-item-content {
  position: relative;
  z-index: 2;
}

.rss-item-title {
  margin: 0 0 0.4rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
}

.rss-item-desc {
  margin: 0 0 0.4rem 0;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.rss-item-date {
  font-size: 0.75rem;
  color: #999;
  transition: color 0.3s ease;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-top-color: #9F353A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  position: relative;
  background: #fff;
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid #000;
  transition: background-color 0.3s ease;
}

.post-card:hover {
  background-color: #9F353A;
}

.post-card .post-body {
  position: relative;
  z-index: 2;
  padding: 1.5rem;
}

.post-card:hover .post-title,
.post-card:hover .post-excerpt,
.post-card:hover .post-category,
.post-card:hover .post-date {
  color: white;
}

.post-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #9F353A;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  border-radius: 0;
}

.post-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
}

.post-excerpt {
  margin: 0 0 1rem 0;
  color: #666;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-date {
  font-size: 0.85rem;
  color: #888;
  transition: color 0.3s ease;
}

.btn-ripple {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-ripple > *:not(.ripple-effect) {
  position: relative;
  z-index: 1;
}

.ripple-effect {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.ripple-effect span {
  position: absolute;
  z-index: 0;
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
  }

  .announcement-desktop {
    display: none;
  }

  .left-sidebar {
    width: 100%;
    float: none;
    position: static;
    margin-bottom: 1.5rem;
    order: 4;
  }

  .right-sidebar {
    width: 100%;
    float: none;
    position: static;
    margin-bottom: 1.5rem;
    order: 3;
  }

  .main-content {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 1.5rem;
    order: 2;
  }

  .sidebar-section {
    width: 100%;
  }

  .music-player {
    height: 350px;
  }

  .music-loading,
  .music-error {
    height: 350px;
  }

  .content-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tab-buttons {
    flex: 1;
  }

  .tab-btn {
    flex: 1;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .search-box {
    flex: 1;
    max-width: none;
    width: 100%;
  }

  .search-input {
    font-size: 0.85rem;
  }

  .rss-feed-section {
    padding: 1rem;
  }

  .rss-feed-title {
    font-size: 1rem;
  }

  .rss-feed-item {
    padding: 0.6rem;
  }

  .rss-item-title {
    font-size: 0.9rem;
  }

  .rss-item-desc {
    font-size: 0.8rem;
  }
}
</style>
