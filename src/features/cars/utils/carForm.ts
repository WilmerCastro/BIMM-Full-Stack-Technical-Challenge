import type { CreateCarInput } from "@/features/cars/types/car";

export type CarFormValues = {
  make: string;
  model: string;
  year: string;
  color: string;
};

export type CarFormErrors = Partial<Record<keyof CarFormValues, string>>;

export const EMPTY_CAR_FORM: CarFormValues = {
  make: "",
  model: "",
  year: "",
  color: "",
};

const MIN_YEAR = 1886;
const MAX_YEAR = new Date().getFullYear() + 1;

export const validateCarForm = (values: CarFormValues): CarFormErrors => {
  const errors: CarFormErrors = {};
  const year = Number(values.year);

  if (!values.make.trim()) errors.make = "Make is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.color.trim()) errors.color = "Color is required";
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    errors.year = `Enter a year between ${MIN_YEAR} and ${MAX_YEAR}`;
  }

  return errors;
};

export const toCreateCarInput = (values: CarFormValues): CreateCarInput => ({
  make: values.make.trim(),
  model: values.model.trim(),
  year: Number(values.year),
  color: values.color.trim(),
});
