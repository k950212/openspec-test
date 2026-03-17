## MODIFIED Requirements

### Requirement: User can open a dedicated product detail page
The system SHALL provide a dedicated page for each catalog product so the user can review product information in a focused view and continue browsing through related product suggestions.

#### Scenario: User opens a product detail page
- **WHEN** the user navigates to a valid product detail route
- **THEN** the system shows the selected product's details
- **THEN** the page includes at least the product name, price, and description
- **THEN** the page includes a related products section below the main product information when related products are available
