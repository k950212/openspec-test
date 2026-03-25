## ADDED Requirements

### Requirement: Products support multiple gallery images
The system SHALL allow a product to define a primary image and zero or more additional gallery images for richer visual presentation.

#### Scenario: Product includes additional gallery images
- **WHEN** a product is configured with a primary image and additional gallery images
- **THEN** the product data model MUST preserve the image order for gallery presentation

#### Scenario: Product has only one image
- **WHEN** a product does not define any additional gallery images
- **THEN** the system MUST continue to support the product using its single primary image without requiring extra gallery data

### Requirement: Gallery image list is normalized for display
The system SHALL build a product gallery display list that includes the primary image, avoids duplicate image entries, and can be recomputed when the active product image set changes.

#### Scenario: Primary image also appears in gallery data
- **WHEN** the same image URL is present in both the primary image field and additional gallery images
- **THEN** the display gallery MUST show that image only once

#### Scenario: Gallery display order is prepared
- **WHEN** the product gallery is prepared for the product-detail page
- **THEN** the primary image MUST appear first and additional gallery images MUST follow in configured order

#### Scenario: Variant changes the image set
- **WHEN** a product variant selection changes which images should be shown for the product
- **THEN** the display gallery MUST be recomputed from the newly active image set before rendering

### Requirement: Gallery data supports resilient browsing
The system SHALL keep product image browsing stable even when gallery images are numerous or an individual image fails to load.

#### Scenario: Product has many gallery images
- **WHEN** a product defines many gallery images
- **THEN** the gallery data MUST remain navigable in configured order without dropping images unexpectedly

#### Scenario: Gallery image fails to load
- **WHEN** an image in the product gallery cannot be loaded
- **THEN** the gallery MUST keep its structure stable and allow the shopper to continue browsing the remaining images
