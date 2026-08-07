<script setup lang="ts">
import EditHeaderContainer from "@/components/createEdit/editHeaderContainer/EditHeaderContainer.vue";
import BasePage from "@/components/common/basePage/BasePage.vue";

//PROPS
interface Props {
  id?: string;
}

defineProps<Props>();
</script>

<template>
  <BasePage title="Edit Recipe">
    <EditHeaderContainer :id="id ? Number(id) : undefined" />
  </BasePage>
</template>
