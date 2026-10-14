import { useLocation } from "react-router-dom";
import {
  act,
  renderHookWithProviders,
  waitFor,
} from "@/test/renderWithProviders";
import { useCarFilters } from "./useCarFilters";

const renderFilters = (route: string) =>
  renderHookWithProviders(
    () => ({ ...useCarFilters(), search: useLocation().search }),
    { route }
  );

describe("useCarFilters", () => {
  it("reads the filters from the URL", () => {
    const { result } = renderFilters("/?model=q&year=2024&sort=model-asc");

    expect(result.current.filters).toEqual({
      model: "q",
      year: "2024",
      sort: "model-asc",
    });
    expect(result.current.query).toEqual({
      model: "q",
      year: 2024,
      sort: "model-asc",
    });
    expect(result.current.isFiltered).toBe(true);
  });

  it("falls back to the default sort and no filters", () => {
    const { result } = renderFilters("/?sort=price&year=abc");

    expect(result.current.query).toEqual({
      model: undefined,
      year: undefined,
      sort: "year-desc",
    });
    expect(result.current.isFiltered).toBe(false);
  });

  it("writes changes to the URL and debounces the query", async () => {
    const { result } = renderFilters("/");

    act(() => result.current.setFilter("model", "q5"));

    expect(result.current.filters.model).toBe("q5");
    expect(result.current.search).toBe("?model=q5");
    expect(result.current.query.model).toBeUndefined();
    await waitFor(() => expect(result.current.query.model).toBe("q5"));
  });

  it("clears model and year but keeps the sort", () => {
    const { result } = renderFilters("/?model=q&year=2024&sort=year-asc");

    act(() => result.current.clearFilters());

    expect(result.current.search).toBe("?sort=year-asc");
  });
});
