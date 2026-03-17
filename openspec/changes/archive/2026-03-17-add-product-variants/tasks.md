## 1. Catalog Variant Model

- [x] 1.1 Extend the local product data model to support optional variant option groups and allowed values.
- [x] 1.2 Add representative variant data to at least some catalog products while preserving compatibility for products without variants.
- [x] 1.3 Add or update product helpers so the UI can determine whether a product requires variant selection.
- [x] 1.4 Define and expose validation rules for which variant combinations are valid and purchasable.

## 2. Product Detail Variant Selection

- [x] 2.1 Render variant selectors on the product detail page for products that define option groups.
- [x] 2.2 Track the current selection for each variant option group in product detail state.
- [x] 2.3 Disable the add-to-cart control until all required variant selections are complete.
- [x] 2.4 Prevent invalid variant combinations from being selected or purchased and show clear guidance when a selection is not purchasable.
- [x] 2.5 Pass the normalized selected variant details to cart actions when the user adds the product.

## 3. Cart Variant Persistence And Display

- [x] 3.1 Extend cart item storage so product-and-variant combinations have stable identity in memory and localStorage.
- [x] 3.2 Merge quantities only when both the product and selected variant combination match.
- [x] 3.3 Update cart item rendering to display selected variant details for variant-enabled products.
- [x] 3.4 Preserve existing cart behavior for products that do not define variants.

## 4. Verification

- [x] 4.1 Verify products without variants still add to cart normally.
- [x] 4.2 Verify the add-to-cart control stays disabled until all required options are selected.
- [x] 4.3 Verify incomplete variant selections cannot be added to the cart.
- [x] 4.4 Verify invalid variant combinations cannot be selected or purchased.
- [x] 4.5 Verify two different variants of the same product appear as separate cart line items.
- [x] 4.6 Verify the same product-and-variant selection increments quantity instead of duplicating a line item.
