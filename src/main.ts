import './assets/css/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/Home.vue';
import NotFoundView from './views/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
  ]
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
