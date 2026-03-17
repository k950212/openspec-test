## 1. Storefront Filter State

- [x] 1.1 Add storefront-local state for the active search query and selected category.
- [x] 1.2 Derive available category options from the current product catalog data, including an `All` option that restores the full catalog.
- [x] 1.3 Add storefront-local state for the active price sort option.

## 2. Filtered Product Results

- [x] 2.1 Add computed filtering so the storefront only shows products matching the active search query and selected category.
- [x] 2.2 Match search input against visible product fields such as name, category, and description.
- [x] 2.3 Normalize search behavior so it is case-insensitive and ignores leading or trailing whitespace.
- [x] 2.4 Ensure empty search input and the `All` category both restore the unfiltered product list.
- [x] 2.5 Apply price sorting to the filtered product results for low-to-high and high-to-low ordering.
- [x] 2.6 Preserve the storefront's default catalog order until the user selects a price sort option.
- [x] 2.7 Add a no-results state for cases where the current search and filters match no products.
- [x] 2.8 Add a storefront empty-state fallback for cases where the catalog itself has no products.

## 3. Storefront Controls And Layout

- [x] 3.1 Add a keyword search input to the storefront page.
- [x] 3.2 Add category filter controls to the storefront page.
- [x] 3.3 Add price sort controls to the storefront page.
- [x] 3.4 Allow search, category filters, and price sorting to be used together and update results in real time.
- [x] 3.5 Style the search, filter, and sort controls so they fit the existing storefront design.

## 4. Verification

- [x] 4.1 Verify keyword search, category filtering, price sorting, combined behavior, and real-time updates through project checks and manual validation.
- [x] 4.2 Verify empty search, the `All` category, default ordering, low-to-high sorting, high-to-low sorting, case-insensitive matching, trimmed input behavior, no-results messaging, and empty-catalog fallback.
