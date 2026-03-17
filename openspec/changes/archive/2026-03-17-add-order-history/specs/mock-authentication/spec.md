## MODIFIED Requirements

### Requirement: User can sign in with mock credentials
The system SHALL provide a frontend-only login flow that authenticates a user with a fixed email and password combination and grants access to member-only routes.

#### Scenario: Authenticated user opens order history
- **WHEN** an authenticated user navigates to the order history page
- **THEN** the system allows access to the page

#### Scenario: Unauthenticated user attempts to open order history
- **WHEN** an unauthenticated user navigates to the order history page
- **THEN** the system redirects the user to the login page
