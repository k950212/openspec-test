## 1. Wishlist State

- [x] 1.1 Add a Pinia wishlist store for frontend-only favorite product IDs.
- [x] 1.2 Persist wishlist state to `localStorage` and restore it on refresh.
- [x] 1.3 Expose helpers for checking, toggling, and removing favorited products.

## 2. Storefront And Detail Actions

- [x] 2.1 Add a wishlist heart icon to each storefront product card to the left of the cart icon.
- [x] 2.2 Show filled red heart state for favorited products and outlined dark heart state for non-favorited products.
- [x] 2.3 Update the product detail page action row so the heart icon appears to the left of the cart icon on the right side.
- [x] 2.4 Preserve existing add-to-cart behavior and notifications while adding wishlist controls.

## 3. Wishlist Page And Navigation

- [x] 3.1 Add a wishlist page route and view for listing favorited products.
- [x] 3.2 Add a header navigation entry that links to the wishlist page.
- [x] 3.3 Allow users to open product detail pages from the wishlist page.
- [x] 3.4 Add an empty state for cases where no products are favorited.
- [x] 3.5 Allow removing products from the wishlist page without requiring a refresh.

## 4. Verification

- [x] 4.1 Verify wishlist icon states on the storefront and product detail page.
- [x] 4.2 Verify storefront, product detail, and wishlist page stay synchronized when favorite state changes.
- [x] 4.3 Verify localStorage persistence, wishlist empty-state behavior, and compatibility with existing cart actions through project checks and manual validation.
