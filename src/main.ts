import { createApp } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App.vue'
import router from './router'
import { initLenis } from './composables/useLenis'
import './assets/styles/main.css'

gsap.registerPlugin(ScrollTrigger)

// Init Lenis smooth scroll
const lenis = initLenis()

// Sync Lenis with GSAP ScrollTrigger
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time: number) => { lenis.raf(time * 1000) })
  gsap.ticker.lagSmoothing(0)
}

const app = createApp(App)
app.use(router)
app.mount('#app')