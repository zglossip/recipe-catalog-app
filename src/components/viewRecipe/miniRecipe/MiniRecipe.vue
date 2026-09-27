<script setup lang="ts">
import { Card, Divider } from "primevue";
import { INJECTION_KEY, useMiniRecipeService } from "./miniRecipeService";
import { inject } from "vue";
import { formatMeasurementText } from "@/services/util";
import { Ingredient } from "@/types/Ingredient";

interface Props {
  id: number;
}

const props = defineProps<Props>();

const { recipe, ingredients, instructions } = inject(
  INJECTION_KEY,
  useMiniRecipeService,
)(props.id);

function formatIngredient(ingredient: Ingredient): string {
  if(ingredient.notes) {
    return formatMeasurementText(ingredient) + " " + ingredient.name + " (" + ingredient.notes + ")"
  }

  return formatMeasurementText(ingredient) + " " + ingredient.name;
}
</script>

<template>
  <Card>
    <template #title>
      <span v-if="recipe">{{ recipe.name }}</span>
    </template>
    <template #content>
      <div v-if="recipe" class="flex flex-col gap-1">
        <span>{{ recipe.servingAmount + " " + recipe.servingName }}</span>
        <Divider v-if="ingredients" />
        <ul v-if="ingredients" class="list-disc list-inside">
          <li v-for="ingredient in ingredients">
            {{ formatIngredient(ingredient) }}
          </li>
        </ul>
        <Divider v-if="instructions" />
        <ol v-if="instructions" class="list-decimal list-inside">
          <li v-for="instruction in instructions">{{ instruction }}</li>
        </ol>
      </div>
    </template>
  </Card>
</template>
