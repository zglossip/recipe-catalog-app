<script setup lang="ts">
import { Ingredient } from "@/types/Ingredient";
import { formatMeasurementText } from "@/services/util";

interface Props {
  ingredient: Ingredient;
}

defineProps<Props>();
</script>

<template>
  <div class="mb-4">
    <div class="mb-1">
      <span class="font-bold mr-2">{{ ingredient.name + ":" }}</span
      ><span>{{ formatMeasurementText(ingredient) }}</span>
    </div>
    <p
      v-if="ingredient.notes"
      class="text-sm text-surface-500 dark:text-surface-400"
    >
      {{ ingredient.notes }}
    </p>
  </div>
</template>
