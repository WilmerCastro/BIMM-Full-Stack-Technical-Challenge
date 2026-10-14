import { useQuery } from "@apollo/client";
import { GET_CAR } from "@/features/cars/api/getCar";

export const useCar = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_CAR, {
    variables: { id },
  });

  return {
    car: data?.car ?? null,
    loading,
    error,
    retry: () => refetch(),
  };
};
