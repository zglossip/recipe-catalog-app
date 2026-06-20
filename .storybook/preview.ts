import { Preview, setup } from "@storybook/vue3";
import PrimeVue from "primevue/config";
import { MyPreset } from "../src/style/theme";
import "../src/style/style.css";

setup((app) => {
  app.use(PrimeVue, {
    theme: {
      preset: MyPreset,
    },
  });
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
