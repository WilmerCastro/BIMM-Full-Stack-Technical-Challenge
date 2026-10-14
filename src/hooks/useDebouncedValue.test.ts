import { act, renderHook } from "@testing-library/react";
import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("only takes the latest value once it stops changing for the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "ab" });
    act(() => jest.advanceTimersByTime(200));
    rerender({ value: "abc" });
    act(() => jest.advanceTimersByTime(299));
    expect(result.current).toBe("a");

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe("abc");
  });
});
