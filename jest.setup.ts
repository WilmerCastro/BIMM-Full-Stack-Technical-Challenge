import "@testing-library/jest-dom";
import { db } from "@/mocks/db";
import { server } from "@/mocks/server";

// jsdom does not implement matchMedia; MUI's useMediaQuery needs it.
// Candidates can override the return value per-test if they assert on breakpoints.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  db.reset();
});
afterAll(() => server.close());
