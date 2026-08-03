<script lang="ts" setup>
import { computed, inject } from "vue";
import {
  INJECTION_KEY,
  useEditInstructionService,
} from "./editInstructionsService";
import { Card, InputText, Button, OrderList } from "primevue";

//PROPS

interface Props {
  recipeId?: number;
}

const props = defineProps<Props>();

//SERVICE

const {
  instructions,
  newInstructionText,
  loadFailed,
  onAddInstruction,
  onSaveClick,
  onCancelClick,
} = inject(INJECTION_KEY, useEditInstructionService)(props.recipeId);

const disableAddButton = computed(() => {
  return newInstructionText.value.trim() === "";
});
</script>

<template>
  <Card>
    <template #content>
      <div class="flex items-end gap-2 mb-4">
        <div class="flex flex-col gap-2 flex-auto">
          <label class="font-semibold" for="rc-instruction">
            Instruction
          </label>
          <InputText id="rc-instruction" v-model="newInstructionText" />
        </div>
        <Button
          icon="pi pi-plus"
          @click="onAddInstruction"
          :disabled="disableAddButton"
        />
      </div>
      <div v-if="loadFailed" class="mb-4 text-red-500 dark:text-red-400">
        Instructions could not be loaded.
      </div>
      <OrderList v-model="instructions" class="mb-4">
        <template #option="{ option }">
          {{ option }}
        </template>
      </OrderList>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button @click="onCancelClick" severity="secondary">Cancel</Button>
        <Button @click="onSaveClick" :disabled="loadFailed">Confirm</Button>
      </div>
    </template>
  </Card>
</template>
