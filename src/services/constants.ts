import { FilterType } from "@/types/FilterType";
import { Recipe } from "@/types/Recipe";

export const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE;

export const FILTER_OPTIONS: FilterType[] = [
  FilterType.COURSE,
  FilterType.CUISINE,
  FilterType.TAG,
];

export const ERROR_RECIPE: Recipe = {
  name: "ERROR",
  courseTypes: ["ERROR"],
  cuisineTypes: ["ERROR"],
  tags: ["ERROR"],
  servingAmount: -1,
  servingName: "ERROR",
  uploaded: null,
};

export const LOADING_RECIPE: Recipe = {
  name: "Loading...",
  courseTypes: ["Loading..."],
  cuisineTypes: ["Loading..."],
  tags: ["Loading..."],
  servingAmount: 0,
  servingName: "Loading...",
  uploaded: null,
};

export const EMPTY_RECIPE: Recipe = {
  name: "",
  courseTypes: [],
  cuisineTypes: [],
  tags: [],
  servingAmount: 0,
  servingName: "",
  uploaded: null,
};
