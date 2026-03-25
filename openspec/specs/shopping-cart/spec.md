# shopping-cart Specification

## Purpose
Defines the storefront shopping cart experience, including cart contents, quantity updates, variant-aware line items, empty states, and coupon-driven pricing behavior.

## Requirements

### Requirement: Cart shows selected products and totals
The system SHALL provide a cart view that lists the user's selected items and summarizes the current order subtotal, with a clear empty state when the cart has no items.

#### Scenario: User opens the cart with items
- **WHEN** the user navigates to the cart after adding one or more products
- **THEN** the cart shows each selected product
- **THEN** the cart displays the current subtotal for all items

#### Scenario: User opens an empty cart
- **WHEN** the user navigates to the cart with no selected products
- **THEN** the cart shows a clear empty state
- **THEN** the empty state provides a way back to continue shopping

### Requirement: User can update cart contents
The system SHALL allow the user to adjust item quantities and remove items from the cart.

#### Scenario: User changes quantity
- **WHEN** the user increases or decreases the quantity of a cart item
- **THEN** the cart updates the item quantity immediately
- **THEN** the subtotal updates to reflect the new quantity

#### Scenario: User removes an item
- **WHEN** the user removes a product from the cart
- **THEN** the product no longer appears in the cart
- **THEN** the subtotal updates to reflect the removal

### Requirement: User can add products to the cart
The system SHALL provide an add-to-cart action that preserves variant selection for variant-enabled products.

#### Scenario: User adds two different variants of the same product
- **WHEN** the user adds the same product to the cart with two different valid variant selections
- **THEN** the cart stores those selections as distinct line items
- **THEN** each line item keeps its own quantity

#### Scenario: User adds the same variant selection again
- **WHEN** the user adds a product using a variant selection that already exists in the cart
- **THEN** the cart increases the quantity for the matching product-and-variant line item
- **THEN** the cart does not create a duplicate line item for the same selection

### Requirement: Cart displays selected variant details
The system SHALL show the selected variant details for cart items that were added with variant choices.

#### Scenario: Cart renders a variant-enabled line item
- **WHEN** the cart displays a product that includes a stored variant selection
- **THEN** the cart shows the selected option values alongside the product summary
- **THEN** the user can distinguish it from other variants of the same product

### Requirement: Shopping cart supports coupon entry and feedback
The shopping cart SHALL provide an input for coupon codes, an action to apply the coupon, and visible feedback for successful or failed validation.

#### Scenario: User sees coupon controls in the cart
- **WHEN** the user opens the shopping cart
- **THEN** the cart MUST display coupon entry controls as part of the cart experience

#### Scenario: Coupon validation fails
- **WHEN** the user attempts to apply an invalid or ineligible coupon
- **THEN** the cart MUST show feedback explaining why the coupon was not applied

### Requirement: Shopping cart summary shows shipping discount details
The shopping cart SHALL reflect an active free-shipping coupon in the order summary and clearly show the shipping discount.

#### Scenario: Free-shipping coupon is active
- **WHEN** a free-shipping coupon has been successfully applied
- **THEN** the order summary MUST show the applied coupon and a shipping discount that offsets the normal shipping fee

#### Scenario: Coupon is not active
- **WHEN** no coupon is currently applied
- **THEN** the order summary MUST continue to show the normal shipping fee without discount labeling

### Requirement: Shopping cart summary stays in sync with coupon eligibility
The shopping cart SHALL keep coupon presentation in sync with the latest cart contents and pricing totals.

#### Scenario: Cart changes after coupon application
- **WHEN** the user changes cart quantities or removes items after applying a coupon
- **THEN** the shopping cart MUST update coupon eligibility and summary totals automatically

#### Scenario: Applied coupon is removed
- **WHEN** the user removes the applied coupon from the cart
- **THEN** the shopping cart MUST remove the coupon display and revert the summary to standard pricing
