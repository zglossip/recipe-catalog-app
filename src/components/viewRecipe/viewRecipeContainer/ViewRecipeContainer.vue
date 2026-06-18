<script setup lang="ts">
import { inject } from "vue";
import {
  INJECTION_KEY,
  useViewRecipeContainerService,
} from "./viewRecipeContainerService";
import RecipeCard from "@/components/viewRecipe/recipeCard/RecipeCard.vue";
import IngredientCard from "../ingredientCard/IngredientCard.vue";
import InstructionCard from "../instructionCard/InstructionCard.vue";

// PROPS
interface Props {
  id: number;
}
const props = defineProps<Props>();

// SERVICE

const {
  recipe,
  onEditHeader,
  onEditIngredients,
  onEditInstructions,
  displayError,
} = inject(INJECTION_KEY, useViewRecipeContainerService)(props.id);
</script>

<template>
  <ion-item v-if="displayError">
    <ion-label color="danger">Unable to load recipe.</ion-label>
  </ion-item>
  <RecipeCard :recipe="recipe" @edit="onEditHeader" />
  <IngredientCard :id="id" @edit="onEditIngredients" />
  <InstructionCard :id="id" @edit="onEditInstructions" />
</template>
