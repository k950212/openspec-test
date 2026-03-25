## 1. Coupon Data And Validation Rules

- [x] 1.1 Create a small frontend coupon dataset for the free-shipping coupon code.
- [x] 1.2 Add coupon validation logic that checks code existence and the subtotal greater-than-$100 requirement.
- [x] 1.3 Define how coupon state and feedback are represented in cart state.

## 2. Cart Store Integration

- [x] 2.1 Extend the cart store to apply and remove the free-shipping coupon.
- [x] 2.2 Update cart pricing calculations so an eligible coupon removes the shipping fee.
- [x] 2.3 Persist active coupon state and revalidate it when cart data is restored.
- [x] 2.4 Revalidate the coupon automatically whenever cart contents or subtotal change.

## 3. Shopping Cart UI

- [x] 3.1 Add coupon code entry and apply action to the shopping cart page.
- [x] 3.2 Show coupon success and failure feedback in the cart experience.
- [x] 3.3 Display the applied coupon and shipping discount in the cart order summary.
- [x] 3.4 Allow users to remove an applied coupon from the cart UI.

## 4. Verification

- [x] 4.1 Verify valid and invalid coupon codes show the correct result.
- [x] 4.2 Verify the free-shipping coupon only applies when subtotal is greater than $100.
- [x] 4.3 Verify coupon eligibility is revoked correctly when subtotal drops or the cart becomes empty.
- [x] 4.4 Verify coupon state is restored and revalidated after page refresh.
