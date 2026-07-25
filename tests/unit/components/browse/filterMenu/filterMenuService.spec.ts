import { describe, it, expect, vi } from "vitest";
import {
  FilterMenuService,
  Filters,
  useFilterMenuService,
} from "@/components/browse/filterMenu/filterMenuService";
import { FilterType } from "@/types/FilterType";

interface SetupOptions {
  startingName?: string;
  startingCourseTypes?: string[];
  startingCuisineTypes?: string[];
  startingTags?: string[];
  emitApply?: (filters: Filters) => void;
}

interface TestSetup {
  service: FilterMenuService;
  emitApply: (filters: Filters) => void;
}

const setup = (options: SetupOptions = {}): TestSetup => {
  const {
    startingName = "Test Name",
    startingCourseTypes = [],
    startingCuisineTypes = [],
    startingTags = [],
    emitApply = vi.fn(),
  } = options;
  const service: FilterMenuService = useFilterMenuService(
    startingName,
    startingCourseTypes,
    startingCuisineTypes,
    startingTags,
    emitApply,
  );

  return { service, emitApply };
};

describe("filterMenuService", () => {
  it("Can add filter chip to course", () => {
    const { service } = setup();

    service.filterText.value = "New Value";
    service.currentFilterType.value = FilterType.COURSE;

    service.addFilter();

    expect(service.courseTypeFilters.value).toEqual(["New Value"]);
  });

  it("Can add filter chip to cuisine", () => {
    const { service } = setup();

    service.filterText.value = "New Value";
    service.currentFilterType.value = FilterType.CUISINE;

    service.addFilter();

    expect(service.cuisineTypeFilters.value).toEqual(["New Value"]);
  });

  it("Can add filter chip to tag", () => {
    const { service } = setup();

    service.filterText.value = "New Value";
    service.currentFilterType.value = FilterType.TAG;

    service.addFilter();

    expect(service.tagFilters.value).toEqual(["New Value"]);
  });

  it("Can remove filter chip from cuisine", () => {
    const { service } = setup({
      startingCuisineTypes: ["test 1", "test 2"],
    });

    service.removeChip({ type: FilterType.CUISINE, value: "test 1" });

    expect(service.cuisineTypeFilters.value).toEqual(["test 2"]);
  });

  it("Can remove filter chip from course", () => {
    const { service } = setup({
      startingCourseTypes: ["test 1", "test 2"],
    });

    service.removeChip({ type: FilterType.COURSE, value: "test 1" });

    expect(service.courseTypeFilters.value).toEqual(["test 2"]);
  });

  it("Can remove filter chip from tag", () => {
    const { service } = setup({
      startingTags: ["test 1", "test 2"],
    });

    service.removeChip({ type: FilterType.TAG, value: "test 1" });

    expect(service.tagFilters.value).toEqual(["test 2"]);
  });
});
