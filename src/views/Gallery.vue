<script setup lang="ts">
import { ref, computed } from 'vue'
import { handleRipple } from '../composables/useRipple'

const categories = [
  { id: 'all', name: '全部' },
  { id: 'landscape', name: '风景' },
  { id: 'city', name: '城市' },
  { id: 'people', name: '人物' },
  { id: 'animal', name: '动物' },
  { id: 'food', name: '美食' },
  { id: 'art', name: '艺术' },
  { id: 'nature', name: '自然' },
  { id: 'architecture', name: '建筑' }
]

function getCategories(id: number): string[] {
  const cats: string[] = []
  if (id % 3 === 0) cats.push('landscape')
  if (id % 5 === 0) cats.push('city')
  if (id % 7 === 0) cats.push('people')
  if (id % 11 === 0) cats.push('animal')
  if (id % 13 === 0) cats.push('food')
  if (id % 2 === 0) cats.push('art')
  if (id % 4 === 0) cats.push('nature')
  if (id % 6 === 0) cats.push('architecture')
  if (cats.length === 0) cats.push('landscape')
  return cats
}

function getCategoryNames(ids: string[]): string[] {
  return ids.map(id => categories.find(c => c.id === id)?.name || '').filter(Boolean)
}

const photos = Array.from({ length: 125 }, (_, i) => {
  const cats = getCategories(i + 1)
  return {
    id: i + 1,
    src: `/photos/photo (${i + 1}).jpg`,
    alt: `Photo ${i + 1}`,
    categories: cats,
    categoryNames: getCategoryNames(cats)
  }
})

const selectedPhoto = ref<typeof photos[0] | null>(null)
const activeCategories = ref<string[]>([])
const loadedImages = ref<Set<number>>(new Set())

const filteredPhotos = computed(() => {
  if (activeCategories.value.length === 0) return photos
  return photos.filter(p => 
    activeCategories.value.some(cat => p.categories.includes(cat))
  )
})

function toggleCategory(categoryId: string) {
  if (categoryId === 'all') {
    activeCategories.value = []
    return
  }
  const index = activeCategories.value.indexOf(categoryId)
  if (index === -1) {
    activeCategories.value.push(categoryId)
  } else {
    activeCategories.value.splice(index, 1)
  }
}

function onImageLoad(id: number) {
  loadedImages.value.add(id)
}

function openPhoto(photo: typeof photos[0]) {
  selectedPhoto.value = photo
}

function closePhoto() {
  selectedPhoto.value = null
}

function prevPhoto() {
  if (!selectedPhoto.value) return
  const currentIndex = filteredPhotos.value.findIndex(p => p.id === selectedPhoto.value!.id)
  if (currentIndex > 0) {
    selectedPhoto.value = filteredPhotos.value[currentIndex - 1]
  }
}

function nextPhoto() {
  if (!selectedPhoto.value) return
  const currentIndex = filteredPhotos.value.findIndex(p => p.id === selectedPhoto.value!.id)
  if (currentIndex < filteredPhotos.value.length - 1) {
    selectedPhoto.value = filteredPhotos.value[currentIndex + 1]
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closePhoto()
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
}
</script>

<template>
  <div class="gallery-container" @keydown="handleKeydown" tabindex="0">
    <div class="gallery-header">
      <div class="category-tabs">
        <button
          class="category-btn btn-ripple"
          :class="{ active: activeCategories.length === 0 }"
          @click="toggleCategory('all')"
          @mousedown="(e) => handleRipple(e)"
          @touchstart="(e) => handleRipple(e.touches[0])"
        >
          全部
        </button>
        <button
          v-for="cat in categories.filter(c => c.id !== 'all')"
          :key="cat.id"
          class="category-btn btn-ripple"
          :class="{ active: activeCategories.includes(cat.id) }"
          @click="toggleCategory(cat.id)"
          @mousedown="(e) => handleRipple(e)"
          @touchstart="(e) => handleRipple(e.touches[0])"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <div class="results-info">
      <span>共 {{ filteredPhotos.length }} 张图片</span>
    </div>

    <div class="photo-grid" v-if="filteredPhotos.length > 0">
      <div
        v-for="photo in filteredPhotos"
        :key="photo.id"
        class="photo-card"
        :class="{ loaded: loadedImages.has(photo.id) }"
        @click="openPhoto(photo)"
      >
        <div class="photo-wrapper">
          <div class="photo-placeholder" v-if="!loadedImages.has(photo.id)">
            <div class="loading-spinner"></div>
          </div>
          <img 
            :src="photo.src" 
            :alt="photo.alt" 
            loading="lazy"
            @load="onImageLoad(photo.id)"
          />
        </div>
        <div class="photo-info">
          <span class="photo-number">#{{ photo.id }}</span>
          <div class="photo-tags">
            <span v-for="name in photo.categoryNames.slice(0, 2)" :key="name" class="photo-tag">{{ name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>没有找到匹配的图片</p>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPhoto" class="photo-modal" @click="closePhoto">
          <div class="modal-image-wrapper" @click.stop>
            <img :src="selectedPhoto.src" :alt="selectedPhoto.alt" />
          </div>
          
          <div class="modal-controls" @click.stop>
            <div class="controls-info">
              <span class="photo-title">{{ selectedPhoto.alt }}</span>
              <div class="modal-tags">
                <span v-for="name in selectedPhoto.categoryNames" :key="name" class="modal-tag">{{ name }}</span>
              </div>
              <span class="photo-counter">{{ filteredPhotos.findIndex(p => p.id === selectedPhoto?.id) + 1 }} / {{ filteredPhotos.length }}</span>
            </div>
            <div class="controls-buttons">
              <button class="control-btn btn-ripple" @click="prevPhoto" @mousedown="(e) => handleRipple(e)" @touchstart="(e) => handleRipple(e.touches[0])" title="上一张 (←)">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button class="control-btn btn-ripple" @click="nextPhoto" @mousedown="(e) => handleRipple(e)" @touchstart="(e) => handleRipple(e.touches[0])" title="下一张 (→)">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button class="control-btn close btn-ripple" @click="closePhoto" @mousedown="(e) => handleRipple(e)" @touchstart="(e) => handleRipple(e.touches[0])" title="关闭 (ESC)">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  outline: none;
}

.gallery-header {
  margin-bottom: 1.5rem;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-btn {
  width: 80px;
  padding: 0.5rem;
  background: #fff;
  border: 2px solid #000;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  text-align: center;
}

.btn-ripple > *:not(.ripple-effect) {
  position: relative;
  z-index: 1;
}

.category-btn:hover {
  background: #9F353A;
  color: white;
  border-color: #9F353A;
}

.category-btn.active {
  background: #9F353A;
  color: white;
  border-color: #9F353A;
}

.results-info {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.photo-card {
  border: 3px solid #000;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards;
}

.photo-card.loaded {
  opacity: 1;
  transform: translateY(0);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.photo-card:hover {
  border-color: #9F353A;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.photo-wrapper {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
}

.photo-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e0e0e0;
  border-top-color: #9F353A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.photo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease, opacity 0.3s ease;
  opacity: 0;
}

.photo-card.loaded .photo-wrapper img {
  opacity: 1;
}

.photo-card:hover .photo-wrapper img {
  transform: scale(1.08);
}

.photo-info {
  padding: 0.5rem 0.75rem;
  border-top: 2px solid #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.photo-number {
  font-size: 0.8rem;
  font-weight: 500;
  color: #666;
  flex-shrink: 0;
}

.photo-tags {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.photo-tag {
  font-size: 0.65rem;
  padding: 0.1rem 0.4rem;
  background: #9F353A;
  color: white;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.photo-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-image-wrapper {
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image-wrapper img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
}

.modal-controls {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  z-index: 10001;
}

.controls-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.photo-title {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.modal-tags {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.modal-tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  background: #9F353A;
  color: white;
}

.photo-counter {
  color: #999;
  font-size: 0.8rem;
}

.controls-buttons {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.control-btn:hover {
  background: #9F353A;
  border-color: #9F353A;
}

.control-btn.close:hover {
  background: #c44536;
  border-color: #c44536;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .category-btn {
    width: 72px;
    font-size: 0.8rem;
  }

  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .gallery-container {
    padding: 1rem;
  }

  .gallery-header {
    margin-bottom: 1rem;
  }

  .category-tabs {
    gap: 0.4rem;
  }

  .category-btn {
    width: 65px;
    padding: 0.4rem;
    font-size: 0.75rem;
  }

  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .photo-tag {
    font-size: 0.6rem;
    padding: 0.05rem 0.3rem;
  }

  .modal-controls {
    bottom: 1rem;
    right: 1rem;
  }

  .control-btn {
    width: 40px;
    height: 40px;
  }

  .photo-title {
    font-size: 0.8rem;
  }

  .modal-tag {
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .gallery-container {
    padding: 0.75rem;
  }

  .category-tabs {
    gap: 0.35rem;
  }

  .category-btn {
    width: 58px;
    padding: 0.35rem;
    font-size: 0.7rem;
  }

  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .photo-info {
    padding: 0.4rem 0.5rem;
  }

  .photo-number {
    font-size: 0.7rem;
  }

  .photo-tag {
    font-size: 0.55rem;
    padding: 0.05rem 0.25rem;
  }

  .modal-controls {
    bottom: 0.75rem;
    right: 0.75rem;
    gap: 0.75rem;
  }

  .controls-buttons {
    gap: 0.4rem;
  }

  .control-btn {
    width: 36px;
    height: 36px;
  }

  .control-btn svg {
    width: 16px;
    height: 16px;
  }
}
</style>
