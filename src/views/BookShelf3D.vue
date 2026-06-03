<template>
  <div class="shelf-container">
    <div class="shelf-header">
      <button class="back-btn" @click="$router.push('/library')">
        <span>←</span> 返回藏书阁
      </button>
      <h1>3D 书架</h1>
      <p class="shelf-tip">拖拽浏览 · 悬停翻转 · 点击详情</p>
    </div>
    <div ref="canvasWrap" class="canvas-wrap"></div>
    <div v-if="selectedBook" class="book-popup" @click.self="selectedBook = null">
      <div class="popup-card">
        <img :src="selectedBook.cover" :alt="selectedBook.title" class="popup-cover" />
        <div class="popup-info">
          <h2>{{ selectedBook.title }}</h2>
          <p class="popup-author">{{ selectedBook.author }}</p>
          <p class="popup-desc">{{ selectedBook.description }}</p>
          <div class="popup-tags">
            <span v-for="tag in selectedBook.tags" :key="tag" class="popup-tag">{{ getTagName(tag) }}</span>
          </div>
          <p class="popup-chapters">{{ selectedBook.chapters.length }} 章</p>
          <button class="popup-btn" @click="goToRead">开始阅读</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllBooks, type Book } from '../lib/books'
import { BOOK_TAGS } from '../data/books'

declare const THREE: any

const router = useRouter()
const canvasWrap = ref<HTMLElement | null>(null)
const selectedBook = ref<Book | null>(null)

const getTagName = (id: string) => BOOK_TAGS.find(t => t.id === id)?.name || id

function goToRead() {
  if (selectedBook.value) {
    if (selectedBook.value.chapters.length > 0) {
      router.push(`/library/${selectedBook.value.id}/read/${selectedBook.value.chapters[0].id}`)
    } else {
      router.push(`/library/${selectedBook.value.id}`)
    }
  }
}

let scene: any, camera: any, renderer: any, raycaster: any, mouse: any
let bookMeshes: any[] = []
let isDragging = false
let dragMoved = false
let prevX = 0
let totalW = 0
let frameId = 0
let hoveredMesh: any = null
let cameraTargetX = 0
let gap = 2.2

async function init() {
  if (!canvasWrap.value) return
  const allBooks = await getAllBooks()

  const W = canvasWrap.value.clientWidth
  const H = canvasWrap.value.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)
  scene.fog = new THREE.Fog(0x1a1a2e, 40, 100)

  camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200)
  camera.position.set(0, 1.5, 12)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasWrap.value.appendChild(renderer.domElement)

  const ambLight = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambLight)
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(5, 10, 7)
  scene.add(dirLight)
  const pointLight = new THREE.PointLight(0x9F353A, 0.8, 25)
  pointLight.position.set(-3, 5, 5)
  scene.add(pointLight)

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  const books = allBooks
  const count = books.length
  totalW = (count - 1) * gap
  const loader = new THREE.TextureLoader()
  const bookW = 1.6
  const bookH = 2.2
  const bookD = 0.2

  for (let i = 0; i < count; i++) {
    const book = books[i]
    const x = i * gap - totalW / 2

    const group = new THREE.Group()

    // 书脊 (薄边，面向观众)
    const spineGeo = new THREE.BoxGeometry(bookD, bookH, bookW)
    const hue = (i / count) * 360
    const color = new THREE.Color(`hsl(${hue}, 60%, 40%)`)
    const spineMat = new THREE.MeshPhongMaterial({ color, shininess: 30 })
    const spine = new THREE.Mesh(spineGeo, spineMat)
    group.add(spine)

    // 封面贴在书的正面 (z+ 面)
    const coverGeo = new THREE.PlaneGeometry(bookD, bookH)
    const coverMat = new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 10 })
    const cover = new THREE.Mesh(coverGeo, coverMat)
    cover.rotation.y = -Math.PI / 2
    cover.position.x = bookW / 2 + 0.001
    group.add(cover)

    if (book.cover) {
      loader.load(book.cover, (tex: any) => {
        const mat = new THREE.MeshPhongMaterial({ map: tex, shininess: 10 })
        cover.material = mat
        cover.material.needsUpdate = true
      })
    }

    group.rotation.y = Math.PI * 0.12
    group.position.set(x, 0, 0)
    group.userData = { bookIndex: i, book, targetRotY: Math.PI * 0.12 }
    scene.add(group)
    bookMeshes.push(group)
  }

  const floorGeo = new THREE.PlaneGeometry(totalW + 40, 15)
  const floorMat = new THREE.MeshPhongMaterial({ color: 0x16213e, shininess: 5 })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -bookH / 2 - 0.01
  scene.add(floor)

  canvasWrap.value.addEventListener('mousedown', onMouseDown)
  canvasWrap.value.addEventListener('mousemove', onMouseMove)
  canvasWrap.value.addEventListener('mouseup', onMouseUp)
  canvasWrap.value.addEventListener('mouseleave', onMouseLeave)
  canvasWrap.value.addEventListener('click', onClick)
  canvasWrap.value.addEventListener('wheel', onWheel)
  canvasWrap.value.addEventListener('touchstart', onTouchStart, { passive: false })
  canvasWrap.value.addEventListener('touchmove', onTouchMove, { passive: false })
  canvasWrap.value.addEventListener('touchend', onMouseUp)

  animate()
}

function onMouseDown(e: MouseEvent) {
  isDragging = true
  dragMoved = false
  prevX = e.clientX
}

function onMouseMove(e: MouseEvent) {
  if (isDragging) {
    const dx = e.clientX - prevX
    if (Math.abs(dx) > 3) dragMoved = true
    cameraTargetX -= dx * 0.02
    prevX = e.clientX
    return
  }
  updateHover(e)
}

function onMouseUp() { isDragging = false }

function onMouseLeave() {
  isDragging = false
  if (hoveredMesh) {
    hoveredMesh.userData.targetRotY = Math.PI * 0.12
    hoveredMesh = null
  }
}

function onTouchStart(e: TouchEvent) {
  e.preventDefault()
  isDragging = true
  dragMoved = false
  prevX = e.touches[0].clientX
}
function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  if (!isDragging) return
  const dx = e.touches[0].clientX - prevX
  if (Math.abs(dx) > 3) dragMoved = true
  cameraTargetX -= dx * 0.02
  prevX = e.touches[0].clientX
}

function onWheel(e: WheelEvent) {
  camera.position.z = Math.max(6, Math.min(20, camera.position.z + e.deltaY * 0.01))
}

function updateHover(e: MouseEvent) {
  if (!canvasWrap.value) return
  const rect = canvasWrap.value.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObjects(bookMeshes, true)

  let newHovered: any = null
  if (hits.length > 0) {
    let obj = hits[0].object
    while (obj.parent && !obj.userData.book) obj = obj.parent
    if (obj.userData.book) newHovered = obj
  }

  if (newHovered !== hoveredMesh) {
    if (hoveredMesh) hoveredMesh.userData.targetRotY = Math.PI * 0.12
    if (newHovered) {
      newHovered.userData.targetRotY = 0
      cameraTargetX = newHovered.position.x
    }
    hoveredMesh = newHovered
  }
  canvasWrap.value.style.cursor = newHovered ? 'pointer' : 'grab'
}

function onClick(e: MouseEvent) {
  if (dragMoved) return
  if (!canvasWrap.value) return
  const rect = canvasWrap.value.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObjects(bookMeshes, true)
  if (hits.length > 0) {
    let obj = hits[0].object
    while (obj.parent && !obj.userData.book) obj = obj.parent
    if (obj.userData.book) {
      selectedBook.value = obj.userData.book
    }
  }
}

function animate() {
  frameId = requestAnimationFrame(animate)

  camera.position.x += (cameraTargetX - camera.position.x) * 0.08

  for (const mesh of bookMeshes) {
    const target = mesh.userData.targetRotY
    mesh.rotation.y += (target - mesh.rotation.y) * 0.1
  }

  renderer.render(scene, camera)
}

function onResize() {
  if (!canvasWrap.value) return
  const W = canvasWrap.value.clientWidth
  const H = canvasWrap.value.clientHeight
  camera.aspect = W / H
  camera.updateProjectionMatrix()
  renderer.setSize(W, H)
}

onMounted(() => {
  init()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('resize', onResize)
  if (renderer) renderer.dispose()
})
</script>

<style scoped>
.shelf-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
}

.shelf-header {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.shelf-header h1 {
  font-size: 1.2rem;
  color: #fff;
  margin: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: #9F353A;
  color: #9F353A;
}

.shelf-tip {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  margin: 0;
  margin-left: auto;
}

.canvas-wrap {
  flex: 1;
  cursor: grab;
  overflow: hidden;
}

.canvas-wrap:active {
  cursor: grabbing;
}

.book-popup {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.popup-card {
  background: #fff;
  border: 3px solid #000;
  display: flex;
  max-width: 700px;
  width: 90%;
  overflow: hidden;
}

.popup-cover {
  width: 220px;
  min-height: 300px;
  object-fit: cover;
  flex-shrink: 0;
}

.popup-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.popup-info h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}

.popup-author {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.popup-desc {
  color: #555;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  max-height: 120px;
  overflow-y: auto;
}

.popup-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.popup-tag {
  padding: 0.2rem 0.6rem;
  background: #f0f0f0;
  border: 1px solid #ddd;
  font-size: 0.75rem;
  color: #666;
}

.popup-chapters {
  color: #9F353A;
  font-size: 0.85rem;
  margin: 0;
  font-weight: 500;
}

.popup-btn {
  margin-top: auto;
  padding: 0.6rem 1.5rem;
  background: #9F353A;
  border: 3px solid #000;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}

.popup-btn:hover {
  background: #7a2a2e;
}

@media (max-width: 600px) {
  .popup-card {
    flex-direction: column;
  }
  .popup-cover {
    width: 100%;
    min-height: 200px;
    max-height: 250px;
  }
}
</style>
