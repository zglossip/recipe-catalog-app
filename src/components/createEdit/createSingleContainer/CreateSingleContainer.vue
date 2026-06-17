<script setup lang="ts">
import { inject } from "vue";
import {
  INJECTION_KEY,
  useCreateSingleContainerService,
} from "./createSingleContainerService";

const {
  name,
  coursesString,
  cuisinesString,
  tagsString,
  servingAmount,
  servingName,
  sourceUrl,
  ingredientsString,
  instructionsString,
  add,
} = inject(INJECTION_KEY, useCreateSingleContainerService)();
</script>

<template>
  <ion-card>
    <ion-card-content>
      <ion-list>
        <ion-item>
          <ion-input label="Name" label-placement="stacked" v-model="name" />
        </ion-item>
        <ion-item>
          <ion-input
            label="Course(s)"
            label-placement="stacked"
            v-model="coursesString"
          />
        </ion-item>
        <ion-item>
          <ion-input
            label="Cuisine(s)"
            label-placement="stacked"
            v-model="cuisinesString"
          />
        </ion-item>
        <ion-item>
          <ion-input
            label="Tag(s)"
            label-placement="stacked"
            v-model="tagsString"
          />
        </ion-item>
        <ion-item>
          <ion-input
            label="Serving Amount"
            label-placement="stacked"
            v-model="servingAmount"
            type="number"
          />
        </ion-item>
        <ion-item>
          <ion-input
            label="Serving Name"
            label-placement="stacked"
            v-model="servingName"
          />
        </ion-item>
        <ion-item>
          <ion-input
            label="Source URL"
            label-placement="stacked"
            v-model="sourceUrl"
            type="url"
          />
        </ion-item>
        <ion-item>
          <ion-textarea
            label="Ingredients"
            label-placement="stacked"
            v-model="ingredientsString"
          />
        </ion-item>
        <ion-item>
          <ion-textarea
            label="Instructions"
            label-placement="stacked"
            v-model="instructionsString"
          />
        </ion-item>
      </ion-list>
    </ion-card-content>
    <ion-button fill="clear" @click="add">Add</ion-button>
  </ion-card>
</template>
