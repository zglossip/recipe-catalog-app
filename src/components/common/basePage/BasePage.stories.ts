import type { Meta, StoryObj } from "@storybook/vue3";
import BasePage from "./BasePage.vue";
import { provide } from "vue";
import { INJECTION_KEY } from "./basePageService.js";
import { action } from "@storybook/addon-actions";

export const stubBasePageService = () => {
  provide(INJECTION_KEY, () => ({
    navigateHome: action("navigate home"),
  }));
};

const meta: Meta<typeof BasePage> = {
  title: "Components/Base Page",
  component: BasePage,
  excludeStories: /stubBasePageService/,
  render: (args: any) => ({
    components: { BasePage },
    setup: () => {
      stubBasePageService();
      return { ...args };
    },
    template: `
      <BasePage>
        <template #header>
          <h1 class="text-2xl font-bold">Header</h1>
        </template>
        <template #content>
          <p>Content</p>
        </template>
      </BasePage>
    `,
  }),
};

export default meta;

type Story = StoryObj<typeof BasePage>;

export const Primary: Story = {};
