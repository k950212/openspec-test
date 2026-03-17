## ADDED Requirements

### Requirement: Checkout shows order summary and customer form
The system SHALL provide a checkout page that displays the current cart summary alongside a basic customer information form.

#### Scenario: User enters checkout with items in cart
- **WHEN** the user navigates to the checkout page with at least one cart item
- **THEN** the page shows an order summary based on the current cart
- **THEN** the page provides fields for basic checkout information

### Requirement: User can submit a simple checkout flow
The system SHALL allow the user to submit checkout details and receive a confirmation that the order was placed.

#### Scenario: User submits valid checkout details
- **WHEN** the user submits the checkout form with required information
- **THEN** the system shows an order confirmation state
- **THEN** the checkout result reflects the cart contents that were being purchased

### Requirement: Checkout cannot proceed with an empty cart
The system SHALL prevent a user from completing checkout when there are no items selected.

#### Scenario: User opens checkout with no items
- **WHEN** the user navigates to the checkout page with an empty cart
- **THEN** the system informs the user that checkout requires at least one item
- **THEN** the user is given a path back to continue shopping
