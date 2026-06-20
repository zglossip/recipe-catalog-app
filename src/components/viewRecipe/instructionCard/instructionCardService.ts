import { fetchInstructions } from "@/services/apiService";
import { Ref, ref } from "vue";
import { usePageRefresher } from "@/composables/usePageRefresher";

export const injectionKey = Symbol();

export interface InstructionCardService {
  instructions: Ref<string[]>;
  isLoading: Ref<boolean>;
  onClick: () => void;
  displayError: Ref<boolean>;
}

export const useInstructionCardService = (
  id: number,
  editEmit: () => void,
): InstructionCardService => {
  const instructions: Ref<string[]> = ref([]);
  const isLoading: Ref<boolean> = ref(true);
  const onClick = () => editEmit();
  const displayError: Ref<boolean> = ref(false);

  const refreshData = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const instructionResponse = await fetchInstructions(id);
      if (instructionResponse.ok) {
        instructions.value = instructionResponse.data.instructions;
        displayError.value = false;
        return;
      }
      instructions.value = [];
      displayError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  usePageRefresher(refreshData);
  void refreshData();

  return { instructions, isLoading, onClick, displayError };
};