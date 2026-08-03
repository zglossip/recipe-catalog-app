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

const { showToast } = vi.hoisted(() => ({ showToast: vi.fn() }));

vi.mock("@/services/apiService");
vi.mock("vue-router");
vi.mock("@/composables/useToast", () => ({
  useToast: () => ({ showToast, dismissToast: vi.fn() }),
}));

const recipeId = 10;
const testName = "Test Ingredient";

const defaultIngredientList: IngredientList = {
  recipeId,
  ingredients: [generateIngredient({ name: testName })],
};

const setup = (
  fetchResult: ApiResult<IngredientList> = {
    ok: true,
    data: defaultIngredientList,
  },
): {
  service: EditIngredientsService;
  routerGo: () => void;
  showToast: Mock;
} => {
  vi.resetAllMocks();

  const routerGo = vi.fn();

  (useRouter as Mock).mockReturnValue({ go: routerGo });
  (saveIngredients as Mock).mockResolvedValue({
    ok: true,
    data: null,
  } satisfies ApiResult<null>);
  (fetchIngredients as Mock).mockResolvedValue(fetchResult);

  const service = useEditIngredientService(recipeId);

  return { service, routerGo, showToast };
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

    await service.onSaveClick();

    expect(saveIngredients as Mock).toHaveBeenCalledWith({
      recipeId,
      ingredients: service.ingredients.value,
    });
    expect(routerGo).toHaveBeenCalledWith(-1);
  });

  it("toasts and flags the load when fetching ingredients fails", async () => {
    const { service, showToast } = setup({ ok: false, error: "Boom" });

    await vi.waitFor(() => expect(service.loadFailed.value).toBe(true));

    expect(showToast).toHaveBeenCalledWith("Unable to load ingredients: Boom");
    expect(service.ingredients.value).toEqual([]);
  });

  it("refuses to save over a list that never loaded", async () => {
    const { service, routerGo, showToast } = setup({
      ok: false,
      error: "Boom",
    });

    await vi.waitFor(() => expect(service.loadFailed.value).toBe(true));
    showToast.mockClear();

    await service.onSaveClick();

    expect(saveIngredients as Mock).not.toHaveBeenCalled();
    expect(routerGo).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      "Ingredients could not be loaded, so they cannot be saved. Reload and try again.",
    );
  });

  it("cancels editing by going back", () => {
    const { service, routerGo } = setup();

    service.onCancelClick();

    expect(routerGo).toHaveBeenCalledWith(-1);
  });
});
