import { useMutation, type ApolloError } from "@apollo/client";
import { CREATE_CAR } from "@/features/cars/api/createCar";
import { GET_CARS } from "@/features/cars/api/getCars";
import type { CreateCarInput } from "@/features/cars/types/car";

const PLACEHOLDER_IMAGES = {
  mobile: "/images/placeholder-mobile.svg",
  tablet: "/images/placeholder-tablet.svg",
  desktop: "/images/placeholder-desktop.svg",
};

const toErrorMessage = (error?: ApolloError) => {
  if (!error) return undefined;
  const invalid = error.graphQLErrors.find(
    (graphQLError) => graphQLError.extensions?.code === "BAD_USER_INPUT",
  );
  return invalid
    ? `The car was rejected: ${invalid.message}.`
    : "We couldn't save the car. Please try again.";
};

export const useCreateCar = () => {
  const [mutate, { loading, error }] = useMutation(CREATE_CAR, {
    update(cache, { data }) {
      const created = data?.createCar;
      if (!created) return;

      const allCars = cache.readQuery({ query: GET_CARS });
      cache.evict({ fieldName: "cars" });

      if (allCars) {
        cache.writeQuery({
          query: GET_CARS,
          data: { cars: [...allCars.cars, created] },
        });
      }
    },
  });

  const createCar = async (input: CreateCarInput) => {
    try {
      await mutate({
        variables: { input: { ...PLACEHOLDER_IMAGES, ...input } },
      });
      return true;
    } catch {
      return false;
    }
  };

  return { createCar, loading, errorMessage: toErrorMessage(error) };
};
