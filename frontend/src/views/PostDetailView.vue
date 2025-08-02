<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'

export default {
  name: 'PostDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const post = ref<any>(null)
    const html = ref('')
    const loading = ref(true)
    const error = ref('')
    const showContent = ref(false)

    const goBack = () => router.back()

    onMounted(async () => {
      try {
        const res = await fetch(`/api/blog-posts/${route.params.slug}`)
        if (!res.ok) throw new Error('Post not found')
        post.value = await res.json()
        html.value = marked.parse(post.value.markdown || '') as string
        setTimeout(() => { showContent.value = true }, 100) // fade in
      } catch (e: any) {
        error.value = e.message
      } finally {
        loading.value = false
      }
    })

    return { post, html, loading, error, showContent, goBack }
  }
}
</script>

<template>
  <main class="post-detail-main">
    <button class="back-btn" @click="goBack" aria-label="Back to posts">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <transition name="fade">
      <div v-if="loading" class="fade-content">Loading...</div>
      <div v-else-if="error" class="fade-content">{{ error }}</div>
      <div v-else-if="post && showContent" class="fade-content">
        <div class="post-meta">
          <span v-if="post.date">{{ post.date }}</span>
          <span v-if="post.summary">&mdash; {{ post.summary }}</span>
        </div>
        <div class="post-content" v-html="html"></div>
      </div>
    </transition>
  </main>
</template>

<style scoped>
.post-detail-main {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 1.5rem 6rem 1.5rem;
  min-height: 100vh;
  display: block;
  background: none;
  position: relative;
}
.back-btn {
  position: fixed;
  top: 2.5rem;
  left: 2.5rem;
  background: none;
  border: none;
  padding: 0.2rem 0.5rem 0.2rem 0;
  cursor: pointer;
  color: var(--color-text);
  outline: none;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  z-index: 1000;
}
.back-btn:hover {
  color: var(--color-text-hover);
}
.fade-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.7s cubic-bezier(.4,0,.2,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.post-title {
  font-size: 2.6rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  text-align: center;
  letter-spacing: -0.01em;
}
.post-meta {
  font-size: 1rem;
  color: var(--color-text);
  opacity: 0.5;
  margin-bottom: 0.5rem;
  text-align: center;
}
.post-content {
  width: 100%;
  font-size: 1.18rem;
  line-height: 1.8;
  color: var(--color-text);
  margin: 0 auto;
  padding-bottom: 2rem;
}
.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3) {
  color: var(--color-heading);
  margin-top: 2.2rem;
  margin-bottom: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.post-content :deep(p) {
  margin: 1.2rem 0;
}
.post-content :deep(pre) {
  background: var(--color-background-mute);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}
.post-content :deep(code) {
  background: var(--color-background-mute);
  padding: 0.2em 0.4em;
  border-radius: 4px;
}
.post-content :deep(a) {
  color: var(--color-text-hover);
  text-decoration: underline;
  transition: color 0.2s;
}
.post-content :deep(a):hover {
  color: var(--color-heading);
}
@media (max-width: 800px) {
  .post-detail-main {
    max-width: 100vw;
    padding: 0 0.5rem 4rem 0.5rem;
  }
  .back-btn {
    top: 1rem;
    left: 1rem;
    right: auto;
  }
  .post-title {
    font-size: 2rem;
  }
}
</style> 