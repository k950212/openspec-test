## 1. Recently Viewed State

- [x] 1.1 Add a Pinia store for frontend-only recently viewed product IDs.
- [x] 1.2 Persist recently viewed state to `localStorage` and restore it on refresh.
- [x] 1.3 Deduplicate viewed products so revisiting a product moves it to the front.

## 2. Product Detail Tracking

- [x] 2.1 Record valid product detail page visits in the recently viewed store.
- [x] 2.2 Prevent invalid product routes from being recorded.
- [x] 2.3 Keep recently viewed tracking compatible with existing wishlist and cart actions.

## 3. Recently Viewed Page And Navigation

- [x] 3.1 Add a recently viewed products page route and view.
- [x] 3.2 Add a header navigation entry that links to the recently viewed products page.
- [x] 3.3 Show recorded products in reverse chronological order with links to product detail pages.
- [x] 3.4 Add an empty state for cases where no products have been viewed yet.

## 4. Verification

- [x] 4.1 Verify product detail visits are stored and restored from `localStorage`.
- [x] 4.2 Verify revisiting the same product moves it to the top without duplication.
- [x] 4.3 Verify invalid routes are ignored and recently viewed remains compatible with existing cart and wishlist flows through project checks and manual validation.
