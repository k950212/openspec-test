# wishlist Specification

## Purpose
Defines the frontend-only wishlist behavior for favoriting products and reviewing saved favorites later.

## Requirements

### Requirement: User can favorite products for later
The system SHALL provide a frontend-only wishlist that lets users favorite products and return to them later.

#### Scenario: User favorites a product
- **WHEN** the user activates a wishlist control for a product
- **THEN** the system stores that product in the wishlist
- **THEN** the product's wishlist icon reflects the favorited state

#### Scenario: User unfavorites a product
- **WHEN** the user activates the wishlist control for an already-favorited product
- **THEN** the system removes that product from the wishlist
- **THEN** the product's wishlist icon reflects the non-favorited state

### Requirement: User can review saved wishlist products
The system SHALL provide a dedicated wishlist page showing saved products.

#### Scenario: User opens wishlist page
- **WHEN** the user navigates to the wishlist page
- **THEN** the page lists favorited products
- **THEN** each listed product provides a way to open its detail page

#### Scenario: Wishlist is empty
- **WHEN** the user opens the wishlist page with no favorited products
- **THEN** the page shows a clear empty state
- **THEN** the user is given a way back to the storefront

### Requirement: Wishlist persists across refreshes
The system SHALL restore saved wishlist state from localStorage.

#### Scenario: User refreshes after favoriting products
- **WHEN** the user has favorited one or more products and reloads the app
- **THEN** the system restores the saved wishlist state
- **THEN** wishlist icons and the wishlist page reflect the restored data
