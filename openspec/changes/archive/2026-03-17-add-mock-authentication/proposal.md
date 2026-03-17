## Why

The storefront and checkout flow currently do not distinguish between authenticated and unauthenticated users. Adding a frontend-only mock login system allows the app to demonstrate protected navigation and session persistence without introducing backend complexity.

## What Changes

- Add a login page that accepts a fixed email and password for mock authentication.
- Introduce frontend-only authentication state management with persistence in `localStorage`.
- Add a logout action so users can end the mock session explicitly.
- Protect the checkout route so unauthenticated users must sign in before accessing it.
- Use Pinia to manage shared authentication state across the app.
- Use `demo@example.com` and `123456` as the mock login credential pair.
- Redirect users to `/` after a successful login.
- Keep the implementation fully client-side with no backend or API integration.

## Capabilities

### New Capabilities
- `mock-authentication`: Let users sign in with fixed credentials, stay signed in across refreshes, and sign out from the frontend.

### Modified Capabilities
- `checkout-flow`: Require an authenticated session before the user can access checkout.

## Impact

- Affected code: `src/router/index.ts`, new auth-related state under `src/stores/` or shared modules, `src/views/*`, and app-level navigation in `src/App.vue`.
- APIs: No backend integration required; authentication uses fixed client-side credentials only.
- Dependencies: No new dependencies expected.
- Systems: Pinia state management, Vue Router route guards, `localStorage` persistence, and the current frontend UI shell.
