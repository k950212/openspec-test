## Context

This project is a Vue 3 + Vite frontend with Vue Router and Pinia already configured. The current application has only a small demo experience, so a simple ecommerce site will require adding a richer page structure, shared storefront state, and a multi-step user journey across product browsing, cart review, and checkout.

## Goals / Non-Goals

**Goals:**
- Deliver a basic storefront that lets users browse a small product catalog.
- Maintain cart state in a shared client-side store so selections persist while navigating between routes.
- Provide a simple checkout form and order confirmation flow without needing backend services.
- Keep the implementation approachable by using local mock product data and client-side totals.

**Non-Goals:**
- Real payment processing, tax calculation, shipping integrations, or inventory synchronization.
- User accounts, authentication, or saved order history.
- Admin tooling or product management interfaces.

## Decisions

- Use client-side mock product data for the initial catalog.
  Rationale: the request is for a simple ecommerce website, and local data allows the full browse-to-checkout flow without introducing backend complexity.
  Alternative considered: fetching products from an API. This was rejected because it adds networking and failure states that are outside the current scope.

- Centralize cart state in Pinia rather than storing selections inside individual pages.
  Rationale: the cart must remain consistent across product listing, cart, and checkout routes. Pinia is already part of the project and is a natural fit for shared reactive state.
  Alternative considered: route-local state or query-string storage. This was rejected because it makes cross-page updates harder to reason about.

- Persist cart items in `localStorage` and hydrate the Pinia cart store on load.
  Rationale: shoppers expect the cart to survive refreshes during a simple browse-to-checkout flow, and browser storage keeps the implementation frontend-only.
  Alternative considered: keeping cart state in memory only. This was rejected because it resets the cart on refresh and interrupts checkout.

- Separate the experience into three main routes: storefront, cart, and checkout.
  Rationale: these are clear mental models for users and map directly to the requested functionality.
  Alternative considered: building everything on one page. This was rejected because it would make the UI denser and the checkout transition less clear.

- Treat checkout submission as a client-side confirmation action that clears or finalizes the cart state.
  Rationale: a simple confirmation step satisfies the requested checkout flow while staying within a frontend-only implementation.
  Alternative considered: leaving the cart untouched after submission. This was rejected because it creates ambiguity about whether the order was completed successfully.

## Risks / Trade-offs

- [Frontend-only checkout may feel less realistic] -> Mitigate by clearly presenting it as a simple confirmation flow with visible order summary details.
- [Mock data limits future realism] -> Structure product data in a reusable shape so it can be replaced by API data later.
- [Stored cart data becomes invalid or stale] -> Validate `localStorage` entries before hydrating the cart store and ignore malformed items.
- [Additional routes increase UI complexity compared to the current app] -> Keep navigation simple and consistent across all ecommerce pages.
