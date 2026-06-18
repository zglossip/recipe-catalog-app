<script setup lang="ts">
import {
  useIngredientCardService,
  INJECTION_KEY,
} from "./ingredientCardService";
import { inject } from "vue";
import IngredientItem from "@/components/viewRecipe/ingredientCard/IngredientItem.vue";
import ButtonCard from "@/components/common/buttonCard/ButtonCard.vue";

//PROPS

interface Props {
  id: number;
}

const props = defineProps<Props>();

//EMITS
const emit = defineEmits(["edit"]);
const editEmit = () => emit("edit");

const { isLoading, ingredients, onClick, displayError } = inject(
  INJECTION_KEY,
  useIngredientCardService,
)(props.id, editEmit);
</script>

<template>
  <button-card header-text="Ingredients" @click="onClick">
    <div v-if="isLoading">
      <ion-spinner />
    </div>
    <div v-else-if="displayError">
      <ion-item>
        <ion-label color="danger">Unable to load ingredients.</ion-label>
      </ion-item>
    </div>
    <div v-else-if="ingredients.length === 0">
      <ion-item>
        <ion-label> None </ion-label>
      </ion-item>
    </div>
    <div v-else>
      <ion-list>
        <ingredient-item
          v-for="ingredient in ingredients"
          :key="ingredient.name"
          :ingredient="ingredient"
        />
      </ion-list>
    </div>
  </button-card>
</template>
