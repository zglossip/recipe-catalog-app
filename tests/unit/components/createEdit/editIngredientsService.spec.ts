import { describe, it, expect, vi, Mock } from "vitest";
import {
  useEditIngredientService,
  EditIngredientsService,
} from "@/components/createEdit/editIngredientsForm/editIngredientsService";
import {
  ApiResult,
  fetchIngredients,
  saveIngredients,
} from "@/services/apiService";
import { useRouter } from "vue-router";
import { generateIngredient } from "@tests/data/defaults";
import { IngredientList } from "@/types/IngredientList";

vi.mock("@/services/apiService");
vi.mock("vue-router");
vi.mock("@/composables/usePageRefresher", () => ({
  usePageRefresher: () => {},
}));

const recipeId = 10;
const testName = "Test Ingredient";

const defaultIngredientList: IngredientList = {
  recipeId,
  ingredients: [generateIngredient({ name: testName })],
};

const setup = (
  ingredientListResponse = defaultIngredientList,
): { service: EditIngredientsService; routerGo: () => void } => {
  vi.resetAllMocks();

  const routerGo = vi.fn();

  (useRouter as Mock).mockReturnValue({ go: routerGo });
  (saveIngredients as Mock).mockResolvedValue({
    ok: true,
    data: null,
  } satisfies ApiResult<null>);
  (fetchIngredients as Mock).mockResolvedValue({
    ok: true,
    data: ingredientListResponse,
  } satisfies ApiResult<IngredientList>);

  const service = useEditIngredientService(recipeId);

  return { service, routerGo };
};

describe("editIngredientsService", () => {
  it("loads ingredients for the recipe id", async () => {
    const { service } = setup();

    await vi.waitFor(() => expect(service.ingredients.value.length).toBe(1));

    expect(fetchIngredients as Mock).toHaveBeenCalledWith(recipeId);
    expect(service.ingredients.value[0].name).toBe(testName);
  });

  it("saves ingredients and navigates back", async () => {
    const { service, routerGo } = setup();
    await vi.waitFor(() => expect(service.ingredients.value.length).toBe(1));

    service.onSaveClick();

    expect(saveIngredients as Mock).toHaveBeenCalledWith({
      recipeId,
      ingredients: service.ingredients.value,
    });
    expect(routerGo).toHaveBeenCalledWith(-1);
  });

  it("cancels editing by going back", () => {
    const { service, routerGo } = setup();

    service.onCancelClick();

    expect(routerGo).toHaveBeenCalledWith(-1);
  });
});
