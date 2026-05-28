<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { handleMouseEnter } from '../composables/useRipple'

interface RSSFeed {
  title: string
  url: string
  description: string
  items: RSSItem[]
}

interface RSSItem {
  title: string
  link: string
  pubDate: string
  description: string
}

const rssFeeds = ref<RSSFeed[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedFeed = ref<RSSFeed | null>(null)

const CORS_PROXY = 'https://api.allorigins.win/raw?url='

const presetFeeds = [
  {
    title: '阮一峰的网络日志',
    url: 'https://www.ruanyifeng.com/blog/atom.xml',
    description: '阮一峰的个人博客，分享技术见解'
  },
  {
    title: 'Hacker News',
    url: 'https://news.ycombinator.com/rss',
    description: 'Hacker News 最新资讯'
  },
  {
    title: '少数派',
    url: 'https://sspai.com/feed',
    description: '少数派 - 高效工作，品质生活'
  }
]

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
  const description = channel.querySelector('description')?.textContent || ''
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
    description,
    items: items.slice(0, 10)
  }
}

async function loadAllFeeds() {
  loading.value = true
  error.value = null
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
    error.value = err instanceof Error ? err.message : 'Failed to load RSS feeds'
  } finally {
    loading.value = false
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

onMounted(() => {
  loadAllFeeds()
})
</script>

<template>
  <div class="rss-container">
    <div class="rss-header">
      <h1 class="rss-title">RSS 订阅</h1>
      <p class="rss-subtitle">关注你感兴趣的博客和资讯</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载 RSS 订阅中...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button 
        class="retry-btn btn-ripple" 
        @click="loadAllFeeds"
        @mouseenter="(e) => handleMouseEnter(e, { color: '#fff', duration: '0.5s', scale: 2.5 })"
      >
        重试
      </button>
    </div>

    <div v-else class="rss-feeds">
      <div 
        v-for="feed in rssFeeds" 
        :key="feed.url" 
        class="feed-section"
      >
        <div class="feed-header">
          <h2 class="feed-title">{{ feed.title }}</h2>
          <p class="feed-description">{{ feed.description }}</p>
        </div>

        <div class="feed-items">
          <a 
            v-for="item in feed.items" 
            :key="item.link"
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
            class="feed-item"
          >
            <div class="item-content">
              <h3 class="item-title">{{ item.title }}</h3>
              <p class="item-description">{{ stripHtml(item.description).substring(0, 100) }}...</p>
              <span class="item-date">{{ formatDate(item.pubDate) }}</span>
            </div>
          </a>
        </div>
      </div>

      <div v-if="rssFeeds.length === 0" class="empty-state">
        <p>暂无 RSS 订阅内容</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rss-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.rss-header {
  text-align: center;
  margin-bottom: 3rem;
}

.rss-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
  border: 3px solid #000;
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #fff;
}

.rss-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 1rem 0 0 0;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #9F353A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #9F353A;
  color: white;
  border: 3px solid #000;
  border-radius: 0;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.retry-btn:hover {
  background: #000;
  color: #000;
  border-color: #9F353A;
}

.rss-feeds {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feed-section {
  border: 3px solid #000;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0;
}

.feed-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #000;
}

.feed-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.feed-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.feed-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feed-item {
  display: block;
  text-decoration: none;
  border: 2px solid #000;
  padding: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feed-item:hover {
  background: #9F353A;
  color: white;
  border-color: #9F353A;
}

.feed-item:hover .item-title {
  color: white;
}

.feed-item:hover .item-description {
  color: rgba(255, 255, 255, 0.9);
}

.feed-item:hover .item-date {
  color: rgba(255, 255, 255, 0.8);
}

.item-content {
  position: relative;
  z-index: 1;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
  transition: color 0.3s ease;
}

.item-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
  transition: color 0.3s ease;
}

.item-date {
  font-size: 0.8rem;
  color: #999;
  transition: color 0.3s ease;
}

@media (max-width: 768px) {
  .rss-container {
    padding: 1rem;
  }

  .rss-title {
    font-size: 1.8rem;
  }

  .rss-subtitle {
    font-size: 1rem;
  }

  .feed-section {
    padding: 1rem;
  }

  .feed-title {
    font-size: 1.3rem;
  }

  .item-title {
    font-size: 1rem;
  }

  .item-description {
    font-size: 0.85rem;
  }
}
</style>