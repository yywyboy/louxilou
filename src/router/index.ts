import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Library from '../views/Library.vue'
import BookDetail from '../views/BookDetail.vue'
import BookReader from '../views/BookReader.vue'
import PostDetail from '../views/PostDetail.vue'

export const isLibraryTransition = (from: string, to: string): boolean => {
  const isFromLibrary = from === '/library' || from.startsWith('/library/')
  const isToLibrary = to === '/library' || to.startsWith('/library/')
  return isFromLibrary && isToLibrary
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/library',
    name: 'Library',
    component: Library
  },
  {
    path: '/library/:id',
    name: 'BookDetail',
    component: BookDetail
  },
  {
    path: '/library/:bookId/read/:chapterId',
    name: 'BookReader',
    component: BookReader
  },
  {
    path: '/blog/:id',
    name: 'PostDetail',
    component: PostDetail
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
  if (isLibraryTransition(from.path, to.path)) {
    skipNextTransition = true
  } else {
    skipNextTransition = false
  }
})

export default router
