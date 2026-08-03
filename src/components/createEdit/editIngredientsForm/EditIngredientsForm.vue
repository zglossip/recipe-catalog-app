<script lang="ts" setup>
import { computed, inject } from "vue";
import {
  INJECTION_KEY,
  useEditIngredientService,
} from "./editIngredientsService";
import { formatMeasurementText } from "@/services/util";
import { InputText, Card, InputNumber, Button, OrderList } from "primevue";

//PROPS

interface Props {
  recipeId?: number;
}

const props = defineProps<Props>();

//SERVICE

const {
  ingredients,
  newIngredientName,
  newIngredientQuantity,
  newIngredientUom,
  onAddIngredient,
  onSaveClick,
  onCancelClick,
} = inject(INJECTION_KEY, useEditIngredientService)(props.recipeId);

const disableAddButton = computed(() => {
  return newIngredientName.value.trim() === "";
});
</script>

<template>
  <Card>
    <template #content>
      <div class="grid grid-cols-12 gap-4">
        <div
          class="flex flex-col gap-2 mb-4 col-span-12 lg:col-span-6 xl:col-span-6"
        >
          <label class="font-semibold" for="rc-ingredient-name">
            Ingredient
          </label>
          <InputText id="rc-ingredient-name" v-model="newIngredientName" />
        </div>
        <div
          class="flex flex-col gap-2 mb-4 col-span-12 md:col-span-8 lg:col-span-3 xl:col-span-3"
        >
          <label class="font-semibold" for="rs-ingredient-quantity">Unit</label>
          <InputNumber
            id="rc-ingredient-quantity"
            v-model="newIngredientQuantity"
          />
        </div>
        <div
          class="flex flex-col gap-2 mb-4 col-span-12 md:col-span-3 lg:col-span-2 xl:col-span-2"
        >
          <label class="font-semibold" for="rs-ingredient-uom">UOM</label>
          <InputText id="rc-ingredient-uom" v-model="newIngredientUom" />
        </div>
        <div class="flex flex-col gap-2 mb-4 col-span-1 justify-end">
          <Button
            icon="pi pi-plus"
            @click="onAddIngredient"
            :disabled="disableAddButton"
          />
        </div>
        <div class="flex flex-col gap-2 mb-4 col-span-12">
          <OrderList v-model="ingredients" data-key="name">
            <template #option="{ option }">
              <div class="flex flex-col">
                <div>
                  <span class="font-semibold">{{ option.name }}:</span>
                  <span>{{ formatMeasurementText(option) }}</span>
                </div>
                <p
                  class="text-sm text-surface-500 dark:text-surface-400"
                  v-if="option.notes"
                >
                  {{ option.notes }}
                </p>
              </div>
            </template>
          </OrderList>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-4">
        <Button label="Cancel" @click="onCancelClick" severity="secondary" />
        <Button label="Confirm" @click="onSaveClick" />
      </div>
    </template>
  </Card>
</template>
