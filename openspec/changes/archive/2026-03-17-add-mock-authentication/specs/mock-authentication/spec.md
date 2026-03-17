## ADDED Requirements

### Requirement: User can sign in with mock credentials
The system SHALL provide a frontend-only login flow that authenticates a user with a fixed email and password combination.

#### Scenario: User enters valid mock credentials
- **WHEN** the user submits the login form with the configured email and password
- **THEN** the system marks the user as authenticated
- **THEN** the authenticated state is available to the rest of the app

#### Scenario: User enters invalid mock credentials
- **WHEN** the user submits the login form with incorrect credentials
- **THEN** the system keeps the user signed out
- **THEN** the UI informs the user that the credentials are invalid

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
