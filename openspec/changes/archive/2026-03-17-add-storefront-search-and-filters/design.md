## Context

The storefront already renders products from a local in-memory catalog and supports basic browse-to-cart behavior. Search and category filters should fit into that same frontend-only model by deriving a filtered list from the existing catalog data without changing the underlying product source.

## Goals / Non-Goals

**Goals:**
- Let users search the storefront by keyword.
- Let users filter products by category.
- Update the product list immediately as filters change.
- Keep the controls simple and visible on the storefront page.

**Non-Goals:**
- Backend search APIs, fuzzy ranking services, or server-side filtering.
- Advanced faceting such as price ranges, sorting, or stock availability filters.
- Persisting filter state across sessions or sharing it in URLs.

## Decisions

- Keep search and category filter state local to the storefront page.
  Rationale: the controls are currently specific to the product listing experience and do not need cross-page persistence.
  Alternative considered: storing filter state in a shared store. This was rejected because it adds complexity without a clear reuse case yet.

- Filter the existing product catalog in-memory using computed state.
  Rationale: the catalog is already available on the client, and reactive filtering keeps the implementation fast and straightforward.
  Alternative considered: duplicating filtered data structures elsewhere. This was rejected because it introduces unnecessary synchronization work.

- Match search queries against the most user-relevant product text fields.
  Rationale: users will expect search to find products by visible details such as name, category, and description.
  Alternative considered: matching only product names. This was rejected because it makes search feel narrower than the visible product information suggests.

- Provide a clear no-results state when filters hide all products.
  Rationale: users should understand that the catalog is empty because of their current filters rather than because the page failed to load.
  Alternative considered: showing a blank grid. This was rejected because it gives poor feedback.

## Risks / Trade-offs

- [Search feels too literal] -> Match across multiple visible fields and normalize case to make results more forgiving.
- [Filter controls crowd the storefront layout] -> Group search and category controls in a compact header area above the product grid.
- [Categories drift from catalog data] -> Derive available category options directly from the existing product list instead of hardcoding them separately.
