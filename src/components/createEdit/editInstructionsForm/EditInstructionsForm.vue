<script lang="ts" setup>
import { computed, inject } from "vue";
import {
  INJECTION_KEY,
  useEditInstructionService,
} from "./editInstructionsService";

//PROPS

interface Props {
  recipeId?: number;
}

const props = defineProps<Props>();

//SERVICE

const {
  instructions,
  newInstructionText,
  onItemReorder,
  onAddInstruction,
  onSaveClick,
  onCancelClick,
} = inject(INJECTION_KEY, useEditInstructionService)(props.recipeId);

const disableAddButton = computed(() => {
  return newInstructionText.value.trim() === "";
});
</script>

<template>
  <ion-card>
    <ion-card-content>
      <ion-list>
        <ion-item>
          <ion-grid class="ion-no-padding">
            <ion-row class="ion-align-items-end">
              <ion-col size="9">
                <ion-input
                  label="Instruction"
                  label-placement="stacked"
                  v-model="newInstructionText"
                />
              </ion-col>
              <ion-col size="3" class="ion-text-right">
                <ion-button
                  @click="onAddInstruction"
                  :disabled="disableAddButton"
                  >Add</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
        <ion-reorder-group
          :disabled="false"
          @ion-item-reorder="onItemReorder($event)"
        >
          <ion-item v-for="instruction in instructions" :key="instruction">
            <ion-label>
              {{ instruction }}
            </ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>
        </ion-reorder-group>
      </ion-list>
    </ion-card-content>
    <ion-button fill="clear" @click="onCancelClick">Cancel</ion-button>
    <ion-button fill="clear" @click="onSaveClick">Confirm</ion-button>
  </ion-card>
</template>
