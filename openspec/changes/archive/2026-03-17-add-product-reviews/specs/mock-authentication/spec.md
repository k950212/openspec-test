## MODIFIED Requirements

### Requirement: User can sign in with mock credentials
The system SHALL provide a frontend-only login flow that grants access to member-only actions such as product review submission.

#### Scenario: Authenticated user submits a product review
- **WHEN** an authenticated user is on a product detail page
- **THEN** the system allows the user to submit a review

#### Scenario: Unauthenticated user attempts to submit a product review
- **WHEN** an unauthenticated user tries to submit a product review
- **THEN** the system blocks the submission
- **THEN** the user is prompted or redirected to log in
