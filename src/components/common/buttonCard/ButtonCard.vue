<script setup lang="ts">
import {
  useButtonCardService,
  INJECTION_KEY,
} from "@/components/common/buttonCard/buttonCardService";
import { inject } from "vue";

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
  <ion-card>
    <ion-card-header>
      <ion-card-title v-if="headerText">
        <span>{{ headerText }}</span>
      </ion-card-title>
      <slot name="header" />
    </ion-card-header>
    <ion-card-content>
      <slot />
    </ion-card-content>
    <ion-button @click="onClick" fill="clear">
      {{ buttonText }}
    </ion-button>
  </ion-card>
</template>
