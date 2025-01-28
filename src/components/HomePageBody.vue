<template>
  <div class="blog-message">
    This is a blog.
  </div>
</template>

<style>

.blog-message {
  font-size: 10em;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}

@media screen and (max-width: 768px) {
  .blog-message {
    font-size: 5em;
  }
}

@media screen and (max-width: 480px) {
  .blog-message {
    font-size: 3em;
  }
}
</style>
