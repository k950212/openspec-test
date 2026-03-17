## Context

The app already has a client-side product catalog, shared cart state in Pinia, and route-based navigation for storefront, cart, and checkout. A product detail page should fit into that same frontend-only architecture and reuse existing product data instead of introducing a new data source.

## Goals / Non-Goals

**Goals:**
- Introduce a dedicated route for viewing one product at a time.
- Reuse the existing product catalog as the source of truth for product details.
- Let users add the viewed product to the cart from the detail page.
- Make it easy to move between the storefront and a product detail page.

**Non-Goals:**
- Backend product fetching or server-rendered product pages.
- Product reviews, recommendations, or related-item personalization.
- Variant selection, inventory tracking, or multi-image galleries.

## Decisions

- Use a dynamic route parameter for product detail pages.
  Rationale: each product should have a stable, bookmarkable page while keeping routing simple within the existing Vue Router setup.
  Alternative considered: using modal overlays from the storefront. This was rejected because it is less direct for navigation and sharing URLs.

- Resolve product details from the existing local catalog by product identifier.
  Rationale: the catalog already holds the content needed for the initial ecommerce flow, so the detail page can stay consistent with the storefront without new APIs.
  Alternative considered: creating a separate detail-only data source. This was rejected because it duplicates product information and increases maintenance.

- Reuse the shared Pinia cart store for add-to-cart actions on the detail page.
  Rationale: users should see the same cart behavior regardless of whether they add from the listing or the detail page.
  Alternative considered: page-local add-to-cart state. This was rejected because it would diverge from the current cart architecture.

- Provide an explicit empty/error state for unknown product routes.
  Rationale: manual URL edits or stale links should fail gracefully and still give the user a path back to the storefront.
  Alternative considered: redirecting silently to the storefront. This was rejected because it hides the reason the requested page could not be shown.

## Risks / Trade-offs

- [Route params and catalog IDs drift apart] -> Use a single product identifier strategy and validate route lookup results before rendering.
- [The detail page duplicates some storefront content] -> Keep shared product fields sourced from the same catalog model and only add layout-specific presentation.
- [Invalid product URLs create a dead-end] -> Show a not-found state with a clear link back to the storefront.
