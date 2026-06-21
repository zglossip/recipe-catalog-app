<script setup lang="ts">
import BasePage from "@/components/common/basePage/BasePage.vue";
import EditInstructionsForm from "@/components/createEdit/editInstructionsForm/EditInstructionsForm.vue";

//PROPS
interface Props {
  id?: string;
}

defineProps<Props>();
</script>

<template>
  <BasePage title="Edit Instructions">
    <EditInstructionsForm :recipe-id="id ? Number(id) : undefined" />
  </BasePage>
</template>
