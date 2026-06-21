<script setup lang="ts">
import RecipeItem from "@/components/browse/recipeItem/RecipeItem.vue";
import FilterMenu from "@/components/browse/filterMenu/FilterMenu.vue";
import BasePage from "@/components/common/basePage/BasePage.vue";
//import BaseFabModal from "@/components/common/baseFabModal/BaseFabModal.vue";
import { useBrowseViewService } from "./browseViewService";
import { Filters } from "@/components/browse/filterMenu/filterMenuService";

const {
  recipes,
  name,
  courses,
  cuisines,
  tags,
  applyFilters,
  displayError,
  // goToCreationWizard,
  // goToQuickAdd,
} = useBrowseViewService();

// const onApply = (filters: Filters) => {
//   applyFilters(filters);
// };

// const onApplyWithClose = (filters: Filters, closeModal: () => void) => {
//   onApply(filters);
//   closeModal();
// };

// const goToCreationWizardWithClose = (closeModal: () => void) => {
//   closeModal();
//   goToCreationWizard();
// };

// const goToQuickAddWithClose = (closeModal: () => void) => {
//   closeModal();
//   goToQuickAdd();
// };
</script>

<template>
  <BasePage title="Browse">
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Browse Recipes</h1>
        <filter-menu
          :starting-name="name"
          :starting-course-types="courses"
          :starting-cuisine-types="cuisines"
          :starting-tags="tags"
          @apply="(filters) => applyFilters(filters)"
        />
      </div>
    </template>
    <ion-item v-if="displayError">
      <ion-label color="danger"
        >Unable to load recipes. Please try again.</ion-label
      >
    </ion-item>
    <recipe-item v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
  </BasePage>
</template>
