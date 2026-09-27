import { IngredientList } from "@/types/IngredientList";
import { InstructionList } from "@/types/InstructionList";
import { Recipe } from "@/types/Recipe";
import { ref, Ref } from "vue";

export const INJECTION_KEY = Symbol();

export interface MiniRecipeService {
  recipe: Ref<Recipe | null>;
  ingredients: Ref<IngredientList | null>;
  instructions: Ref<InstructionList | null>;
}

export const useMiniRecipeService = (id: number): MiniRecipeService => {
  const recipe: Ref<Recipe | null> = ref(null);
  const ingredients: Ref<IngredientList | null> = ref(null);
  const instructions: Ref<InstructionList | null> = ref(null);



  return { recipe, ingredients, instructions };
};
