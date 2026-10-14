import { useQuery } from "@apollo/client";
import {
  GET_CARS,
  type GetCarsVariables,
} from "@/features/cars/api/getCars";
import { sortCars, type CarSort } from "@/features/cars/utils/sortCars";

export type CarQuery = GetCarsVariables & { sort: CarSort };

export const useCars = ({ sort, ...variables }: CarQuery) => {
  const { data, previousData, loading, error, refetch } = useQuery(GET_CARS, {
    variables,
  });
  const cars = (data ?? previousData)?.cars ?? [];

  return {
    cars: sortCars(cars, sort),
    loading: loading && !previousData,
    updating: loading && Boolean(previousData),
    error,
    retry: () => refetch(),
  };
};
