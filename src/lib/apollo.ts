import { ApolloClient, InMemoryCache } from "@apollo/client";

/**
 * Apollo points at /graphql, which MSW intercepts in the browser.
 * There is no real server process to run.
 */
export const createApolloClient = () =>
  new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache(),
  });

export const apolloClient = createApolloClient();
