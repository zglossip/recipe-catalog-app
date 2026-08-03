import type { Meta, StoryObj } from "@storybook/vue3";
import { provide, ref } from "vue";
import {
  EditInstructionsService,
  INJECTION_KEY,
} from "./editInstructionsService";
import { action } from "@storybook/addon-actions";
import EditInstructionsForm from "./EditInstructionsForm.vue";

//STUBS

const stubEditInstructionsService = (args: any) => {
  const instructions = ref(args.instructions);
  const newInstructionText = ref("");

  provide(
    INJECTION_KEY,
    (): EditInstructionsService => ({
      instructions,
      newInstructionText,
      isLoading: ref(args.isLoading ?? false),
      loadFailed: ref(args.loadFailed ?? false),
      onAddInstruction: () => {
        const text = newInstructionText.value.trim();
        if (!text) {
          return;
        }

        instructions.value.push(text);
        action("instruction added")({ text });
        newInstructionText.value = "";
      },
      onSaveClick: action("saved"),
      onCancelClick: action("cancelled"),
    }),
  );
};

//META

const meta: Meta<typeof EditInstructionsForm> = {
  title: "Create Edit/Edit Instructions Form",
  component: EditInstructionsForm,
  render: (args: any) => ({
    components: { EditInstructionsForm },
    setup: () => {
      stubEditInstructionsService(args);
      return { ...args };
    },
    template: `<EditInstructionsForm :recipe-id="recipeId" />`,
  }),
  args: {
    instructions: ["Bob it", "Pull it", "Twist it"],
    recipeId: 100,
  },
};

export default meta;

//STORIES

type Story = StoryObj<typeof EditInstructionsForm>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    instructions: [],
  },
};

export const Loading: Story = {
  args: {
    instructions: [],
    isLoading: true,
  },
};

export const LoadFailed: Story = {
  args: {
    instructions: [],
    loadFailed: true,
  },
};
