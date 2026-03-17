## 1. Product Image Data

- [x] 1.1 Extend product data to support additional gallery images while keeping current primary-image usage compatible.
- [x] 1.2 Add or normalize gallery image data for products that should demonstrate the new image gallery experience.
- [x] 1.3 Add helper logic to build a deduplicated product gallery list in display order and support image-set recomputation.

## 2. Product Detail Gallery UI

- [x] 2.1 Update the product-detail image area to render a main image and thumbnail gallery when multiple images are available.
- [x] 2.2 Add desktop and touch-friendly thumbnail interactions so hover, click, or tap update the main image as appropriate.
- [x] 2.3 Add an enlarged image preview modal launched from the main product image.
- [x] 2.4 Add swipe-based image browsing for mobile-sized product detail layouts.
- [x] 2.5 Reset the selected image correctly when the shopper navigates to a different product or changes to an image-affecting variant.

## 3. Layout And Fallback Behavior

- [x] 3.1 Style the gallery so selected-image state is clear on desktop and mobile layouts.
- [x] 3.2 Keep the gallery scrollable or otherwise navigable when products define many images.
- [x] 3.3 Ensure single-image products gracefully fall back to the current simple image presentation.
- [x] 3.4 Preserve existing product-detail actions and surrounding layout while enhancing only the image section.
- [x] 3.5 Add resilient fallback behavior for image load failures so the layout remains stable.

## 4. Verification

- [x] 4.1 Verify products with multiple images render a stable gallery and switch the main image correctly.
- [x] 4.2 Verify the enlarged preview modal opens correctly on desktop and small-screen layouts.
- [x] 4.3 Verify mobile swipe browsing works for multi-image products without affecting single-image products.
- [x] 4.4 Verify products with only one image still render cleanly without unnecessary gallery controls.
- [x] 4.5 Verify navigating between product pages or image-affecting variants resets the gallery selection to the correct default image.
- [x] 4.6 Verify failed image loads and large gallery sets still leave the gallery usable.
