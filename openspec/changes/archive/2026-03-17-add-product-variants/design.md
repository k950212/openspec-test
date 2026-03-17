## Context

The current storefront data model represents each product as a flat record with a single price and no selectable options. The product detail page can add a product directly to the shared cart store, and the cart store currently keys line items only by `productId`. Supporting product variants requires coordinated updates to the catalog model, detail-page selection state, and cart identity rules so the app can distinguish the same product purchased in different configurations.

## Goals / Non-Goals

**Goals:**
- Extend the local product catalog to describe variant-enabled products and their available option values.
- Define which variant combinations are valid to purchase for each variant-enabled product.
- Let the product detail page render variant option controls from catalog data rather than hard-coded UI.
- Disable add-to-cart for variant-enabled products until a valid required selection is made.
- Treat the same product with different selected variants as separate cart line items.
- Preserve the current frontend-only architecture and localStorage cart persistence.

**Non-Goals:**
- Backend inventory management or stock validation for variants.
- Dynamic price changes per variant unless explicitly encoded in the local data model later.
- Variant selection from the storefront list view.
- Multi-step configurators, personalization text input, or bundle-building flows.

## Decisions

- Represent variants as structured option groups on the product record.
  Rationale: the existing app already resolves product detail content from `src/data/products.ts`, so adding option-group metadata there keeps the source of truth in one place.
  Alternative considered: storing variant metadata in a separate variant registry. This was rejected because it adds lookup indirection without clear benefit for the current frontend-only app.

- Represent purchasable combinations explicitly so the UI can validate selections.
  Rationale: some products may not support every cross-product combination of option values, so the app needs a concrete way to distinguish valid combinations from impossible ones.
  Alternative considered: assuming every combination of option-group values is valid. This was rejected because it cannot support restricted selections and would conflict with the updated proposal.

- Track selection on the product detail page as a map of option group to chosen value.
  Rationale: this keeps the UI flexible for products with one or more option groups and makes validation straightforward before add-to-cart.
  Alternative considered: hard-coding dedicated fields like `selectedSize` and `selectedColor`. This was rejected because it does not scale cleanly to other option types.

- Drive add-to-cart enabled state from selection completeness and combination validity.
  Rationale: disabling the action gives immediate feedback and prevents an invalid purchase attempt before the cart store is called.
  Alternative considered: leaving the button enabled and only showing an error after click. This was rejected because the updated proposal explicitly requires disabled-state gating.

- Extend cart item identity to include both `productId` and a normalized variant selection key.
  Rationale: users may intentionally add the same product in multiple configurations, and those selections must not merge into one indistinguishable line item.
  Alternative considered: keeping one cart line item per product and overwriting the latest selection. This was rejected because it would silently discard prior choices.

- Preserve backwards compatibility for products without variants.
  Rationale: the existing catalog should continue to work without requiring every product to define option groups.
  Alternative considered: migrating all products to require variants. This was rejected because it increases scope and creates unnecessary content work for simple products.

## Risks / Trade-offs

- [Variant data becomes inconsistent across products] -> Keep the data shape simple and validate required option groups plus allowed combinations before allowing add-to-cart.
- [Cart persistence breaks for existing localStorage data] -> Continue accepting legacy cart items without variant metadata and treat them as the base product selection.
- [Users do not understand why add-to-cart is disabled] -> Show clear inline guidance when required variant choices are missing or the current combination is invalid.
- [Future per-variant pricing adds complexity] -> Keep the initial model focused on selection identity and allow pricing extensions as a later change.
