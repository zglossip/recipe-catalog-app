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

const { showToast } = vi.hoisted(() => ({ showToast: vi.fn() }));

vi.mock("@/services/apiService");
vi.mock("@/composables/useToast", () => ({
  useToast: () => ({ showToast, dismissToast: vi.fn() }),
}));

interface SetupResult {
  service: CreateSingleContainerService;
  createRecipe: Mock;
  saveIngredients: Mock;
  saveInstructions: Mock;
  showToast: Mock;
}

const setup = (
  recipe: Recipe | null = generateRecipe({ id: 55 }),
): SetupResult => {
  showToast.mockReset();

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
    showToast,
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

  it("submits empty lists when the list fields are left blank", async () => {
    const { service, createRecipe, saveIngredients, saveInstructions } =
      setup();

    service.name.value = "Plain Dish";

    await service.add();

    expect(createRecipe).toHaveBeenCalledWith(
      expect.objectContaining({
        courseTypes: [],
        cuisineTypes: [],
        tags: [],
      }),
    );

    expect(saveIngredients).toHaveBeenCalledWith({
      recipeId: 55,
      ingredients: [],
    });

    expect(saveInstructions).toHaveBeenCalledWith({
      recipeId: 55,
      instructions: [],
    });
  });

  it("ignores blank and whitespace-only entries in list fields", async () => {
    const { service, createRecipe, saveInstructions } = setup();

    service.name.value = "Padded Dish";
    service.coursesString.value = "Lunch, , Dinner,";
    service.instructionsString.value = "Mix\n\n   \nServe";

    await service.add();

    expect(createRecipe).toHaveBeenCalledWith(
      expect.objectContaining({ courseTypes: ["Lunch", "Dinner"] }),
    );

    expect(saveInstructions).toHaveBeenCalledWith({
      recipeId: 55,
      instructions: ["Mix", "Serve"],
    });
  });

  it("does not save ingredients or instructions when creation fails", async () => {
    const { service, saveIngredients, saveInstructions, showToast } =
      setup(null);

    service.name.value = "Fails";
    service.coursesString.value = "";
    service.cuisinesString.value = "";
    service.tagsString.value = "";
    service.ingredientsString.value = "Flour";
    service.instructionsString.value = "Bake";

    await service.add();

    expect(saveIngredients).not.toHaveBeenCalled();
    expect(saveInstructions).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      "Unable to create recipe: Failed to create",
    );
  });

  it("toasts when saving ingredients fails", async () => {
    const { service, saveIngredients, showToast } = setup();

    saveIngredients.mockResolvedValue({
      ok: false,
      error: "Ingredients rejected",
    } satisfies ApiResult<null>);

    service.name.value = "Partly Fails";
    service.ingredientsString.value = "Flour";

    await service.add();

    expect(showToast).toHaveBeenCalledWith(
      "Unable to save ingredients: Ingredients rejected",
    );
  });

  it("toasts when saving instructions fails", async () => {
    const { service, saveInstructions, showToast } = setup();

    saveInstructions.mockResolvedValue({
      ok: false,
      error: "Instructions rejected",
    } satisfies ApiResult<null>);

    service.name.value = "Partly Fails";
    service.instructionsString.value = "Bake";

    await service.add();

    expect(showToast).toHaveBeenCalledWith(
      "Unable to save instructions: Instructions rejected",
    );
  });

  it("rejects an unparseable ingredient line before creating anything", async () => {
    const {
      service,
      createRecipe,
      saveIngredients,
      saveInstructions,
      showToast,
    } = setup();

    service.name.value = "Bad Ingredients";
    service.ingredientsString.value = "1|cup|Flour|sifted|extra";
    service.instructionsString.value = "Bake";

    await service.add();

    expect(createRecipe).not.toHaveBeenCalled();
    expect(saveIngredients).not.toHaveBeenCalled();
    expect(saveInstructions).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      'Unable to parse ingredient: "1|cup|Flour|sifted|extra"',
    );
  });
});
