import { toCreateCarInput, validateCarForm } from "./carForm";

const valid = { make: "Ford", model: "Mustang", year: "1967", color: "Red" };

describe("validateCarForm", () => {
  it("accepts a complete car", () => {
    expect(validateCarForm(valid)).toEqual({});
  });

  it("rejects blank and whitespace-only fields", () => {
    expect(
      validateCarForm({ make: "  ", model: "", year: "", color: " " })
    ).toEqual({
      make: "Make is required",
      model: "Model is required",
      color: "Color is required",
      year: expect.stringMatching(/^Enter a year between 1886 and \d{4}$/),
    });
  });

  it.each(["1885", "3000", "2020.5", "abc"])("rejects year %s", (year) => {
    expect(validateCarForm({ ...valid, year }).year).toBeDefined();
  });
});

describe("toCreateCarInput", () => {
  it("trims text and turns the year into a number", () => {
    expect(
      toCreateCarInput({ ...valid, make: " Ford ", color: " Red " })
    ).toEqual({ make: "Ford", model: "Mustang", year: 1967, color: "Red" });
  });
});
