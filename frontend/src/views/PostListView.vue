<script lang="ts">
import SiteHeader from '../components/SiteHeader.vue'
import PostList from '../components/PostList.vue'

export default {
  components: {
    SiteHeader,
    PostList
  }
}
</script>

<template>
  <main>
    <SiteHeader/>
    <PostList />
  </main>
</template>
