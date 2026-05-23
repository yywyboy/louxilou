<script setup lang="ts">
import { ref, computed } from 'vue'

const photos = Array.from({ length: 36 }, (_, i) => ({
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

const columns = computed(() => {
  const cols: typeof photos[][] = [[], [], []]
  photos.forEach((photo, index) => {
    cols[index % 3].push(photo)
  })
  return cols
})
</script>

<template>
  <div class="gallery-container">
    <div class="photo-grid">
      <div v-for="(column, colIndex) in columns" :key="colIndex" class="photo-column">
        <div
          v-for="photo in column"
          :key="photo.id"
          class="photo-card"
          @click="openPhoto(photo)"
        >
          <img 
            :src="photo.src" 
            :alt="photo.alt" 
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPhoto" class="photo-modal" @click="closePhoto">
          <div class="modal-content" @click.stop>
            <button class="close-btn" @click="closePhoto">✕</button>
            <img :src="selectedPhoto.src" :alt="selectedPhoto.alt" />
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
  max-width: 1200px;
  margin: 0 auto;
}

.photo-grid {
  display: flex;
  gap: 1.5rem;
}

.photo-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.photo-card {
  border: 3px solid #000;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.photo-card:hover {
  border-color: #9F353A;
}

.photo-card img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.photo-card:hover img {
  transform: scale(1.05);
}

.photo-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-content img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: 2px solid #fff;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
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
    gap: 1rem;
  }

  .photo-column {
    gap: 1rem;
  }
}
</style>
