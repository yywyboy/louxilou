<script setup lang="ts">
export interface TocItem { id: string; text: string; level: number }

defineProps<{
  items: TocItem[]
  activeId: string
}>()
const emit = defineEmits<{ navigate: [id: string] }>()
</script>

<template>
  <div class="sb-section" v-if="items.length > 1">
    <h3 class="sb-title">目录</h3>
    <ul class="toc-list">
      <li v-for="item in items" :key="item.id" :class="'toc-l' + item.level">
        <a :href="'#' + item.id" @click.prevent="emit('navigate', item.id)" :class="{ active: activeId === item.id }">{{ item.text }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-list li { margin-bottom: 0.15rem; }
.toc-list a { display: block; padding: 0.25rem 0 0.25rem 0.75rem; font-size: 0.8rem; color: var(--ink-ghost); text-decoration: none; border-left: 2px solid transparent; transition: all 0.2s; line-height: 1.5; }
.toc-list a:hover { color: var(--ink); }
.toc-list a.active { color: var(--gold); border-left-color: var(--gold); }
.toc-l2 { padding-left: 0.75rem; }
.toc-l3 { padding-left: 1.5rem; }
</style>
