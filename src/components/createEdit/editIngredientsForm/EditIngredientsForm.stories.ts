import type { Meta, StoryObj } from "@storybook/vue3";
import { provide, ref } from "vue";
import {
  EditIngredientsService,
  INJECTION_KEY,
} from "./editIngredientsService";
import { action } from "@storybook/addon-actions";
import EditIngredientsForm from "./EditIngredientsForm.vue";
import { generateIngredient } from "@tests/data/defaults";

//STUBS

const stubEditIngredientsFormService = (args: any) => {
  const ingredients = ref(args.ingredients);
  const newIngredientName = ref("");
  const newIngredientQuantity = ref(1);
  const newIngredientUom = ref("");

  provide(
    INJECTION_KEY,
    (): EditIngredientsService => ({
      ingredients,
      newIngredientName,
      newIngredientQuantity,
      newIngredientUom,
      loadFailed: ref(args.loadFailed ?? false),
      onAddIngredient: () => {
        const name = newIngredientName.value.trim();
        if (!name) {
          return;
        }

        const uom = newIngredientUom.value.trim();
        const parsedQuantity = Number(newIngredientQuantity.value);
        const quantity =
          Number.isFinite(parsedQuantity) && parsedQuantity > 0
            ? parsedQuantity
            : 1;
        ingredients.value.push({
          name,
          quantity,
          uom: uom ? uom : undefined,
        });
        action("ingredient added")({ name, quantity, uom: uom || undefined });

        newIngredientName.value = "";
        newIngredientQuantity.value = 1;
        newIngredientUom.value = "";
      },
      onSaveClick: action("saved"),
      onCancelClick: action("cancelled"),
    }),
  );
};

//META

const meta: Meta<typeof EditIngredientsForm> = {
  title: "Create Edit/Edit Ingredients Form",
  component: EditIngredientsForm,
  render: (args: any) => ({
    components: { EditIngredientsForm },
    setup: () => {
      stubEditIngredientsFormService(args);
      return { ...args };
    },
    template: `<EditIngredientsForm :recipe-id="recipeId" />`,
  }),
  args: {
    ingredients: [
      generateIngredient(),
      generateIngredient({ quantity: 2, name: "Test Item 2", uom: "Tbs" }),
      generateIngredient({
        name: "Test Item 3",
        notes: "A note about the item",
      }),
    ],
    recipeId: 100,
  },
};

export default meta;

//STORIES

type Story = StoryObj<typeof EditIngredientsForm>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    ingredients: [],
  },
};

export const LoadFailed: Story = {
  args: {
    ingredients: [],
    loadFailed: true,
  },
};
