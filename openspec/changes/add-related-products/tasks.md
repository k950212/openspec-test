## 1. Related Product Matching

- [x] 1.1 Add or update catalog helpers to derive related products from the existing local catalog.
- [x] 1.2 Exclude the currently viewed product from related product results.
- [x] 1.3 Use deterministic matching rules such as shared category for related product selection.
- [x] 1.4 Limit the number of related products returned for display on the detail page to at most 4 items.

## 2. Product Detail Related Products UI

- [x] 2.1 Add a related products section to the product detail page.
- [x] 2.2 Render related product cards with key product information and a path to open each product.
- [x] 2.3 Place the related products section below the main product information on the detail page.
- [x] 2.4 Keep the related products section hidden or gracefully reduced when too few matches exist or no related products are available.
- [x] 2.5 Preserve existing product detail page actions such as wishlist, cart, reviews, and variants.

## 3. Verification

- [x] 3.1 Verify valid product detail pages show related products when matching catalog items exist.
- [x] 3.2 Verify the current product never appears in its own related products section.
- [x] 3.3 Verify no more than 4 related products are displayed.
- [x] 3.4 Verify related product links open the selected product detail page.
- [x] 3.5 Verify product detail pages remain stable when no related products are available.
- [x] 3.6 Verify edge cases such as a single-product catalog and categories with very few items do not break the page.
