## MODIFIED Requirements

### Requirement: Cart shows selected products and totals
The system SHALL provide a cart view that lists the user's selected items and summarizes the current order subtotal, with a clear empty state when the cart has no items.

#### Scenario: User opens the cart with items
- **WHEN** the user navigates to the cart after adding one or more products
- **THEN** the cart shows each selected product
- **THEN** the cart displays the current subtotal for all items

#### Scenario: User opens an empty cart
- **WHEN** the user navigates to the cart with no selected products
- **THEN** the cart shows a clear empty state
- **THEN** the empty state provides a way back to continue shopping
