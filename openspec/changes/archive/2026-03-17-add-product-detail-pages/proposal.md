## Why

The storefront currently lets users browse products and add them to the cart directly from the listing, but it does not provide a dedicated product detail experience. Adding a product detail page makes the shopping flow more realistic by giving users a focused place to review a product before deciding to add it to the cart.

## What Changes

- Add a dedicated product detail page for each product in the catalog.
- Update storefront product entry points so users can navigate from the product listing to a matching detail page.
- Show richer product information on the detail page using the existing client-side catalog data.
- Provide an add-to-cart action on the detail page that updates the shared cart state immediately.
- Handle invalid product routes gracefully and guide the user back to shopping.

## Capabilities

### New Capabilities
- `product-detail-page`: Display a dedicated page for an individual product with its information and an add-to-cart action.

### Modified Capabilities
- `product-catalog`: Let users open a product detail page from storefront product listings.

## Impact

- Affected code: `src/router/index.ts`, `src/views/*`, shared product presentation logic, and existing product data access in `src/data/products.ts`.
- APIs: No backend integration required; product details continue to come from local catalog data.
- Dependencies: No new dependencies expected.
- Systems: Vue Router route handling, existing Pinia cart state, and storefront page styling.
