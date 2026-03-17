## ADDED Requirements

### Requirement: User can open a dedicated product detail page
The system SHALL provide a dedicated page for each catalog product so the user can review product information in a focused view.

#### Scenario: User opens a product detail page
- **WHEN** the user navigates to a valid product detail route
- **THEN** the system shows the selected product's details
- **THEN** the page includes at least the product name, price, and description

### Requirement: User can add the viewed product to the cart
The system SHALL provide an add-to-cart action on the product detail page.

#### Scenario: User adds a product from the detail page
- **WHEN** the user activates the add-to-cart control on a product detail page
- **THEN** the selected product is added to the shared shopping cart
- **THEN** the cart state updates immediately

### Requirement: Invalid product detail routes are handled gracefully
The system SHALL provide a recoverable state when the requested product detail page cannot be resolved.

#### Scenario: User opens an unknown product route
- **WHEN** the user navigates to a product detail route for a product that does not exist
- **THEN** the system informs the user that the product could not be found
- **THEN** the user is given a path back to continue shopping
