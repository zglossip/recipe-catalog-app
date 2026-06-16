<script setup lang="ts">
import { Recipe } from "@/types/Recipe";
import { inject, Ref, toRef } from "vue";
import {
  INJECTION_KEY,
  useEditHeaderFormService,
} from "./editHeaderFormService";
import FilterChips from "@/components/common/filterChips/FilterChips.vue";

interface Props {
  recipe?: Recipe;
}

const props = defineProps<Props>();

const recipe: Ref<Recipe | undefined> = toRef(props, "recipe");

const {
  newName,
  newServingAmount,
  newServingName,
  newCourseTypes,
  newCuisineTypes,
  newTags,
  currentFilterType,
  filterText,
  filterOptions,
  addChip,
  removeChip,
  onSaveClick,
  onCancelClick,
} = inject(INJECTION_KEY, useEditHeaderFormService)(recipe);
</script>

<template>
  <ion-card>
    <ion-card-content>
      <ion-list>
        <ion-item>
          <ion-input label="Name" label-placement="stacked" v-model="newName" />
        </ion-item>
        <ion-item>
          <ion-input
            label="Serving Amount"
            label-placement="stacked"
            v-model="newServingAmount"
            name="servamt"
            autocomplete="off"
          />
        </ion-item>
        <ion-item>
          <ion-input
            label="Serving Name"
            label-placement="stacked"
            v-model="newServingName"
          />
        </ion-item>
        <ion-item>
          <ion-select
            label="Property Type"
            v-model="currentFilterType"
            fill="solid"
            label-placement="stacked"
          >
            <ion-select-option
              v-for="filterOption in filterOptions"
              :key="filterOption"
              :value="filterOption"
            >
              {{ filterOption }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-input
            label-placement="stacked"
            v-model="filterText"
            label="Property"
          />
          <ion-button slot="end" @click="addChip">
            <ion-icon />
          </ion-button>
        </ion-item>
        <ion-item>
          <FilterChips
            :course-types="newCourseTypes"
            :cuisine-types="newCuisineTypes"
            :tags="newTags"
            @remove-chip="removeChip"
          />
        </ion-item>
      </ion-list>
    </ion-card-content>
    <ion-button fill="clear" @click="onCancelClick">Cancel</ion-button>
    <ion-button fill="clear" @click="onSaveClick">Confirm</ion-button>
  </ion-card>
</template>

<style scoped>
ion-select {
  margin-right: -1rem;
  margin-left: -1rem;
}
</style>
