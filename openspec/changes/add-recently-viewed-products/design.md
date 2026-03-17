## Overview

This change adds a frontend-only recently viewed products feature that tracks product detail page visits. Recently viewed state is stored in localStorage through a shared Pinia store, allowing the product detail page, header, and a dedicated recently viewed page to stay in sync.

## State Management

- Add a new Pinia store in `src/stores/recentlyViewed.ts`.
- Persist a list of product IDs in reverse chronological order, newest first.
- Deduplicate product IDs so viewing the same product again moves it to the front rather than creating duplicates.
- Ignore invalid product IDs and catalog entries that no longer exist.

## Product Detail Tracking

- Record a product as recently viewed only when a valid product detail page loads.
- Re-recording the same product should move it to the top of the list.
- Invalid product routes should not write to the store.

## Recently Viewed Page

- Add a new route such as `/recently-viewed`.
- Show recorded products using existing catalog data and product card patterns.
- Allow users to open product detail pages from this list.
- If no products have been viewed, show an empty state with a link back to the storefront.

## Header Navigation

- Add a header navigation entry for recently viewed products.
- Show the entry to all users because this is a frontend-only browsing convenience, not an authenticated feature.

## Validation

- Confirm valid product detail visits are stored.
- Confirm refresh restores recently viewed state.
- Confirm revisiting a product moves it to the top without duplicating it.
- Confirm invalid product routes do not create history entries.
- Confirm recently viewed behavior does not affect wishlist or cart flows.
