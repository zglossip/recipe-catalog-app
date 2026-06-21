<script setup lang="ts">
import { provide } from "vue";
import ViewRecipeContainer from "@/components/viewRecipe/viewRecipeContainer/ViewRecipeContainer.vue";
import BasePage from "@/components/common/basePage/BasePage.vue";
import {
  INJECTION_KEY,
  useViewRecipeContainerService,
} from "@/components/viewRecipe/viewRecipeContainer/viewRecipeContainerService";

//PROPS
interface Props {
  id: string;
}

const props = defineProps<Props>();

const viewRecipeContainerService = useViewRecipeContainerService(
  Number(props.id),
);

provide(INJECTION_KEY, () => viewRecipeContainerService);
</script>

<template>
  <BasePage title="View Recipe">
    <ViewRecipeContainer :id="Number(id)" />
  </BasePage>
</template>
