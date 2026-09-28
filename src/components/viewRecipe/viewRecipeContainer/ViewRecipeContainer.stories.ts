import { stubIngredientCardService } from "@/components/viewRecipe/ingredientCard/IngredientCard.stories";
import { stubInstructionCardService } from "@/components/viewRecipe/instructionCard/InstructionCard.stories";
import { stubRecipeService } from "@/components/viewRecipe/recipeCard/RecipeCard.stories";
import { provide, ref } from "vue";
import {
  INJECTION_KEY,
  ViewRecipeContainerService,
} from "./viewRecipeContainerService";
import { Meta, StoryObj } from "@storybook/vue3";
import ViewRecipeContainer from "./ViewRecipeContainer.vue";
import { generateRecipe, generateIngredient } from "@tests/data/defaults";
import BasePage from "@/components/common/basePage/BasePage.vue";
import {
  INJECTION_KEY as miniRecipeInjectionKey,
  MiniRecipeService,
} from "../miniRecipe/miniRecipeService.ts";

// STUBS
const stubViewRecipeContainerService = (args: any) => {
  provide(
    INJECTION_KEY,
    (): ViewRecipeContainerService => ({
      recipe: ref(args.recipe),
      isLoading: ref(args.isLoading),
      displayError: ref(args.displayError ?? false),
      onEditHeader: () => null,
      onEditIngredients: () => null,
      onEditInstructions: () => null,
      refreshData: async () => undefined,
    }),
  );
};

const stubMiniRecipeService = (args: any) => {
  provide(
    miniRecipeInjectionKey,
    (): MiniRecipeService => ({
      recipe: ref(args.subRecipeRecipe),
      ingredients: ref(args.subRecipeIngredients),
      instructions: ref(args.subRecipeInstructions),
      isLoading: args.isLoading,
    }),
  );
};

// META

const TEST_RECIPE_NAME = "Fried Rice";
const TEST_SERVING_TAG = "4 servings";
const TEST_CUISINE_TAG = "Cuisines: American, Chinese";
const TEST_COURSE_TAG = "Courses: Main, Side";
const TEST_TAG_TAG = "Tags: fav, St. Louis";

const meta: Meta<typeof ViewRecipeContainer> = {
  title: "View Recipe/View Recipe Container",
  component: ViewRecipeContainer,
  args: {
    id: 100,
    isLoading: false,
    recipe: generateRecipe({
      id: 100,
      name: TEST_RECIPE_NAME,
      subRecipes: [101],
    }),
    formattedServingTag: TEST_SERVING_TAG,
    formattedCuisineTag: TEST_CUISINE_TAG,
    formattedCourseTag: TEST_COURSE_TAG,
    formattedTagTag: TEST_TAG_TAG,
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
        name: "Seasoning Sauce",
        quantity: 1,
        uom: "Tbs",
      }),
      generateIngredient({
        name: "Green onions",
        quantity: 2,
      }),
    ],
    instructions: ["Mix it", "Cook it", "Bop it"],
    subRecipeRecipe: generateRecipe({ id: 101, name: "Seasoning Sauce" }),
    subRecipeIngredients: [
      generateIngredient({
        name: "Soy Sauce",
        quantity: 1,
        uom: "Tbs",
      }),
      generateIngredient({
        name: "Dark Soy Sauce",
        quantity: 1,
        uom: "Tbs",
      }),
      generateIngredient({
        name: "Oyster Sauce",
        quantity: 1,
        uom: "Tbs",
      }),
    ],
    subRecipeInstructions: ["Mix stuff together"],
  },
  argTypes: {
    formattedCuisineTag: {
      options: [TEST_CUISINE_TAG, false],
      type: "select",
    },
    formattedCourseTag: {
      options: [TEST_COURSE_TAG, false],
      type: "select",
    },
    formattedTagTag: {
      options: [TEST_TAG_TAG, false],
      type: "select",
    },
  },
  render: (args: any) => ({
    components: { ViewRecipeContainer, BasePage },
    setup: () => {
      stubRecipeService(args);
      stubMiniRecipeService(args);
      stubIngredientCardService(args);
      stubInstructionCardService(args);
      stubViewRecipeContainerService(args);
    },
    template: `
      <BasePage><ViewRecipeContainer /></BasePage>
    `,
  }),
};

export default meta;

//STORIES

type Story = StoryObj<typeof ViewRecipeContainer>;

export const Default: Story = {};

export const NoSubRecipe: Story = {
  args: {
    recipe: generateRecipe({
      id: 100,
      name: TEST_RECIPE_NAME,
      subRecipes: [],
    })
  }
}

export const Error: Story = {
  args: {
    displayError: true,
  },
};
