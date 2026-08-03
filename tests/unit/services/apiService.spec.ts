import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateRecipe } from "@tests/data/defaults";

const { showToast } = vi.hoisted(() => ({
  showToast: vi.fn(),
}));

const axiosMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  isAxiosError: vi.fn(),
}));

vi.mock("@/composables/useToast", () => ({
  useToast: () => ({ showToast }),
}));

vi.mock("@/services/constants", () => ({
  BACKEND_BASE: "http://example.com",
}));

vi.mock("axios", () => ({
  default: axiosMock,
}));

import {
  createRecipe,
  fetchIngredients,
  fetchInstructions,
  fetchRecipe,
  fetchRecipes,
  saveIngredients,
  saveInstructions,
  saveRecipe,
} from "@/services/apiService";
import { IngredientList } from "@/types/IngredientList";
import { InstructionList } from "@/types/InstructionList";

const makeAxiosError = (message = "Request failed") => ({
  response: { data: message },
  message,
});

describe("apiService", () => {
  beforeEach(() => {
    axiosMock.get.mockReset();
    axiosMock.post.mockReset();
    axiosMock.put.mockReset();
    axiosMock.isAxiosError.mockReset();
    showToast.mockReset();
  });

  it("fetchRecipes handles success", async () => {
    const data = [generateRecipe()];
    axiosMock.get.mockResolvedValue({ data });

    const result = await fetchRecipes(
      "Test Name",
      ["Cuisine 1"],
      ["Course 1", "Course 2"],
      ["Tag 1"],
    );

    expect(axiosMock.get).toHaveBeenCalledWith(
      "http://example.com/recipe?name=Test+Name&course=Course+1&course=Course+2&cuisine=Cuisine+1&tag=Tag+1",
    );
    expect(result).toEqual({ ok: true, data });
  });

  it("fetchRecipes handles errors", async () => {
    axiosMock.isAxiosError.mockReturnValue(true);
    axiosMock.get.mockRejectedValue(makeAxiosError("No recipes"));

    const result = await fetchRecipes("", [], [], []);

    expect(result).toEqual({ ok: false, error: "No recipes" });
    expect(showToast).toHaveBeenCalledWith("No recipes");
  });

  it("fetchRecipe handles success", async () => {
    const data = generateRecipe({ id: 12 });
    axiosMock.get.mockResolvedValue({ data });

    const result = await fetchRecipe(12);

    expect(axiosMock.get).toHaveBeenCalledWith("http://example.com/recipe/12");
    expect(result).toEqual({ ok: true, data });
  });

  it("fetchRecipe handles errors", async () => {
    axiosMock.isAxiosError.mockReturnValue(true);
    axiosMock.get.mockRejectedValue(makeAxiosError("Recipe missing"));

    const result = await fetchRecipe(12);

    expect(result).toEqual({ ok: false, error: "Recipe missing" });
    expect(showToast).toHaveBeenCalledWith("Recipe missing");
  });

  it("createRecipe handles success", async () => {
    const recipe = generateRecipe();
    axiosMock.post.mockResolvedValue({ data: recipe });

    const result = await createRecipe(recipe);

    expect(axiosMock.post).toHaveBeenCalledWith(
      "http://example.com/recipe",
      recipe,
    );
    expect(result).toEqual({ ok: true, data: recipe });
  });

  it("createRecipe handles errors", async () => {
    const recipe = generateRecipe();
    axiosMock.isAxiosError.mockReturnValue(true);
    axiosMock.post.mockRejectedValue(makeAxiosError("Create failed"));

    const result = await createRecipe(recipe);

    expect(result).toEqual({ ok: false, error: "Create failed" });
    expect(showToast).toHaveBeenCalledWith("Create failed");
  });

  it("saveRecipe handles success", async () => {
    const recipe = generateRecipe({ id: 42 });
    axiosMock.put.mockResolvedValue({ data: null });

    const result = await saveRecipe(recipe);

    expect(axiosMock.put).toHaveBeenCalledWith(
      "http://example.com/recipe/42",
      recipe,
    );
    expect(result).toEqual({ ok: true, data: null });
  });

  it("saveRecipe handles errors", async () => {
    const recipe = generateRecipe({ id: 42 });
    axiosMock.isAxiosError.mockReturnValue(true);
    axiosMock.put.mockRejectedValue(makeAxiosError("Save failed"));

    const result = await saveRecipe(recipe);

    expect(result).toEqual({ ok: false, error: "Save failed" });
    expect(showToast).toHaveBeenCalledWith("Save failed");
  });

  it("fetchIngredients handles success", async () => {
    const ingredientList: IngredientList = {
      recipeId: 5,
      ingredients: [],
    };
    axiosMock.get.mockResolvedValue({ data: ingredientList });

    const result = await fetchIngredients(5);

    expect(axiosMock.get).toHaveBeenCalledWith(
      "http://example.com/recipe/5/ingredients",
    );
    expect(result).toEqual({ ok: true, data: ingredientList });
  });

  it("fetchIngredients handles errors", async () => {
    axiosMock.isAxiosError.mockReturnValue(true);
    axiosMock.get.mockRejectedValue(makeAxiosError("Ingredients missing"));

    const result = await fetchIngredients(5);

    expect(result).toEqual({ ok: false, error: "Ingredients missing" });
    expect(showToast).toHaveBeenCalledWith("Ingredients missing");
  });

  it("saveIngredients handles success", async () => {
    const ingredientList: IngredientList = {
      recipeId: 5,
      ingredients: [],
    };
    axiosMock.put.mockResolvedValue({ data: null });

    const result = await saveIngredients(ingredientList);

    expect(axiosMock.put).toHaveBeenCalledWith(
      "http://example.com/recipe/5/ingredients",
      ingredientList,
    );
    expect(result).toEqual({ ok: true, data: null });
  });

  it("saveIngredients handles errors", async () => {
    const ingredientList: IngredientList = {
      recipeId: 5,
      ingredients: [],
    };
    axiosMock.isAxiosError.mockReturnValue(true);
    axiosMock.put.mockRejectedValue(makeAxiosError("Save ingredients failed"));

    const result = await saveIngredients(ingredientList);

    expect(result).toEqual({ ok: false, error: "Save ingredients failed" });
    expect(showToast).toHaveBeenCalledWith("Save ingredients failed");
  });

  it("fetchInstructions handles success", async () => {
    const instructionList: InstructionList = {
      recipeId: 7,
      instructions: ["Step 1"],
    };
    axiosMock.get.mockResolvedValue({ data: instructionList });

    const result = await fetchInstructions(7);

    expect(axiosMock.get).toHaveBeenCalledWith(
      "http://example.com/recipe/7/instructions",
    );
    expect(result).toEqual({ ok: true, data: instructionList });
  });

  it("fetchInstructions handles errors", async () => {
    axiosMock.isAxiosError.mockReturnValue(true);
    axiosMock.get.mockRejectedValue(makeAxiosError("Instructions missing"));

    const result = await fetchInstructions(7);

    expect(result).toEqual({ ok: false, error: "Instructions missing" });
    expect(showToast).toHaveBeenCalledWith("Instructions missing");
  });

  it("saveInstructions handles success", async () => {
    const instructionList: InstructionList = {
      recipeId: 7,
      instructions: ["Step 1"],
    };
    axiosMock.put.mockResolvedValue({ data: null });

    const result = await saveInstructions(instructionList);

    expect(axiosMock.put).toHaveBeenCalledWith(
      "http://example.com/recipe/7/instructions",
      instructionList,
    );
    expect(result).toEqual({ ok: true, data: null });
  });

  it("saveInstructions handles errors", async () => {
    const instructionList: InstructionList = {
      recipeId: 7,
      instructions: ["Step 1"],
    };
    axiosMock.isAxiosError.mockReturnValue(true);
    axiosMock.put.mockRejectedValue(makeAxiosError("Save instructions failed"));

    const result = await saveInstructions(instructionList);

    expect(result).toEqual({ ok: false, error: "Save instructions failed" });
    expect(showToast).toHaveBeenCalledWith("Save instructions failed");
  });
});
