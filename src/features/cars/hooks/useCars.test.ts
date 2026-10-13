import { graphql, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { seedCars } from "@/mocks/seed";
import { renderHookWithProviders, waitFor } from "@/test/renderWithProviders";
import { useCars } from "./useCars";

describe("useCars", () => {
  it("starts loading and then returns the cars from the API", async () => {
    const { result } = renderHookWithProviders(() => useCars());

    expect(result.current.loading).toBe(true);
    expect(result.current.cars).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.cars).toHaveLength(seedCars.length);
    expect(result.current.error).toBeUndefined();
  });

  it("exposes the error when the API fails", async () => {
    server.use(
      graphql.query("GetCars", () =>
        HttpResponse.json({ errors: [{ message: "boom" }] })
      )
    );

    const { result } = renderHookWithProviders(() => useCars());

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.cars).toEqual([]);
  });
});
