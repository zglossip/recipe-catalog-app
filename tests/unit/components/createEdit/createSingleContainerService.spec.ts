import { describe, it, expect, vi, Mock } from "vitest";
import {
  useCreateSingleContainerService,
  CreateSingleContainerService,
} from "@/components/createEdit/createSingleContainer/createSingleContainerService";
import {
  ApiResult,
  createRecipe,
  saveIngredients,
  saveInstructions,
} from "@/services/apiService";
import { generateRecipe } from "@tests/data/defaults";
import { Recipe } from "@/types/Recipe";

vi.mock("@/services/apiService");

interface SetupResult {
  service: CreateSingleContainerService;
  createRecipe: () => ApiResult<Recipe>;
  saveIngredients: () => ApiResult<null>;
  saveInstructions: () => ApiResult<null>;
}

const setup = (
  recipe: Recipe | null = generateRecipe({ id: 55 }),
): SetupResult => {
  const createRecipeMock = vi.fn().mockResolvedValue(
    recipe
      ? ({ ok: true, data: recipe } satisfies ApiResult<Recipe>)
      : ({
          ok: false,
          error: "Failed to create",
        } satisfies ApiResult<Recipe>),
  );

  const saveIngredientsMock = vi
    .fn()
    .mockResolvedValue({ ok: true, data: null } satisfies ApiResult<null>);
  const saveInstructionsMock = vi
    .fn()
    .mockResolvedValue({ ok: true, data: null } satisfies ApiResult<null>);

  (createRecipe as Mock).mockImplementation(createRecipeMock);
  (saveIngredients as Mock).mockImplementation(saveIngredientsMock);
  (saveInstructions as Mock).mockImplementation(saveInstructionsMock);

  const service = useCreateSingleContainerService();

  return {
    service,
    createRecipe: createRecipeMock,
    saveIngredients: saveIngredientsMock,
    saveInstructions: saveInstructionsMock,
  };
};

describe("createSingleContainerService", () => {
  it("creates a recipe and persists parsed ingredients and instructions", async () => {
    const { service, createRecipe, saveIngredients, saveInstructions } =
      setup();

    service.name.value = "New Dish";
    service.coursesString.value = "Lunch, Dinner";
    service.cuisinesString.value = "Italian, Fusion";
    service.tagsString.value = "Quick, Favorite";
    service.servingAmount.value = 4;
    service.servingName.value = "plates";
    service.sourceUrl.value = "https://example.com";
    service.ingredientsString.value = "2|cups|Rice|washed\nSugar|Sweet";
    service.instructionsString.value = "Mix thoroughly\nServe warm";

    await service.add();

    expect(createRecipe).toHaveBeenCalledWith({
      name: "New Dish",
      courseTypes: ["Lunch", "Dinner"],
      cuisineTypes: ["Italian", "Fusion"],
      tags: ["Quick", "Favorite"],
      servingAmount: 4,
      servingName: "plates",
      source: "https://example.com",
      uploaded: null,
    });

    expect(saveIngredients).toHaveBeenCalledWith({
      recipeId: 55,
      ingredients: [
        { quantity: 2, uom: "cups", name: "Rice", notes: "washed" },
        { quantity: 1, name: "Sugar", notes: "Sweet" },
      ],
    });

    expect(saveInstructions).toHaveBeenCalledWith({
      recipeId: 55,
      instructions: ["Mix thoroughly", "Serve warm"],
    });
  });

  it("does not save ingredients or instructions when creation fails", async () => {
    const { service, saveIngredients, saveInstructions } = setup(null);

    service.name.value = "Fails";
    service.coursesString.value = "";
    service.cuisinesString.value = "";
    service.tagsString.value = "";
    service.ingredientsString.value = "Flour";
    service.instructionsString.value = "Bake";

    await service.add();

    expect(saveIngredients).not.toHaveBeenCalled();
    expect(saveInstructions).not.toHaveBeenCalled();
  });
});
