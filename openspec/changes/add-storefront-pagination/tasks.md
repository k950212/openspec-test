## 1. Pagination State

- [x] 1.1 Add storefront-local state for the active page and a fixed page size for the storefront product list.
- [x] 1.2 Derive total page count from the filtered product result set.
- [x] 1.3 Use a fixed per-page limit for visible products that matches the accepted storefront pagination behavior.
- [x] 1.4 Clamp or reset the active page when the current result set changes.

## 2. Paginated Results

- [x] 2.1 Apply pagination after the existing search, category filter, and price sort logic.
- [x] 2.2 Derive the visible storefront products from the active page slice.
- [x] 2.3 Preserve product detail navigation and add-to-cart behavior for paginated product cards.
- [x] 2.4 Update the visible product list immediately when search, category, or sort state changes.
- [x] 2.5 Keep existing no-results and empty-catalog states working without showing invalid pagination controls.

## 3. Storefront Pagination Controls

- [x] 3.1 Add pagination controls to the storefront page.
- [x] 3.2 Show the current page state and allow navigation to previous and next pages.
- [x] 3.3 Hide or disable pagination controls appropriately when the result set fits on a single page.
- [x] 3.4 Disable or hide invalid navigation actions at pagination boundaries.
- [x] 3.5 Style the pagination controls so they fit the existing storefront layout.

## 4. Interaction Rules And Verification

- [x] 4.1 Reset the active page to the first page when search or category filter state changes.
- [x] 4.2 Preserve or clamp the active page appropriately when the sort option changes.
- [x] 4.3 Ensure clearing search and filters restores the first page of the full catalog.
- [x] 4.4 Verify pagination, fixed page size behavior, combined search/filter/sort behavior, page reset behavior, valid-page preservation on sort changes, boundary navigation, and empty states through project checks and manual validation.
