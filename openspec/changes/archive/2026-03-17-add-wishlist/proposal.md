## Why

The storefront already supports browsing products, viewing product details, and adding items to the cart, but users do not yet have a lightweight way to bookmark products they are interested in. Adding a wishlist makes the shopping flow feel more complete by letting users save products for later and return to them from a dedicated collection page.

## What Changes

- Add a frontend-only wishlist feature that lets users toggle product favorites from the storefront product list.
- Add the same wishlist toggle to the product detail page, positioned beside the cart action.
- Replace the large add-to-cart button on the product detail page with a cart icon action aligned to the far right, with the wishlist heart icon immediately to its left.
- Add a header navigation entry so users can open a dedicated wishlist page.
- Show wishlist icon state clearly: filled red heart when a product is already favorited, outlined dark heart when it is not.
- Keep wishlist data in the existing frontend-only architecture without backend APIs.

## Capabilities

### New Capabilities

- `wishlist`: Allow users to save and review favorited products in a dedicated wishlist page.

### Modified Capabilities

- `product-catalog`: Let users toggle wishlist state directly from product cards in the storefront.
- `product-detail-page`: Let users toggle wishlist state from the product detail page and align action icons around the cart action.

## Impact

- Affected code: `src/views/HomeView.vue`, `src/views/ProductDetailView.vue`, `src/App.vue`, `src/router/index.ts`, and new wishlist state/storage logic.
- APIs: No backend integration required; wishlist state persists using browser localStorage.
- Dependencies: No new dependencies expected.
- Systems: Frontend catalog rendering, product detail actions, header navigation, localStorage persistence, and wishlist-specific page rendering.

## Acceptance Criteria

- Each product card on the storefront shows a heart icon to the left of the cart icon.
- Clicking the heart icon toggles wishlist state for that product.
- Wishlisted products show a filled red heart icon.
- Non-wishlisted products show an outlined dark heart icon.
- The product detail page shows a heart icon and a cart icon aligned on the right side of the action row, with the heart icon to the left of the cart icon.
- The header includes a wishlist entry point that navigates to a wishlist page.
- The wishlist page lists all favorited products and lets users open product details from that page.
- Wishlist state persists across refreshes using frontend-only local storage.
- A product can appear only once in the wishlist even if the heart icon is toggled multiple times.

## Edge Cases

- If there are no favorited products, the wishlist page shows a clear empty state.
- Toggling wishlist state on the storefront updates the product detail page state for the same product immediately, and vice versa.
- Removing a product from the wishlist while viewing the wishlist page removes it from the list without requiring a refresh.
- Wishlist state should not interfere with existing add-to-cart behavior.
