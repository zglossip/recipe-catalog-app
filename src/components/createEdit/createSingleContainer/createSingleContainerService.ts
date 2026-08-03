import {
  ApiResult,
  createRecipe,
  saveIngredients,
  saveInstructions,
} from "@/services/apiService";
import { Ingredient } from "@/types/Ingredient";
import { IngredientList } from "@/types/IngredientList";
import { InstructionList } from "@/types/InstructionList";
import { Recipe } from "@/types/Recipe";
import { ref, Ref } from "vue";
import { useToast } from "@/composables/useToast";

export const INJECTION_KEY = Symbol();

/**
 * Splits user input into a list, discarding blank entries. `"".split(sep)`
 * yields `[""]`, so an untouched field would otherwise submit a single empty
 * value rather than an empty list.
 */
const splitList = (value: string, separator: string): string[] =>
  value
    .split(separator)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

type ParseResult =
  | { ok: true; ingredients: Ingredient[] }
  | { ok: false; error: string };

/**
 * Runs before anything is persisted. A malformed line used to surface only
 * after `createRecipe` had already succeeded, leaving an orphaned recipe with
 * neither ingredients nor instructions.
 */
const parseIngredients = (value: string): ParseResult => {
  const ingredients: Ingredient[] = [];

  for (const ingredientLine of splitList(value, "\n")) {
    const partitionedLine = ingredientLine.split("|");

    switch (partitionedLine.length) {
      case 4:
      case 3:
        ingredients.push({
          quantity: +partitionedLine[0],
          uom: partitionedLine[1],
          name: partitionedLine[2],
          notes: partitionedLine[3],
        });
        break;
      case 2:
      case 1:
        ingredients.push({
          quantity: 1,
          name: partitionedLine[0],
          notes: partitionedLine[1],
        });
        break;
      default:
        return {
          ok: false,
          error: `Unable to parse ingredient: "${ingredientLine}"`,
        };
    }
  }

  return { ok: true, ingredients };
};

export interface CreateSingleContainerService {
  name: Ref<string>;
  coursesString: Ref<string>;
  cuisinesString: Ref<string>;
  tagsString: Ref<string>;
  servingAmount: Ref<number>;
  servingName: Ref<string>;
  sourceUrl: Ref<string>;
  ingredientsString: Ref<string>;
  instructionsString: Ref<string>;
  add: () => void;
}

export function useCreateSingleContainerService(): CreateSingleContainerService {
  const name = ref("");
  const coursesString = ref("");
  const cuisinesString = ref("");
  const tagsString = ref("");
  const servingAmount = ref(0);
  const servingName = ref("");
  const sourceUrl = ref("");
  const ingredientsString = ref("");
  const instructionsString = ref("");

  const { showToast } = useToast();

  async function add(): Promise<void> {
    const parsed = parseIngredients(ingredientsString.value);

    if (!parsed.ok) {
      showToast(parsed.error);
      return;
    }

    const recipe: Recipe = {
      name: name.value,
      courseTypes: splitList(coursesString.value, ","),
      cuisineTypes: splitList(cuisinesString.value, ","),
      tags: splitList(tagsString.value, ","),
      servingAmount: servingAmount.value,
      servingName: servingName.value,
      uploaded: null,
    };

    if (sourceUrl.value) recipe.source = sourceUrl.value;

    const response: ApiResult<Recipe> = await createRecipe(recipe);

    if (!response.ok) {
      showToast(`Unable to create recipe: ${response.error}`);
      return;
    }

    // We can assume the recipe has an ID if it was successful.
    await addIngredients(response.data.id!, parsed.ingredients);
    await addInstructions(response.data.id!);
  }

  async function addIngredients(
    recipeId: number,
    ingredients: Ingredient[],
  ): Promise<void> {
    const ingredientList: IngredientList = { recipeId, ingredients };

    const response = await saveIngredients(ingredientList);

    if (!response.ok) {
      showToast(`Unable to save ingredients: ${response.error}`);
    }
  }

  async function addInstructions(recipeId: number): Promise<void> {
    const instructionList: InstructionList = {
      recipeId,
      instructions: splitList(instructionsString.value, "\n"),
    };

    const response = await saveInstructions(instructionList);

    if (!response.ok) {
      showToast(`Unable to save instructions: ${response.error}`);
    }
  }

  return {
    name,
    coursesString,
    cuisinesString,
    tagsString,
    servingAmount,
    servingName,
    sourceUrl,
    ingredientsString,
    instructionsString,
    add,
  };
}
