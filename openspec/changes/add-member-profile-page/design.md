## Context

The application already has frontend-only authentication and local persistence for cart, auth state, and orders. A member profile page should follow the same architecture by storing profile information locally and exposing it through a protected route tied to the authenticated shell.

## Goals / Non-Goals

**Goals:**
- Provide a dedicated profile page for authenticated users.
- Show existing member profile fields clearly: name, phone, address, and email.
- Allow users to edit and save those profile fields from the frontend.
- Add a profile entry point in the current signed-in UI area.

**Non-Goals:**
- Backend account sync, password management, or server-side validation.
- Multi-user switching or separate profiles per device user.
- Avatar uploads, preferences, or notification settings.

## Decisions

- Store member profile data in a dedicated frontend store with `localStorage` persistence.
  Rationale: the app already uses Pinia plus browser storage for shared state, and profile data should survive refreshes in the same way.
  Alternative considered: keeping profile fields only inside the page component. This was rejected because the data should remain available across navigation and reloads.

- Protect the member profile route using the existing authenticated route guard pattern.
  Rationale: profile information is member-only and should follow the same access control approach as checkout and order pages.
  Alternative considered: leaving the page publicly accessible. This was rejected because the request explicitly scopes it to authenticated users.

- Place the profile entry in the current signed-in shell area where users already look for account actions.
  Rationale: this keeps the profile flow discoverable without introducing a second account navigation region.
  Alternative considered: adding profile access only in the main nav. This was rejected because the request specifically points to the signed-in status area.

- Allow editing of all requested profile fields from one page.
  Rationale: users should be able to review and update personal information in a single place without extra steps.
  Alternative considered: splitting view and edit modes across separate pages. This was rejected because it adds unnecessary complexity for a frontend-only account page.

## Risks / Trade-offs

- [Profile data is device-local only] -> Keep the scope explicit and avoid implying cross-device account sync.
- [Malformed stored profile data] -> Validate persisted values before hydrating the profile store and fall back to safe defaults.
- [Profile email can diverge from login email] -> Treat the editable profile email as display/contact data for this demo rather than a real authentication identity.
