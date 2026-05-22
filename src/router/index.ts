import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LivingRoom from '../views/LivingRoom.vue'
import Library from '../views/Library.vue'
import BookDetail from '../views/BookDetail.vue'
import BookReader from '../views/BookReader.vue'
import Observation from '../views/Observation.vue'
import Blog from '../views/Blog.vue'
import PostDetail from '../views/PostDetail.vue'
import ReadingRoom from '../views/ReadingRoom.vue'
import ChatRoom from '../views/ChatRoom.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'

export const isLibraryTransition = (from: string, to: string): boolean => {
  const isFromLibrary = from === '/library' || from.startsWith('/library/')
  const isToLibrary = to === '/library' || to.startsWith('/library/')
  return isFromLibrary && isToLibrary
}

const routes = [
  {
    path: '/',
    name: 'LivingRoom',
    component: LivingRoom
  },
  {
    path: '/home',
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
    path: '/observation',
    name: 'Observation',
    component: Observation
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/blog/:id',
    name: 'PostDetail',
    component: PostDetail
  },
  {
    path: '/reading-room',
    name: 'ReadingRoom',
    component: ReadingRoom
  },
  {
    path: '/chat-room',
    name: 'ChatRoom',
    component: ChatRoom
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
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
