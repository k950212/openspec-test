## ADDED Requirements

### Requirement: Product catalog results must reflect active price range filters
The storefront product catalog SHALL combine price range filters with existing catalog filters and display a single result set that reflects all active criteria.

#### Scenario: Combine price range with other catalog filters
- **WHEN** the user applies a price range together with search text, category filters, or sorting
- **THEN** the storefront SHALL render the product list using the combined criteria

### Requirement: Product catalog must provide a recoverable empty state for price filtering
The storefront product catalog SHALL show an empty state when no products match the active price range and MUST provide a path to recover from that state.

#### Scenario: No products match active price range
- **WHEN** no products satisfy the current price range filters
- **THEN** the storefront SHALL show an empty state message and a clear price range action
