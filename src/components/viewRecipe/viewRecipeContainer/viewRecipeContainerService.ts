import { fetchRecipe } from "@/services/apiService";
import { Recipe } from "@/types/Recipe";
import { Ref, ref } from "vue";
import { useRouter } from "vue-router";

export const INJECTION_KEY = Symbol();

export interface ViewRecipeContainerService {
  isLoading: Ref<boolean>;
  recipe: Ref<Recipe | null>;
  onEditHeader: () => void;
  onEditIngredients: () => void;
  onEditInstructions: () => void;
  refreshData: () => Promise<void>;
  displayError: Ref<boolean>;
}

export const useViewRecipeContainerService = (
  id: number,
): ViewRecipeContainerService => {
  const isLoading: Ref<boolean> = ref(false);
  const recipe: Ref<Recipe | null> = ref(null);
  const displayError: Ref<boolean> = ref(false);

  const router = useRouter();

  const refreshData = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetchRecipe(id);
      if (response.ok) {
        recipe.value = response.data;
        displayError.value = false;
        return;
      }
      recipe.value = null;
      displayError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const onEditHeader = () => {
    router.push(`/recipe/edit/${id}`);
  };

  const onEditIngredients = () => {
    router.push(`/recipe/edit/${id}/ingredients`);
  };

  const onEditInstructions = () => {
    router.push(`/recipe/edit/${id}/instructions`);
  };

  refreshData();

  return {
    isLoading,
    recipe,
    onEditHeader,
    onEditIngredients,
    onEditInstructions,
    refreshData,
    displayError,
  };
};
