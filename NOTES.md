# Notes

Fill this in as you go — it carries as much weight in review as the code.
Keep it short; bullets are fine.

## What I completed

<!-- Required items done, and anything from the optional list. -->

- All seven required items.
- From the optional list: server-side filtering, a year filter combined in `useCarFilters()`,
  debounced search, and a `/cars/:id` detail route using `GetCar`.
- A Docker setup (see below).

## What I left out, and why

<!-- Scope you consciously cut. Naming a trade-off reads better than silence. -->

- **Image URLs in the form:** new cars get placeholder images. The mock leaves
  out images it isn't sent, and Apollo's cache expects them.
- **A full accessibility audit:** controls are labelled, there are landmarks
  and alt text, and everything works from the keyboard, but I didn't test with
  a screen reader or axe.

## Decisions and trade-offs

<!-- Structure, state management, where filtering happens, what you tested and
     what you didn't, any library you added and why. -->

- **Types without codegen:** written by hand from `schema.graphql` and attached
  with `TypedDocumentNode`, so `useQuery` infers its data. If the schema grew,
  I would add codegen.
- **The mock omits `__typename`:** fragments don't match and Apollo can't
  normalise cars by id, so each query lists its fields inline.
- **Cache update after create:** the mutation already returns the new car, so
  I add it to the cached full list. Filtered results are evicted and refetched.
- **Filter server-side, sort client-side:** the API has no sort argument.
- **Filters live in the URL** with `useSearchParams`, so they can work with reloads
  and the back button. `nuqs` would be worth it with more params; for this test
  it wasn't.
- **Tests run against the mock API** with a real Apollo client, not mocked
  hooks. jsdom ignores media queries, so I checked the image swap by hand.

## If I had another day

<!-- What you would do next, in priority order. -->

- A GitHub Actions workflow that runs `npm run verify` and builds the Docker
  image on every pull request.
- Playwright tests for the image swap across breakpoints.
- An accessibility audit with axe and a screen reader.
- Codegen for the GraphQL types.
- Route-level code splitting; the main chunk is over 500 kB.

## Anything you should know to run it

<!-- Deviations from `npm install && npm run dev`, if any. -->

- `npm install && npm run dev` works as described.
- Or with Docker: `docker compose up --build` serves the production build at
  http://localhost:3000.
