# price-range-filter Specification

## Purpose
TBD - created by archiving change add-price-range-filter. Update Purpose after archive.
## Requirements
### Requirement: User can filter products by price range
The system SHALL allow users to limit the storefront product list by entering a minimum price, a maximum price, or both.

#### Scenario: Apply minimum price only
- **WHEN** the user enters only a minimum price
- **THEN** the storefront SHALL show only products priced greater than or equal to that minimum

#### Scenario: Apply maximum price only
- **WHEN** the user enters only a maximum price
- **THEN** the storefront SHALL show only products priced less than or equal to that maximum

#### Scenario: Apply both minimum and maximum price
- **WHEN** the user enters both a minimum price and a maximum price with a valid range
- **THEN** the storefront SHALL show only products whose price falls within the inclusive range

### Requirement: Invalid price range must be clearly handled
The system SHALL detect when the entered minimum price is greater than the maximum price and MUST show validation feedback instead of treating the range as a valid filter.

#### Scenario: Minimum price is greater than maximum price
- **WHEN** the user enters a minimum price greater than the maximum price
- **THEN** the storefront SHALL show a validation message indicating the range is invalid

### Requirement: User can clear price range filters
The system SHALL provide a way to clear the currently entered price range and restore the full unfiltered price range state.

#### Scenario: Clear active price range
- **WHEN** the user activates the clear price range action
- **THEN** the storefront SHALL remove both minimum and maximum price filters

