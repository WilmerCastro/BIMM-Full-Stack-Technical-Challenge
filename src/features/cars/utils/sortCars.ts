import type { Car } from "@/features/cars/types/car";

export const CAR_SORT_OPTIONS = [
  { value: "year-desc", label: "Newest first" },
  { value: "year-asc", label: "Oldest first" },
  { value: "model-asc", label: "Model A–Z" },
] as const;

export type CarSort = (typeof CAR_SORT_OPTIONS)[number]["value"];

export const DEFAULT_CAR_SORT: CarSort = "year-desc";

export const isCarSort = (value: string): value is CarSort =>
  CAR_SORT_OPTIONS.some((option) => option.value === value);

const compare: Record<CarSort, (a: Car, b: Car) => number> = {
  "year-desc": (a, b) => b.year - a.year,
  "year-asc": (a, b) => a.year - b.year,
  "model-asc": (a, b) => a.model.localeCompare(b.model),
};

export const sortCars = (cars: readonly Car[], sort: CarSort) =>
  [...cars].sort(compare[sort]);
