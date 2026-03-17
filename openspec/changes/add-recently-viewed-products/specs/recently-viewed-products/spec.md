## ADDED Requirements

### Requirement: User can review recently viewed products
The system SHALL provide a frontend-only recently viewed products list based on valid product detail page visits.

#### Scenario: User opens a product detail page
- **WHEN** the user opens a valid product detail page
- **THEN** the system records that product in the recently viewed list
- **THEN** the most recently viewed product appears first

#### Scenario: User revisits the same product
- **WHEN** the user opens a product detail page that is already in recently viewed history
- **THEN** the system moves that product to the top of the list
- **THEN** the history does not contain a duplicate entry for that product

### Requirement: User can open a dedicated recently viewed page
The system SHALL provide a page for reviewing recently viewed products.

#### Scenario: User opens recently viewed page
- **WHEN** the user navigates to the recently viewed products page
- **THEN** the page lists recently viewed products
- **THEN** each listed product provides a way to open its detail page

#### Scenario: Recently viewed list is empty
- **WHEN** the user opens the recently viewed page with no viewed products
- **THEN** the page shows a clear empty state
- **THEN** the user is given a way back to the storefront
