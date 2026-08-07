<script setup lang="ts">
import {
  useIngredientCardService,
  INJECTION_KEY,
} from "./ingredientCardService";
import { inject } from "vue";
import IngredientItem from "@/components/viewRecipe/ingredientCard/IngredientItem.vue";
import ButtonCard from "@/components/common/buttonCard/ButtonCard.vue";
import ProgressSpinner from "primevue/progressspinner";

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
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" />
    </div>
    <div v-else-if="displayError">
      <div class="text-red-500 dark:text-red-400">
        <span>Unable to load ingredients.</span>
      </div>
    </div>
    <div v-else-if="ingredients.length === 0">
      <span>None</span>
    </div>
    <div v-else>
      <ingredient-item
        v-for="ingredient in ingredients"
        :key="ingredient.name"
        :ingredient="ingredient"
      />
    </div>
  </button-card>
</template>
