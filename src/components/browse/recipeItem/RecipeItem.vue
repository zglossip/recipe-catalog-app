<script setup lang="ts">
import { injectionKey, useRecipeService } from "@/services/recipeService";
import { Recipe } from "@/types/Recipe";
import { inject, toRefs } from "vue";
import { useRecipeUploadedDate } from "@/composables/useDateFormat";

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
  <ion-item :class="$style.recipeItem" @click="navigate">
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-label>
            <span :class="$style.recipeItemTitle">
              {{ recipe.name }}
            </span>
            <p>
              {{ formattedServingTag }}
            </p>

            <p
              v-for="(tag, i) in [
                formattedCuisineTag,
                formattedCourseTag,
                formattedTagTag,
              ]"
              :key="i"
            >
              {{ tag ? tag : "" }}
            </p>
            <p v-if="formattedUploaded">Added: {{ formattedUploaded }}</p>
          </ion-label>
        </ion-col>
        <ion-col size="auto" :class="$style.recipeItemArrow">
          <ion-icon size="large" />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-item>
</template>

<style module>
.recipeItem {
  cursor: pointer;
}

.recipeItemTitle {
  font-size: 1.5rem;
}

.recipeItemArrow {
  display: flex;
  align-items: center;
  float: right;
}
</style>
