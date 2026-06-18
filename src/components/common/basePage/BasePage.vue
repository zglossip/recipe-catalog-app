<template>
  <div>
    <Menubar :model="items" />
    <slot name="header" />
    <slot name="content" />
  </div>
</template>

<script lang="ts" setup>
import Menubar from "primevue/menubar";
import { INJECTION_KEY, useBasePageService } from "./basePageService";
import { inject } from "vue";

interface Props {
  title: string;
}

defineProps<Props>();

const { navigateHome } = inject(INJECTION_KEY, useBasePageService)();

const items = [
  {
    label: "Home",
    icon: "pi pi-home",
    command: navigateHome,
  },
];
</script>
