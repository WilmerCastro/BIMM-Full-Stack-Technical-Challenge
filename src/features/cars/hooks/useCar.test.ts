import { renderHookWithProviders, waitFor } from "@/test/renderWithProviders";
import { useCar } from "./useCar";

describe("useCar", () => {
  it("returns the car with that id", async () => {
    const { result } = renderHookWithProviders(() => useCar("1"));

    await waitFor(() =>
      expect(result.current.car).toMatchObject({ model: "Q5" })
    );
  });

  it("returns null for an unknown id", async () => {
    const { result } = renderHookWithProviders(() => useCar("999"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.car).toBeNull();
  });
});
