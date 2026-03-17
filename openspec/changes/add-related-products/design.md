## Context

The app already has a client-side catalog, a dedicated product detail page, and several browsing aids such as wishlist and recently viewed products. Related products should fit into that same frontend-only architecture and reuse catalog data rather than introducing a recommendation service or backend dependency.

## Goals / Non-Goals

**Goals:**
- Show related products on valid product detail pages.
- Derive related items from the existing local catalog using simple, deterministic rules.
- Limit the related products section to a maximum of 4 items.
- Keep the current product detail page focused while adding a clear next-browse path.
- Reuse existing product data and navigation patterns.

**Non-Goals:**
- Personalized recommendations based on user behavior.
- Backend recommendation APIs, ranking services, or analytics-driven suggestions.
- Cross-sell bundles, editorial merchandising tools, or paid placements.
- Separate related-products experiences on the storefront or cart page.

## Decisions

- Derive related products from catalog metadata already available in the frontend.
  Rationale: the app already stores product category and other key product fields locally, so related items can be computed without adding new infrastructure.
  Alternative considered: hard-coding related product IDs per product. This was rejected because it adds content maintenance overhead and does not scale well as the catalog grows.

- Prioritize products from the same category and exclude the current product.
  Rationale: category is the most stable and already-available signal for lightweight related browsing in this app.
  Alternative considered: random recommendations across the whole catalog. This was rejected because the results would feel less coherent and less helpful.

- Limit the number of related products shown on the detail page.
  Rationale: the detail page should remain focused on the viewed product while still offering a few next steps, and the proposal now explicitly caps the section at 4 items.
  Alternative considered: rendering a long carousel or full catalog slice. This was rejected because it would dilute the page and add unnecessary UI complexity.

- Place related products below the main product information on the detail page.
  Rationale: users should finish reviewing the current product before being presented with alternative browsing paths.
  Alternative considered: placing related products above the primary product actions. This was rejected because it competes too directly with the main purchase experience.

## Risks / Trade-offs

- [Category alone produces weak recommendations] -> Keep the logic deterministic and simple now, while structuring it so stronger matching rules can be added later.
- [Small categories yield too few related items] -> Allow the section to show fewer items than the maximum rather than padding with low-quality matches.
- [Very small catalogs produce no related products] -> Keep the page layout stable and omit the section gracefully when there are no matches.
- [Related products distract from the main purchase action] -> Place the section after the main product content and keep the visual weight secondary.
