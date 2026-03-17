## 1. Review State

- [x] 1.1 Add a Pinia reviews store for product-scoped frontend review data.
- [x] 1.2 Persist reviews to `localStorage` and restore them on refresh.
- [x] 1.3 Define a stable saved-review shape with product ID, author name, rating, text, and timestamp.
- [x] 1.4 Ensure each authenticated user can have only one saved review per product.

## 2. Product Detail Reviews

- [x] 2.1 Add a review section to the product detail page.
- [x] 2.2 Show stored reviews for the current product in newest-first order.
- [x] 2.3 Add a clear empty state for products that do not have reviews yet.
- [x] 2.4 Show the signed-in user's name as the review author for submitted reviews.

## 3. Review Submission

- [x] 3.1 Add a signed-in review submission form with a fixed 1-to-5 rating input and review text input.
- [x] 3.2 Prevent empty, whitespace-only, or out-of-range review submissions in the UI.
- [x] 3.3 Restrict review submission to authenticated users and guide unauthenticated users to log in.
- [x] 3.4 Update the existing review instead of creating a duplicate when the same authenticated user submits again for the same product.
- [x] 3.5 Update the review list immediately after a successful submission.

## 4. Verification

- [x] 4.1 Verify review persistence across refreshes.
- [x] 4.2 Verify reviews stay scoped to the correct product only.
- [x] 4.3 Verify one-review-per-user-per-product behavior and review updates on repeat submission.
- [x] 4.4 Verify authenticated submission, unauthenticated blocking, empty states, fixed 1-to-5 rating validation, whitespace rejection, and invalid route handling through project checks and manual validation.
