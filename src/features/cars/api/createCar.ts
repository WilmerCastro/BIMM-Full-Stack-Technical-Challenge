import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Car, CreateCarInput } from "@/features/cars/types/car";

export type CreateCarData = { createCar: Car };
export type CreateCarVariables = { input: CreateCarInput };

export const CREATE_CAR: TypedDocumentNode<CreateCarData, CreateCarVariables> =
  gql`
    mutation CreateCar($input: CreateCarInput!) {
      createCar(input: $input) {
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
