<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { getFriends } from '../lib/gallery'
import type { Friend } from '../lib/gallery'
import { getR2Url } from '../lib/r2-utils'
import { gsap } from '../composables/useGsap'

const friends = ref<Friend[]>([])
const loading = ref(true)

// 联系方式解析
interface ContactInfo {
  platform: string
  value: string
  isLink: boolean
  icon: string  // SVG path
}

const PLATFORM_ICONS: Record<string, string> = {
  '抖音': 'M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z',
  'WeChat': 'M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.329 6.329 0 0 1-.235-1.69c0-3.54 3.29-6.41 7.34-6.41.15 0 .305.003.457.01C16.563 4.457 12.97 2.188 8.691 2.188zm-2.6 4.408c-.58 0-1.05-.47-1.05-1.05s.47-1.05 1.05-1.05 1.05.47 1.05 1.05-.47 1.05-1.05 1.05zm5.2 0c-.58 0-1.05-.47-1.05-1.05s.47-1.05 1.05-1.05 1.05.47 1.05 1.05-.47 1.05-1.05 1.05zM16.52 10.18c-3.56 0-6.45 2.45-6.45 5.47 0 3.02 2.89 5.47 6.45 5.47.72 0 1.42-.11 2.07-.31a.67.67 0 0 1 .55.07l1.46.855a.25.25 0 0 0 .128.042.226.226 0 0 0 .226-.226c0-.054-.022-.108-.036-.162l-.298-1.132a.452.452 0 0 1 .163-.51c1.4-1.03 2.29-2.55 2.29-4.257 0-3.02-2.89-5.47-6.55-5.47zm-2.46 3.39c-.45 0-.81-.36-.81-.81s.36-.81.81-.81.81.36.81.81-.36.81-.81.81zm4.92 0c-.45 0-.81-.36-.81-.81s.36-.81.81-.81.81.36.81.81-.36.81-.81.81z',
  'Instagram': 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  '微博': 'M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM20.196 9.4a4.068 4.068 0 0 0-4.668-1.33.758.758 0 0 0 .377 1.47 2.553 2.553 0 0 1 2.931.836 2.54 2.54 0 0 1 .133 2.876.758.758 0 1 0 1.227.872A4.05 4.05 0 0 0 20.196 9.4zm-1.03 3.12a1.52 1.52 0 0 1-1.757-.54.758.758 0 0 0-1.295.76 3.027 3.027 0 0 0 3.51 1.081.758.758 0 1 0-.458-1.301z',
  '小红书': 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.5h-9v-1h9v1zm0-3h-9v-1h9v1zm0-3h-9v-1h9v1zm0-3h-9v-1h9v1z',
  'Email': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5v2l8 5 8-5V6zm0 12V8l-8 5-8-5v10h16z',
}

function parseContact(contact: string): ContactInfo | null {
  if (!contact) return null
  const match = contact.match(/^([^:]+):\s*(.+)$/)
  if (!match) return { platform: '链接', value: contact, isLink: contact.startsWith('http'), icon: '' }
  const platform = match[1].trim()
  const value = match[2].trim()
  const isLink = value.startsWith('http')
  const icon = PLATFORM_ICONS[platform] || ''
  return { platform, value, isLink, icon }
}

// 卡片状态
const cardOpen = ref(false)
const activeFriend = ref<Friend | null>(null)
const flyAvatar = ref<{ src: string; x: number; y: number; w: number; h: number } | null>(null)
let origAvatarEl: HTMLElement | null = null
let origAvatarRect: DOMRect | null = null

// 头像地址
function avatarUrl(filename: string) {
  return getR2Url(`friends/avatars/${filename}`)
}

// 朋友图片列表（带 R2 地址）
const friendPhotos = computed(() => {
  if (!activeFriend.value) return []
  return activeFriend.value.photos.map((p, i) => ({
    ...p,
    id: i + 1,
    src: getR2Url(`friends/photos/${activeFriend.value!.name}/${p.filename}`),
  }))
})

// 打开卡片
function openCard(friend: Friend, e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const img = el.querySelector('.friend-avatar') as HTMLImageElement
  if (!img) return
  const rect = img.getBoundingClientRect()

  // 隐藏原头像，记录位置
  origAvatarEl = img
  origAvatarRect = rect
  img.style.opacity = '0'

  // 设置飞头像起点
  flyAvatar.value = {
    src: avatarUrl(friend.avatar),
    x: rect.left, y: rect.top,
    w: rect.width, h: rect.height
  }

  activeFriend.value = friend
  cardOpen.value = true
  document.body.style.overflow = 'hidden'

  nextTick(() => {
    const overlay = document.querySelector('.card-overlay') as HTMLElement
    const card = document.querySelector('.friend-card') as HTMLElement
    const cardAvatar = document.querySelector('.card-avatar-img') as HTMLImageElement
    if (!card || !cardAvatar) return

    // 背景淡入
    if (overlay) gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })

    // 先把卡片放到最终位置，算出准确的目标坐标
    gsap.set(card, { opacity: 1, y: 0 })
    cardAvatar.style.opacity = '0'
    cardAvatar.style.transition = 'none'
    const targetRect = cardAvatar.getBoundingClientRect()

    // 恢复卡片初始状态
    gsap.set(card, { opacity: 0, y: 30 })

    // 飞头像动画
    const fly = document.querySelector('.fly-avatar') as HTMLElement
    if (fly) {
      gsap.set(fly, { willChange: 'transform' })
      gsap.fromTo(fly, {
        x: 0, y: 0,
        width: rect.width, height: rect.height,
        opacity: 1, borderRadius: '50%',
      }, {
        x: targetRect.left - rect.left,
        y: targetRect.top - rect.top,
        width: targetRect.width,
        height: targetRect.height,
        borderRadius: '50%',
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to(fly, { opacity: 0, duration: 0.15, ease: 'power1.out', onComplete: () => { flyAvatar.value = null } })
          cardAvatar.style.opacity = '1'
        }
      })
    }

    // 卡片弹出
    gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 })

    // 内容淡入
    gsap.fromTo('.card-info', { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.25 })
    gsap.fromTo('.card-photos', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.35 })
  })
}

// 关闭卡片
function closeCard() {
  gsap.killTweensOf('.fly-avatar')
  gsap.killTweensOf('.friend-card')
  gsap.killTweensOf('.card-info')
  gsap.killTweensOf('.card-photos')
  gsap.killTweensOf('.card-overlay')

  const overlay = document.querySelector('.card-overlay') as HTMLElement
  const card = document.querySelector('.friend-card') as HTMLElement
  if (!card) { finishClose(); return }

  const cardAvatar = document.querySelector('.card-avatar-img') as HTMLImageElement
  const fly = document.querySelector('.fly-avatar') as HTMLElement

  if (!origAvatarEl || !origAvatarRect) { finishClose(); return }

  let startX = 0, startY = 0, startW = 0, startH = 0

  if (fly) {
    const flyRect = fly.getBoundingClientRect()
    startX = flyRect.left; startY = flyRect.top
    startW = flyRect.width; startH = flyRect.height
  } else if (cardAvatar) {
    const imgRect = cardAvatar.getBoundingClientRect()
    startX = imgRect.left; startY = imgRect.top
    startW = imgRect.width; startH = imgRect.height
  }

  // 确保飞头像存在
  if (!fly) {
    flyAvatar.value = {
      src: activeFriend.value ? avatarUrl(activeFriend.value.avatar) : '',
      x: startX, y: startY, w: startW, h: startH
    }
    if (cardAvatar) cardAvatar.style.opacity = '0'
    nextTick(() => doCloseAnim(document.querySelector('.fly-avatar') as HTMLElement, card, overlay, startX, startY))
  } else {
    if (cardAvatar) cardAvatar.style.opacity = '0'
    doCloseAnim(fly, card, overlay, startX, startY)
  }
}

function doCloseAnim(fly: HTMLElement, card: HTMLElement, overlay: HTMLElement | null, startX: number, startY: number) {
  if (!fly || !origAvatarRect) { finishClose(); return }

  // 背景淡出
  if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.45, ease: 'power2.inOut' })

  // 飞头像飞回
  gsap.to(fly, {
    x: origAvatarRect.left - startX,
    y: origAvatarRect.top - startY,
    width: origAvatarRect.width,
    height: origAvatarRect.height,
    borderRadius: '50%',
    duration: 0.45,
    ease: 'expo.inOut',
    onComplete: () => {
      if (origAvatarEl) origAvatarEl.style.opacity = '1'
      requestAnimationFrame(() => {
        flyAvatar.value = null
        cardOpen.value = false
        activeFriend.value = null
        document.body.style.overflow = ''
        origAvatarEl = null
        origAvatarRect = null
      })
    }
  })

  // 卡片消失
  gsap.to(card, { opacity: 0, y: 20, duration: 0.35, ease: 'power2.in' })
}

function finishClose() {
  if (origAvatarEl) { origAvatarEl.style.opacity = ''; origAvatarEl = null }
  origAvatarRect = null
  cardOpen.value = false
  activeFriend.value = null
  flyAvatar.value = null
  document.body.style.overflow = ''
}

// Lightbox（查看大图）+ 飞图动画
const selIdx = ref<number>(-1)
const selPhoto = computed(() => selIdx.value >= 0 ? friendPhotos.value[selIdx.value] : null)
const flyImg = ref<{ src: string; x: number; y: number; w: number; h: number } | null>(null)
let origImgEl: HTMLElement | null = null
let origImgRect: DOMRect | null = null

function openPhoto(idx: number, e: MouseEvent) {
  const phEl = (e.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement
  if (!phEl) return

  const rect = phEl.getBoundingClientRect()

  // 隐藏原图，记录位置
  origImgEl = phEl
  origImgRect = rect
  phEl.style.opacity = '0'

  // 设置飞图起点
  flyImg.value = {
    src: friendPhotos.value[idx].src,
    x: rect.left, y: rect.top,
    w: rect.width, h: rect.height
  }

  selIdx.value = idx

  nextTick(() => {
    // 等飞图元素渲染 + 图片加载
    requestAnimationFrame(() => {
      const lb = document.querySelector('.flb') as HTMLElement
      const lbImg = document.querySelector('.flb-img') as HTMLImageElement
      const lbBar = document.querySelector('.flb-bar') as HTMLElement
      const fly = document.querySelector('.fly-img') as HTMLElement
      if (!lb || !lbImg || !fly) return

      // 背景淡入
      gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })

      // 隐藏 lightbox 图片，等飞图到位
      lbImg.style.opacity = '0'
      lbImg.style.transition = 'none'

      const targetRect = lbImg.getBoundingClientRect()

      // 飞图动画
      gsap.set(fly, { willChange: 'transform' })
      gsap.fromTo(fly, {
        x: 0, y: 0,
        width: rect.width, height: rect.height,
        opacity: 1, borderRadius: 6,
      }, {
        x: targetRect.left - rect.left,
        y: targetRect.top - rect.top,
        width: targetRect.width,
        height: targetRect.height,
        borderRadius: 0,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to(fly, { opacity: 0, duration: 0.15, ease: 'power1.out', onComplete: () => { flyImg.value = null } })
          lbImg.style.opacity = '1'
        }
      })

      // 底部栏浮出
      if (lbBar) {
        gsap.set(lbBar, { y: 60, opacity: 0 })
        gsap.to(lbBar, { y: 0, opacity: 1, duration: 0.5, delay: 0.15, ease: 'back.out(1.2)' })
      }
    })
  })
}

function closePhoto() {
  gsap.killTweensOf('.fly-img')
  gsap.killTweensOf('.flb')
  gsap.killTweensOf('.flb-img')
  gsap.killTweensOf('.flb-bar')

  const lb = document.querySelector('.flb') as HTMLElement
  const lbImg = document.querySelector('.flb-img') as HTMLImageElement
  const lbBar = document.querySelector('.flb-bar') as HTMLElement
  const fly = document.querySelector('.fly-img') as HTMLElement

  if (!origImgEl || !origImgRect) { finishClosePhoto(); return }

  let startX = 0, startY = 0, startW = 0, startH = 0

  if (fly) {
    const flyRect = fly.getBoundingClientRect()
    startX = flyRect.left; startY = flyRect.top
    startW = flyRect.width; startH = flyRect.height
  } else if (lbImg) {
    const imgRect = lbImg.getBoundingClientRect()
    startX = imgRect.left; startY = imgRect.top
    startW = imgRect.width; startH = imgRect.height
  }

  // 确保飞图存在
  if (!fly) {
    flyImg.value = {
      src: selPhoto.value?.src || '',
      x: startX, y: startY, w: startW, h: startH
    }
    nextTick(() => doClosePhotoAnim(document.querySelector('.fly-img') as HTMLElement, startX, startY))
  } else {
    doClosePhotoAnim(fly, startX, startY)
  }

  // 底部栏消失
  if (lbBar) gsap.to(lbBar, { y: 40, opacity: 0, duration: 0.25, ease: 'power2.in' })
  // 背景淡出
  if (lb) gsap.to(lb, { opacity: 0, duration: 0.45, ease: 'power2.inOut' })
}

function doClosePhotoAnim(fly: HTMLElement, startX: number, startY: number) {
  if (!fly || !origImgRect) { finishClosePhoto(); return }

  gsap.to(fly, {
    x: origImgRect.left - startX,
    y: origImgRect.top - startY,
    width: origImgRect.width,
    height: origImgRect.height,
    borderRadius: 6,
    duration: 0.45,
    ease: 'expo.inOut',
    onComplete: () => {
      if (origImgEl) origImgEl.style.opacity = '1'
      requestAnimationFrame(() => {
        flyImg.value = null
        selIdx.value = -1
        origImgEl = null
        origImgRect = null
      })
    }
  })
}

function finishClosePhoto() {
  if (origImgEl) origImgEl.style.opacity = '1'
  flyImg.value = null
  selIdx.value = -1
  origImgEl = null
  origImgRect = null
}

function prevPhoto() {
  if (selIdx.value > 0) {
    selIdx.value--
    nextTick(() => {
      const lbImg = document.querySelector('.flb-img') as HTMLElement
      if (lbImg) {
        gsap.fromTo(lbImg,
          { x: 80, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }
        )
      }
    })
  }
}

function nextPhoto() {
  if (selIdx.value < friendPhotos.value.length - 1) {
    selIdx.value++
    nextTick(() => {
      const lbImg = document.querySelector('.flb-img') as HTMLElement
      if (lbImg) {
        gsap.fromTo(lbImg,
          { x: -80, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }
        )
      }
    })
  }
}

function onKey(e: KeyboardEvent) {
  if (selPhoto.value) {
    if (e.key === 'Escape') closePhoto()
    if (e.key === 'ArrowLeft') prevPhoto()
    if (e.key === 'ArrowRight') nextPhoto()
    return
  }
  if (cardOpen.value && e.key === 'Escape') closeCard()
}

function animItems() {
  const items = document.querySelectorAll('.flist-item:not(.shown)')
  if (!items.length) return
  gsap.fromTo(items, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out', onComplete: () => items.forEach(c => c.classList.add('shown')) })
}

onMounted(async () => {
  document.title = '朋友的图 — LOUXILOU'
  try { friends.value = await getFriends() } catch (e) { console.error(e) }
  loading.value = false
  document.addEventListener('keydown', onKey)
  await nextTick()
  gsap.fromTo('.pg-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.1 })
  animItems()
})

onUnmounted(() => { document.removeEventListener('keydown', onKey) })
</script>

<template>
  <div class="fg">
    <div class="ctr">

      <header class="pg-head">
        <span class="eyebrow">Friends</span>
        <h1 class="pg-title">朋友的图</h1>
        <p class="pg-desc">来自朋友们的精彩瞬间</p>
      </header>

      <!-- 骨架屏 -->
      <div v-if="loading" class="skeleton-list">
        <div v-for="i in 3" :key="i" class="skeleton-row"><div class="skeleton-circle"></div><div class="skeleton-bar"></div></div>
      </div>

      <!-- 列表 -->
      <div v-else class="friend-list">
        <div v-for="f in friends" :key="f.id" class="friend-row flist-item" @click="openCard(f, $event)">
          <div class="friend-head">
            <img :src="avatarUrl(f.avatar)" :alt="f.name" class="friend-avatar" loading="lazy" decoding="async" />
            <div class="friend-meta">
              <span class="friend-name">{{ f.name }}</span>
              <span class="friend-intro">{{ f.intro }}</span>
            </div>
            <a class="friend-view interactive">查看更多 →</a>
          </div>
          <div class="friend-line"></div>
          <div class="friend-thumbs">
            <div v-for="(p, i) in f.photos.slice(0, 3)" :key="i" class="friend-thumb">
              <img :src="getR2Url(`friends/photos/${f.name}/${p.filename}`)" :alt="p.caption || f.name" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 飞头像 -->
    <Teleport to="body">
      <div v-if="flyAvatar" class="fly-avatar" :style="{ left: flyAvatar.x + 'px', top: flyAvatar.y + 'px', width: flyAvatar.w + 'px', height: flyAvatar.h + 'px' }">
        <img :src="flyAvatar.src" class="fly-avatar-inner" />
      </div>
      <!-- 飞图（大图动画） -->
      <div v-if="flyImg" class="fly-img" :style="{ left: flyImg.x + 'px', top: flyImg.y + 'px', width: flyImg.w + 'px', height: flyImg.h + 'px' }">
        <img :src="flyImg.src" class="fly-img-inner" />
      </div>
    </Teleport>

    <!-- 卡片叠加层 -->
    <Teleport to="body">
      <div v-if="cardOpen" class="card-overlay" @click.self="closeCard" @wheel.prevent>
        <div class="friend-card" v-if="activeFriend" @wheel.stop>
          <button class="card-close interactive" @click="closeCard">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="card-top">
            <div class="card-header">
              <div class="card-avatar">
                <img :src="avatarUrl(activeFriend.avatar)" :alt="activeFriend.name" class="card-avatar-img" />
              </div>
              <div class="card-title-area">
                <h2 class="card-name">{{ activeFriend.name }}</h2>
                <p class="card-intro">{{ activeFriend.intro }}</p>
              </div>
            </div>
            <div class="card-meta">
              <div class="card-stat">
                <span class="card-stat-label">共</span>
                <span class="card-stat-num">{{ activeFriend.photos.length }}</span>
                <span class="card-stat-label">张照片</span>
              </div>
              <a v-if="activeFriend.contact && parseContact(activeFriend.contact)" :href="parseContact(activeFriend.contact)!.isLink ? parseContact(activeFriend.contact)!.value : undefined" :target="parseContact(activeFriend.contact)!.isLink ? '_blank' : undefined" rel="noopener" class="card-contact">
                <svg v-if="parseContact(activeFriend.contact)!.icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" class="contact-icon"><path :d="parseContact(activeFriend.contact)!.icon"/></svg>
                <span>{{ parseContact(activeFriend.contact)!.platform }}</span>
              </a>
            </div>
          </div>

          <div class="card-photos">
            <div class="card-photo-grid">
              <div v-for="(p, i) in friendPhotos" :key="p.id" class="card-photo interactive" @click="openPhoto(i, $event)">
                <img :src="p.src" :alt="p.caption || activeFriend.name" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 大图查看 -->
    <Teleport to="body">
      <div v-if="selPhoto" class="flb" @click.self="closePhoto">
        <div class="flb-body" @click.self="closePhoto">
          <img :src="selPhoto.src" :alt="selPhoto.caption || ''" class="flb-img" decoding="async" />
        </div>
        <div class="flb-bar">
          <div class="flb-bar-shell">
            <button class="flb-btn interactive" @click="closePhoto" title="关闭">
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div class="flb-div"></div>
            <button class="flb-btn interactive" @click.stop="prevPhoto" :disabled="selIdx <= 0" title="上一张">
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button class="flb-btn interactive" @click.stop="nextPhoto" :disabled="selIdx >= friendPhotos.length - 1" title="下一张">
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <div class="flb-div"></div>
            <span v-if="selPhoto.caption" class="flb-caption">{{ selPhoto.caption }}</span>
            <div class="flb-div"></div>
            <span class="flb-counter">{{ selIdx + 1 }} / {{ friendPhotos.length }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.fg { position: relative; z-index: 1; padding: 2rem 0 6rem; }

.pg-head { text-align: center; margin-bottom: 3rem; opacity: 0; }
.eyebrow { font-family: var(--font-sans); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.3em; text-transform: uppercase; display: block; margin-bottom: 1rem; }
.pg-title { font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; letter-spacing: 0.06em; margin-bottom: 0.75rem; }
.pg-desc { font-size: 0.88rem; color: var(--ink-ghost); letter-spacing: 0.05em; }

/* 骨架屏 */
.skeleton-list { display: flex; flex-direction: column; gap: 1.5rem; }
.skeleton-row { display: flex; align-items: center; gap: 1rem; }
.skeleton-circle {
  width: 56px; height: 56px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-warm) 50%, var(--bg-elevated) 75%);
  background-size: 200% 100%; animation: skeleton-pulse 1.5s ease-in-out infinite;
}
.skeleton-bar {
  width: 120px; height: 14px; border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-warm) 50%, var(--bg-elevated) 75%);
  background-size: 200% 100%; animation: skeleton-pulse 1.5s ease-in-out infinite;
}
@keyframes skeleton-pulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* 列表 */
.friend-list { display: flex; flex-direction: column; }
.friend-row { opacity: 0; cursor: pointer; }
.friend-row.shown { opacity: 1; }
.friend-head { display: flex; align-items: center; gap: 1rem; padding-bottom: 1.25rem; }
.friend-avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); flex-shrink: 0; }
.friend-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.15rem; }
.friend-name { font-family: var(--font-display); font-size: 1.05rem; font-weight: 600; color: var(--ink); }
.friend-intro { font-size: 0.78rem; color: var(--ink-ghost); }
.friend-view { font-family: var(--font-sans); font-size: 0.72rem; color: var(--ink-ghost); text-decoration: none; cursor: pointer; transition: color 0.3s; flex-shrink: 0; }
.friend-view:hover { color: var(--gold); }
.friend-line { height: 1px; background: var(--border); margin-bottom: 1.25rem; }
.friend-thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; margin-bottom: 1.5rem; }
.friend-thumb { overflow: hidden; border-radius: var(--r-xs); background: var(--bg-elevated); line-height: 0; }
.friend-thumb img { width: 100%; height: 160px; object-fit: cover; display: block; transition: transform 0.4s var(--ease); }
.friend-thumb:hover img { transform: scale(1.03); }

@media (max-width: 768px) {
  .pg-title { font-size: 2.5rem; }
  .friend-thumb img { height: 100px; }
}
</style>

<style>
/* 飞头像 */
.fly-avatar {
  position: fixed; z-index: 10004; pointer-events: none;
  overflow: hidden; will-change: transform;
}
.fly-avatar-inner { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 50%; }

/* 飞图 */
.fly-img {
  position: fixed; z-index: 10007; pointer-events: none;
  overflow: hidden; will-change: transform;
}
.fly-img-inner { width: 100%; height: 100%; object-fit: cover; display: block; }

/* 卡片叠加层 */
.card-overlay {
  position: fixed; inset: 0; z-index: 10003;
  background: rgba(var(--bg-rgb), 0.92);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.friend-card {
  width: 520px; max-width: calc(100vw - 2rem);
  max-height: calc(100vh - 4rem);
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl);
  box-shadow: 0 24px 80px rgba(0,0,0,0.12);
  display: flex; flex-direction: column;
  overflow: hidden; position: relative;
  opacity: 0; will-change: transform, opacity;
}
.card-close {
  position: absolute; top: 1.25rem; right: 1.25rem; z-index: 10;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  background: var(--bg-warm); border: 1px solid var(--border); border-radius: 50%;
  color: var(--ink-ghost); transition: all 0.3s; cursor: pointer;
}
.card-close:hover { color: var(--gold); border-color: var(--gold); }

/* 卡片顶部：头像 + 信息 */
.card-top { padding: 2rem 2rem 1.5rem; flex-shrink: 0; }
.card-header { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.25rem; }
.card-avatar { overflow: hidden; border-radius: 50%; background: var(--bg-elevated); width: 72px; height: 72px; flex-shrink: 0; }
.card-avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 50%; }
.card-title-area { flex: 1; min-width: 0; }
.card-name { font-family: var(--font-display); font-size: 1.35rem; font-weight: 700; margin-bottom: 0.2rem; line-height: 1.3; }
.card-intro { font-size: 0.82rem; color: var(--ink-ghost); line-height: 1.5; }

.card-meta { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border); }
.card-contact { display: inline-flex; align-items: center; gap: 0.35rem; font-family: var(--font-sans); font-size: 0.75rem; color: var(--gold); text-decoration: none; transition: opacity 0.3s; }
.card-contact:hover { opacity: 0.75; }
.contact-icon { flex-shrink: 0; opacity: 0.85; }
.card-stat { display: flex; align-items: baseline; gap: 0.15rem; }
.card-stat-num { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--gold); }
.card-stat-label { font-size: 0.72rem; color: var(--ink-ghost); }

/* 卡片图片区域 */
.card-photos {
  padding: 0 1.5rem 1.5rem; flex: 1; min-height: 0;
  overflow-y: auto; overflow-x: hidden;
  overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.card-photos::-webkit-scrollbar { display: none; }
.card-photo-grid { columns: 2; column-gap: 0.35rem; }
.card-photo { break-inside: avoid; margin-bottom: 0.35rem; overflow: hidden; border-radius: var(--r-xs); cursor: pointer; line-height: 0; }
.card-photo img { width: 100%; height: auto; display: block; transition: transform 0.4s var(--ease), filter 0.3s; }
.card-photo:hover img { transform: scale(1.03); filter: brightness(1.05); }

/* 大图查看 */
.flb {
  position: fixed; inset: 0; z-index: 10005;
  background: rgba(var(--bg-rgb),0.97);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.flb-body { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; min-height: 0; padding: 2rem; }
.flb-img { max-width: 90vw; max-height: 80vh; object-fit: contain; }
.flb-bar { position: fixed; bottom: 0.75rem; left: 50%; transform: translateX(-50%); z-index: 10006; }
.flb-bar-shell {
  display: flex; align-items: center; height: 48px; padding: 0 0.8rem;
  background: var(--bg-card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border); border-radius: var(--r-full);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08); gap: 0;
}
.flb-btn {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; background: none; border: none;
  color: var(--ink-ghost); transition: color 0.2s; cursor: pointer; border-radius: 50%; flex-shrink: 0;
}
.flb-btn:hover { color: var(--gold); }
.flb-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.flb-div { width: 1px; height: 20px; background: var(--border); margin: 0 0.4rem; flex-shrink: 0; }
.flb-caption { font-family: var(--font-body); font-size: 0.78rem; color: var(--ink-ghost); }
.flb-counter { font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-ghost); white-space: nowrap; }

@media (max-width: 768px) {
  .card-top { padding: 1.5rem 1.25rem 1rem; }
  .card-header { gap: 1rem; margin-bottom: 1rem; }
  .card-avatar { width: 60px; height: 60px; }
  .card-name { font-size: 1.2rem; }
  .card-intro { font-size: 0.78rem; }
  .card-meta { gap: 1rem; padding-top: 0.75rem; }
  .card-contact { font-size: 0.7rem; }
  .card-stat-num { font-size: 1rem; }
  .card-photos { padding: 0 1rem 1rem; }
  .card-photo-grid { columns: 2; column-gap: 0.25rem; }
  .card-photo { margin-bottom: 0.25rem; }
  .flb-bar-shell { padding: 0 0.6rem; }
}
</style>
