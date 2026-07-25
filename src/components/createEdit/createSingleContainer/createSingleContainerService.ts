import {
  ApiResult,
  createRecipe,
  saveIngredients,
  saveInstructions,
} from "@/services/apiService";
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
    try {
      await addRecipe();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to add recipe.",
      );
    }
  }

  async function addRecipe(): Promise<void> {
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
      showToast("Unable to create recipe.");
      return;
    }

    // We can assume the recipe has an ID if it was successful.
    await addIngredients(response.data.id!);
    await addInstructions(response.data.id!);
  }

  async function addIngredients(recipeId: number): Promise<void> {
    const ingredientList: IngredientList = {
      recipeId,
      ingredients: splitList(ingredientsString.value, "\n").map(
        (ingredientLine) => {
          const partitionedLine = ingredientLine.split("|");

          switch (partitionedLine.length) {
            case 4:
            case 3:
              return {
                quantity: +partitionedLine[0],
                uom: partitionedLine[1],
                name: partitionedLine[2],
                notes: partitionedLine[3],
              };
            case 2:
            case 1:
              return {
                quantity: 1,
                name: partitionedLine[0],
                notes: partitionedLine[1],
              };
            default:
              throw new Error(
                `Unable to parse ingredient: "${ingredientLine}"`,
              );
          }
        },
      ),
    };

    await saveIngredients(ingredientList);
  }

  async function addInstructions(recipeId: number): Promise<void> {
    const instructionList: InstructionList = {
      recipeId,
      instructions: splitList(instructionsString.value, "\n"),
    };

    await saveInstructions(instructionList);
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
