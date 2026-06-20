<script setup lang="ts">
import { inject } from "vue";
import { INJECTION_KEY, useFilterChipSetService } from "./filterChipSetService";
import Chip from "primevue/chip";

//PROPS

interface Props {
  elements: Array<string>;
  iconUrl: string;
  iconAltText: string;
}

defineProps<Props>();

//EMITS
const emit = defineEmits(["close"]);

const closeEmit = (element: string) => emit("close", element);

//SERVICE
const { onClose } = inject(INJECTION_KEY, useFilterChipSetService)(closeEmit);
</script>

<template>
    <Chip v-for="element in elements" 
    :key="element" 
    :label="element" 
    :image="iconUrl" 
    removable
    @remove="onClose(element)" />
</template>
