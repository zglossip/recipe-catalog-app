import { fetchIngredients, saveIngredients } from "@/services/apiService";
import { Ingredient } from "@/types/Ingredient";
import { Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";

export const INJECTION_KEY = Symbol();

export interface EditIngredientsService {
  ingredients: Ref<Ingredient[]>;
  newIngredientName: Ref<string>;
  newIngredientQuantity: Ref<number>;
  newIngredientUom: Ref<string>;
  isLoading: Ref<boolean>;
  loadFailed: Ref<boolean>;
  onAddIngredient: () => void;
  onSaveClick: () => Promise<void>;
  onCancelClick: () => void;
}

export const useEditIngredientService = (
  id?: number,
): EditIngredientsService => {
  const ingredients: Ref<Ingredient[]> = ref([]);
  const newIngredientName = ref("");
  const newIngredientQuantity = ref(1);
  const newIngredientUom = ref("");
  // Create mode never fetches, so it is never loading.
  const isLoading = ref(id !== undefined);
  const loadFailed = ref(false);

  const router = useRouter();
  const { showToast } = useToast();

  const refreshData = async (): Promise<void> => {
    if (id === undefined) {
      return;
    }
    isLoading.value = true;
    try {
      const response = await fetchIngredients(id);
      if (!response.ok) {
        // The list stays empty on failure, which is indistinguishable from a
        // recipe with no ingredients — so say so, and block the save that
        // would otherwise overwrite the real list with `[]`.
        loadFailed.value = true;
        showToast(`Unable to load ingredients: ${response.error}`);
        return;
      }
      loadFailed.value = false;
      ingredients.value = response.data.ingredients;
    } finally {
      isLoading.value = false;
    }
  };

  if (id !== undefined) {
    void refreshData();
  }

  const onAddIngredient = () => {
    const name = newIngredientName.value.trim();
    if (!name) {
      return;
    }

    const uom = newIngredientUom.value.trim();
    const parsedQuantity = Number(newIngredientQuantity.value);
    const quantity =
      Number.isFinite(parsedQuantity) && parsedQuantity > 0
        ? parsedQuantity
        : 1;

    ingredients.value.push({
      name,
      quantity,
      uom: uom ? uom : undefined,
    });

    newIngredientName.value = "";
    newIngredientQuantity.value = 1;
    newIngredientUom.value = "";
  };

  const onSaveClick = async () => {
    if (id === undefined) {
      router.go(-1);
      return;
    }
    // Until the fetch settles the list is an empty placeholder, not the
    // recipe's real ingredients — saving here would wipe them out.
    if (isLoading.value) {
      showToast("Ingredients are still loading. Try again in a moment.");
      return;
    }
    if (loadFailed.value) {
      showToast(
        "Ingredients could not be loaded, so they cannot be saved. Reload and try again.",
      );
      return;
    }
    const response = await saveIngredients({
      ingredients: ingredients.value,
      recipeId: id,
    });
    if (!response.ok) {
      showToast(`Unable to save ingredients: ${response.error}`);
      return;
    }

    router.go(-1);
  };

  const onCancelClick = () => {
    router.go(-1);
  };

  return {
    ingredients,
    newIngredientName,
    newIngredientQuantity,
    newIngredientUom,
    isLoading,
    loadFailed,
    onAddIngredient,
    onSaveClick,
    onCancelClick,
  };
};
