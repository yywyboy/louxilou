<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts, getActiveAnnouncement } from '../lib/blog'
import { handleMouseEnter } from '../composables/useRipple'
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
const showAnnouncementModal = ref(false)

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

const CORS_PROXY = 'https://api.allorigins.win/raw?url='

const presetFeeds = [
  { title: '阮一峰', url: 'https://www.ruanyifeng.com/blog/atom.xml' },
  { title: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
  { title: '少数派', url: 'https://sspai.com/feed' }
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
    if (isMobile()) {
      setTimeout(() => {
        showAnnouncementModal.value = true
      }, 500)
    }
  } catch (error) {
    console.error('Failed to load announcement:', error)
  }
}

function isMobile() {
  return window.innerWidth <= 768
}

function closeAnnouncementModal() {
  showAnnouncementModal.value = false
}

async function fetchRSSFeed(feedUrl: string): Promise<RSSFeed> {
  const response = await fetch(CORS_PROXY + encodeURIComponent(feedUrl))
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.statusText}`)
  }
  const text = await response.text()
  return parseRSS(text, feedUrl)
}

function parseRSS(xmlText: string, feedUrl: string): RSSFeed {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'text/xml')
  
  const channel = doc.querySelector('channel')
  if (!channel) {
    throw new Error('Invalid RSS feed format')
  }

  const title = channel.querySelector('title')?.textContent || 'Unknown Feed'
  const items: RSSItem[] = []

  const itemElements = doc.querySelectorAll('item')
  itemElements.forEach(item => {
    const itemTitle = item.querySelector('title')?.textContent || ''
    const itemLink = item.querySelector('link')?.textContent || ''
    const itemPubDate = item.querySelector('pubDate')?.textContent || ''
    const itemDescription = item.querySelector('description')?.textContent || ''

    if (itemTitle && itemLink) {
      items.push({
        title: itemTitle,
        link: itemLink,
        pubDate: itemPubDate,
        description: itemDescription
      })
    }
  })

  return {
    title,
    url: feedUrl,
    items: items.slice(0, 3)
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

    <Teleport to="body">
      <div v-if="showAnnouncementModal" class="modal-overlay" @click="closeAnnouncementModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeAnnouncementModal">×</button>
          <h3 class="modal-title">网站公告</h3>
          <p class="modal-body">
            {{ announcement?.content || '欢迎访问我的博客！这里会发布最新的更新公告和功能介绍。' }}
          </p>
          <button 
  class="modal-btn btn-ripple" 
  @click="closeAnnouncementModal"
  @mouseenter="(e) => handleMouseEnter(e, { color: '#fff', duration: '0.5s', scale: 2.5 })"
>知道了</button>
        </div>
      </div>
    </Teleport>

    <aside class="right-sidebar">
      <div class="sidebar-section">
        <h3 class="sidebar-title">快速链接</h3>
        <div class="quick-links">
          <a
            href="https://github.com/yywyboy"
            target="_blank"
            class="quick-link btn-ripple"
            @mouseenter="(e) => handleMouseEnter(e, { color: '#9F353A', duration: '0.5s', scale: 2.5 })"
          >
            <span class="link-text">GitHub</span>
          </a>
          <a
            href="https://space.bilibili.com/603244446"
            target="_blank"
            class="quick-link btn-ripple"
            @mouseenter="(e) => handleMouseEnter(e, { color: '#9F353A', duration: '0.5s', scale: 2.5 })"
          >
            <span class="link-text">Bilibili</span>
          </a>
          <a
            href="mailto:17766710131@163.com"
            class="quick-link btn-ripple"
            @mouseenter="(e) => handleMouseEnter(e, { color: '#9F353A', duration: '0.5s', scale: 2.5 })"
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
            @mouseenter="(e) => handleMouseEnter(e, { color: '#9F353A', duration: '0.5s', scale: 2.5 })"
          >
            <span class="link-text">楼西楼</span>
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
            @mouseenter="(e) => handleMouseEnter(e, { color: '#fff', duration: '0.5s', scale: 2.5 })"
          >
            文章
          </button>
          <button 
            class="tab-btn btn-ripple" 
            :class="{ active: activeTab === 'rss' }"
            @click="activeTab = 'rss'"
            @mouseenter="(e) => handleMouseEnter(e, { color: '#fff', duration: '0.5s', scale: 2.5 })"
          >
            RSS 订阅
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
            @mouseenter="(e) => handleMouseEnter(e, { color: '#9F353A', duration: '0.5s', scale: 2.5 })"
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
                class="rss-feed-item"
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

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.tab-buttons {
  display: flex;
  gap: 0;
}

.tab-btn {
  position: relative;
  padding: 0.6rem 1.25rem;
  background: #fff;
  color: #333;
  border: 3px solid #000;
  border-right: none;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
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
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem;
  border: 3px solid #000;
  border-radius: 0;
  font-size: 0.9rem;
  background: #fff;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
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
  border: 3px solid #000;
  background: #fff;
  padding: 1.25rem;
}

.rss-feed-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #000;
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
}
</style>
