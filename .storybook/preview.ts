import { Preview, setup } from "@storybook/vue3";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import { MyPreset } from "../src/style/theme";
import { registerToastService } from "../src/composables/useToast";
import "../src/style/style.css";

setup((app) => {
  app.use(PrimeVue, {
    theme: {
      preset: MyPreset,
    },
  });

  // Same handover `main.ts` does, so `useToast` reaches a real service here
  // instead of queueing every toast a story raises.
  app.use(ToastService);
  registerToastService(app.config.globalProperties.$toast);
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Common", "Browse", "View Recipe", "Create Edit"],
      },
    },
  },
};

export default preview;
