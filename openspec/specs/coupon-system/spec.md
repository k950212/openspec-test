# coupon-system Specification

## Purpose
TBD - created by archiving change add-coupon-system. Update Purpose after archive.
## Requirements
### Requirement: Users can apply coupon codes in the cart
The system SHALL allow users to enter a coupon code in the shopping cart and validate it against a frontend coupon dataset.

#### Scenario: Valid coupon code is entered
- **WHEN** the user enters a coupon code that exists in the frontend coupon dataset
- **THEN** the system MUST evaluate whether the cart meets the coupon eligibility rules before applying it

#### Scenario: Invalid coupon code is entered
- **WHEN** the user enters a coupon code that does not exist in the frontend coupon dataset
- **THEN** the system MUST reject the coupon and show invalid coupon feedback

### Requirement: Free-shipping coupon enforces a minimum subtotal
The system SHALL support a free-shipping coupon that only applies when the cart subtotal is greater than $100.

#### Scenario: Cart subtotal exceeds the threshold
- **WHEN** the user applies the free-shipping coupon and the cart subtotal is greater than $100
- **THEN** the system MUST remove the shipping fee from the order calculation

#### Scenario: Cart subtotal does not exceed the threshold
- **WHEN** the user applies the free-shipping coupon and the cart subtotal is $100 or less
- **THEN** the system MUST refuse to apply the coupon and show feedback explaining the minimum subtotal requirement

### Requirement: Applied coupons can be removed and revalidated
The system SHALL allow users to remove an applied coupon and MUST revalidate coupon eligibility when cart contents change.

#### Scenario: User removes an applied coupon
- **WHEN** the user removes an already applied coupon
- **THEN** the system MUST clear the coupon benefit and restore normal shipping calculation

#### Scenario: Cart subtotal drops after coupon was applied
- **WHEN** the cart contents change and the subtotal no longer satisfies the applied coupon's minimum requirement
- **THEN** the system MUST revoke the coupon benefit and update coupon feedback accordingly

#### Scenario: Cart becomes empty while coupon is applied
- **WHEN** the cart becomes empty after a coupon was previously applied
- **THEN** the system MUST clear the applied coupon state

### Requirement: Coupon state survives refresh with revalidation
The system SHALL persist the active coupon state across page refreshes and revalidate it when the cart is loaded.

#### Scenario: User refreshes while a coupon is active
- **WHEN** the page reloads and a coupon was previously stored
- **THEN** the system MUST restore the coupon input state and revalidate whether the coupon still qualifies against the current cart subtotal

