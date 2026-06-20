<script setup lang="ts">
import { injectionKey, useRecipeService } from "@/services/recipeService";
import { Recipe } from "@/types/Recipe";
import { inject, toRefs } from "vue";
import { useRecipeUploadedDate } from "@/composables/useDateFormat";
import Card from "primevue/card";

//PROPS

interface Props {
  recipe: Recipe;
}

const props = defineProps<Props>();
const { recipe } = toRefs(props);

//SERVICE

const {
  formattedServingTag,
  formattedCuisineTag,
  formattedCourseTag,
  formattedTagTag,
  navigate,
} = inject(injectionKey, useRecipeService)(recipe);

const formattedUploaded = useRecipeUploadedDate(recipe);
</script>

<template>
  <Card @click="navigate" cursor="pointer">
    <template #title>
      {{ recipe.name }}
    </template>
    <template #content>
      <p class="text-sm text-surface-500 dark:text-surface-400">
        {{ formattedServingTag }}
      </p>
      <p
        v-for="(tag, i) in [
          formattedCuisineTag,
          formattedCourseTag,
          formattedTagTag,
        ]"
        :key="i"
        class="text-sm text-surface-500 dark:text-surface-400"
      >
        {{ tag ? tag : "" }}
      </p>
      <p
        v-if="formattedUploaded"
        class="text-sm text-surface-500 dark:text-surface-400"
      >
        Added: {{ formattedUploaded }}
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <i class="pi pi-arrow-right" />
      </div>
    </template>
  </Card>
</template>
