## Why

The storefront currently allows users to browse products and add them to the cart, but it does not yet support promotional incentives that encourage larger purchases. Introducing a simple free-shipping coupon provides a realistic ecommerce promotion while remaining easy to implement in a frontend-only environment.

This feature encourages users to reach a minimum purchase threshold by offering free shipping when the order subtotal exceeds $100.

## What Changes

- Add support for applying a coupon code in the shopping cart.
- Introduce a free-shipping coupon that removes the shipping fee when the order subtotal exceeds $100.
- Validate coupon codes against a small frontend coupon dataset.
- Apply the free-shipping benefit only when the cart subtotal is greater than $100.
- Display coupon feedback messages when the code is invalid or the cart does not meet the minimum subtotal requirement.
- Show the applied coupon and the shipping discount in the cart order summary.
- Allow users to remove an applied coupon.
- Automatically revalidate the coupon when cart contents change.

## Capabilities

### New Capabilities

- `coupon-system`: Allow users to enter and apply coupon codes that modify cart pricing behavior.

### Modified Capabilities

- `shopping-cart`:  
  Support entering coupon codes, validating eligibility, and applying shipping discounts to the order summary.

## Impact

- Affected code: `src/stores/cart.ts`, `src/views/CartView.vue`, and any shared order summary helpers used by the cart.
- APIs: No backend integration required; coupon validation uses a small local coupon dataset.
- Dependencies: No new dependencies expected.
- Systems: Cart pricing calculation, coupon validation logic, and cart summary presentation.

## Acceptance Criteria

- Users can enter a coupon code in the shopping cart.
- A valid coupon removes the shipping fee when the cart subtotal is greater than $100.
- If the subtotal is $100 or less, the coupon cannot be applied.
- The cart summary clearly shows the shipping discount when the coupon is active.
- Users can remove an applied coupon.
- Coupon validity is rechecked whenever cart contents change.

## Edge Cases

- The user enters an invalid coupon code.
- The coupon is applied and then the cart subtotal drops below $100.
- The cart becomes empty while a coupon is applied.
- The user refreshes the page while a coupon is active.
