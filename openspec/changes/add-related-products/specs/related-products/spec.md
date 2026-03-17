## ADDED Requirements

### Requirement: User can browse related products from a product detail page
The system SHALL suggest related products while the user is viewing a valid product detail page.

#### Scenario: User views a product with related matches
- **WHEN** the user opens a valid product detail page and related products can be derived from the catalog
- **THEN** the page shows a related products section
- **THEN** the section lists one or more products other than the currently viewed product
- **THEN** the section shows no more than 4 related products

### Requirement: Related products are derived from catalog relationships
The system SHALL derive related products using deterministic frontend catalog rules.

#### Scenario: Related products share catalog context
- **WHEN** the system computes related products for a viewed product
- **THEN** the currently viewed product is excluded from the results
- **THEN** related products are selected using catalog metadata such as shared category

#### Scenario: Too few related products exist
- **WHEN** the catalog contains fewer related products than the display limit
- **THEN** the system shows only the available related products
- **THEN** the product detail page remains usable without layout failure

#### Scenario: No related products exist
- **WHEN** the catalog does not contain any related products for the viewed product
- **THEN** the product detail page remains intact
- **THEN** the system does not fail while rendering the page

### Requirement: User can open a related product from the detail page
The system SHALL let the user navigate from a related product suggestion to that product's detail page.

#### Scenario: User selects a related product
- **WHEN** the user activates a related product entry from the related products section
- **THEN** the system navigates to the selected product's detail page
- **THEN** the newly opened page uses that selected product as the current detail context
