import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import App from './App.vue';
import router from "./router";

import './style/style.css';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

router.isReady().then(() => {
  app.mount("#app");
});;
