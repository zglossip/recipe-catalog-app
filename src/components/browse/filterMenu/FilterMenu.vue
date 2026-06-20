<script setup lang="ts">
import { inject, ref } from "vue";
import {
  Filters,
  injectionKey,
  useFilterMenuService,
} from "@/components/browse/filterMenu/filterMenuService";
import FilterChips from "@/components/common/filterChips/FilterChips.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Divider from "primevue/divider";

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
  filterText,
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

const visible = ref(false);
</script>

<template>
  <Button label="Filter" @click="visible = true" />
  <Dialog v-model:visible="visible" modal header="Filter">
    <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Apply filters to your search</span
    >
    <div class="flex items-center gap-4 mb-4">
      <label for="rc-name" class="font-semibold w-24">Name</label>
      <InputText
        id="rc-name"
        v-model="nameFilter"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <Divider />
    <div class="flex items-center gap-4 mb-4">
      <label for="rc-filter-type" class="font-semibold w-24">Filter Type</label>
      <Select
        id="rc-filter-type"
        v-model="currentFilterType"
        :options="filterOptions"
        class="flex-auto"
      />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="rc-filter-text" class="font-semibold w-24">Filter Text</label>
      <InputText
        id="rc-filter-text"
        v-model="filterText"
        class="flex-auto"
        autocomplete="off"
      />
      <Button icon="pi pi-plus" @click="addFilter" />
    </div>
    <div
      class="mb-4"
      v-if="
        courseTypeFilters.length ||
        cuisineTypeFilters.length ||
        tagFilters.length
      "
    >
      <FilterChips
        :course-types="courseTypeFilters"
        :cuisine-types="cuisineTypeFilters"
        :tags="tagFilters"
        @remove-chip="removeChip"
      />
    </div>
    <Divider />
    <div class="flex justify-end gap-2">
      <Button label="Cancel" @click="visible = false" severity="secondary" />
      <Button label="Apply" @click="apply" />
    </div>
  </Dialog>
</template>
