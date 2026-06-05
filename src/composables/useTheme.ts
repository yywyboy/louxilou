import { ref } from 'vue'

export const isDark = ref(true)

export function updateThemeState(dark: boolean) {
  isDark.value = dark
}
