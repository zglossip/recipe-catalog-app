<script setup lang="ts">
import { inject } from "vue";
import ButtonCard from "@/components/common/buttonCard/ButtonCard.vue";
import {
  injectionKey,
  useInstructionCardService,
} from "./instructionCardService";
import ProgressSpinner from "primevue/progressspinner";

//PROPS

interface Props {
  id: number;
}

const props = defineProps<Props>();

//EMITS

const emit = defineEmits(["edit"]);
const editEmit = () => emit("edit");

//SERVICE

const { isLoading, instructions, onClick, displayError } = inject(
  injectionKey,
  useInstructionCardService,
)(props.id, editEmit);
</script>

<template>
  <button-card header-text="Instructions" @click="onClick">
    <div v-if="isLoading">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" />
    </div>
    <div v-else-if="displayError">
      <div class="text-red-500 dark:text-red-400">
        <span>Unable to load instructions.</span>
      </div>
    </div>
    <div v-else-if="instructions.length === 0">
      <span>None</span>
    </div>
    <div v-else class="px-4">
      <ol>
        <li
          v-for="instruction in instructions"
          :key="instruction"
          class="list-decimal"
        >
          {{ instruction }}
        </li>
      </ol>
    </div>
  </button-card>
</template>
