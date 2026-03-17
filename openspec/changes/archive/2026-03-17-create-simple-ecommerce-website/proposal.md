## Why

The current app is a small demo and does not yet represent a realistic product experience. Creating a simple ecommerce website adds a more practical end-to-end flow that demonstrates browsing products, managing a cart, and completing checkout in one cohesive interface.

## What Changes

- Replace the current simple demo homepage with an ecommerce storefront experience.
- Add a product listing view that shows a small catalog of products with pricing and add-to-cart actions.
- Introduce cart functionality so users can review selected items, adjust quantities, and view totals.
- Add a simple checkout flow that collects basic customer details and confirms the order submission.
- Update the application shell and routing as needed to support storefront, cart, and checkout pages cleanly.

## Capabilities

### New Capabilities
- `product-catalog`: Display a product list with essential product details and controls for adding items to the cart.
- `shopping-cart`: Let users review selected products, adjust item quantities, remove items, and view subtotal information.
- `checkout-flow`: Provide a basic checkout form and order confirmation experience using the current cart contents.

### Modified Capabilities

## Impact

- Affected code: `src/App.vue`, `src/router/index.ts`, `src/views/*`, and likely new shared components and store modules under `src/components/` and `src/stores/`.
- APIs: No backend integration required for the initial version; product data and checkout submission can be local to the client.
- Dependencies: No new dependencies expected unless a small utility is needed for formatting.
- Systems: Vue Router navigation, Pinia state management, and the current frontend styling layer.
