<script setup lang="ts">
import { Ingredient } from "@/types/Ingredient";
import { formatMeasurementText } from "@/services/util";

interface Props {
  ingredient: Ingredient;
}

defineProps<Props>();
</script>

<template>
  <ion-item>
    <ion-label>
      {{ ingredient.name }}
      <p v-if="ingredient.notes">{{ ingredient.notes }}</p>
    </ion-label>
    <ion-label>
      <p :class="$style.ingredientMeasurement">
        {{ formatMeasurementText(ingredient) }}
      </p>
    </ion-label>
  </ion-item>
</template>

<style module>
.ingredientMeasurement {
  float: right;
}
</style>
