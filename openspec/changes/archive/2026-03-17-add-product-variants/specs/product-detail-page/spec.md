## MODIFIED Requirements

### Requirement: User can open a dedicated product detail page
The system SHALL provide a dedicated page for each catalog product so the user can review product information in a focused view, including variant choices when the product defines them.

#### Scenario: User opens a variant-enabled product detail page
- **WHEN** the user navigates to a valid product detail route for a product with variants
- **THEN** the page shows the selected product's details
- **THEN** the page shows selectors for each required variant option group
- **THEN** the page distinguishes which values are currently selected

### Requirement: User can add the viewed product to the cart
The system SHALL provide an add-to-cart action on the product detail page and require variant selection before adding a variant-enabled product.

#### Scenario: User adds a product with a complete variant selection
- **WHEN** the user activates the add-to-cart control for a variant-enabled product after choosing every required option
- **THEN** the selected product is added to the shared shopping cart
- **THEN** the cart entry includes the chosen variant details

#### Scenario: User attempts to add a product without required variant choices
- **WHEN** the user has not completed the required selections for a variant-enabled product
- **THEN** the add-to-cart control is disabled
- **THEN** the page informs the user that variant choices are still required

#### Scenario: User chooses an invalid variant combination
- **WHEN** the current combination of selected option values is not purchasable for a variant-enabled product
- **THEN** the add-to-cart control is disabled
- **THEN** the page informs the user that the current combination is unavailable
