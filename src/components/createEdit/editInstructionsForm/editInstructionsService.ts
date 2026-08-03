import { fetchInstructions, saveInstructions } from "@/services/apiService";
import { Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";

export const INJECTION_KEY = Symbol();

export interface EditInstructionsService {
  instructions: Ref<string[]>;
  newInstructionText: Ref<string>;
  isLoading: Ref<boolean>;
  loadFailed: Ref<boolean>;
  onAddInstruction: () => void;
  onSaveClick: () => Promise<void>;
  onCancelClick: () => void;
}

export const useEditInstructionService = (
  id?: number,
): EditInstructionsService => {
  const instructions: Ref<string[]> = ref([]);
  const newInstructionText = ref("");
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
      const response = await fetchInstructions(id);
      if (!response.ok) {
        // The list stays empty on failure, which is indistinguishable from a
        // recipe with no instructions — so say so, and block the save that
        // would otherwise overwrite the real list with `[]`.
        loadFailed.value = true;
        showToast(`Unable to load instructions: ${response.error}`);
        return;
      }
      loadFailed.value = false;
      instructions.value = response.data.instructions;
    } finally {
      isLoading.value = false;
    }
  };

  if (id !== undefined) {
    void refreshData();
  }

  const onAddInstruction = () => {
    const text = newInstructionText.value.trim();
    if (!text) {
      return;
    }

    instructions.value.push(text);
    newInstructionText.value = "";
  };

  const onSaveClick = async () => {
    if (id === undefined) {
      router.go(-1);
      return;
    }
    // Until the fetch settles the list is an empty placeholder, not the
    // recipe's real instructions — saving here would wipe them out.
    if (isLoading.value) {
      showToast("Instructions are still loading. Try again in a moment.");
      return;
    }
    if (loadFailed.value) {
      showToast(
        "Instructions could not be loaded, so they cannot be saved. Reload and try again.",
      );
      return;
    }
    const response = await saveInstructions({
      instructions: instructions.value,
      recipeId: id,
    });
    if (!response.ok) {
      showToast(`Unable to save instructions: ${response.error}`);
      return;
    }
    router.go(-1);
  };

  const onCancelClick = () => {
    router.go(-1);
  };

  return {
    instructions,
    newInstructionText,
    isLoading,
    loadFailed,
    onAddInstruction,
    onSaveClick,
    onCancelClick,
  };
};
