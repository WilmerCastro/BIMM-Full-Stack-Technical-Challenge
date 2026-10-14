import { ApolloProvider } from "@apollo/client";
import {
  render,
  renderHook,
  type RenderOptions,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";
import { createApolloClient } from "@/lib/apollo";

/**
 * Renders a component inside the same providers the app uses.
 *
 * Pair this with `src/mocks/server.ts` when you want a test to exercise the
 * real Apollo client against the mock API. For unit tests of presentational
 * components, plain `render` from RTL is fine.
 */
type ProviderOptions = {
  route?: string;
};

const createProviders = ({ route = "/" }: ProviderOptions = {}) => {
  const client = createApolloClient();
  return ({ children }: { children: ReactNode }) => (
    <ApolloProvider client={client}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </ApolloProvider>
  );
};

export const renderWithProviders = (
  ui: ReactElement,
  { route, ...options }: Omit<RenderOptions, "wrapper"> & ProviderOptions = {}
) => render(ui, { wrapper: createProviders({ route }), ...options });

export const renderHookWithProviders = <Result,>(
  hook: () => Result,
  options: ProviderOptions = {}
) => renderHook(hook, { wrapper: createProviders(options) });

export * from "@testing-library/react";
