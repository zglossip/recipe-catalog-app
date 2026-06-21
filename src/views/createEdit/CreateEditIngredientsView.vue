<script setup lang="ts">
import BasePage from "@/components/common/basePage/BasePage.vue";
import EditIngredientsForm from "@/components/createEdit/editIngredientsForm/EditIngredientsForm.vue";

//PROPS
interface Props {
  id?: string;
}

defineProps<Props>();
</script>

<template>
  <BasePage title="Edit Ingredients">
    <EditIngredientsForm :recipe-id="id ? Number(id) : undefined" />
  </BasePage>
</template>
