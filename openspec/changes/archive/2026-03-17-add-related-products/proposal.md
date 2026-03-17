## Why

The storefront currently gives users a focused product detail page, but it does not help them continue browsing once they finish reviewing a product. Adding related products creates a more natural discovery flow by surfacing nearby alternatives or complementary items directly from the detail page.

## What Changes

- Add a frontend-only related products section to product detail pages.
- Derive related products from the existing local catalog using lightweight matching rules such as shared category and excluding the currently viewed product.
- Show a small list of related product cards with key product information and navigation back into their detail pages.
- Limit the number of related products displayed to a maximum of 4 items to maintain layout consistency.
- Handle cases where too few related products exist without breaking the product detail layout.
- Keep the feature compatible with existing product detail, cart, wishlist, and variant behavior.

## Capabilities

### New Capabilities

- `related-products`: Suggest a small set of related products from the catalog while a user is viewing a product detail page.

### Modified Capabilities

- `product-detail-page`: Display a related products section for valid product detail pages.

## Impact

- Affected code: `src/data/products.ts`, [`src/views/ProductDetailView.vue`](C:\Users\kevin.chang\Documents\kevin\openspec-test\src\views\ProductDetailView.vue), and any shared product-card helpers used by the storefront.
- APIs: No backend integration required; related products are derived entirely from the local catalog.
- Dependencies: No new dependencies expected.
- Systems: Product detail rendering, frontend catalog matching logic, and existing product navigation flows.

## Acceptance Criteria

- When a user views a product detail page, a related products section is displayed below the main product information.
- The currently viewed product must not appear in the related products list.
- No more than 4 related products are displayed.
- Clicking a related product navigates to that product's detail page.
- If no related products are found, the product detail page layout remains intact and no errors occur.

## Edge Cases

- The catalog contains only one product.
- Fewer than four related products exist.
- Products belong to categories with very few items.
- The related products list is empty.
