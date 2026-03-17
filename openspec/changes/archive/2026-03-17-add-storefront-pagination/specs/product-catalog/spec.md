## MODIFIED Requirements

### Requirement: Storefront displays a product catalog
The system SHALL present a product listing view that shows only the products for the active storefront page after applying the current search, category filter, and sort state.

#### Scenario: User visits the storefront
- **WHEN** the user navigates to the storefront page
- **THEN** the page shows a list of products
- **THEN** the visible products reflect the active search query, category selection, price sort, and current page
- **THEN** each visible product still shows at least a name and price
