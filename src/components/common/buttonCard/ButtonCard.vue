<script setup lang="ts">
import {
  useButtonCardService,
  INJECTION_KEY,
} from "@/components/common/buttonCard/buttonCardService";
import { inject } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";

//PROPS

interface Props {
  buttonText?: string;
  headerText?: string;
}

withDefaults(defineProps<Props>(), {
  buttonText: "EDIT",
  headerText: "",
});

//EMITS

const emit = defineEmits(["click"]);

const clickEmit = () => emit("click");

//SERVICE

const { onClick } = inject(INJECTION_KEY, useButtonCardService)(clickEmit);
</script>

<template>
  <Card>
    <template #title>
      <slot name="header"><span>{{ headerText }}</span></slot>
    </template>
    <template #content>
      <slot />
    </template>
    <template #footer>
      <div class="grid justify-items-end">
        <Button @click="onClick" severity="primary">
          {{ buttonText }}
        </Button>
      </div>
    </template>
  </Card>
</template>
