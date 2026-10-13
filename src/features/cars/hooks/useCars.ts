import { useQuery } from "@apollo/client";
import { GET_CARS } from "../api/getCars";

export const useCars = () => {
  const { data, loading, error, refetch } = useQuery(GET_CARS);

  return {
    cars: data?.cars ?? [],
    loading,
    error,
    retry: () => refetch(),
  };
};
