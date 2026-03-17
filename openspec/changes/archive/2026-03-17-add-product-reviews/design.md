## Overview

This change adds a frontend-only product review system on top of the existing product detail experience. Reviews are stored in localStorage through a shared Pinia store so they persist across refreshes and remain scoped to individual products.

## Review State Management

- Add a new Pinia store in `src/stores/reviews.ts`.
- Store reviews in a product-scoped structure, keyed by product ID.
- Each saved review should include:
  - a generated review ID
  - product ID
  - author display name
  - author email or identity reference if needed
  - numeric rating
  - review text
  - submitted timestamp
- Restore review data from localStorage on app startup.

## Product Detail Page Behavior

- Add a review section below the main product content.
- Show all reviews saved for the current product, ordered newest first.
- If no reviews exist, show an empty state.
- If the current user is authenticated, show a submission form with:
  - rating input
  - review text input
  - submit button
- If the user is not authenticated, show a message and login path instead of an active submission form.

## Authentication Rules

- Review reading remains public.
- Review submission requires the existing mock authentication state.
- Use the current member profile name as the review author display name when available.

## Validation

- Confirm reviews persist after refresh.
- Confirm reviews remain isolated to their product.
- Confirm unauthenticated users cannot submit reviews.
- Confirm successful review submission updates the list immediately.
- Confirm empty review states and invalid product routes behave safely.
