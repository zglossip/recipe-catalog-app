import { FILTER_OPTIONS } from "@/services/constants";
import { FilterChipData } from "@/types/FilterChipData";
import { FilterType } from "@/types/FilterType";
import { Ref, ref } from "vue";

export interface FilterMenuService {
  filterOptions: FilterType[];
  currentFilterType: Ref<FilterType>;
  filterText: Ref<string>;
  nameFilter: Ref<string>;
  courseTypeFilters: Ref<string[]>;
  cuisineTypeFilters: Ref<string[]>;
  tagFilters: Ref<string[]>;
  addFilter: () => void;
  removeChip: (data: FilterChipData) => void;
  apply: VoidFunction;
}

export const injectionKey = Symbol();

export interface Filters {
  courseTypeFilters: Array<string>;
  cuisineTypeFilters: Array<string>;
  tagFilters: Array<string>;
  nameFilter: string;
}

export const useFilterMenuService = (
  startingName: string,
  startingCourseTypes: string[],
  startingCuisineTypes: string[],
  startingTags: string[],
  emitApply: (filters: Filters) => void,
): FilterMenuService => {
  const currentFilterType = ref(FilterType.COURSE);
  const filterText = ref("");
  const nameFilter = ref(startingName ?? "");
  const courseTypeFilters: Ref<string[]> = ref(startingCourseTypes ?? []);
  const cuisineTypeFilters: Ref<string[]> = ref(startingCuisineTypes ?? []);
  const tagFilters: Ref<string[]> = ref(startingTags ?? []);

  const addFilter = () => {
    switch (currentFilterType.value) {
      case FilterType.COURSE:
        if (courseTypeFilters.value.find((a: any) => a === filterText.value)) {
          break;
        }
        courseTypeFilters.value.push(filterText.value);
        break;
      case FilterType.CUISINE:
        if (cuisineTypeFilters.value.find((a: any) => a === filterText.value)) {
          break;
        }
        cuisineTypeFilters.value.push(filterText.value);
        break;
      case FilterType.TAG:
        if (tagFilters.value.find((a: any) => a === filterText.value)) {
          break;
        }
        tagFilters.value.push(filterText.value);
        break;
      default:
        return;
    }
  };

  const removeChip = (data: FilterChipData) => {
    switch (data.type) {
      case FilterType.COURSE:
        courseTypeFilters.value = courseTypeFilters.value.filter(
          (a) => a !== data.value,
        );
        break;
      case FilterType.CUISINE:
        cuisineTypeFilters.value = cuisineTypeFilters.value.filter(
          (a) => a !== data.value,
        );
        break;
      case FilterType.TAG:
        tagFilters.value = tagFilters.value.filter((a) => a !== data.value);
        break;
      default:
        return;
    }
  };

  const apply = (): void => {
    emitApply({
      courseTypeFilters: courseTypeFilters.value,
      cuisineTypeFilters: cuisineTypeFilters.value,
      tagFilters: tagFilters.value,
      nameFilter: nameFilter.value,
    });
  };

  return {
    filterOptions: FILTER_OPTIONS,
    currentFilterType,
    filterText,
    nameFilter,
    courseTypeFilters,
    cuisineTypeFilters,
    tagFilters,
    addFilter,
    removeChip,
    apply,
  };
};
