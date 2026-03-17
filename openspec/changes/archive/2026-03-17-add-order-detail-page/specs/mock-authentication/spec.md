## MODIFIED Requirements

### Requirement: User can sign in with mock credentials
The system SHALL provide a frontend-only login flow that authenticates a user with a fixed email and password combination and grants access to member-only routes.

#### Scenario: Authenticated user opens order detail
- **WHEN** an authenticated user navigates to a valid order detail page
- **THEN** the system allows access to the page

#### Scenario: Unauthenticated user attempts to open order detail
- **WHEN** an unauthenticated user navigates to an order detail page
- **THEN** the system redirects the user to the login page
