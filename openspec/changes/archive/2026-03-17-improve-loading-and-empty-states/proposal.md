## Why

The storefront already includes multiple browsing and shopping flows, but its loading and empty-state experiences are inconsistent across pages. Improving these states will make the app feel more polished and easier to understand when data is unavailable, still loading, or has no matching results.

## What Changes

- Add consistent frontend loading states for major catalog and product-detail experiences.
- Use skeleton-style placeholders for catalog and product-detail loading states to maintain layout stability.
- Add skeleton loading placeholders for product lists and product detail pages, and clear empty-state messaging for search results, carts, reviews, and related products.
- Improve empty-state messaging for pages and sections that may legitimately have no data.
- Standardize how empty states guide users back to a useful next action such as browsing products or revisiting filters.
- Keep the feature frontend-only and aligned with the app's existing product, cart, recently viewed, and related products flows.
- Preserve current business behavior while improving visual feedback and fallback states.

## Capabilities

### New Capabilities

- `loading-and-empty-states`: Provide consistent loading placeholders and empty-state feedback across key storefront views and detail-page sections.

### Modified Capabilities

- `product-catalog`: Show clearer loading and no-results states while browsing the storefront.
- `product-detail-page`: Show clear fallback messaging for empty related-products and review states, and support loading feedback patterns.
- `shopping-cart`: Show clearer empty-cart feedback and aligned loading/fallback presentation.

## Impact

- Affected code: `src/views/HomeView.vue`, `src/views/ProductDetailView.vue`, `src/views/CartView.vue`, and any shared UI styles or helper components used for loading and empty states.
- APIs: No backend integration required; the change affects frontend rendering and state presentation only.
- Dependencies: No new dependencies expected.
- Systems: Storefront page rendering, product detail sections, cart presentation, and shared UI consistency.
