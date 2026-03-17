## ADDED Requirements

### Requirement: Cart shows selected products and totals
The system SHALL provide a cart view that lists the user's selected items and summarizes the current order subtotal.

#### Scenario: User opens the cart with items
- **WHEN** the user navigates to the cart after adding one or more products
- **THEN** the cart shows each selected product
- **THEN** the cart displays the current subtotal for all items

### Requirement: User can update cart contents
The system SHALL allow the user to adjust item quantities and remove items from the cart.

#### Scenario: User changes quantity
- **WHEN** the user increases or decreases the quantity of a cart item
- **THEN** the cart updates the item quantity immediately
- **THEN** the subtotal updates to reflect the new quantity

#### Scenario: User removes an item
- **WHEN** the user removes a product from the cart
- **THEN** the product no longer appears in the cart
- **THEN** the subtotal updates to reflect the removal
