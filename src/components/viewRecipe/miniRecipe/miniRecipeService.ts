import {
  fetchIngredients,
  fetchInstructions,
  fetchRecipe,
} from "@/services/apiService";
import { Ingredient } from "@/types/Ingredient";
import { Recipe } from "@/types/Recipe";
import { ref, Ref } from "vue";

export const INJECTION_KEY = Symbol();

export interface MiniRecipeService {
  recipe: Ref<Recipe | null>;
  ingredients: Ref<Ingredient[]>;
  instructions: Ref<string[]>;
  isLoading: Ref<boolean>;
}

export const useMiniRecipeService = (id: number): MiniRecipeService => {
  const recipe: Ref<Recipe | null> = ref(null);
  const ingredients: Ref<Ingredient[]> = ref([]);
  const instructions: Ref<string[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);

  const refreshData = async (): Promise<void> => {
    isLoading.value = true;

    try {
      const recipeResponse = await fetchRecipe(id);
      if (recipeResponse.ok) {
        recipe.value = recipeResponse.data;
      } else {
        console.error("Error loading recipe for ID: " + id);
      }

      const ingredientResponse = await fetchIngredients(id);
      if (ingredientResponse.ok) {
        ingredients.value = ingredientResponse.data.ingredients;
      } else {
        console.error("Error loading ingredients for ID: " + id);
      }

      const instructionsResponse = await fetchInstructions(id);
      if (instructionsResponse.ok) {
        instructions.value = instructionsResponse.data.instructions;
      } else {
        console.error("Error loading instructions for ID: " + id);
      }
    } finally {
      isLoading.value = false;
    }
  };

  refreshData();

  return { recipe, ingredients, instructions, isLoading };
};
