import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Car } from "@/features/cars/types/car";

export type GetCarsData = { cars: Car[] };

export type GetCarsVariables = { model?: string; year?: number };

export const GET_CARS: TypedDocumentNode<GetCarsData, GetCarsVariables> = gql`
  query GetCars($model: String, $year: Int) {
    cars(model: $model, year: $year) {
      id
      make
      model
      year
      color
      mobile
      tablet
      desktop
    }
  }
`;
