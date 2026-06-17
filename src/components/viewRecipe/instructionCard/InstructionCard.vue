<script setup lang="ts">
import { inject } from "vue";
import ButtonCard from "@/components/common/buttonCard/ButtonCard.vue";
import {
  injectionKey,
  useInstructionCardService,
  formatInstruction,
} from "./instructionCardService";

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
      <ion-spinner />
    </div>
    <div v-else-if="displayError">
      <ion-item>
        <ion-label color="danger">Unable to load instructions.</ion-label>
      </ion-item>
    </div>
    <div v-else-if="instructions.length === 0">
      <ion-item>
        <ion-label> None </ion-label>
      </ion-item>
    </div>
    <div v-else>
      <ion-list>
        <ion-item v-for="(instruction, i) in instructions" :key="instruction">
          <ion-label>{{ formatInstruction(i, instruction) }}</ion-label>
        </ion-item>
      </ion-list>
    </div>
  </button-card>
</template>
