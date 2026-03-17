## Context

This project is a frontend-only Vue 3 + Vite application with Vue Router and Pinia. The existing ecommerce experience already persists cart state in `localStorage`, so a mock authentication system should fit into the same client-side model and avoid introducing server communication.

## Goals / Non-Goals

**Goals:**
- Provide a simple login page for a fixed email and password combination.
- Persist authentication state across page refreshes using `localStorage`.
- Allow users to log out explicitly from the UI.
- Protect the checkout route so only authenticated users can access it.

**Non-Goals:**
- Real user registration, password reset, or backend token handling.
- Secure credential storage beyond the limits of a frontend-only demo.
- Role-based permissions or profile management.

## Decisions

- Implement authentication as a dedicated client-side store with a boolean signed-in state and fixed credentials.
  Rationale: the app already uses Pinia for shared client state, and a store makes login status easy to consume across navigation and route guards.
  Alternative considered: storing auth status only in route meta or component-local state. This was rejected because it would make cross-page auth behavior harder to manage.

- Persist the authenticated session in `localStorage`.
  Rationale: the user asked for authentication state to survive refreshes, and browser storage is sufficient for a mock frontend-only flow.
  Alternative considered: keeping auth in memory only. This was rejected because it would log the user out on every refresh.

- Use a router guard on the checkout route.
  Rationale: route-level protection ensures checkout cannot be opened directly by URL when the user is unauthenticated.
  Alternative considered: guarding only inside the checkout component. This was rejected because it still allows navigation into the route before enforcing the restriction.

- Redirect unauthenticated checkout attempts to the login page, then send users to the storefront after successful sign-in.
  Rationale: the requested demo flow should be simple and predictable, with a single post-login destination.
  Alternative considered: preserving the intended checkout destination. This was rejected to match the requested implementation detail that successful login returns to `/`.

- Keep mock credentials fixed and documented in the UI.
  Rationale: this is a demo-only authentication flow, so the login page should make it easy to test without confusion.
  Alternative considered: hiding the credentials or generating them dynamically. This was rejected because it adds friction without improving the demo.

## Risks / Trade-offs

- [Frontend-only auth is not secure] -> Present it clearly as a mock login system and avoid implying real account protection.
- [Stale or malformed auth state in `localStorage`] -> Validate persisted values before hydrating the auth store and fall back to signed-out state.
- [Route protection becomes inconsistent across pages] -> Centralize access control in router meta and guards rather than duplicating checks in multiple views.
