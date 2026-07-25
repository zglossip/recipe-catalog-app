import { RecipeService, useRecipeService } from "@/services/recipeService";
import { Recipe } from "@/types/Recipe";
import { generateRecipe } from "@tests/data/defaults";
import { describe, it, expect } from "vitest";
import { toRef } from "vue";

interface SetupOptions {
  recipe?: Recipe;
}

interface TestSetup {
  service: RecipeService;
  recipe: Recipe;
}

const setup = (options: SetupOptions = {}): TestSetup => {
  const recipe = options.recipe ?? generateRecipe();
  const service = useRecipeService(toRef(recipe));

  return { service, recipe };
};

describe("useRecipeService.ts", () => {
  it("formats servings", () => {
    const recipe: Recipe = generateRecipe({
      servingAmount: 5,
      servingName: "tests",
    });
    const { service } = setup({ recipe });
    expect(service.formattedServingTag.value).toBe("5 tests");
  });

  it("formats one cuisine", () => {
    const recipe: Recipe = generateRecipe({ cuisineTypes: ["Test Cuisine"] });
    const { service } = setup({ recipe });
    expect(service.formattedCuisineTag.value).toBe("Cuisine: Test Cuisine");
  });

  it("formats multipe cuisines", () => {
    const recipe: Recipe = generateRecipe({
      cuisineTypes: ["Test Cuisine 1", "Test Cuisine 2"],
    });
    const { service } = setup({ recipe });
    expect(service.formattedCuisineTag.value).toBe(
      "Cuisines: Test Cuisine 1, Test Cuisine 2",
    );
  });

  it("formats no cuisines", () => {
    const recipe: Recipe = generateRecipe({ cuisineTypes: [] });
    const { service } = setup({ recipe });
    expect(service.formattedCuisineTag.value).toBeFalsy();
  });

  it("formats one course", () => {
    const recipe: Recipe = generateRecipe({ courseTypes: ["Test Course"] });
    const { service } = setup({ recipe });
    expect(service.formattedCourseTag.value).toBe("Course: Test Course");
  });

  it("formats multipe courses", () => {
    const recipe: Recipe = generateRecipe({
      courseTypes: ["Test Course 1", "Test Course 2"],
    });
    const { service } = setup({ recipe });
    expect(service.formattedCourseTag.value).toBe(
      "Courses: Test Course 1, Test Course 2",
    );
  });

  it("formats no courses", () => {
    const recipe: Recipe = generateRecipe({ courseTypes: [] });
    const { service } = setup({ recipe });
    expect(service.formattedCourseTag.value).toBeFalsy();
  });

  it("formats one tag", () => {
    const recipe: Recipe = generateRecipe({ tags: ["Test Tag"] });
    const { service } = setup({ recipe });
    expect(service.formattedTagTag.value).toBe("Tag: Test Tag");
  });

  it("formats multipe tags", () => {
    const recipe: Recipe = generateRecipe({
      tags: ["Test Tag 1", "Test Tag 2"],
    });
    const { service } = setup({ recipe });
    expect(service.formattedTagTag.value).toBe("Tags: Test Tag 1, Test Tag 2");
  });

  it("formats no tags", () => {
    const recipe: Recipe = generateRecipe({ tags: [] });
    const { service } = setup({ recipe });
    expect(service.formattedTagTag.value).toBeFalsy();
  });
});
