<template>
  <div class="p-8 lg:px-64 md:px-32 sm:px-16">
    <Menubar :model="items" class="mb-4"/>
    <div class="mb-4">
<slot name="header" />
    </div>
    <div>
      <slot name="content" />
      <slot />
    </div>
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
