import { Recipe } from "@/types/Recipe";
import { Ref, ref, watch } from "vue";
import { ApiResult, createRecipe, saveRecipe } from "@/services/apiService";
import { FILTER_OPTIONS } from "@/services/constants";
import { FilterType } from "@/types/FilterType";
import { FilterChipData } from "@/types/FilterChipData";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";

export const INJECTION_KEY = Symbol();

export interface EditHeaderFormService {
  newName: Ref<string>;
  newServingAmount: Ref<number>;
  newServingName: Ref<string>;
  newCourseTypes: Ref<string[]>;
  newCuisineTypes: Ref<string[]>;
  newTags: Ref<string[]>;
  filterOptions: FilterType[];
  filterText: Ref<string>;
  currentFilterType: Ref<FilterType>;
  removeChip: (data: FilterChipData) => void;
  addChip: () => void;
  onSaveClick: () => Promise<void>;
  onCancelClick: () => void;
}

export const useEditHeaderFormService = (
  recipe: Ref<Recipe | undefined>,
): EditHeaderFormService => {
  const newName = ref(recipe.value?.name ?? "");
  const newServingAmount = ref(recipe.value?.servingAmount ?? 0);
  const newServingName = ref(recipe.value?.servingName ?? "");
  const newCourseTypes = ref(recipe.value?.courseTypes ?? []);
  const newCuisineTypes = ref(recipe.value?.cuisineTypes ?? []);
  const newTags = ref(recipe.value?.tags ?? []);
  const currentFilterType = ref(FilterType.COURSE);
  const filterText = ref("");

  const router = useRouter();
  const { showToast } = useToast();

  watch(
    () => recipe.value,
    (newVal) => {
      if (newVal) {
        newName.value = newVal.name;
        newServingAmount.value = newVal.servingAmount;
        newServingName.value = newVal.servingName;
        newCourseTypes.value = newVal.courseTypes;
        newCuisineTypes.value = newVal.cuisineTypes;
        newTags.value = newVal.tags;
      }
    },
  );

  const removeChip = (data: FilterChipData) => {
    switch (data.type) {
      case FilterType.COURSE:
        newCourseTypes.value = newCourseTypes.value.filter(
          (a) => a !== data.value,
        );
        break;
      case FilterType.CUISINE:
        newCuisineTypes.value = newCuisineTypes.value.filter(
          (a) => a !== data.value,
        );
        break;
      case FilterType.TAG:
        newTags.value = newTags.value.filter((a) => a !== data.value);
        break;
      default:
        return;
    }
  };

  const addChip = () => {
    switch (currentFilterType.value) {
      case FilterType.COURSE:
        if (newCourseTypes.value.find((a: any) => a === filterText.value)) {
          break;
        }
        newCourseTypes.value.push(filterText.value);
        break;
      case FilterType.CUISINE:
        if (newCuisineTypes.value.find((a: any) => a === filterText.value)) {
          break;
        }
        newCuisineTypes.value.push(filterText.value);
        break;
      case FilterType.TAG:
        if (newTags.value.find((a: any) => a === filterText.value)) {
          break;
        }
        newTags.value.push(filterText.value);
        break;
      default:
        return;
    }
  };

  const onSaveClick = async () => {
    if (recipe.value) {
      const response: ApiResult<null> = await saveRecipe({
        ...recipe.value,
        name: newName.value,
        servingAmount: newServingAmount.value,
        servingName: newServingName.value,
        courseTypes: newCourseTypes.value,
        cuisineTypes: newCuisineTypes.value,
        tags: newTags.value,
      });
      if (!response.ok) {
        showToast(`Unable to save recipe: ${response.error}`);
        return;
      }
    } else {
      const response: ApiResult<Recipe> = await createRecipe({
        name: newName.value,
        servingAmount: newServingAmount.value,
        servingName: newServingName.value,
        courseTypes: newCourseTypes.value,
        cuisineTypes: newCuisineTypes.value,
        tags: newTags.value,
        uploaded: null,
      });
      if (!response.ok) {
        showToast(`Unable to create recipe: ${response.error}`);
        return;
      }
    }
    router.go(-1);
  };

  const onCancelClick = () => {
    router.go(-1);
  };

  return {
    newName,
    newServingAmount,
    newServingName,
    newCourseTypes,
    newCuisineTypes,
    newTags,
    currentFilterType,
    filterText,
    filterOptions: FILTER_OPTIONS,
    addChip,
    removeChip,
    onSaveClick,
    onCancelClick,
  };
};
