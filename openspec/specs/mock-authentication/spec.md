# mock-authentication Specification

## Purpose
Defines the frontend-only authentication model, including mock sign-in, persistence, logout, and access control for member-only pages and actions.

## Requirements

### Requirement: User can sign in with mock credentials
The system SHALL provide a frontend-only login flow that authenticates a user with a fixed email and password combination and grants access to member-only routes and actions.

#### Scenario: User enters valid mock credentials
- **WHEN** the user submits the login form with the configured email and password
- **THEN** the system marks the user as authenticated
- **THEN** the authenticated state is available to the rest of the app

#### Scenario: User enters invalid mock credentials
- **WHEN** the user submits the login form with incorrect credentials
- **THEN** the system keeps the user signed out
- **THEN** the UI informs the user that the credentials are invalid

#### Scenario: Authenticated user accesses member profile
- **WHEN** an authenticated user selects the profile entry point from the signed-in shell area
- **THEN** the system allows access to the member profile page

#### Scenario: Unauthenticated user attempts to open member profile
- **WHEN** an unauthenticated user navigates to the member profile page
- **THEN** the system redirects the user to the login page

#### Scenario: Authenticated user opens order history
- **WHEN** an authenticated user navigates to the order history page
- **THEN** the system allows access to the page

#### Scenario: Unauthenticated user attempts to open order history
- **WHEN** an unauthenticated user navigates to the order history page
- **THEN** the system redirects the user to the login page

#### Scenario: Authenticated user opens order detail
- **WHEN** an authenticated user navigates to a valid order detail page
- **THEN** the system allows access to the page

#### Scenario: Unauthenticated user attempts to open order detail
- **WHEN** an unauthenticated user navigates to an order detail page
- **THEN** the system redirects the user to the login page

#### Scenario: Authenticated user submits a product review
- **WHEN** an authenticated user is on a product detail page
- **THEN** the system allows the user to submit a review

#### Scenario: Unauthenticated user attempts to submit a product review
- **WHEN** an unauthenticated user tries to submit a product review
- **THEN** the system blocks the submission
- **THEN** the user is prompted or redirected to log in

### Requirement: Authentication state persists across refreshes
The system SHALL restore the mock authenticated session from `localStorage` when possible.

#### Scenario: User refreshes after signing in
- **WHEN** the user has an authenticated session and reloads the app
- **THEN** the system restores the authenticated state from persisted frontend storage
- **THEN** the user remains signed in

### Requirement: User can sign out
The system SHALL provide a logout action that clears the mock authenticated session.

#### Scenario: User signs out
- **WHEN** the user activates the logout control
- **THEN** the system clears the authenticated state
- **THEN** persisted auth session data is removed or reset
