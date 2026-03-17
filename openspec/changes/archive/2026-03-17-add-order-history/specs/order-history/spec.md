## ADDED Requirements

### Requirement: Authenticated user can view saved order history
The system SHALL provide an order history page where authenticated users can review previously completed orders.

#### Scenario: Authenticated user opens order history
- **WHEN** an authenticated user navigates to the order history page
- **THEN** the system shows a list of saved orders
- **THEN** each listed order includes at least the order date and total amount

### Requirement: Order history shows purchased items and quantities
The system SHALL show the purchased items for each saved order.

#### Scenario: User reviews a past order
- **WHEN** the order history page displays a saved order
- **THEN** the order includes the purchased item names
- **THEN** the order includes the quantity for each purchased item

### Requirement: Order history handles no orders gracefully
The system SHALL provide a clear empty state when an authenticated user has no saved orders.

#### Scenario: Authenticated user has no saved orders
- **WHEN** an authenticated user opens order history without any stored orders
- **THEN** the system informs the user that no past orders are available
- **THEN** the user is given a path back to continue shopping
