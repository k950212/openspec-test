## Why

The app already has a simple authenticated experience, but signed-in users do not yet have a dedicated place to view or manage their own member information. Adding a member profile page makes the logged-in state more meaningful and provides a clear destination for personal account details.

## What Changes

- Add a member profile page where authenticated users can view their name, phone number, address, and email.
- Let authenticated users edit their name, phone number, and address directly in the frontend while keeping email read-only.
- Place the entry point in the current authenticated user area where the UI now shows the signed-in status.
- Keep the experience frontend-only and persist profile data locally without backend APIs.
- Protect the profile page so only logged-in users can access it.

## Capabilities

### New Capabilities
- `member-profile-page`: Allow authenticated users to view and update their member profile details.

### Modified Capabilities
- `mock-authentication`: Add an authenticated navigation entry point to the member profile page and restrict access to signed-in users only.

## Impact

- Affected code: `src/views/*`, `src/router/index.ts`, the authenticated shell area in `src/App.vue`, and new profile state/storage logic.
- APIs: No backend integration required; member profile data is stored locally in the browser.
- Dependencies: No new dependencies expected.
- Systems: Vue Router protected routes, frontend auth state, and `localStorage` persistence for member profile data.
