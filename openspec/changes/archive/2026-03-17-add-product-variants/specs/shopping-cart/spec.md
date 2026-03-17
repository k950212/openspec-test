## MODIFIED Requirements

### Requirement: User can add products to the cart
The system SHALL provide an add-to-cart action that preserves variant selection for variant-enabled products.

#### Scenario: User adds two different variants of the same product
- **WHEN** the user adds the same product to the cart with two different valid variant selections
- **THEN** the cart stores those selections as distinct line items
- **THEN** each line item keeps its own quantity

#### Scenario: User adds the same variant selection again
- **WHEN** the user adds a product using a variant selection that already exists in the cart
- **THEN** the cart increases the quantity for the matching product-and-variant line item
- **THEN** the cart does not create a duplicate line item for the same selection

### Requirement: Cart displays selected variant details
The system SHALL show the selected variant details for cart items that were added with variant choices.

#### Scenario: Cart renders a variant-enabled line item
- **WHEN** the cart displays a product that includes a stored variant selection
- **THEN** the cart shows the selected option values alongside the product summary
- **THEN** the user can distinguish it from other variants of the same product
