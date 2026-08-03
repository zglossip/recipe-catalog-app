import { createApp } from "vue";
import PrimeVue from "primevue/config";
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

// No `app.use(ToastService)`: it only registers `$toast` and PrimeVue's
// inject-based `useToast`, neither of which this app uses. `<Toast />` in
// `App.vue` subscribes to `ToastEventBus` itself, which is what
// `@/composables/useToast` emits on.

router.isReady().then(() => {
  app.mount("#app");
});
