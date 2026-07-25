import {
  IngredientCardService,
  useIngredientCardService,
} from "@/components/viewRecipe/ingredientCard/ingredientCardService";
import { vi, expect, Mock, describe, it } from "vitest";
import { ApiResult, fetchIngredients } from "@/services/apiService";
import { generateIngredient } from "@tests/data/defaults";
import { Ingredient } from "@/types/Ingredient";

vi.mock("@/services/apiService");

interface SetupOptions {
  recipeId?: number;
  fetchIngredients?: () => Promise<ApiResult<{ ingredients: Ingredient[] }>>;
  closeEmit?: () => void;
}

interface TestSetup {
  service: IngredientCardService;
  recipeId: number;
  fetchIngredients: () => Promise<ApiResult<{ ingredients: Ingredient[] }>>;
  closeEmit: () => void;
}

const setup = (options: SetupOptions = {}): TestSetup => {
  const defaultIngredient = generateIngredient();
  const {
    recipeId = 100,
    fetchIngredients: fetchIngredientsMock = vi.fn().mockResolvedValue({
      ok: true,
      data: { ingredients: [defaultIngredient] },
    } satisfies ApiResult<{ ingredients: Ingredient[] }>),
    closeEmit = vi.fn(),
  } = options;

  (fetchIngredients as Mock).mockImplementation(fetchIngredientsMock);

  const service: IngredientCardService = useIngredientCardService(
    recipeId,
    closeEmit,
  );

  return {
    service,
    recipeId,
    fetchIngredients: fetchIngredientsMock,
    closeEmit,
  };
};

describe("useIngredientCardService.ts", () => {
  it("loads ingredients", async () => {
    const ingredient = generateIngredient();
    const { service } = setup({
      fetchIngredients: vi.fn().mockResolvedValue({
        ok: true,
        data: { ingredients: [ingredient] },
      } satisfies ApiResult<{ ingredients: Ingredient[] }>),
    });
    await vi.waitFor(() => expect(service.isLoading.value).toBe(false));
    expect(service.ingredients.value).toStrictEqual([ingredient]);
  });
});
