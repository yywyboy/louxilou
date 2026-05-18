import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LivingRoom from '../views/LivingRoom.vue'
import Library from '../views/Library.vue'
import Observation from '../views/Observation.vue'
import ReadingRoom from '../views/ReadingRoom.vue'
import ChatRoom from '../views/ChatRoom.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'

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
    path: '/observation',
    name: 'Observation',
    component: Observation
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

export default router
