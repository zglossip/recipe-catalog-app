import { Ingredient } from "@/types/Ingredient";
import { Ref, ref } from "vue";
import { fetchIngredients } from "@/services/apiService";

export const INJECTION_KEY = Symbol();

export interface IngredientCardService {
  ingredients: Ref<Ingredient[]>;
  isLoading: Ref<boolean>;
  onClick: () => void;
  displayError: Ref<boolean>;
}

export const useIngredientCardService = (
  id: number,
  editEmit: () => void,
): IngredientCardService => {
  const ingredients: Ref<Ingredient[]> = ref([]);
  const isLoading: Ref<boolean> = ref(true);
  const onClick = () => editEmit();
  const displayError: Ref<boolean> = ref(false);

  const refreshData = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const ingredientResponse = await fetchIngredients(id);
      if (ingredientResponse.ok) {
        ingredients.value = ingredientResponse.data.ingredients;
        displayError.value = false;
        return;
      }
      ingredients.value = [];
      displayError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  void refreshData();

  return { ingredients, isLoading, onClick, displayError };
};
