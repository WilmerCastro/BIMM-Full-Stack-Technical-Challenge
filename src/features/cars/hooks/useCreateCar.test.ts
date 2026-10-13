import { graphql, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { seedCars } from "@/mocks/seed";
import {
  act,
  renderHookWithProviders,
  waitFor,
} from "@/test/renderWithProviders";
import { useCars } from "./useCars";
import { useCreateCar } from "./useCreateCar";

const newCar = { make: "Ford", model: "Mustang", year: 1967, color: "Red" };

const renderCarsAndCreate = () =>
  renderHookWithProviders(() => ({ list: useCars(), create: useCreateCar() }));

describe("useCreateCar", () => {
  it("adds the created car to the cached list without refetching it", async () => {
    let getCarsRequests = 0;
    server.use(
      graphql.query("GetCars", () => {
        getCarsRequests += 1;
      })
    );
    const { result } = renderCarsAndCreate();
    await waitFor(() => expect(result.current.list.loading).toBe(false));

    let created = false;
    await act(async () => {
      created = await result.current.create.createCar(newCar);
    });

    expect(created).toBe(true);
    expect(result.current.list.cars).toHaveLength(seedCars.length + 1);
    expect(result.current.list.cars[seedCars.length]).toMatchObject({
      ...newCar,
      mobile: "/images/placeholder-mobile.svg",
    });
    expect(getCarsRequests).toBe(1);
  });

  it("reports a validation error from the API", async () => {
    server.use(
      graphql.mutation("CreateCar", () =>
        HttpResponse.json({
          errors: [
            {
              message: "make and model are required",
              extensions: { code: "BAD_USER_INPUT" },
            },
          ],
        })
      )
    );
    const { result } = renderCarsAndCreate();

    let created = true;
    await act(async () => {
      created = await result.current.create.createCar(newCar);
    });

    expect(created).toBe(false);
    expect(result.current.create.errorMessage).toBe(
      "The car was rejected: make and model are required."
    );
  });
});
