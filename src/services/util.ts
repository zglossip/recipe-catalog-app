import { Ingredient } from "@/types/Ingredient";

export const formatMeasurementText = (ingredient: Ingredient) => {
  if (ingredient.uom) {
    return `${ingredient.quantity} ${ingredient.uom}`;
  }

  return `${ingredient.quantity}`;
};
