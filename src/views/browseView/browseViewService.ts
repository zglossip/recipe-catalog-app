import { Filters } from "@/components/browse/filterMenu/filterMenuService";
import { fetchRecipes as fetchRecipesApi } from "@/services/apiService";
import { Recipe } from "@/types/Recipe";
import { Ref, ref } from "vue";
import { LocationQueryValue, useRoute, useRouter } from "vue-router";

export interface BrowseViewService {
  recipes: Ref<Recipe[]>;
  name: Ref<string>;
  courses: Ref<string[]>;
  cuisines: Ref<string[]>;
  tags: Ref<string[]>;
  applyFilters: (filter: Filters) => void;
  goToCreationWizard: () => void;
  goToQuickAdd: () => void;
  isLoading: Ref<boolean>;
  displayError: Ref<boolean>;
}

export const injectionKey = Symbol();

export const useBrowseViewService = (): BrowseViewService => {
  const recipes: Ref<Recipe[]> = ref([]);
  const name: Ref<string> = ref("");
  const courses: Ref<string[]> = ref([]);
  const cuisines: Ref<string[]> = ref([]);
  const tags: Ref<string[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const displayError: Ref<boolean> = ref(false);

  const route = useRoute();
  const router = useRouter();
  const nameQuery = route.query.nameQuery as string;
  const courseQuery = route.query.courseQuery as LocationQueryValue[];
  const cuisineQuery = route.query.cuisineQuery as LocationQueryValue[];
  const tagQuery = route.query.tagQuery as LocationQueryValue[];

  if (nameQuery) {
    name.value = nameQuery;
  }

  if (courseQuery) {
    courseQuery.forEach((v: LocationQueryValue) => {
      if (!v) {
        return;
      }

      courses.value.push(v.toString());
    });
  }

  if (cuisineQuery) {
    cuisineQuery.forEach((v: LocationQueryValue) => {
      if (!v) {
        return;
      }

      cuisines.value.push(v.toString());
    });
  }

  if (tagQuery) {
    tagQuery.forEach((v: LocationQueryValue) => {
      if (!v) {
        return;
      }

      tags.value.push(v.toString());
    });
  }

  const refreshData = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetchRecipesApi(
        name.value,
        cuisines.value,
        courses.value,
        tags.value,
      );
      if (response.ok) {
        recipes.value = response.data;
        displayError.value = false;
        return;
      }

      recipes.value = [];
      displayError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const applyFilters = (filters: Filters): void => {
    name.value = filters.nameFilter;
    courses.value = filters.courseTypeFilters;
    cuisines.value = filters.cuisineTypeFilters;
    tags.value = filters.tagFilters;
    void refreshData();
  };

  const goToCreationWizard = (): void => {
    router.push("/recipe/create");
  };

  const goToQuickAdd = (): void => {
    router.push("/recipe/create/single");
  };

  refreshData()

  return {
    recipes,
    name,
    courses,
    cuisines,
    tags,
    applyFilters,
    goToCreationWizard,
    goToQuickAdd,
    isLoading,
    displayError,
  };
};
