## Why

The app currently confirms checkout in the moment, but it does not retain any record of completed purchases for signed-in users. Adding an order history page makes the ecommerce flow feel more complete and gives authenticated users a place to review past orders even in this frontend-only demo.

## What Changes

- Store completed checkout orders in `localStorage` after a successful submission.
- Add an authenticated order history page where signed-in users can review prior orders.
- Show each saved order with order date, purchased items, quantities, and total amount.
- Protect the order history page so only authenticated users can access it.
- Keep the implementation fully frontend-only with no backend or external API integration.

## Capabilities

### New Capabilities

- `order-history`: Allow authenticated users to view a list of past orders saved from previous checkout submissions.

### Modified Capabilities

- `checkout-flow`: Persist completed orders to frontend storage when checkout succeeds.
- `mock-authentication`: Restrict order history access to authenticated users.

## Impact

- Affected code: `src/views/*`, `src/router/index.ts`, checkout submission flow, auth-aware navigation, and new shared storage/state logic for orders.
- APIs: No backend integration required; orders are stored and read from `localStorage`.
- Dependencies: No new dependencies expected.
- Systems: Vue Router route protection, `localStorage` persistence, existing checkout flow, and the frontend authentication state.

## Acceptance Criteria

- When checkout succeeds, the order is saved to localStorage.
- Authenticated users can access an order history page at `/orders`.
- The order history page lists previous orders with date, items, quantities, and total amount.
- Unauthenticated users attempting to access `/orders` are redirected to `/login`.
- Refreshing the page preserves stored order history.
- Orders remain available across sessions until localStorage is cleared.
