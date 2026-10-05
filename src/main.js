import "@/styles/index.css";

import { createApp } from 'vue';
import App from './App.vue';
import { exposeDevTools } from './core/dev-expose';
import { initGame } from '@/game/init';

initGame();
createApp(App).mount('#app');

if (import.meta.env.DEV) {
  import('eruda').then(({ default: eruda }) => {
    import('eruda-vue').then(({ default: erudaVue }) => {
      eruda.init();
      eruda.add(erudaVue);
    });
  });
  exposeDevTools();
}