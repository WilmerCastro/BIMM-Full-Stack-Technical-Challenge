# Notes

Fill this in as you go — it carries as much weight in review as the code.
Keep it short; bullets are fine.

## What I completed

<!-- Required items done, and anything from the optional list. -->

## What I left out, and why

<!-- Scope you consciously cut. Naming a trade-off reads better than silence. -->

- **Image URLs in the form:** new cars get placeholder images. The mock leaves
  out images it isn't sent, and Apollo's cache expects them.

## Decisions and trade-offs

<!-- Structure, state management, where filtering happens, what you tested and
     what you didn't, any library you added and why. -->

- **Types without codegen:** written by hand from `schema.graphql` and attached
  with `TypedDocumentNode`, so `useQuery` infers its data. Worth if the schema grew, i would add codegen.
- **The mock omits `__typename`:** fragments don't match and Apollo can't
  normalise cars by id, so each query lists its fields inline.
- **Cache update after create:** the mutation already returns the new car, so
  I add it to the cached full list. Filtered results are evicted and refetched.
- **Filter server-side, sort client-side:** the API has no sort argument.
- **Filters live in the URL** with `useSearchParams`, so they can work with reloads
  and the back button. `nuqs `would be worth it with more params; for this test wasn't.

## If I had another day

<!-- What you would do next, in priority order. -->

## Anything you should know to run it

<!-- Deviations from `npm install && npm run dev`, if any. -->
