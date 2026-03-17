## Why

The storefront currently shows all products at once, which works for a small catalog but becomes harder to scan as the shopping experience grows. Adding search and category filtering helps users narrow the product list more quickly and makes the storefront feel more practical.

## What Changes

- Add a keyword search control to the storefront so users can filter products by relevant text.
- Add category filter controls so users can narrow the product list by product category.
- Add price sort controls so users can order products by price from low to high or high to low.
- Update the storefront product list to reflect the active search query, selected category, and price sort in real time.
- Provide clear empty-state feedback when no products match the current search and filter combination.
- Keep the feature frontend-only and powered by the existing local product catalog data.

## Capabilities

### New Capabilities

- `storefront-search-and-filters`: Allow users to search products, filter by category, and sort the storefront by price.

### Modified Capabilities

- `product-catalog`: Show only the products that match the current storefront search and category filter state, ordered by the active price sort selection.

## Impact

- Affected code: `src/views/HomeView.vue`, product catalog data access in `src/data/products.ts`, and any shared storefront UI state/helpers needed for filtering and sorting.
- APIs: No backend integration required; search, filtering, and sorting run entirely against the local product catalog.
- Dependencies: No new dependencies expected.
- Systems: Frontend catalog rendering, Vue reactivity for derived product lists, and existing storefront styling.

## Acceptance Criteria

- The storefront displays a search input for filtering products by keyword.
- The storefront displays category filter controls.
- The storefront displays price sort controls for low-to-high and high-to-low ordering.
- Typing in the search input filters products by name or relevant text.
- Selecting a category filter limits the visible products to that category.
- Search, category filters, and price sorting can be used together.
- The product list updates in real time as filters and sort options change.
- If no products match the search and category filters, an empty-state message is shown.
- Clearing the search and filters restores the full product list.
- Changing the price sort option should not reset the active search query or category filter.

## Edge Cases

- Searching with no keyword shows all products.
- Category filter "All" restores the full catalog.
- Price sort defaults to the storefront's standard catalog order until the user changes it.
- Search should be case-insensitive.
- Leading or trailing whitespace in search input should not affect results.
- If the catalog is empty, the storefront should show a proper empty state.
- Price sorting should apply only to the currently filtered product set.
