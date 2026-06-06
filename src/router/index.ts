import { createRouter, createWebHistory } from 'vue-router'
import { scrollTo as lenisScrollTo, getLenis } from '../composables/useLenis'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '楼西楼' },
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('../views/Library.vue'),
    meta: { title: '藏书阁 — 楼西楼' },
  },
  {
    path: '/library/:id',
    name: 'BookDetail',
    component: () => import('../views/BookDetail.vue'),
    meta: { title: '书籍详情 — 楼西楼' },
  },
  {
    path: '/library/:bookId/read/:chapterId',
    name: 'BookReader',
    component: () => import('../views/BookReader.vue'),
    meta: { title: '在线阅读 — 楼西楼' },
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue'),
    meta: { title: '博客 — 楼西楼' },
  },
  {
    path: '/blog/:id',
    name: 'PostDetail',
    component: () => import('../views/PostDetail.vue'),
    meta: { title: '文章 — 楼西楼' },
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('../views/Gallery.vue'),
    meta: { title: '图库 — 楼西楼' },
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('../views/Archive.vue'),
    meta: { title: '归档 — 楼西楼' },
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import('../views/Friends.vue'),
    meta: { title: '友链 — 楼西楼' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    return { top: 0, behavior: 'instant' }
  },
})

router.afterEach(() => {
  requestAnimationFrame(() => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  })
})

router.beforeEach((to) => {
  const title = to.meta.title as string
  if (title) document.title = title
})

export default router