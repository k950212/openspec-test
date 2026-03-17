## Why

The storefront currently treats each product as a single purchasable item, which does not reflect common ecommerce behavior where shoppers choose options like size or color before adding an item to the cart. Adding product variants makes the catalog and cart flow more realistic and prepares the product detail experience for more configurable merchandise.

## What Changes

- Add frontend-only product variant support to the catalog data model.
- Let product detail pages show variant option groups such as size or color for products that define variants.
- Require the user to choose a valid variant combination before adding a variant-enabled product to the cart.
- Store the selected variant combination with each cart line item so different selections for the same product remain distinct.
- Show the selected variant details in the cart so users can review what they chose before checkout.
- Disable the Add to Cart button until all required options are selected.
- If a product does not define variants, the existing add-to-cart behavior remains unchanged.
- Ensure only valid variant combinations can be selected and purchased.

## Capabilities

### New Capabilities

- `product-variants`: Define variant-enabled products, available option values, and the rules for selecting a purchasable variant combination.

### Modified Capabilities

- `product-detail-page`: Display product variant selectors and gate add-to-cart until the required selection is complete.
- `shopping-cart`: Persist the selected variant combination for each cart line item and display it in cart summaries.

## Impact

- Affected code: `src/data/products.ts`, [`src/views/ProductDetailView.vue`](C:\Users\kevin.chang\Documents\kevin\openspec-test\src\views\ProductDetailView.vue), [`src/stores/cart.ts`](C:\Users\kevin.chang\Documents\kevin\openspec-test\src\stores\cart.ts), and cart rendering in [`src/views/CartView.vue`](C:\Users\kevin.chang\Documents\kevin\openspec-test\src\views\CartView.vue).
- APIs: No backend integration required; variant data remains in the local frontend catalog.
- Dependencies: No new dependencies expected.
- Systems impacted: Product catalog data structure, product detail variant selection state, cart item data structure, cart UI rendering, and localStorage persistence.
