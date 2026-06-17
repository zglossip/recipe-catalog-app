<script setup lang="ts">
import { inject } from "vue";
import { INJECTION_KEY, useFilterChipSetService } from "./filterChipSetService";

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
  <ion-chip v-for="element in elements" :key="element">
    <ion-avatar>
      <img :src="iconUrl" :alt="iconAltText" />
    </ion-avatar>
    <ion-label>{{ element }}</ion-label>
    <ion-icon @click="onClose(element)" />
  </ion-chip>
</template>
