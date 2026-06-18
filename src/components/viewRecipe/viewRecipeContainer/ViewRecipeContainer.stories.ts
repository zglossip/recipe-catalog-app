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
    components: { ViewRecipeContainer, IonContent, IonPage },
    setup: () => {
      stubRecipeService(args);
      stubIngredientCardService(args);
      stubInstructionCardService(args);
      stubViewRecipeContainerService(args);
    },
    template: `
      <ion-page><ion-content><ViewRecipeContainer /></ion-content></ion-page>
    `,
  }),
};

export default meta;

//STORIES

type Story = StoryObj<typeof ViewRecipeContainer>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    displayError: true,
  },
};
