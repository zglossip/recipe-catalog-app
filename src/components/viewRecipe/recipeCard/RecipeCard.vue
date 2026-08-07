<script setup lang="ts">
import { computed, inject, toRefs } from "vue";
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

const formattedSubtitle = computed(() => {
  if (formattedUploaded.value) {
    return `${formattedServingTag.value} | Added: ${formattedUploaded.value}`;
  }
  return formattedServingTag.value;
});
</script>

<template>
  <button-card
    @click="onClick"
    :header-text="recipe?.name"
    :subtitle-text="formattedSubtitle"
  >
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
