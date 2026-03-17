## ADDED Requirements

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
