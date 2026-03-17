## Overview

This change adds a frontend-only wishlist that works across the storefront, product detail pages, and a new dedicated wishlist page. Wishlist state is stored in localStorage and exposed through a shared Pinia store so all pages stay in sync.

## State Management

- Add a new Pinia wishlist store in `src/stores/wishlist.ts`.
- Store favorited product IDs as a deduplicated array of numbers.
- Expose helpers such as:
  - `favoriteIds`
  - `isFavorited(productId)`
  - `toggleFavorite(productId)`
  - `removeFavorite(productId)`
  - `favoritedProducts` derived from the existing local product catalog
- Persist wishlist state to `localStorage` and restore it on app startup.

## Storefront Product Cards

- Keep the existing product detail link on each product card.
- Replace the current product action layout with:
  - detail link on the left
  - heart icon button and cart icon button grouped on the right
- The heart icon reflects current wishlist state:
  - filled red for favorited
  - outlined dark for not favorited

## Product Detail Page Actions

- Keep the product detail content and add-to-cart behavior.
- Update the action area so the primary row contains compact icon actions on the right:
  - heart icon first
  - cart icon second
- The heart icon uses the same visual states as the storefront cards.
- The cart icon continues to add the product to the cart and trigger the existing success notification flow.

## Wishlist Page

- Add a new route such as `/wishlist`.
- Render a dedicated wishlist page that:
  - shows favorited products using existing product data
  - allows navigation to product detail pages
  - supports unfavoriting directly from the wishlist page
- If there are no favorites, show an empty state with a path back to the storefront.

## Header Navigation

- Add a wishlist navigation item to the app header alongside existing primary routes.
- The header entry should always be available because wishlist is frontend-only and not restricted to authenticated users.

## Validation

- Confirm wishlist state persists across refreshes.
- Confirm toggling favorite state stays synchronized between storefront, detail page, and wishlist page.
- Confirm removing the last item from the wishlist page reveals the empty state immediately.
- Confirm wishlist controls do not break existing cart actions or product detail navigation.
