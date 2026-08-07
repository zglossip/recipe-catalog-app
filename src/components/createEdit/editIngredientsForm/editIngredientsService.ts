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

  const router = useRouter();
  const { showToast } = useToast();

  const refreshData = async (): Promise<void> => {
    if (id === undefined) {
      return;
    }
    const response = await fetchIngredients(id);
    if (response.ok) {
      ingredients.value = response.data.ingredients;
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
    const response = await saveIngredients({
      ingredients: ingredients.value,
      recipeId: id,
    });
    if (!response.ok) {
      showToast("Unable to save ingredients.");
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
    onAddIngredient,
    onSaveClick,
    onCancelClick,
  };
};
