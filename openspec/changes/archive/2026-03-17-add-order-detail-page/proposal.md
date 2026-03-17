## Why

The order history page currently serves as the main place to review saved orders, but it becomes harder to scan when it includes both summary and full detail information in one list. Splitting order summaries and full order details into separate pages makes the history view easier to browse while still giving authenticated users access to complete order information.

## What Changes

- Keep the order history page focused on summary data only: order date, amount, customer name, and email.
- Make each order summary clickable so users can open a dedicated order detail page.
- Add an authenticated order detail page that shows the full saved order content, including purchased items, quantities, prices, address, and other checkout fields.
- Continue reading order data from `localStorage` within the existing frontend-only architecture.
- Protect the order detail page so only logged-in users can access it.

## Capabilities

### New Capabilities

- `order-detail-page`: Let authenticated users open a dedicated page for one saved order and review its full details.

### Modified Capabilities

- `order-history`: Show summary-only order rows and link each row to its detail page.
- `mock-authentication`: Restrict access to order detail pages to authenticated users.

## Impact

- Affected code: `src/views/*`, `src/router/index.ts`, order storage lookup logic, and authenticated navigation behavior.
- APIs: No backend integration required; order summaries and details continue to come from `localStorage`.
- Dependencies: No new dependencies expected.
- Systems: Vue Router protected routes, existing order history storage, and the frontend-only authentication model.

## Acceptance Criteria

- The order history page shows summary fields only: order date, total amount, customer name, and email.
- Each order summary row is clickable.
- Clicking a row navigates to `/orders/:id`.
- The order detail page displays full order information including items, quantities, prices, address, and checkout details.
- Only authenticated users can access the order detail page.
- Unauthenticated users attempting to access `/orders/:id` are redirected to `/login`.
- Order detail data is read from the existing localStorage order records.

## Edge Cases

- Navigating to `/orders/:id` with an invalid order ID shows a not-found state or redirects to the order history page.
- Refreshing the order detail page still loads the order correctly from localStorage.
- If the user logs out while viewing an order detail page, access should be revoked.
