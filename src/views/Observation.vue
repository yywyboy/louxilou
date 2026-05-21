<template>
  <div class="gallery-container">
    <div class="page-header">
      <h1>🌅 观景台</h1>
      <p>欣赏楼西楼的美丽风景</p>
    </div>
    
    <div class="gallery-grid">
      <TransitionGroup name="gallery" tag="div" class="gallery-list">
        <div
          v-for="(image, index) in displayedImages"
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
              <span class="overlay-text">查看大图</span>
            </div>
          </div>
          <div class="image-info">
            <span class="image-title">{{ image.alt }}</span>
            <span class="image-category">{{ getCategoryLabel(image.category) }}</span>
          </div>
        </div>
      </TransitionGroup>
    </div>
    
    <div class="search-container">
      <div class="search-box" :class="{ expanded: isSearchOpen }">
        <div class="search-content" v-if="isSearchOpen">
          <div class="category-filters">
            <span class="filter-label">图片类型</span>
            <div class="filter-tags">
              <button
                v-for="cat in categories"
                :key="cat.value"
                :class="{ active: selectedCategory === cat.value }"
                class="filter-tag"
                @click="selectCategory(cat.value)"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>
          
          <div class="search-results">
            <span class="results-count">找到 {{ filteredImages.length }} 张图片</span>
          </div>
        </div>
        
        <button class="search-trigger" @click="toggleSearch">
          <svg viewBox="0 0 24 24" class="search-icon">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightboxOpen" class="lightbox-overlay" @click="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox">✕</button>
          <button class="lightbox-prev" @click.stop="prevImage">‹</button>
          <button class="lightbox-next" @click.stop="nextImage">›</button>
          <div class="lightbox-content" @click.stop>
            <img :src="filteredImages[currentIndex].src" :alt="filteredImages[currentIndex].alt" class="lightbox-image" />
            <div class="lightbox-caption">
              {{ filteredImages[currentIndex].alt }} ({{ currentIndex + 1 }} / {{ filteredImages.length }})
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const lightboxOpen = ref(false)
const currentIndex = ref(0)
const isSearchOpen = ref(false)
const selectedCategory = ref('all')
const debouncedCategory = ref('all')

const categories = [
  { label: '全部', value: 'all' },
  { label: '自然风光', value: 'nature' },
  { label: '城市建筑', value: 'city' },
  { label: '人物肖像', value: 'portrait' },
  { label: '动物世界', value: 'animal' },
  { label: '美食料理', value: 'food' }
]

const getCategoryLabel = (value: string) => {
  const cat = categories.find(c => c.value === value)
  return cat ? cat.label : value
}

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
    return selectedCategory.value === 'all' || img.category === selectedCategory.value
  })
})

const displayedImages = computed(() => {
  return images.filter(img => {
    return debouncedCategory.value === 'all' || img.category === debouncedCategory.value
  })
})

let debounceTimer: number | null = null

const debounceSelectCategory = (category: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = window.setTimeout(() => {
    debouncedCategory.value = category
  }, 150)
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    document.dispatchEvent(new Event('searchopen'))
  }
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
  debounceSelectCategory(category)
}

const handleGlassMenuOpen = () => {
  if (isSearchOpen.value) {
    isSearchOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('glassmenuopen', handleGlassMenuOpen)
  debouncedCategory.value = selectedCategory.value
})

onUnmounted(() => {
  document.removeEventListener('glassmenuopen', handleGlassMenuOpen)
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})

const openLightbox = (index: number) => {
  currentIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + filteredImages.value.length) % filteredImages.value.length
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % filteredImages.value.length
}
</script>

<style scoped>
.gallery-container {
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  background: var(--bg-color, #f8f9fa);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-color, #1a1a1a);
  font-weight: 700;
}

.page-header p {
  font-size: 1.1rem;
  color: var(--text-secondary, #666666);
}

.gallery-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.gallery-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.gallery-item {
  cursor: pointer;
  transition: transform 0.2s ease-out;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.gallery-item:hover {
  transform: translateY(-4px);
}

.image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
  box-shadow: var(--image-shadow, 0 4px 16px rgba(0, 0, 0, 0.08));
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gallery-item:hover .gallery-image {
  transform: scale(1.08);
}

.gallery-enter-active,
.gallery-leave-active {
  transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

.gallery-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.gallery-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.gallery-move {
  transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.overlay-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.overlay-text {
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
}

.image-info {
  padding: 0.75rem;
  background: var(--card-bg, #ffffff);
  border-radius: 0 0 12px 12px;
  margin-top: -4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.image-title {
  font-size: 0.95rem;
  color: var(--text-color, #1a1a1a);
  font-weight: 500;
  display: block;
}

.image-category {
  font-size: 0.75rem;
  color: var(--text-secondary, #999999);
  margin-top: 0.25rem;
  display: block;
}

.search-container {
  position: fixed;
  right: 140px;
  bottom: 32px;
  z-index: 999;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--search-bg, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--search-border, rgba(255, 255, 255, 0.5));
  border-radius: 25px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: width 0.55s cubic-bezier(0.32, 0.72, 0, 1),
              transform 0.55s cubic-bezier(0.32, 0.72, 0, 1),
              opacity 0.55s cubic-bezier(0.32, 0.72, 0, 1),
              box-shadow 0.55s cubic-bezier(0.32, 0.72, 0, 1),
              background 0.3s ease,
              border-color 0.3s ease;
  width: 56px;
  height: 56px;
  overflow: hidden;
}

.search-box.expanded {
  width: 300px;
  height: auto;
  padding: 12px;
  flex-direction: column;
  align-items: stretch;
  transition: width 0.65s cubic-bezier(0.23, 1, 0.32, 1),
              transform 0.65s cubic-bezier(0.23, 1, 0.32, 1),
              opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 0.65s cubic-bezier(0.23, 1, 0.32, 1);
}

.search-content {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
  transition: all 0.45s cubic-bezier(0.32, 0.72, 0, 1);
}

.search-box.expanded .search-content {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: all 0.65s cubic-bezier(0.23, 1, 0.32, 1);
  transition-delay: 0.2s;
}

.category-filters {
  margin-bottom: 12px;
}

.filter-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #666666);
  margin-bottom: 8px;
  display: block;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-tag {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--text-secondary, #666666);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tag:hover {
  border-color: #4299e1;
  color: #4299e1;
}

.filter-tag.active {
  background: #4299e1;
  border-color: #4299e1;
  color: #ffffff;
}

.search-results {
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.results-count {
  font-size: 0.75rem;
  color: var(--text-secondary, #999999);
}

.search-trigger {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--search-trigger-bg, rgba(66, 153, 225, 0.9));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.55s cubic-bezier(0.32, 0.72, 0, 1);
  box-shadow: var(--search-trigger-shadow, 0 4px 16px rgba(66, 153, 225, 0.3));
}

.search-box.expanded .search-trigger {
  position: static;
  transform: none;
  width: 100%;
  height: 40px;
  border-radius: 12px;
  margin-top: 8px;
}

.search-icon {
  width: 22px;
  height: 22px;
  stroke: #ffffff;
  stroke-width: 2;
  fill: none;
}

.search-box.expanded .search-icon {
  width: 18px;
  height: 18px;
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
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
  color: #ffffff;
  margin-top: 1rem;
  font-size: 1rem;
  opacity: 0.9;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .gallery-container {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .search-container {
    right: 16px;
    bottom: 80px;
  }
  
  .search-box.expanded {
    width: calc(100vw - 64px);
    max-width: 280px;
  }
  
  .lightbox-prev,
  .lightbox-next {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
  }
  
  .lightbox-prev {
    left: 10px;
  }
  
  .lightbox-next {
    right: 10px;
  }
  
  .lightbox-close {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
  }
}


</style>