import { createRouter, createWebHistory } from 'vue-router'

export const isLibraryTransition = (from: string, to: string): boolean => {
  const isFromLibrary = from === '/library' || from.startsWith('/library/')
  const isToLibrary = to === '/library' || to.startsWith('/library/')
  return isFromLibrary && isToLibrary
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '楼西楼' }
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('../views/Library.vue'),
    meta: { title: '藏书阁 - 楼西楼' }
  },
  {
    path: '/library/:id',
    name: 'BookDetail',
    component: () => import('../views/BookDetail.vue'),
    meta: { title: '书籍详情 - 楼西楼' }
  },
  {
    path: '/library/:bookId/read/:chapterId',
    name: 'BookReader',
    component: () => import('../views/BookReader.vue'),
    meta: { title: '在线阅读 - 楼西楼' }
  },
  {
    path: '/blog/:id',
    name: 'PostDetail',
    component: () => import('../views/PostDetail.vue'),
    meta: { title: '文章 - 楼西楼' }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('../views/Gallery.vue'),
    meta: { title: '图片库 - 楼西楼' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export let skipNextTransition = false

router.beforeEach((to, from) => {
  const title = to.meta.title as string
  if (title) document.title = title

  if (isLibraryTransition(from.path, to.path)) {
    skipNextTransition = true
  } else {
    skipNextTransition = false
  }
})

export default router
