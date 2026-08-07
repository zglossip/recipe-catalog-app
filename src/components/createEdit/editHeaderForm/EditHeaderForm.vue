<script setup lang="ts">
import { Recipe } from "@/types/Recipe";
import { inject, Ref, toRef } from "vue";
import {
  INJECTION_KEY,
  useEditHeaderFormService,
} from "./editHeaderFormService";
import FilterChips from "@/components/common/filterChips/FilterChips.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import SelectButton from "primevue/selectbutton";
import Button from "primevue/button";

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
  <Card>
    <template #content>
      <div class="grid grid-cols-6 gap-4">
        <div class="flex flex-col gap-2 mb-4 col-span-6">
          <label class="font-semibold" for="rc-name"> Name </label>
          <InputText id="rc-name" v-model="newName" />
        </div>
        <div
          class="flex flex-col gap-2 mb-4 col-span-6 md:col-span-2 2xl:col-span-1"
        >
          <label class="font-semibold" for="rc-serving-amount">
            Serving Amount
          </label>
          <InputNumber id="rc-serving-amount" v-model="newServingAmount" />
        </div>
        <div
          class="flex flex-col gap-2 mb-4 col-span-6 md:col-span-4 2xl:col-span-5"
        >
          <label class="font-semibold" for="rc-serving-name">
            Serving Name
          </label>
          <InputText id="rc-serving-name" v-model="newServingName" />
        </div>
        <div
          class="flex flex-col gap-2 mb-4 col-span-6 md:col-span-2 2xl:col-span-1"
        >
          <label class="font-semibold" for="rc-property-type">
            Property Type
          </label>
          <SelectButton
            id="rc-property-type"
            v-model="currentFilterType"
            :options="filterOptions"
          />
        </div>
        <div
          class="flex flex-col gap-2 mb-4 col-span-5 md:col-span-3 2xl:col-span-4"
        >
          <label class="font-semibold" for="rc-property"> Property </label>
          <InputText
            id="rc-property"
            v-model="filterText"
            @keyup.enter="addChip"
          />
        </div>
        <div class="flex flex-col gap-2 mb-4 col-span-1 justify-end">
          <Button icon="pi pi-plus" @click="addChip" />
        </div>
        <div class="flex flex-col gap-4 mb-4 col-span-6">
          <p class="font-semibold">Current Properties</p>
          <div class="flex gap-2 flex-wrap">
            <FilterChips
              :course-types="newCourseTypes"
              :cuisine-types="newCuisineTypes"
              :tags="newTags"
              @remove-chip="removeChip"
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-4">
        <Button label="Cancel" @click="onCancelClick" severity="secondary" />
        <Button label="Confirm" @click="onSaveClick" />
      </div>
    </template>
  </Card>
</template>
