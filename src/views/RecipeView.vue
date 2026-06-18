<script setup lang="ts">
import { provide } from "vue";
import ViewRecipeContainer from "@/components/viewRecipe/viewRecipeContainer/ViewRecipeContainer.vue";
import BasePage from "@/components/common/basePage/BasePage.vue";
import { usePageRefreshController } from "@/composables/usePageRefresher";
import {
  INJECTION_KEY,
  useViewRecipeContainerService,
} from "@/components/viewRecipe/viewRecipeContainer/viewRecipeContainerService";

//PROPS
interface Props {
  id: string;
}

const props = defineProps<Props>();

const pageRefreshController = usePageRefreshController();

const viewRecipeContainerService = useViewRecipeContainerService(
  Number(props.id),
  pageRefreshController,
);

provide(INJECTION_KEY, () => viewRecipeContainerService);
</script>

<template>
  <BasePage title="View Recipe">
    <ViewRecipeContainer :id="Number(id)" />
  </BasePage>
</template>
