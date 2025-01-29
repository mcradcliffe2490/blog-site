<template>
  <div class="header-container">
    <span class="name">Mycale C. Radcliffe</span>
    <div class="pages-list">
      <router-link to="/about-me" class="page-item">About Me</router-link>
      <router-link to="/topics" class="page-item">Topics</router-link>
      <router-link to="/post-list" class="page-item">Post List</router-link>
      <router-link to="/my-reading-list" class="page-item">My Reading List</router-link>
    </div>
  </div>
</template>

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
