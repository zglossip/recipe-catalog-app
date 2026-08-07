import { describe, it, expect, vi, Mock, beforeEach } from "vitest";

vi.mock("@/services/apiService");
vi.mock("vue-router");

import {
  useViewRecipeContainerService,
  ViewRecipeContainerService,
} from "@/components/viewRecipe/viewRecipeContainer/viewRecipeContainerService";
import { ApiResult, fetchRecipe } from "@/services/apiService";
import { generateRecipe } from "@tests/data/defaults";
import { useRouter } from "vue-router";

interface SetupOptions {
  id?: number;
  fetchResponse?: ReturnType<typeof generateRecipe> | null;
}

const setup = (options: SetupOptions = {}) => {
  const id = options.id ?? 15;
  const recipeResponse = options.fetchResponse ?? generateRecipe({ id });

  const push = vi.fn();
  (useRouter as Mock).mockReturnValue({ push });
  (fetchRecipe as Mock).mockResolvedValue(
    recipeResponse
      ? ({ ok: true, data: recipeResponse } satisfies ApiResult<
          ReturnType<typeof generateRecipe>
        >)
      : ({ ok: false, error: "Failed to load" } satisfies ApiResult<
          ReturnType<typeof generateRecipe>
        >),
  );

  const service: ViewRecipeContainerService = useViewRecipeContainerService(id);

  return { service, id, push, recipeResponse };
};

describe("viewRecipeContainerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("refreshes the recipe data for the given id", async () => {
    const { service, id, recipeResponse } = setup();

    await service.refreshData();

    await vi.waitFor(() =>
      expect(service.recipe.value).toEqual(recipeResponse),
    );
    expect(fetchRecipe as Mock).toHaveBeenCalledWith(id);
  });

  it("navigates to header edit route", () => {
    const { service, push, id } = setup();

    service.onEditHeader();

    expect(push).toHaveBeenCalledWith(`/recipe/edit/${id}`);
  });

  it("navigates to ingredient edit route", () => {
    const { service, push, id } = setup();

    service.onEditIngredients();

    expect(push).toHaveBeenCalledWith(`/recipe/edit/${id}/ingredients`);
  });

  it("navigates to instruction edit route", () => {
    const { service, push, id } = setup();

    service.onEditInstructions();

    expect(push).toHaveBeenCalledWith(`/recipe/edit/${id}/instructions`);
  });
});
