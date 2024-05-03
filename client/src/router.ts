import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HeroPage from './components/HeroPage.vue';
import HomePage from './components/HomePage.vue';
import HabitPage from './components/HabitPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: HeroPage },
  { path: '/home', component: HomePage },
  { path: '/habit', component: HabitPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

