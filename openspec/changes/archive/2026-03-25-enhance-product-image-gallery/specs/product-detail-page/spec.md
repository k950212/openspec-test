## ADDED Requirements

### Requirement: Product detail page displays an interactive image gallery
The product detail page SHALL display a main product image area and allow the shopper to switch the displayed image when multiple gallery images are available.

#### Scenario: Shopper selects a different thumbnail
- **WHEN** a shopper clicks or taps a product thumbnail in the gallery
- **THEN** the main product image MUST update to the selected gallery image

#### Scenario: Product detail page loads with gallery images
- **WHEN** a shopper opens a product detail page for a product with multiple images
- **THEN** the page MUST show the first available gallery image as the default main image

#### Scenario: Desktop shopper hovers a thumbnail
- **WHEN** a shopper uses a pointer device and hovers a product thumbnail
- **THEN** the product detail page MUST support previewing that thumbnail as the active main image

### Requirement: Product detail page supports enlarged image preview
The product detail page SHALL let the shopper open an enlarged image preview modal from the main product image.

#### Scenario: Shopper opens image preview modal
- **WHEN** a shopper activates the main product image preview affordance
- **THEN** the page MUST open an enlarged image preview modal for the currently selected image

#### Scenario: Preview modal opens on small screens
- **WHEN** a shopper opens the image preview modal on a small-screen layout
- **THEN** the modal MUST remain usable without breaking the product detail page layout

### Requirement: Product detail page supports mobile-friendly image browsing
The product detail page SHALL support swipe-based image browsing on mobile-sized layouts when multiple images are available.

#### Scenario: Mobile shopper swipes between images
- **WHEN** a shopper uses a mobile-sized layout and swipes across the main product image area
- **THEN** the active product image MUST move to the previous or next available image in the gallery

#### Scenario: Product has a single image on mobile
- **WHEN** a shopper opens a product with only one image on a mobile-sized layout
- **THEN** the page MUST render correctly without requiring swipe controls

### Requirement: Product detail page provides clear selected-image state
The product detail page SHALL visually indicate which gallery image is currently selected.

#### Scenario: Selected thumbnail is shown
- **WHEN** a gallery image is currently active in the main image area
- **THEN** the corresponding thumbnail MUST show a visible selected state

### Requirement: Product detail page gracefully falls back for single-image products
The product detail page SHALL continue to render correctly when a product has only one available image.

#### Scenario: Product has no additional gallery images
- **WHEN** a shopper opens a product detail page for a product with only one image
- **THEN** the page MUST show the main image without requiring thumbnail interaction

#### Scenario: Shopper switches to another product
- **WHEN** a shopper navigates from one product detail page to another
- **THEN** the gallery selection MUST reset based on the newly opened product's available images

#### Scenario: Shopper switches variants that change images
- **WHEN** the shopper selects a variant that changes the currently active image set
- **THEN** the gallery selection MUST reset to the first available image in that variant's image set
