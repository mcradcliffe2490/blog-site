import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about-me',
      name: 'about-me',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/post-list',
      name: 'post-list',
      component: () => import('../views/PostListView.vue'),
    },
    {
      path: '/post/:slug',
      name: 'post-detail',
      component: () => import('../views/PostDetailView.vue'),
      props: true
    },
  ],
})

export default router
