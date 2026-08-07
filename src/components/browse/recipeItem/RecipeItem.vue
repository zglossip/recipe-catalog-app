<script setup lang="ts">
import { injectionKey, useRecipeService } from "@/services/recipeService";
import { Recipe } from "@/types/Recipe";
import { inject, toRefs } from "vue";
import { useRecipeUploadedDate } from "@/composables/useDateFormat";
import Panel from "primevue/panel";

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
  <Panel @click="navigate" class="cursor-pointer">
    <template #header>
      {{ recipe.name }}
    </template>
    <div class="grid grid-cols-6">
      <div class="col-span-5">
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
      </div>
      <div class="col-span-1 flex justify-end items-end">
        <i class="pi pi-arrow-right" />
      </div>
    </div>
  </Panel>
</template>
