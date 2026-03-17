## 1. Order Lookup And Routing

- [x] 1.1 Add a protected `/orders/:id` route for authenticated order detail access.
- [x] 1.2 Add order lookup logic that resolves a saved order ID from localStorage-backed order history data.
- [x] 1.3 Handle invalid or missing order IDs with a not-found state or a safe return path to order history.
- [x] 1.4 Verify refreshing `/orders/:id` still reloads the correct order from localStorage.

## 2. Order History Summary View

- [x] 2.1 Update the order history page so each order shows summary-only fields: order date, total amount, customer name, and email.
- [x] 2.2 Make each order summary row clickable and navigable to its dedicated detail page.

## 3. Order Detail Experience

- [x] 3.1 Build an order detail page that shows full order information including items, quantities, prices, address, and checkout details.
- [x] 3.2 Ensure order detail content is sourced from the existing localStorage order records.
- [x] 3.3 Add a graceful not-found state for missing or invalid order IDs.

## 4. Auth And Access Control

- [x] 4.1 Ensure only authenticated users can access `/orders/:id`.
- [x] 4.2 Redirect unauthenticated users attempting to access `/orders/:id` to `/login`.
- [x] 4.3 Revoke access if the user logs out while viewing an order detail page.

## 5. Styling And Verification

- [x] 5.1 Style the order detail page and updated summary list so they feel cohesive with the existing account/order experience.
- [x] 5.2 Verify summary rendering, order detail navigation, auth protection, refresh behavior, logout revocation, and not-found behavior through project checks and manual validation.
