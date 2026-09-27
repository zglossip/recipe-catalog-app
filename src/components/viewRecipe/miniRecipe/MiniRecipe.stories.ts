import type { Meta, StoryObj } from "@storybook/vue3";
import MiniRecipe from "./MiniRecipe.vue";
import { generateRecipe, generateIngredient } from "@tests/data/defaults";
import { provide, ref } from "vue";
import { INJECTION_KEY, MiniRecipeService } from "./miniRecipeService";

const stubMiniRecipeService = (args: any) => {
  provide(
    INJECTION_KEY,
    (): MiniRecipeService => ({
      recipe: ref(args.recipe),
      ingredients: ref(args.ingredients),
      instructions: ref(args.instructions),
    }),
  );
};

const meta: Meta<typeof MiniRecipe> = {
  title: "View Recipe/Mini Recipe",
  component: MiniRecipe,
  excludeStories: ["stubMiniRecipeService"],
  render: (args: any) => ({
    components: { MiniRecipe },
    setup: () => {
      stubMiniRecipeService(args);
      return { args };
    },
    template: '<MiniRecipe v-bind="args" />',
  }),
  args: {
    recipe: generateRecipe(),
    ingredients: [
      generateIngredient({
        name: "Cooked Rice",
        quantity: 3,
        uom: "Cup",
        notes: "Day old",
      }),
      generateIngredient({
        name: "Vegetable Oil",
        quantity: 2,
        uom: "Tbs",
      }),
      generateIngredient({
        name: "Soy sauce",
        quantity: 1,
        uom: "Tbs",
      }),
      generateIngredient({
        name: "Green onions",
        quantity: 2,
      }),
    ],
    instructions: ["Mix it", "Cook it", "Bop it"],
  },
};

export default meta;

type Story = StoryObj<typeof MiniRecipe>;

export const Default: Story = {};
