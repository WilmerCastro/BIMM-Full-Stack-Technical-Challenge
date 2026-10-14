import { useEffect, useState } from "react";

export const useDebouncedValue = <Value>(value: Value, delayMs: number) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
};
