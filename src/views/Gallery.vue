<script setup lang="ts">
import { ref } from 'vue'

const photos = Array.from({ length: 125 }, (_, i) => ({
  id: i + 1,
  src: `/photos/photo (${i + 1}).jpg`,
  alt: `Photo ${i + 1}`
}))

const selectedPhoto = ref<typeof photos[0] | null>(null)
const loadedImages = ref<Set<number>>(new Set())

function openPhoto(photo: typeof photos[0]) {
  selectedPhoto.value = photo
}

function closePhoto() {
  selectedPhoto.value = null
}

function onImageLoad(id: number) {
  loadedImages.value.add(id)
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
        :class="{ loaded: loadedImages.has(photo.id) }"
        @click="openPhoto(photo)"
      >
        <img 
          :src="photo.src" 
          :alt="photo.alt" 
          loading="lazy"
          @load="onImageLoad(photo.id)"
        />
        <div class="photo-overlay">
          <span class="photo-number">#{{ photo.id }}</span>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPhoto" class="photo-modal" @click="closePhoto">
          <button class="nav-btn prev-btn" @click.stop="prevPhoto">‹</button>
          <div class="modal-content" @click.stop>
            <button class="close-btn" @click="closePhoto">✕</button>
            <img :src="selectedPhoto.src" :alt="selectedPhoto.alt" />
            <div class="photo-info">
              <span>{{ selectedPhoto.alt }}</span>
              <span class="photo-counter">{{ photos.findIndex(p => p.id === selectedPhoto?.id) + 1 }} / {{ photos.length }}</span>
            </div>
          </div>
          <button class="nav-btn next-btn" @click.stop="nextPhoto">›</button>
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.25rem;
}

.photo-card {
  border: 3px solid #000;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: #f0f0f0;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards;
}

.photo-card:nth-child(1) { animation-delay: 0.05s; }
.photo-card:nth-child(2) { animation-delay: 0.1s; }
.photo-card:nth-child(3) { animation-delay: 0.15s; }
.photo-card:nth-child(4) { animation-delay: 0.2s; }
.photo-card:nth-child(5) { animation-delay: 0.25s; }
.photo-card:nth-child(6) { animation-delay: 0.3s; }

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

.photo-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.photo-card:hover img {
  transform: scale(1.08);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-card:hover .photo-overlay {
  opacity: 1;
}

.photo-number {
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
}

.photo-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
}

.modal-content {
  position: relative;
  max-width: 85vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border: 2px solid #fff;
}

.photo-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  color: white;
  font-size: 0.9rem;
}

.photo-counter {
  color: #999;
}

.close-btn {
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: 2px solid #fff;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-btn:hover {
  background: #9F353A;
  border-color: #9F353A;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #fff;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
  z-index: 10;
}

.prev-btn {
  left: 1rem;
}

.next-btn {
  right: 1rem;
}

.nav-btn:hover {
  background: #9F353A;
  border-color: #9F353A;
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

  .photo-card img {
    height: 150px;
  }

  .nav-btn {
    font-size: 1.5rem;
    padding: 0.25rem 0.5rem;
  }

  .prev-btn {
    left: 0.5rem;
  }

  .next-btn {
    right: 0.5rem;
  }
}

@media (max-width: 480px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .photo-card img {
    height: 120px;
  }
}
</style>
