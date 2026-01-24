import { fetchInstructions, saveInstructions } from "@/services/apiService";
import { reorderIonicItems } from "@/services/util";
import { Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { usePageRefresher } from "@/composables/usePageRefresher";

export const INJECTION_KEY = Symbol();

export interface EditInstructionsService {
  instructions: Ref<string[]>;
  newInstructionText: Ref<string>;
  onItemReorder: (evt: CustomEvent) => void;
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

  const refreshData = async (): Promise<void> => {
    if (id === undefined) {
      return;
    }
    const response = await fetchInstructions(id);
    if (response.ok) {
      instructions.value = response.data.instructions;
    }
  };

  usePageRefresher(refreshData);

  if (id !== undefined) {
    void refreshData();
  }

  const onItemReorder = (evt: CustomEvent) => {
    reorderIonicItems(evt, instructions.value);
  };

  const onAddInstruction = () => {
    const text = newInstructionText.value.trim();
    if (!text) {
      return;
    }

    instructions.value.push(text);
    newInstructionText.value = "";
  };

  const onSaveClick = () => {
    if (id === undefined) {
      router.go(-1);
      return;
    }
    saveInstructions({
      instructions: instructions.value,
      recipeId: id,
    });
    router.go(-1);
  };

  const onCancelClick = () => {
    router.go(-1);
  };

  return {
    instructions,
    newInstructionText,
    onItemReorder,
    onAddInstruction,
    onSaveClick,
    onCancelClick,
  };
};
