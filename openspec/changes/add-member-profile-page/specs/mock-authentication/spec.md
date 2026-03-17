## MODIFIED Requirements

### Requirement: User can sign in with mock credentials
The system SHALL provide a frontend-only login flow that authenticates a user with a fixed email and password combination and grants access to member-only routes.

#### Scenario: Authenticated user accesses member profile
- **WHEN** an authenticated user selects the profile entry point from the signed-in shell area
- **THEN** the system allows access to the member profile page

#### Scenario: Unauthenticated user attempts to open member profile
- **WHEN** an unauthenticated user navigates to the member profile page
- **THEN** the system redirects the user to the login page
