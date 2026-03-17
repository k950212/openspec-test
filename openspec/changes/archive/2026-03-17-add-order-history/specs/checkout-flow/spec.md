## MODIFIED Requirements

### Requirement: User can submit a simple checkout flow
The system SHALL allow the user to submit checkout details, receive a confirmation that the order was placed, and persist the completed order for later review.

#### Scenario: User submits valid checkout details
- **WHEN** the user submits the checkout form with required information
- **THEN** the system shows an order confirmation state
- **THEN** the checkout result reflects the cart contents that were being purchased
- **THEN** the completed order is saved to frontend storage for order history
