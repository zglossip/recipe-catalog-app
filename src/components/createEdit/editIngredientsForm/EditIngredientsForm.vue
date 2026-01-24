<script lang="ts" setup>
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonList,
  IonReorderGroup,
  IonItem,
  IonLabel,
  IonReorder,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { computed, inject } from "vue";
import {
  INJECTION_KEY,
  useEditIngredientService,
} from "./editIngredientsService";
import { formatMeasurementText } from "@/services/util";

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
  onItemReorder,
  onAddIngredient,
  onSaveClick,
  onCancelClick,
} = inject(INJECTION_KEY, useEditIngredientService)(props.recipeId);

const disableAddButton = computed(() => {
  return newIngredientName.value.trim() === "";
});
</script>

<template>
  <ion-card>
    <ion-card-content>
      <ion-list>
        <ion-item>
          <ion-grid class="ion-no-padding">
            <ion-row class="ion-align-items-end">
              <ion-col size="5">
                <ion-input
                  label="Ingredient"
                  label-placement="stacked"
                  v-model="newIngredientName"
                />
              </ion-col>
              <ion-col size="2">
                <ion-input
                  label="Unit"
                  label-placement="stacked"
                  v-model="newIngredientQuantity"
                  type="text"
                  inputmode="numeric"
                />
              </ion-col>
              <ion-col size="2">
                <ion-input
                  label="UOM"
                  label-placement="stacked"
                  v-model="newIngredientUom"
                />
              </ion-col>
              <ion-col size="3" class="ion-text-right">
                <ion-button @click="onAddIngredient" :disabled="disableAddButton">Add</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
        <ion-reorder-group
          :disabled="false"
          @ion-item-reorder="onItemReorder($event)"
        >
          <ion-item v-for="ingredient in ingredients" :key="ingredient.name">
            <ion-label>
              {{ ingredient.name }}
              <p v-if="ingredient.notes">{{ ingredient.notes }}</p>
            </ion-label>
            <ion-label>
              <p :class="$style.ingredientMeasurement">
                {{ formatMeasurementText(ingredient) }}
              </p>
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

<style module>
.ingredientMeasurement {
  float: right;
}
</style>
