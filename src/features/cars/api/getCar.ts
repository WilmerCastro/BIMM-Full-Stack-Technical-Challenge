import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Car } from "@/features/cars/types/car";

export type GetCarData = { car: Car | null };

export type GetCarVariables = { id: string };

export const GET_CAR: TypedDocumentNode<GetCarData, GetCarVariables> = gql`
  query GetCar($id: ID!) {
    car(id: $id) {
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
