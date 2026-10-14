import {
  DEFAULT_CAR_SORT,
  isCarSort,
  type CarSort,
} from "@/features/cars/utils/sortCars";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSearchParams } from "react-router-dom";

export type CarFilterValues = {
  model: string;
  year: string;
  sort: CarSort;
};

const SEARCH_DELAY_MS = 400;

const toYear = (value: string) => {
  if (!value) return undefined;
  const year = Number(value);
  return Number.isInteger(year) ? year : undefined;
};

export const useCarFilters = () => {
  const [params, setParams] = useSearchParams();
  const sort = params.get("sort") ?? "";

  const filters: CarFilterValues = {
    model: params.get("model") ?? "",
    year: params.get("year") ?? "",
    sort: isCarSort(sort) ? sort : DEFAULT_CAR_SORT,
  };

  const model = useDebouncedValue(filters.model.trim(), SEARCH_DELAY_MS);
  const year = toYear(useDebouncedValue(filters.year, SEARCH_DELAY_MS));

  const updateParams = (update: (next: URLSearchParams) => void) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        update(next);
        return next;
      },
      { replace: true },
    );

  const setFilter = (name: keyof CarFilterValues, value: string) =>
    updateParams((next) => {
      if (value) next.set(name, value);
      else next.delete(name);
    });

  const clearFilters = () =>
    updateParams((next) => {
      next.delete("model");
      next.delete("year");
    });

  return {
    filters,
    query: { model: model || undefined, year, sort: filters.sort },
    isFiltered: Boolean(model) || year !== undefined,
    setFilter,
    clearFilters,
  };
};
