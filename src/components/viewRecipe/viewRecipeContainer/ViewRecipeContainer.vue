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
  <div v-if="displayError" class="text-red-500 dark:text-red-400">
    <span>Unable to load recipe.</span>
  </div>
  <div v-else class="flex flex-col gap-4 md:grid md:grid-cols-3 md:grid-rows-3">
    <div class="md:col-start-1 md:row-start-1">
      <RecipeCard :recipe="recipe" @edit="onEditHeader" />
    </div>
    <div class="md:col-start-1 md:row-start-2 md:row-span-2">
      <IngredientCard :id="id" @edit="onEditIngredients" />
    </div>
    <div class="md:col-start-2 md:col-span-2 md:row-start-1 md:row-span-3">
      <InstructionCard :id="id" @edit="onEditInstructions" />
    </div>
  </div>
</template>
