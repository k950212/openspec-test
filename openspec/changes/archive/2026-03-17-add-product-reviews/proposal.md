## Why

The storefront currently lets users browse products, save favorites, and review product details, but it does not yet provide any product review experience. Adding frontend-only product reviews makes product pages feel more complete and gives signed-in users a way to leave lightweight feedback for items they have explored.

## What Changes

- Add a frontend-only product reviews feature on product detail pages.
- Let authenticated users submit a review with a rating and review text.
- Persist product reviews in localStorage without backend APIs.
- Show a review list on each product detail page using stored reviews for that product.
- Keep review submission restricted to signed-in users while still allowing all users to read existing reviews.

## Capabilities

### New Capabilities

- `product-reviews`: Allow authenticated users to submit reviews for products and allow visitors to read stored reviews.

### Modified Capabilities

- `product-detail-page`: Show product reviews and a signed-in review submission experience on the product detail page.
- `mock-authentication`: Gate review submission so only authenticated users can post reviews.

## Impact

- Affected code: `src/views/ProductDetailView.vue`, new review state/storage logic, and any shared UI needed for review rendering.
- APIs: No backend integration required; reviews are stored locally in the browser.
- Dependencies: No new dependencies expected.
- Systems: Product detail rendering, localStorage persistence, frontend auth gating, and member profile identity reuse for review authorship.

## Acceptance Criteria

- Product detail pages display a review section.
- Existing reviews for the current product are listed on that page.
- Authenticated users can submit a review with a rating and text.
- Ratings use a fixed scale of 1 to 5.
- Submitted reviews are stored in localStorage and remain visible after refresh.
- Review submissions are associated with the current product only.
- Submitted reviews display the signed-in user's name as the review author.
- Each authenticated user can submit only one review per product.
- Submitting another review for the same product updates the existing review instead of creating a duplicate.
- Unauthenticated users can read reviews but cannot submit them.
- When an unauthenticated user attempts to submit a review, the UI guides them to log in.

## Edge Cases

- Products with no reviews show a clear empty state.
- Invalid product detail routes should not create or load reviews.
- Reviews for one product should not appear under another product.
- Empty or invalid review submissions should be prevented in the UI.
- Reopening the same product page after adding a review should immediately show the new review.
- Ratings outside the allowed range and whitespace-only review text should be rejected in the UI.
