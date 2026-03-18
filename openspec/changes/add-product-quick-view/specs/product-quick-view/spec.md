## ADDED Requirements

### Requirement: Shopper can open a quick view from the product catalog
The storefront SHALL provide a quick view entry point on catalog product cards so shoppers can preview product information without leaving the catalog page.

#### Scenario: Shopper opens quick view from a product card
- **WHEN** the shopper activates the quick view control on a catalog product card
- **THEN** the storefront SHALL open a quick view dialog for that product within the catalog page

### Requirement: Quick view shows essential product information and actions
The storefront SHALL display essential product information inside the quick view dialog and MUST provide actions that let the shopper continue toward purchase or a full product page.

#### Scenario: Quick view displays core product details
- **WHEN** the quick view dialog opens
- **THEN** the dialog SHALL show the product image, name, price, category, and description
- **THEN** the dialog SHALL provide a way to open the full product detail page

#### Scenario: Quick view supports purchase-oriented action
- **WHEN** the shopper uses the primary action inside quick view
- **THEN** the storefront SHALL reuse the existing catalog purchase flow for that product
- **THEN** the shopper SHALL either add the product to cart directly or be directed to the product detail page when product options must be selected

### Requirement: Quick view remains recoverable and dismissible
The storefront SHALL let shoppers close the quick view dialog without losing their current catalog browsing context.

#### Scenario: Shopper closes quick view
- **WHEN** the shopper dismisses the quick view dialog
- **THEN** the dialog SHALL close
- **THEN** the storefront SHALL keep the current catalog search, filter, sort, and pagination state unchanged
