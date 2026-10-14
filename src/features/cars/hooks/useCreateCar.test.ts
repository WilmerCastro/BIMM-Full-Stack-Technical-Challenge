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

const newCar = { make: "Audi", model: "Q7", year: 2020, color: "Red" };

const countGetCarsRequests = () => {
  const requests: unknown[] = [];
  server.use(
    graphql.query("GetCars", ({ variables }) => {
      requests.push(variables);
    })
  );
  return requests;
};

describe("useCreateCar", () => {
  it("adds the car to the full list without refetching it", async () => {
    const requests = countGetCarsRequests();
    const { result } = renderHookWithProviders(() => ({
      list: useCars({ sort: "year-desc" }),
      create: useCreateCar(),
    }));
    await waitFor(() => expect(result.current.list.loading).toBe(false));

    let created = false;
    await act(async () => {
      created = await result.current.create.createCar(newCar);
    });

    expect(created).toBe(true);
    expect(result.current.list.cars).toHaveLength(seedCars.length + 1);
    expect(
      result.current.list.cars.find((car) => car.model === "Q7")
    ).toMatchObject({ ...newCar, mobile: "/images/placeholder-mobile.svg" });
    expect(requests).toHaveLength(1);
  });

  it("lets the API decide whether the car belongs in a filtered list", async () => {
    const requests = countGetCarsRequests();
    const { result } = renderHookWithProviders(() => ({
      all: useCars({ sort: "model-asc" }),
      searchQ: useCars({ model: "q", sort: "model-asc" }),
      create: useCreateCar(),
    }));
    await waitFor(() => expect(result.current.searchQ.loading).toBe(false));
    expect(requests).toEqual([{}, { model: "q" }]);

    await act(async () => {
      await result.current.create.createCar(newCar);
    });

    await waitFor(() =>
      expect(result.current.searchQ.cars.map((car) => car.model)).toEqual([
        "Q3",
        "Q5",
        "Q7",
      ])
    );
    expect(result.current.all.cars).toHaveLength(seedCars.length + 1);
    expect(requests).toEqual([{}, { model: "q" }, { model: "q" }]);
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
    const { result } = renderHookWithProviders(() => useCreateCar());

    let created = true;
    await act(async () => {
      created = await result.current.createCar(newCar);
    });

    expect(created).toBe(false);
    expect(result.current.errorMessage).toBe(
      "The car was rejected: make and model are required."
    );
  });
});
