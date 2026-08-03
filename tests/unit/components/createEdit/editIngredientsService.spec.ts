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

interface SetupOptions {
  // `null` stands in for create mode, where no id is passed at all.
  id?: number | null;
  // A promise keeps the fetch in flight, so `isLoading` can be exercised.
  fetchResult?: ApiResult<IngredientList> | Promise<ApiResult<IngredientList>>;
}

const setup = ({
  id = recipeId,
  fetchResult = { ok: true, data: defaultIngredientList },
}: SetupOptions = {}): {
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

  const service = useEditIngredientService(id ?? undefined);

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
    const { service, showToast } = setup({
      fetchResult: { ok: false, error: "Boom" },
    });

    await vi.waitFor(() => expect(service.loadFailed.value).toBe(true));

    expect(showToast).toHaveBeenCalledWith("Unable to load ingredients: Boom");
    expect(service.ingredients.value).toEqual([]);
  });

  it("refuses to save over a list that never loaded", async () => {
    const { service, routerGo, showToast } = setup({
      fetchResult: { ok: false, error: "Boom" },
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

  it("refuses to save while the initial fetch is still in flight", async () => {
    let settleFetch: (result: ApiResult<IngredientList>) => void = () => {};
    const pending = new Promise<ApiResult<IngredientList>>((resolve) => {
      settleFetch = resolve;
    });

    const { service, routerGo, showToast } = setup({ fetchResult: pending });

    expect(service.isLoading.value).toBe(true);

    // The user types an entry into what looks like an empty list and confirms
    // before the GET lands.
    service.newIngredientName.value = "Flour";
    service.onAddIngredient();
    await service.onSaveClick();

    expect(saveIngredients as Mock).not.toHaveBeenCalled();
    expect(routerGo).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      "Ingredients are still loading. Try again in a moment.",
    );

    settleFetch({ ok: true, data: defaultIngredientList });
    await vi.waitFor(() => expect(service.isLoading.value).toBe(false));
  });

  it("is never loading in create mode", () => {
    const { service } = setup({ id: null });

    expect(service.isLoading.value).toBe(false);
    expect(fetchIngredients as Mock).not.toHaveBeenCalled();
  });

  it("cancels editing by going back", () => {
    const { service, routerGo } = setup();

    service.onCancelClick();

    expect(routerGo).toHaveBeenCalledWith(-1);
  });
});
