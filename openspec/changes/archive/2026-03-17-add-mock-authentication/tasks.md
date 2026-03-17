## 1. Authentication State

- [x] 1.1 Add a frontend auth store that validates a fixed email/password combination.
- [x] 1.2 Persist authenticated state to `localStorage` and hydrate it safely on app load.

## 2. Login And Logout Experience

- [x] 2.1 Add a login page with fields for email and password plus clear demo credential guidance.
- [x] 2.2 Add logout controls and authenticated navigation state in the shared app shell.

## 3. Checkout Route Protection

- [x] 3.1 Protect the checkout route with router metadata and a navigation guard.
- [x] 3.2 Redirect unauthenticated users to the login page and send successful sign-ins to `/`.

## 4. Styling And Verification

- [x] 4.1 Style the login flow so it feels consistent with the existing storefront UI.
- [x] 4.2 Verify login, logout, auth persistence, and checkout protection through project checks and manual validation.
