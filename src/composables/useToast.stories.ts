import { Meta, StoryObj } from "@storybook/vue3";
import Toast from "primevue/toast";
import Button from "primevue/button";
import { useToast } from "./useToast";

//META

// There is no toast component of our own — `App.vue` mounts PrimeVue's
// `<Toast />` once and `useToast` pushes into it. These stories stand that pair
// up so the rendered result can be seen without a backend.
const meta: Meta<typeof Toast> = {
  title: "Common/Toast",
  component: Toast,
  render: (args: any) => ({
    components: { Toast, Button },
    setup: () => {
      const { showToast } = useToast();
      return { ...args, showToast };
    },
    template: `
      <Toast />
      <Button label="Raise a toast" @click="showToast(message)" />
    `,
  }),
};

export default meta;

//STORIES

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    message: "Unable to save ingredients.",
  },
};

export const LongMessage: Story = {
  args: {
    message:
      "The server took too long to respond. Your changes have not been saved — check your connection and try again.",
  },
};

export const Stacked: Story = {
  render: (args: any) => ({
    components: { Toast, Button },
    setup: () => {
      const { showToast, dismissToast } = useToast();
      return { ...args, showToast, dismissToast };
    },
    template: `
      <Toast />
      <div class="flex gap-2">
        <Button label="Raise a toast" @click="showToast(message)" />
        <Button label="Dismiss all" severity="secondary" @click="dismissToast()" />
      </div>
    `,
  }),
  args: {
    message: "Unable to save ingredients.",
  },
};
