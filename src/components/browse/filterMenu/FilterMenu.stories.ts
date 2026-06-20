import { Meta, StoryObj } from "@storybook/vue3";
import FilterMenu from "@/components/browse/filterMenu/FilterMenu.vue";
import { FilterType } from "@/types/FilterType";
import { provide, ref } from "vue";
import {
  injectionKey,
  FilterMenuService,
} from "@/components/browse/filterMenu/filterMenuService";
import { action } from "@storybook/addon-actions";
import { FilterChipData } from "@/types/FilterChipData";

//STUBS

const stubFilterMenuService = (args: any) => {
  const currentFilterType = ref(args.currentFilterType);
  const filterText = ref(args.filterText);
  const nameFilter = ref(args.nameFilter);
  const courseTypeFilters = ref(args.courseTypeFilters);
  const cuisineTypeFilters = ref(args.cuisineTypeFilters);
  const tagFilters = ref(args.tagFilters);

  provide(
    injectionKey,
    (): FilterMenuService => ({
      filterOptions: args.filterOptions,
      currentFilterType,
      filterText,
      nameFilter,
      courseTypeFilters,
      cuisineTypeFilters,
      tagFilters,
      addFilter: () => {
        action("adding filter")({
          currentFilterType: currentFilterType.value,
          filterText: filterText.value,
        });
        switch (currentFilterType.value) {
          case FilterType.COURSE:
            if (
              courseTypeFilters.value.find((a: any) => a === filterText.value)
            ) {
              break;
            }
            courseTypeFilters.value.push(filterText.value);
            break;
          case FilterType.CUISINE:
            if (
              cuisineTypeFilters.value.find((a: any) => a === filterText.value)
            ) {
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
      },
      removeChip: (data: FilterChipData) => {
        action("removing chip")(data);
        switch (data.type) {
          case FilterType.COURSE:
            courseTypeFilters.value = courseTypeFilters.value.filter(
              (a: string) => a !== data.value,
            );
            break;
          case FilterType.CUISINE:
            cuisineTypeFilters.value = cuisineTypeFilters.value.filter(
              (a: string) => a !== data.value,
            );
            break;
          case FilterType.TAG:
            tagFilters.value = tagFilters.value.filter(
              (a: string) => a !== data.value,
            );
            break;
          default:
            return;
        }
      },
      apply: () =>
        action("apply")({
          nameFilter: nameFilter.value,
          courseTypeFilters: courseTypeFilters.value,
          cuisineTypeFilters: cuisineTypeFilters.value,
          tagFilters: tagFilters.value,
        }),
    }),
  );
};

//META

const meta: Meta<typeof FilterMenu> = {
  title: "Browse/Filter Menu",
  component: FilterMenu,
  argTypes: {
    filterOptions: {
      options: [FilterType.COURSE, FilterType.CUISINE, FilterType.TAG],
      type: "select",
    },
  },
  render: (args: any) => ({
    components: { FilterMenu },
    setup: () => {
      stubFilterMenuService(args);
      return { ...args };
    },
    template:
      '<FilterMenu :starting-name="startingName" :starting-course-types="startingCourseTypes" :starting-cuisine-types="startingCuisineTypes" :starting-tags="startingTags" />',
  }),
  args: {
    contentId: 100,
    currentFilterType: FilterType.COURSE,
    filterText: "",
    filterOptions: [FilterType.COURSE, FilterType.CUISINE, FilterType.TAG],
    nameFilter: "",
    courseTypeFilters: [],
    cuisineTypeFilters: [],
    tagFilters: [],
  },
};

export default meta;

//STORIES

type Story = StoryObj<typeof FilterMenu>;

export const Default: Story = {};
