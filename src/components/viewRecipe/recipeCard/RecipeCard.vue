<script setup lang="ts">
import { inject, toRefs } from "vue";
import { useRecipeService, injectionKey } from "@/services/recipeService";
import ButtonCard from "@/components/common/buttonCard/ButtonCard.vue";
import { Recipe } from "@/types/Recipe";
import { useRecipeUploadedDate } from "@/composables/useDateFormat";

//PROPS

interface Props {
  recipe: Recipe | null;
}

const props = defineProps<Props>();
const { recipe } = toRefs(props);

//EMITS

const emit = defineEmits(["edit"]);
const editEmit = () => emit("edit");

//SERVICE

const {
  formattedServingTag,
  formattedCuisineTag,
  formattedCourseTag,
  formattedTagTag,
  source,
  onClick,
} = inject(injectionKey, useRecipeService)(recipe, editEmit);

const formattedUploaded = useRecipeUploadedDate(recipe);
</script>

<template>
  <button-card @click="onClick">
    <template #header>
      <ion-card-title>
        <span>{{ recipe?.name }}</span>
      </ion-card-title>
      <ion-card-subtitle
        >{{ formattedServingTag
        }}<span v-if="formattedUploaded">
          | Added: {{ formattedUploaded }}</span
        ></ion-card-subtitle
      >
    </template>
    <div
      v-for="(tag, i) in [
        formattedCuisineTag,
        formattedCourseTag,
        formattedTagTag,
      ]"
      :key="i"
    >
      <span v-if="tag">{{ tag }}</span>
    </div>
    <span v-if="source">Source: {{ source }}</span>
  </button-card>
</template>
