<script setup lang="ts">
import { ref } from 'vue'

const photos = Array.from({ length: 125 }, (_, i) => ({
  id: i + 1,
  src: `/photos/photo (${i + 1}).jpg`,
  alt: `Photo ${i + 1}`
}))

const selectedPhoto = ref<typeof photos[0] | null>(null)

function openPhoto(photo: typeof photos[0]) {
  selectedPhoto.value = photo
}

function closePhoto() {
  selectedPhoto.value = null
}

function prevPhoto() {
  if (!selectedPhoto.value) return
  const currentIndex = photos.findIndex(p => p.id === selectedPhoto.value!.id)
  if (currentIndex > 0) {
    selectedPhoto.value = photos[currentIndex - 1]
  }
}

function nextPhoto() {
  if (!selectedPhoto.value) return
  const currentIndex = photos.findIndex(p => p.id === selectedPhoto.value!.id)
  if (currentIndex < photos.length - 1) {
    selectedPhoto.value = photos[currentIndex + 1]
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
    <div class="photo-grid">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="photo-card"
        @click="openPhoto(photo)"
      >
        <div class="photo-wrapper">
          <img 
            :src="photo.src" 
            :alt="photo.alt" 
            loading="lazy"
          />
        </div>
        <div class="photo-info">
          <span class="photo-number">#{{ photo.id }}</span>
        </div>
      </div>
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
              <span class="photo-counter">{{ photos.findIndex(p => p.id === selectedPhoto?.id) + 1 }} / {{ photos.length }}</span>
            </div>
            <div class="controls-buttons">
              <button class="control-btn" @click="prevPhoto" title="上一张 (←)">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button class="control-btn" @click="nextPhoto" title="下一张 (→)">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button class="control-btn close" @click="closePhoto" title="关闭 (ESC)">
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

.photo-card:nth-child(1) { animation-delay: 0.02s; }
.photo-card:nth-child(2) { animation-delay: 0.04s; }
.photo-card:nth-child(3) { animation-delay: 0.06s; }
.photo-card:nth-child(4) { animation-delay: 0.08s; }
.photo-card:nth-child(5) { animation-delay: 0.1s; }
.photo-card:nth-child(6) { animation-delay: 0.12s; }
.photo-card:nth-child(7) { animation-delay: 0.14s; }
.photo-card:nth-child(8) { animation-delay: 0.16s; }

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
}

.photo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.photo-card:hover .photo-wrapper img {
  transform: scale(1.08);
}

.photo-info {
  padding: 0.5rem 0.75rem;
  border-top: 2px solid #000;
}

.photo-number {
  font-size: 0.8rem;
  font-weight: 500;
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
  gap: 0.25rem;
}

.photo-title {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
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

@media (max-width: 768px) {
  .gallery-container {
    padding: 1rem;
  }

  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .modal-controls {
    bottom: 1rem;
    right: 1rem;
  }

  .control-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .modal-controls {
    bottom: 0.75rem;
    right: 0.75rem;
  }

  .control-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
