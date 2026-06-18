<script setup lang="ts">
import RecipeItem from "@/components/browse/recipeItem/RecipeItem.vue";
import FilterMenu from "@/components/browse/filterMenu/FilterMenu.vue";
import BasePage from "@/components/common/basePage/BasePage.vue";
//import BaseFabModal from "@/components/common/baseFabModal/BaseFabModal.vue";
import { useBrowseViewService } from "./browseViewService";
import { usePageRefreshController } from "@/composables/usePageRefresher";
import { Filters } from "@/components/browse/filterMenu/filterMenuService";

const pageRefreshController = usePageRefreshController();

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
} = useBrowseViewService(pageRefreshController);

const onApply = (filters: Filters) => {
  applyFilters(filters);
};

const onApplyWithClose = (filters: Filters, closeModal: () => void) => {
  onApply(filters);
  closeModal();
};

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
    <ion-item v-if="displayError">
      <ion-label color="danger"
        >Unable to load recipes. Please try again.</ion-label
      >
    </ion-item>
    <recipe-item v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon />
      </ion-fab-button>
      <ion-fab-list side="top">
        <base-fab-modal>
          <template #fab>
            <ion-icon />
          </template>
          <template #default="{ close }">
            <filter-menu
              :starting-name="name"
              :starting-course-types="courses"
              :starting-cuisine-types="cuisines"
              :starting-tags="tags"
              @apply="(filters) => onApplyWithClose(filters, close)"
            />
          </template>
        </base-fab-modal>
        <!-- TODO: Add some sort of menu here to replace the FAB-->
        <!-- <base-fab-modal>
          <template #fab>
            <ion-icon :icon="addCircleOutline" />
          </template>
          <template #default="{ close }">
            <ion-list>
              <ion-item button @click="goToCreationWizardWithClose(close)">
                <ion-label>Creation Wizard</ion-label>
              </ion-item>
              <ion-item button @click="goToQuickAddWithClose(close)">
                <ion-label>Quick Add</ion-label>
              </ion-item>
            </ion-list>
          </template>
        </base-fab-modal> -->
      </ion-fab-list>
    </ion-fab>
  </BasePage>
</template>
