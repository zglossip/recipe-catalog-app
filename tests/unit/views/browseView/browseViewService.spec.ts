import { vi, describe, it, expect, Mock } from "vitest";

vi.mock("@/services/apiService");
vi.mock("vue-router");
vi.mock("@/composables/usePageRefresher", () => ({
  usePageRefresher: () => {},
}));

import { ApiResult, fetchRecipes } from "@/services/apiService";
import { useRoute, useRouter } from "vue-router";
import {
  useBrowseViewService,
  BrowseViewService,
} from "@/views/browseView/browseViewService";
import { Recipe } from "@/types/Recipe";
import { generateRecipe } from "@tests/data/defaults";

interface SetupOptions {
  fetchRecipes?: () => Promise<ApiResult<Recipe[]>>;
  routeQuery?: Record<string, unknown>;
}

interface TestSetup {
  service: BrowseViewService;
  fetchRecipes: () => Promise<ApiResult<Recipe[]>>;
  routerPush: Mock;
}

const setup = (options: SetupOptions = {}): TestSetup => {
  const {
    fetchRecipes: fetchRecipesMock = vi.fn().mockResolvedValue({
      ok: true,
      data: [],
    } satisfies ApiResult<Recipe[]>),
    routeQuery = {},
  } = options;

  (fetchRecipes as Mock).mockImplementation(fetchRecipesMock);
  (useRoute as Mock).mockImplementation(
    vi.fn().mockReturnValue({ query: routeQuery }),
  );

  const routerPush = vi.fn();
  (useRouter as Mock).mockImplementation(
    vi.fn().mockReturnValue({
      push: routerPush,
    }),
  );

  const service = useBrowseViewService();

  return { service, fetchRecipes: fetchRecipesMock, routerPush };
};

describe("browseViewService", () => {
  it("loads recipes on load", async () => {
    const testRecipe = generateRecipe();

    const { service } = setup({
      fetchRecipes: vi.fn().mockResolvedValue({
        ok: true,
        data: [testRecipe],
      } satisfies ApiResult<Recipe[]>),
    });

    await vi.waitFor(() => expect(service.isLoading.value).toBe(false));

    expect(service.recipes.value).toEqual([testRecipe]);
  });

  it("loads recipes with params", async () => {
    const fetchRecipesMock = vi.fn().mockResolvedValue({
      ok: true,
      data: [],
    } satisfies ApiResult<Recipe[]>);
    const { service, fetchRecipes } = setup({
      routeQuery: {
        nameQuery: "Test Name",
        cuisineQuery: ["Cuisine 1", "Cuisine 2"],
        courseQuery: ["Course 1", "Course 2"],
        tagQuery: ["Tag 1", "Tag 2"],
      },
      fetchRecipes: fetchRecipesMock,
    });

    await vi.waitFor(() => expect(service.isLoading.value).toBe(false));

    expect(service.recipes.value).toEqual([]);
    expect(fetchRecipes).toHaveBeenCalledWith(
      "Test Name",
      ["Cuisine 1", "Cuisine 2"],
      ["Course 1", "Course 2"],
      ["Tag 1", "Tag 2"],
    );
  });

  it("applies filters", async () => {
    const { service, fetchRecipes } = setup();

    await vi.waitFor(() => expect(service.isLoading.value).toBe(false));

    service.applyFilters({
      nameFilter: "Test Name",
      courseTypeFilters: ["Course 1", "Course 2"],
      cuisineTypeFilters: ["Cuisine 1", "Cuisine 2"],
      tagFilters: ["Tag 1", "Tag 2"],
    });

    await vi.waitFor(() => expect(service.isLoading.value).toBe(false));

    expect(fetchRecipes).toHaveBeenCalledWith(
      "Test Name",
      ["Cuisine 1", "Cuisine 2"],
      ["Course 1", "Course 2"],
      ["Tag 1", "Tag 2"],
    );
  });

  it("navigates to creation wizard", async () => {
    const { service, routerPush } = setup();

    await vi.waitFor(() => expect(service.isLoading.value).toBe(false));

    service.goToCreationWizard();

    expect(routerPush).toHaveBeenCalledWith("/recipe/create");
  });

  it("navigates to quick add", async () => {
    const { service, routerPush } = setup();

    await vi.waitFor(() => expect(service.isLoading.value).toBe(false));

    service.goToQuickAdd();

    expect(routerPush).toHaveBeenCalledWith("/recipe/create/single");
  });
});
