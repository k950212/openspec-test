## MODIFIED Requirements

### Requirement: Authenticated user can view saved order history
The system SHALL provide an order history page where authenticated users can review previously completed orders using summary-only information.

#### Scenario: Authenticated user opens order history
- **WHEN** an authenticated user navigates to the order history page
- **THEN** the system shows a list of saved orders
- **THEN** each listed order includes the order date, total amount, customer name, and email
- **THEN** each listed order provides a path to open its order detail page
