<template>
  <div class="post-list-container">
    <div class="post-list">
      <router-link
        v-for="post in posts"
        :key="post.slug"
        :to="`/post/${post.slug}`"
        class="post-list-item-link"
        @mouseenter.native="hoveredPost = post"
        @mouseleave.native="hoveredPost = null"
      >
        <div class="post-list-item">
          <div class="post-title">{{ post.title }}</div>
        </div>
      </router-link>
    </div>
    <div class="post-summary-panel-area">
      <transition name="fade">
        <div v-if="hoveredPost" class="post-summary-panel">
          <strong>Summary</strong>
          <div>{{ hoveredPost.summary }}</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'

interface PostMeta {
  title: string
  summary: string
  date: string
  slug: string
  path: string
}

export default {
  name: 'PostList',
  setup() {
    const posts: Ref<PostMeta[]> = ref([])
    const hoveredPost: Ref<PostMeta | null> = ref(null)

    onMounted(async () => {
      const res = await fetch('/api/blog-posts')
      posts.value = await res.json()
    })

    return { posts, hoveredPost }
  }
}
</script>

<style scoped>
.post-list-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
  margin-top: 2rem;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.post-list-item-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-list-item {
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  padding: 1.2rem 2rem;
  font-size: 1.2rem;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  display: flex;
  align-items: center;
}

.post-list-item-link:hover .post-list-item {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

.post-title {
  font-size: 1.2rem;
  font-weight: 500;
}

.post-summary-panel-area {
  min-width: 320px;
  max-width: 350px;
  height: 120px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
}

.post-summary-panel {
  width: 100%;
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  padding: 1.2rem 2rem;
  font-size: 1rem;
  color: var(--color-text);
  box-sizing: border-box;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
