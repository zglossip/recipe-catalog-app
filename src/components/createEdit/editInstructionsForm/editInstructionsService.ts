import { fetchInstructions, saveInstructions } from "@/services/apiService";
import { Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";

export const INJECTION_KEY = Symbol();

export interface EditInstructionsService {
  instructions: Ref<string[]>;
  newInstructionText: Ref<string>;
  onAddInstruction: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
}

export const useEditInstructionService = (
  id?: number,
): EditInstructionsService => {
  const instructions: Ref<string[]> = ref([]);
  const newInstructionText = ref("");
  const router = useRouter();
  const { showToast } = useToast();

  const refreshData = async (): Promise<void> => {
    if (id === undefined) {
      return;
    }
    const response = await fetchInstructions(id);
    if (response.ok) {
      instructions.value = response.data.instructions;
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
    const response = await saveInstructions({
      instructions: instructions.value,
      recipeId: id,
    });
    if (!response.ok) {
      showToast("Unable to save instructions.");
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
    onAddInstruction,
    onSaveClick,
    onCancelClick,
  };
};
