import { createApp } from "vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import App from "./App.vue";
import router from "./router";
import { MyPreset } from "./style/theme";
import "./style/style.css";

const app = createApp(App);

app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
  },
});

app.use(ToastService);

router.isReady().then(() => {
  app.mount("#app");
});
