<template>
  <div class="header-container">
    <span class="name">Mycale C. Radcliffe</span>
    <div class="pages-list">
      <router-link to="/" class="page-item">Home</router-link>
      <router-link to="/about-me" class="page-item">About Me</router-link>
      <div class="dropdown-container" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
        <span class="page-item dropdown-trigger">Topics</span>
        <transition name="dropdown">
          <div v-if="showDropdown" class="dropdown-menu">
            <router-link to="/post-list" class="dropdown-item" @click="showDropdown = false">All Posts</router-link>
            <router-link
              v-for="category in categories"
              :key="category.slug"
              :to="`/post-list?topic=${category.slug}`"
              class="dropdown-item"
              @click="showDropdown = false"
            >{{ category.name }}</router-link>
          </div>
        </transition>
      </div>
      <router-link to="/post-list" class="page-item">Post List</router-link>
      <router-link to="/my-reading-list" class="page-item">My Reading List</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { categories } from '../content/categories'

export default {
  name: 'SiteHeader',
  setup() {
    const showDropdown = ref(false)
    return { showDropdown, categories }
  }
}
</script>

<style>

.header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  width: 100%;
}

.name {
  font-size: x-large;
}

.page-item {
  font-size: x-large;
  margin-right: 1rem;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.page-item::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: var(--color-text-hover);
  transition: width 0.3s ease;
}

.page-item:hover::after {
  width: 100%;
}

.page-item:hover {
  color: var(--color-text-hover);
}

.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  min-width: 150px;
  white-space: nowrap;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--color-text);
  font-size: 1rem;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: var(--color-background-soft);
  color: var(--color-text-hover);
}

.dropdown-item:first-child {
  border-radius: 6px 6px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 6px 6px;
}

.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@media screen and (max-width: 768px) {
  .page-item {
    font-size: large;
  }

  .name {
    font-size: large;
  }
}

@media screen and (max-width: 480px) {
  .page-item {
    font-size: medium;
  }

  .name {
    font-size: medium;
  }
}
</style>
