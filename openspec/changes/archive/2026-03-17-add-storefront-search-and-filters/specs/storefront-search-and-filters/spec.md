## ADDED Requirements

### Requirement: User can search products on the storefront
The system SHALL provide a storefront search control that filters visible products by keyword.

#### Scenario: User searches by keyword
- **WHEN** the user enters a search query on the storefront
- **THEN** the product list updates to show only products matching the query
- **THEN** matching considers at least visible product text such as name or description

### Requirement: User can filter products by category
The system SHALL provide category filter controls on the storefront.

#### Scenario: User selects a category
- **WHEN** the user selects a product category filter
- **THEN** the storefront shows only products in that category

### Requirement: Storefront handles no matching products clearly
The system SHALL provide clear feedback when the active search and filter state matches no products.

#### Scenario: No products match
- **WHEN** the active search query and category filter produce no results
- **THEN** the storefront informs the user that no products match the current filters
- **THEN** the user is given a clear way to adjust or clear the filters
