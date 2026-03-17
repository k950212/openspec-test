## Why

The storefront catalog now includes more products, which makes the page longer and harder to browse in one continuous list. Adding pagination helps users scan products more comfortably, makes the storefront feel more structured, and keeps the shopping experience manageable as the catalog grows.

## What Changes

- Add frontend-only pagination controls to the storefront product list.
- Limit the number of visible products per page so users browse the catalog in smaller groups.
- Update the storefront so pagination works together with the existing search, category filter, and price sort controls.
- Reset or adjust the active page when the filtered result set changes and the current page is no longer valid.
- Show clear pagination state, including the current page and available navigation actions.

## Capabilities

### New Capabilities

- `storefront-pagination`: Allow users to browse the storefront catalog across multiple pages.

### Modified Capabilities

- `product-catalog`: Show only the products for the active storefront page after applying the current search, category filter, and price sort state.
- `storefront-search-and-filters`: Keep search, category filtering, and price sorting compatible with paginated results.

## Impact

- Affected code: `src/views/HomeView.vue`, product list derivation logic, and any shared storefront helpers used for filtering, sorting, and pagination.
- APIs: No backend integration required; pagination is derived entirely from the local product catalog.
- Dependencies: No new dependencies expected.
- Systems: Frontend catalog rendering, Vue computed state for paged results, and existing storefront controls/layout.

## Acceptance Criteria

- The storefront shows pagination controls when the product result set spans more than one page.
- The storefront limits visible products to a fixed number per page (for example, 6 products per page).
- Users can navigate between pages using the pagination controls.
- The current page indicator updates as the user changes pages.
- Search, category filters, and price sorting are applied before pagination is calculated.
- The product list updates immediately when search, category, or sort state changes.
- Changing search or category filters resets pagination to page 1.
- Changing the price sort option does not reset the current page if it remains valid.
- If the filtered result set fits on one page, pagination controls are hidden or disabled appropriately.

## Edge Cases

- If there are no matching products, the storefront shows the existing empty state instead of pagination controls.
- Clearing search and filters restores the first page of the full catalog.
- Changing the sort option preserves a valid current page when possible.
- Pagination should not break product detail links or add-to-cart actions on visible products.
- If the catalog itself is empty, the storefront should continue to show the empty-catalog fallback.
