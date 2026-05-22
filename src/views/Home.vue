<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts, searchPosts, formatDate, estimateReadTime, type Post } from '../lib/blog'
import { articles } from '../data/articles'

const router = useRouter()
const activeTab = ref<'blog' | 'gallery' | 'announcements' | 'contact'>('blog')

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

const galleryCategories = [
  { label: '全部', value: 'all' },
  { label: '自然风光', value: 'nature' },
  { label: '城市建筑', value: 'city' },
  { label: '人物肖像', value: 'portrait' },
  { label: '动物世界', value: 'animal' },
  { label: '美食料理', value: 'food' }
]
const selectedGalleryCategory = ref('all')

const images = [
  { src: '/photos/photo (1).jpg', alt: '枯萎荷叶', category: 'nature' },
  { src: '/photos/photo (2).jpg', alt: '挂枝银杏', category: 'nature' },
  { src: '/photos/photo (3).jpg', alt: '枯萎荷叶', category: 'nature' },
  { src: '/photos/photo (4).jpg', alt: '夜景烟花', category: 'nature' },
  { src: '/photos/photo (5).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (6).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (7).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (8).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (9).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (10).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (11).jpg', alt: '散落银杏', category: 'nature' },
  { src: '/photos/photo (12).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (13).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (14).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (15).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (16).jpg', alt: '夜景烟花', category: 'city' },
  { src: '/photos/photo (17).jpg', alt: '红色枫叶', category: 'nature' },
  { src: '/photos/photo (18).jpg', alt: '红色枫叶', category: 'nature' },
  { src: '/photos/photo (19).jpg', alt: '红色枫叶', category: 'nature' },
  { src: '/photos/photo (20).jpg', alt: '挂枝银杏', category: 'nature' },
  { src: '/photos/photo (21).jpg', alt: '枯萎荷叶', category: 'nature' },
  { src: '/photos/photo (22).jpg', alt: '水到渠成', category: 'nature' },
  { src: '/photos/photo (23).jpg', alt: '植物微距', category: 'nature' },
  { src: '/photos/photo (24).jpg', alt: '天为画布', category: 'nature' },
  { src: '/photos/photo (25).jpg', alt: '这是花花', category: 'nature' },
  { src: '/photos/photo (26).jpg', alt: '水中三鸭', category: 'animal' },
  { src: '/photos/photo (27).jpg', alt: '一只黑鸭', category: 'animal' },
  { src: '/photos/photo (28).jpg', alt: '水中两鸭', category: 'animal' },
  { src: '/photos/photo (29).jpg', alt: '这是啥鸟', category: 'animal' },
  { src: '/photos/photo (30).jpg', alt: '花花特写', category: 'nature' },
  { src: '/photos/photo (31).jpg', alt: 'S型沙发', category: 'city' },
  { src: '/photos/photo (32).jpg', alt: '修枝工人', category: 'portrait' },
  { src: '/photos/photo (33).jpg', alt: '植物微距', category: 'nature' },
  { src: '/photos/photo (34).jpg', alt: '植物微距', category: 'nature' },
  { src: '/photos/photo (35).jpg', alt: '植物微距', category: 'nature' },
  { src: '/photos/photo (36).jpg', alt: '散落银杏', category: 'nature' }
]

const filteredImages = computed(() => {
  return images.filter(img => {
    return selectedGalleryCategory.value === 'all' || img.category === selectedGalleryCategory.value
  })
})

const lightboxOpen = ref(false)
const currentImageIndex = ref(0)

const expandedId = ref<string | null>(null)
const sortedAnnouncements = computed(() => {
  return [...articles].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

const contactInfo = {
  email: '17766710131@163.com',
  phone: '17766710131',
  bilibili: 'https://space.bilibili.com/603244446?spm_id_from=333.1007.0.0',
  acfun: 'https://www.acfun.cn/u/45238942',
  douyin: 'https://www.douyin.com/user/MS4wLjABAAAABe8u8MGYZKd631TZB7hWZwnGH2ZR1A5DyD2oTcgnLe4?from_tab_name=main',
  github: 'https://github.com/yywyboy',
  x: 'https://x.com/louxilou_',
  instagram: 'https://www.instagram.com/louxilou_?igsh=dzFjb3Nsc2Zjc2Qx'
}
const copiedField = ref<string | null>(null)

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

function openLightbox(index: number) {
  currentImageIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + filteredImages.value.length) % filteredImages.value.length
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % filteredImages.value.length
}

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

async function copyToClipboard(text: string, field: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedField.value = field
    setTimeout(() => {
      copiedField.value = null
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="site-title">楼西楼</h1>
      <p class="site-subtitle">记录想法、分享技术、留住生活</p>
    </div>

    <div class="tabs-container">
      <button
        v-for="tab in [
          { key: 'blog', label: '博客', icon: '📝' },
          { key: 'gallery', label: '观景台', icon: '🌅' },
          { key: 'announcements', label: '公告栏', icon: '📋' },
          { key: 'contact', label: '联系我', icon: '📮' }
        ]"
        :key="tab.key"
        class="tab-button"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key as any"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <div class="content-section">
      <Transition name="fade" mode="out-in">
        <div v-if="activeTab === 'blog'" key="blog" class="blog-panel">
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

          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>

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

          <div v-else class="empty-state">
            <div class="empty-icon">✍️</div>
            <p v-if="searchKeyword">没有找到匹配的文章</p>
            <p v-else>还没有文章，敬请期待</p>
          </div>
        </div>

        <div v-else-if="activeTab === 'gallery'" key="gallery" class="gallery-panel">
          <div class="gallery-category-bar">
            <button
              v-for="cat in galleryCategories"
              :key="cat.value"
              class="gallery-category-tag"
              :class="{ active: selectedGalleryCategory === cat.value }"
              @click="selectedGalleryCategory = cat.value"
            >
              {{ cat.label }}
            </button>
          </div>

          <div class="gallery-grid">
            <div
              v-for="(image, index) in filteredImages"
              :key="image.src"
              class="gallery-item"
              @click="openLightbox(filteredImages.indexOf(image))"
            >
              <div class="image-wrapper">
                <img
                  :src="image.src"
                  :alt="image.alt"
                  class="gallery-image"
                  loading="lazy"
                />
                <div class="image-overlay">
                  <span class="overlay-icon">👁️</span>
                </div>
              </div>
              <div class="image-info">
                <span class="image-title">{{ image.alt }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'announcements'" key="announcements" class="announcements-panel">
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
        </div>

        <div v-else-if="activeTab === 'contact'" key="contact" class="contact-panel">
          <div class="contact-grid">
            <div
              class="contact-item email-item"
              @click="copyToClipboard(contactInfo.email, 'email')"
            >
              <div class="contact-icon email-icon">📧</div>
              <div class="contact-info">
                <span class="contact-label">电子邮箱</span>
                <span class="contact-value">{{ contactInfo.email }}</span>
              </div>
              <div class="copy-hint">
                <svg v-if="copiedField !== 'email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>

            <div
              class="contact-item phone-item"
              @click="copyToClipboard(contactInfo.phone, 'phone')"
            >
              <div class="contact-icon phone-icon">📱</div>
              <div class="contact-info">
                <span class="contact-label">电话号码</span>
                <span class="contact-value">{{ contactInfo.phone }}</span>
              </div>
              <div class="copy-hint">
                <svg v-if="copiedField !== 'phone'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>

            <a :href="contactInfo.bilibili" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
              <div class="icon-wrapper bilibili-icon">
                <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                  <rect x="3" y="3" width="18" height="18" rx="4" fill="#FB7299"/>
                  <text x="12" y="17" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle">B</text>
                </svg>
              </div>
              <span class="icon-label">bilibili</span>
            </a>

            <a :href="contactInfo.acfun" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
              <div class="icon-wrapper acfun-icon">
                <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                  <rect x="3" y="3" width="18" height="18" rx="4" fill="#FF6B6B"/>
                  <text x="12" y="17" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle">A</text>
                </svg>
              </div>
              <span class="icon-label">AcFun</span>
            </a>

            <a :href="contactInfo.douyin" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
              <div class="icon-wrapper douyin-icon">
                <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                  <rect x="3" y="3" width="18" height="18" rx="4" fill="#1a1a1a"/>
                  <text x="12" y="17" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle">D</text>
                </svg>
              </div>
              <span class="icon-label">抖音</span>
            </a>

            <a :href="contactInfo.github" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
              <div class="icon-wrapper github-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <span class="icon-label">GitHub</span>
            </a>

            <a :href="contactInfo.x" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
              <div class="icon-wrapper x-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <span class="icon-label">X</span>
            </a>

            <a :href="contactInfo.instagram" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
              <div class="icon-wrapper instagram-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span class="icon-label">Instagram</span>
            </a>
          </div>
        </div>
      </Transition>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightboxOpen" class="lightbox-overlay" @click="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox">✕</button>
          <button class="lightbox-prev" @click.stop="prevImage">‹</button>
          <button class="lightbox-next" @click.stop="nextImage">›</button>
          <div class="lightbox-content" @click.stop>
            <img :src="filteredImages[currentImageIndex].src" :alt="filteredImages[currentImageIndex].alt" class="lightbox-image" />
            <div class="lightbox-caption">
              {{ filteredImages[currentImageIndex].alt }} ({{ currentImageIndex + 1 }} / {{ filteredImages.length }})
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
}

.site-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
}

.site-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-secondary, #666);
  margin: 0;
}

.tabs-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  color: var(--color-text-secondary, #666);
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.tab-icon {
  font-size: 1.25rem;
}

.tab-label {
  font-weight: 600;
}

.content-section {
  max-width: 1000px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.search-icon {
  font-size: 1.1rem;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
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
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
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
  margin-bottom: 1.5rem;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
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
  font-size: 1.1rem;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.post-card {
  display: flex;
  gap: 1.25rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
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
  border-radius: 12px;
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

.tag {
  font-size: 0.75rem;
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
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
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--color-text-secondary, #666);
  font-size: 1.1rem;
}

.gallery-category-bar {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.gallery-category-tag {
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

.gallery-category-tag:hover {
  border-color: #667eea;
  color: #667eea;
}

.gallery-category-tag.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

.gallery-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-4px);
}

.image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.overlay-icon {
  font-size: 2rem;
}

.image-info {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0 0 12px 12px;
  margin-top: -4px;
}

.image-title {
  font-size: 0.95rem;
  color: var(--color-text, #1a1a1a);
  font-weight: 500;
  display: block;
}

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.announcement-card {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
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
  padding: 1.25rem;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pin-badge {
  font-size: 1.1rem;
}

.announcement-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text, #333);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.announcement-date {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #999);
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
  border-top: 6px solid var(--color-text-secondary, #999);
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
  padding: 0 1.25rem 1.25rem;
}

.announcement-content {
  margin: 0;
  color: var(--color-text-secondary, #555);
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 1rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto;
  gap: 1.25rem;
  max-width: 900px;
  margin: 0 auto;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.email-item,
.phone-item {
  grid-column: 1 / -1;
}

.contact-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #fff;
  font-weight: bold;
  flex-shrink: 0;
}

.email-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.phone-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.contact-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary, #666);
  font-weight: 500;
}

.contact-value {
  font-size: 1.05rem;
  color: var(--color-text, #1a1a1a);
  font-weight: 600;
  word-break: break-all;
}

.copy-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary, #666);
  transition: color 0.3s ease, transform 0.3s ease;
  padding: 0.5rem;
}

.contact-item:hover .copy-hint {
  color: #667eea;
}

.copy-hint svg {
  transition: transform 0.3s ease;
}

.contact-item:hover .copy-hint svg {
  transform: scale(1.1);
}

.contact-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.contact-icon-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--icon-bg, #f0f0f0);
}

.bilibili-icon {
  background: linear-gradient(135deg, #FB7299 0%, #F5576C 100%);
}

.acfun-icon {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
}

.douyin-icon {
  background: #1a1a1a;
}

.github-icon {
  background: #171515;
  color: #fff;
}

.x-icon {
  background: #000000;
  color: #fff;
}

.instagram-icon {
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: #fff;
}

.icon-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary, #666);
  font-weight: 500;
}

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: pointer;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.lightbox-prev,
.lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-prev {
  left: 20px;
}

.lightbox-next {
  right: 20px;
}

.lightbox-prev:hover,
.lightbox-next:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  text-align: center;
  cursor: default;
}

.lightbox-image {
  max-width: 100%;
  max-height: 85vh;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.lightbox-caption {
  color: #fff;
  margin-top: 1rem;
  font-size: 1rem;
  opacity: 0.9;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .site-title {
    font-size: 2.5rem;
  }

  .site-subtitle {
    font-size: 1.1rem;
  }

  .tabs-container {
    gap: 0.25rem;
  }

  .tab-button {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .post-card {
    flex-direction: column;
  }

  .post-cover {
    width: 100%;
    height: 160px;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .email-item,
  .phone-item {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .email-item,
  .phone-item {
    grid-column: 1;
  }

  .contact-item {
    padding: 1rem 1.25rem;
  }

  .contact-icon-item {
    flex-direction: row;
    justify-content: flex-start;
    padding: 1rem 1.25rem;
    gap: 1rem;
  }

  .icon-wrapper {
    width: 44px;
    height: 44px;
  }
}
</style>