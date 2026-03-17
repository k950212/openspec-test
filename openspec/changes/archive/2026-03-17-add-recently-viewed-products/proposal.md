## Why

The storefront now supports product detail pages, wishlist, and cart flows, but users do not have a quick way to return to products they recently explored. Adding a recently viewed products feature makes browsing feel more helpful by giving users a lightweight history of the items they opened most recently.

## What Changes

- Add a frontend-only recently viewed products feature based on product detail page visits.
- Track recently viewed products in localStorage so the list persists across refreshes.
- Add a dedicated recently viewed products page where users can revisit previously opened items.
- Add a header entry point so users can quickly open the recently viewed products page.
- Show recently viewed products in reverse chronological order, with the most recently opened product first.

## Capabilities

### New Capabilities

- `recently-viewed-products`: Allow users to revisit products they opened recently.

### Modified Capabilities

- `product-detail-page`: Record valid product detail page visits in the recently viewed history.

## Impact

- Affected code: `src/views/ProductDetailView.vue`, `src/views/*`, `src/App.vue`, `src/router/index.ts`, and new recently viewed state/storage logic.
- APIs: No backend integration required; recently viewed data is stored locally in the browser.
- Dependencies: No new dependencies expected.
- Systems: Product detail routing, localStorage persistence, header navigation, and frontend catalog rendering.

## Acceptance Criteria

- A product is recorded in recently viewed history only after a valid product detail page is successfully loaded.
- The recently viewed list is stored in localStorage and restored after refresh.
- The most recently viewed product appears first in the list.
- Viewing the same product again moves it to the top instead of duplicating it.
- The header includes an entry point to a recently viewed products page.
- The recently viewed products page lists recorded products and lets users open their detail pages.
- The recently viewed page shows a clear empty state when no products have been viewed yet.
- The recently viewed list keeps only a fixed maximum number of products (for example, 10).

## Edge Cases

- Invalid product detail routes should not be recorded in recently viewed history.
- Removing duplicates should preserve only the newest position for a product.
- If a stored product no longer exists in the local catalog, it should be ignored safely.
- Recently viewed tracking should not interfere with existing wishlist or cart behavior.
