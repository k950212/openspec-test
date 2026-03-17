## Context

The application already stores completed orders in `localStorage` and exposes an authenticated order history page. A new order detail page should build on that existing saved-order data model rather than duplicating storage or introducing backend fetching.

## Goals / Non-Goals

**Goals:**
- Keep the order history list concise and summary-focused.
- Add a dedicated route for viewing one saved order in full detail.
- Reuse the existing saved-order shape and storage source from `localStorage`.
- Ensure only authenticated users can view order details.

**Non-Goals:**
- Backend order lookup, search, or filtering APIs.
- Editable orders, cancellations, or customer service actions.
- Printing, downloading invoices, or exporting order data.

## Decisions

- Identify order detail pages by the existing saved order ID.
  Rationale: each stored order already needs a stable identifier, and using it in the route avoids duplicating lookup keys.
  Alternative considered: using array indexes from order history. This was rejected because order ordering can change and indexes are not stable identifiers.

- Keep the order history page summary-only and move full data into the detail page.
  Rationale: users can scan their history more easily when the list focuses on key metadata rather than every item and field.
  Alternative considered: expanding each order inline within the history page. This was rejected because it makes the list denser and less navigable.

- Resolve order details directly from the locally saved order list.
  Rationale: the app is frontend-only, and the saved order snapshot already contains the full detail needed for rendering.
  Alternative considered: fetching separate detail records. This was rejected because there is no backend API and the existing snapshot is sufficient.

- Protect the order detail route using the same auth guard pattern as order history.
  Rationale: order details are also member-only data and should follow the same access control model.
  Alternative considered: leaving detail pages public once an ID is known. This was rejected because it conflicts with the authenticated-only requirement.

## Risks / Trade-offs

- [Order IDs fail to resolve from stale URLs] -> Show a graceful not-found state with a path back to order history.
- [Summary and detail views drift apart] -> Use the same saved-order structure as the source for both list and detail rendering.
- [Frontend-only details remain device-local] -> Keep the scope limited to locally saved demo data and avoid implying server-backed persistence.
