<script setup lang="ts">
import { inject } from "vue";
import {
  INJECTION_KEY,
  useViewRecipeContainerService,
} from "./viewRecipeContainerService";
import RecipeCard from "@/components/viewRecipe/recipeCard/RecipeCard.vue";
import IngredientCard from "../ingredientCard/IngredientCard.vue";
import InstructionCard from "../instructionCard/InstructionCard.vue";
import MiniRecipe from "../miniRecipe/MiniRecipe.vue";

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
  <div v-if="displayError || !recipe" class="text-red-500 dark:text-red-400">
    <span>Unable to load recipe.</span>
  </div>
  <div else class="grid grid-cols-3 gap-4">
    <div>
      <RecipeCard class="mb-4" :recipe="recipe" @edit="onEditHeader" />
      <IngredientCard class="mb-4" :id="id" @edit="onEditIngredients" />
    </div>
    <div class="md:col-span-2">
      <InstructionCard class="mb-4" :id="id" @edit="onEditInstructions" />
      <MiniRecipe
        v-for="subRecipeId in recipe?.subRecipes"
        :key="subRecipeId"
        class="mb-4"
        :id="subRecipeId"
      />
    </div>
  </div>
</template>
