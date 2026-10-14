import { seedCars } from "@/mocks/seed";
import { isCarSort, sortCars } from "./sortCars";

const models = (cars: { model: string }[]) => cars.map((car) => car.model);

describe("sortCars", () => {
  it("sorts newest first", () => {
    expect(sortCars(seedCars, "year-desc").map((car) => car.year)).toEqual([
      2025, 2024, 2024, 2023, 2022, 2021,
    ]);
  });

  it("sorts oldest first", () => {
    expect(sortCars(seedCars, "year-asc")[0].year).toBe(2021);
  });

  it("sorts by model name", () => {
    expect(models(sortCars(seedCars, "model-asc"))).toEqual([
      "A3",
      "A6",
      "e-tron GT",
      "Q3",
      "Q5",
      "R8",
    ]);
  });

  it("does not reorder the list it was given", () => {
    const original = [...seedCars];
    sortCars(seedCars, "model-asc");
    expect(seedCars).toEqual(original);
  });
});

describe("isCarSort", () => {
  it("accepts known sorts only", () => {
    expect(isCarSort("year-asc")).toBe(true);
    expect(isCarSort("price-desc")).toBe(false);
  });
});
