## MODIFIED Requirements

### Requirement: User can search products on the storefront
The system SHALL keep storefront search results compatible with pagination.

#### Scenario: Search changes the result set
- **WHEN** the user changes the storefront search query
- **THEN** the storefront recalculates paginated results from the filtered products
- **THEN** the active page resets to the first page of the new result set

### Requirement: User can filter and sort products with pagination
The system SHALL keep category filtering and price sorting compatible with pagination.

#### Scenario: Category filter changes the result set
- **WHEN** the user selects a different category filter
- **THEN** the storefront recalculates paginated results from the filtered products
- **THEN** the active page resets to the first page of the new result set

#### Scenario: Sort changes product order
- **WHEN** the user changes the price sort option
- **THEN** the storefront reorders the filtered products before pagination is applied
- **THEN** the active page remains valid after the new ordering is applied
