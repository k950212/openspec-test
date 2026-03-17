## MODIFIED Requirements

### Requirement: Checkout shows order summary and customer form
The system SHALL provide a checkout page that displays the current cart summary alongside a basic customer information form, but only for authenticated users.

#### Scenario: Authenticated user enters checkout with items in cart
- **WHEN** an authenticated user navigates to the checkout page with at least one cart item
- **THEN** the page shows an order summary based on the current cart
- **THEN** the page provides fields for basic checkout information

#### Scenario: Unauthenticated user attempts to open checkout
- **WHEN** an unauthenticated user navigates to the checkout page
- **THEN** the system redirects the user to the login page
- **THEN** a successful sign-in returns the user to the storefront
