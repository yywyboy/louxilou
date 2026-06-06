import { ref } from 'vue'

export interface TransitionState {
  rect: DOMRect
  src: string
  alt: string
}

const transitionState = ref<TransitionState | null>(null)

export function usePageTransition() {
  function startTransition(e: MouseEvent, src: string, alt: string) {
    const el = e.currentTarget as HTMLElement
    const cover = el.querySelector('img') || el
    const rect = cover.getBoundingClientRect()
    transitionState.value = { rect, src, alt }
  }

  function getState() {
    return transitionState.value
  }

  function clearState() {
    transitionState.value = null
  }

  return { startTransition, getState, clearState }
}
