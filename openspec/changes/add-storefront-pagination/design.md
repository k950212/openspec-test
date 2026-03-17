## Overview

This change adds client-side pagination to the storefront product list. Pagination is applied after the existing search, category filter, and price sort logic so users always page through the currently relevant result set instead of the full catalog.

## Pagination Model

- Define a storefront-local page size constant in `HomeView.vue` or a closely related storefront helper.
- Track the active page in component state.
- Derive `filteredProducts` first using the existing search, category, and sort behavior.
- Derive `totalPages` from `filteredProducts.length` and the page size.
- Derive `paginatedProducts` by slicing the filtered results for the active page.

## Page State Rules

- Default the active page to `1`.
- When search query or selected category changes, reset the active page to `1` so users see the start of the new result set.
- When the sort option changes, keep the current page if it is still within range; otherwise clamp it to the final valid page.
- If filtering reduces the result set and the current page exceeds `totalPages`, move the active page to the highest valid page.
- When there are no matching products, keep the empty-state behavior and suppress pagination controls.

## UI Behavior

- Show pagination controls near the product list controls or below the grid, following the existing storefront visual language.
- Include at minimum:
  - previous page action
  - next page action
  - visible current page indicator
- Optionally include direct page number buttons if they fit the current layout cleanly.
- Disable previous/next actions at the first or last page rather than allowing invalid navigation.

## Compatibility With Existing Storefront Features

- Search, category filter, and sort all operate on the full in-memory catalog first.
- Pagination only affects how many of those already-filtered products are rendered at once.
- Product cards, detail links, and add-to-cart actions remain unchanged because they still receive normal `Product` entries from the paginated slice.

## Validation

- Confirm multiple pages appear when the catalog exceeds the page size.
- Confirm page navigation updates the visible products correctly.
- Confirm search and category filters reset the user to page `1`.
- Confirm sort changes preserve or clamp the active page correctly.
- Confirm no-results and empty-catalog states do not render misleading pagination controls.
