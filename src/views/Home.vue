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
          <button class="modal-btn" @click="closeAnnouncementModal">知道了</button>
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
      <div class="search-box">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索文章..."
          class="search-input"
          @input="handleSearch"
        />
      </div>

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
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: #9F353A;
  color: white;
  border: 3px solid #000;
  border-radius: 0;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-btn:hover {
  background: #c44536;
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

.search-box {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 3px solid #000;
  border-radius: 0;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #9F353A;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
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
