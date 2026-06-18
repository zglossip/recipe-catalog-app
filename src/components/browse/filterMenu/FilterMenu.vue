<script setup lang="ts">
import { inject } from "vue";
import {
  Filters,
  injectionKey,
  useFilterMenuService,
} from "@/components/browse/filterMenu/filterMenuService";
import FilterChips from "@/components/common/filterChips/FilterChips.vue";

//PROPS

interface Props {
  startingName: string;
  startingCourseTypes: string[];
  startingCuisineTypes: string[];
  startingTags: string[];
}

const props = defineProps<Props>();

//EMITS

const emit = defineEmits(["apply"]);

const emitApply = (filters: Filters) => emit("apply", filters);

//SERVICE

const {
  filterOptions,
  currentFilterType,
  setCurrentFilterType,
  filterText,
  setFilterText,
  setNameFilter,
  addFilter,
  nameFilter,
  courseTypeFilters,
  cuisineTypeFilters,
  tagFilters,
  removeChip,
  apply,
} = inject(injectionKey, useFilterMenuService)(
  props.startingName,
  props.startingCourseTypes,
  props.startingCuisineTypes,
  props.startingTags,
  emitApply,
);
</script>

<template>
  <ion-list>
    <ion-item>
      <ion-input
        label="Name"
        clear-input
        :model-value="nameFilter"
        fill="solid"
        label-placement="stacked"
        @update:model-value="setNameFilter"
      />
    </ion-item>
    <ion-item>
      <ion-select
        label="Filter Type"
        placeholder="Select"
        :model-value="currentFilterType"
        fill="solid"
        @update:modelValue="setCurrentFilterType"
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
        :clear-input="true"
        :model-value="filterText"
        fill="solid"
        @update:modelValue="setFilterText"
      />
      <ion-button slot="end" @click="addFilter">
        <ion-icon />
      </ion-button>
    </ion-item>
    <ion-item>
      <FilterChips
        :course-types="courseTypeFilters"
        :cuisine-types="cuisineTypeFilters"
        :tags="tagFilters"
        @remove-chip="removeChip"
      />
    </ion-item>
  </ion-list>
  <ion-button expand="full" size="large" class="apply-button" @click="apply">
    APPLY
  </ion-button>
</template>
