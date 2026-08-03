import { describe, it, expect, vi, Mock } from "vitest";
import { ref, nextTick, Ref } from "vue";
import { generateRecipe } from "@tests/data/defaults";
import { FilterType } from "@/types/FilterType";
import {
  useEditHeaderFormService,
  EditHeaderFormService,
} from "@/components/createEdit/editHeaderForm/editHeaderFormService";
import { ApiResult, saveRecipe, createRecipe } from "@/services/apiService";
import { useRouter } from "vue-router";
import { Recipe } from "@/types/Recipe";

vi.mock("@/services/apiService");
vi.mock("vue-router");

const setup = (
  existingRecipe?: Recipe,
): {
  service: EditHeaderFormService;
  recipeRef: Ref<Recipe | undefined>;
  routerGo: () => void;
} => {
  vi.resetAllMocks();

  const routerGo = vi.fn();

  (useRouter as Mock).mockReturnValue({ go: routerGo });
  (saveRecipe as Mock).mockResolvedValue({
    ok: true,
    data: null,
  } satisfies ApiResult<null>);
  (createRecipe as Mock).mockResolvedValue({
    ok: true,
    data: generateRecipe({ id: 42 }),
  } satisfies ApiResult<Recipe>);

  const recipeRef = ref<Recipe | undefined>(existingRecipe);
  const service = useEditHeaderFormService(recipeRef);

  return { service, recipeRef, routerGo };
};

describe("editHeaderFormService", () => {
  it("keeps form fields in sync when the recipe ref changes", async () => {
    const initialRecipe = generateRecipe({
      name: "Original",
      servingAmount: 2,
      servingName: "cups",
      courseTypes: ["Dinner"],
      cuisineTypes: ["Italian"],
      tags: ["Comfort"],
    });

    const { service, recipeRef } = setup(initialRecipe);

    const updatedRecipe = generateRecipe({
      name: "Updated",
      servingAmount: 4,
      servingName: "plates",
      courseTypes: ["Lunch", "Dinner"],
      cuisineTypes: ["Italian", "Fusion"],
      tags: ["Comfort", "Weeknight"],
    });

    recipeRef.value = updatedRecipe;
    await nextTick();

    expect(service.newName.value).toBe("Updated");
    expect(service.newServingAmount.value).toBe(4);
    expect(service.newCourseTypes.value).toEqual(["Lunch", "Dinner"]);
    expect(service.newCuisineTypes.value).toEqual(["Italian", "Fusion"]);
    expect(service.newTags.value).toEqual(["Comfort", "Weeknight"]);
  });

  it("removes chips for the correct filter type", () => {
    const recipe = generateRecipe({
      courseTypes: ["Brunch", "Dinner"],
      cuisineTypes: ["Italian", "Thai"],
      tags: ["Favorite", "Quick"],
    });
    const { service } = setup(recipe);

    service.removeChip({ type: FilterType.COURSE, value: "Brunch" });
    service.removeChip({ type: FilterType.CUISINE, value: "Thai" });
    service.removeChip({ type: FilterType.TAG, value: "Favorite" });

    expect(service.newCourseTypes.value).toEqual(["Dinner"]);
    expect(service.newCuisineTypes.value).toEqual(["Italian"]);
    expect(service.newTags.value).toEqual(["Quick"]);
  });

  it("adds unique chips for the selected filter type", () => {
    const { service } = setup(generateRecipe({ tags: [] }));

    service.currentFilterType.value = FilterType.TAG;
    service.filterText.value = "Fresh";
    service.addChip();
    service.addChip(); // duplicate should be ignored

    expect(service.newTags.value).toEqual(["Fresh"]);
  });

  it("updates an existing recipe via saveRecipe and navigates back", async () => {
    const recipe = generateRecipe({
      id: 7,
      name: "Existing",
      servingAmount: 1,
      servingName: "slice",
      courseTypes: ["Dessert"],
      cuisineTypes: ["Italian"],
      tags: ["Sweet"],
    });
    const { service, routerGo } = setup(recipe);

    service.newName.value = "Tiramisu";
    service.newServingAmount.value = 8;
    service.newServingName.value = "pieces";
    service.newCourseTypes.value = ["Dessert", "Party"];
    service.newCuisineTypes.value = ["Italian"];
    service.newTags.value = ["Sweet", "Coffee"];

    await service.onSaveClick();

    expect(saveRecipe as Mock).toHaveBeenCalledWith({
      ...recipe,
      name: "Tiramisu",
      servingAmount: 8,
      servingName: "pieces",
      courseTypes: ["Dessert", "Party"],
      cuisineTypes: ["Italian"],
      tags: ["Sweet", "Coffee"],
    });
    expect(createRecipe as Mock).not.toHaveBeenCalled();
    expect(routerGo).toHaveBeenCalledWith(-1);
  });

  it("creates a recipe when one does not exist and navigates back", async () => {
    const { service, routerGo } = setup(undefined);

    service.newName.value = "New Recipe";
    service.newServingAmount.value = 3;
    service.newServingName.value = "bowls";
    service.newCourseTypes.value = ["Lunch"];
    service.newCuisineTypes.value = ["Thai"];
    service.newTags.value = ["Spicy"];

    await service.onSaveClick();

    expect(createRecipe as Mock).toHaveBeenCalledWith({
      name: "New Recipe",
      servingAmount: 3,
      servingName: "bowls",
      courseTypes: ["Lunch"],
      cuisineTypes: ["Thai"],
      tags: ["Spicy"],
      uploaded: null,
    });
    expect(saveRecipe as Mock).not.toHaveBeenCalled();
    expect(routerGo).toHaveBeenCalledWith(-1);
  });

  it("cancels editing by navigating back", () => {
    const { service, routerGo } = setup();

    service.onCancelClick();

    expect(routerGo).toHaveBeenCalledWith(-1);
  });
});
