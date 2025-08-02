<template>
  <div class="about-container">
    <button class="back-btn" @click="goBack" aria-label="Back to home">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <div class="content-layout">
      <div class="text-section">
        <h1 class="about-title">This is stuff about me.</h1>
        <div class="about-text">
          <p>
            It's hard to pin down exactly who I am because I am a lot of things. 
            I'm a software engineer who enjoys building cool things.
            I'm a seminarian pursing a Masters in Old Testament.
            I'm someone who likes to disect culture and the ways we think. 
            I like climbing fake rocks indoors.
            I like playing gameboy games.
            I like ice cream.
          </p>
          <p>
            This blog is a creative outlet for my many passions.
            I hope you enjoy reading it and thanks for coming to my little corner of the internet.
          </p>
        </div>
      </div>
      <div class="profile-section">
        <div class="profile-circle">
          <div class="profile-image">
            <img src="../assets/profile-pic.svg" alt="Profile Picture" />
          </div>
        </div>
        <div class="contact-info">
          <p>Email: <a href="mailto:mcradcliffe2490@gmail.com" class="contact-link">mcradcliffe2490@gmail.com</a></p>
          <p>Instagram: <a href="https://instagram.com/mcradcliffe" class="contact-link" target="_blank">mcradcliffe</a></p>
          <p>Discord: <a href="#" class="contact-link">mcradcliffe</a></p>
          <p>Medium: <a href="https://medium.com/@mcradcliffe" class="contact-link" target="_blank">@mcradcliffe</a></p>
          <p>Github: <a href="https://github.com/mcradcliffe2490" class="contact-link" target="_blank">mcradcliffe2490</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'

export default {
  name: 'AboutView',
  setup() {
    const router = useRouter()
    const goBack = () => router.push('/')
    return { goBack }
  }
}
</script>

<style scoped>
.about-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
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

.content-layout {
  display: flex;
  gap: 4rem;
  align-items: flex-start;
}

.text-section {
  flex: 1;
}

.about-title {
  font-size: 2.5rem;
  font-weight: normal;
  margin-bottom: 2rem;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 8px;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.6;
}

.about-text p {
  margin-bottom: 1.5rem;
}

.profile-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.profile-circle {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 3px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.profile-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.contact-info {
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.8;
}

.contact-info p {
  margin-bottom: 0.5rem;
}

.contact-link {
  color: inherit;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.contact-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.contact-link:hover::after {
  width: 100%;
}

.contact-link:hover {
  color: var(--color-text-hover, #0066cc);
}

@media screen and (max-width: 768px) {
  .content-layout {
    flex-direction: column;
    gap: 2rem;
  }
  
  .about-title {
    font-size: 2rem;
  }
  
  .profile-circle {
    width: 200px;
    height: 200px;
  }
  
  .about-container {
    padding: 1rem;
  }
  
  .back-btn {
    top: 1rem;
    left: 1rem;
  }
}

@media screen and (max-width: 480px) {
  .about-title {
    font-size: 1.5rem;
  }
  
  .about-text {
    font-size: 1rem;
  }
  
  .profile-circle {
    width: 150px;
    height: 150px;
  }
  
  .contact-info {
    font-size: 1rem;
  }
}
</style>
