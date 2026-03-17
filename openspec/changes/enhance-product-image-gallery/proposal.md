## Why

The storefront currently shows product images in a basic way, but the product detail experience does not yet provide the richer image interactions that are common in ecommerce websites. Enhancing the product image gallery will make product pages feel more polished and help users inspect merchandise more confidently through clearer browsing, preview, and mobile-friendly image interactions.

## What Changes

- Upgrade product detail pages to support a richer product image gallery experience.
- Show a primary product image alongside a list of thumbnail images when multiple product images are available.
- Let users switch the main displayed image by hovering or clicking thumbnail images depending on device interaction patterns.
- Add an enlarged image preview modal so users can inspect product images more closely.
- Support swipe-based image browsing for mobile product detail experiences.
- Preserve the existing product detail behavior for products that only define a single image.
- Keep the feature frontend-only and compatible with existing product detail, cart, wishlist, reviews, related products, and variant flows.

## Capabilities

### New Capabilities

- `product-image-gallery`: Provide an interactive product image gallery with thumbnail selection, enlarged preview, and mobile-friendly image browsing on product detail pages.

### Modified Capabilities

- `product-detail-page`: Display an upgraded product image experience with a main image, thumbnail navigation, preview modal, and mobile swipe support where applicable.

## Impact

- Affected code: `src/data/products.ts`, `src/views/ProductDetailView.vue`, and any shared product media or modal helpers used by the storefront.
- APIs: No backend integration required; gallery images are derived from the existing local frontend product catalog.
- Dependencies: No new dependencies expected.
- Systems: Product detail rendering, product image presentation, modal interaction behavior, and mobile image browsing experience.

## Acceptance Criteria

- Product detail pages display a primary product image.
- Products with multiple images display selectable thumbnail images.
- Selecting or hovering a thumbnail updates the main displayed image.
- Users can open an enlarged image preview modal from the main image.
- On mobile-sized layouts, users can browse product images with swipe interactions.
- Products with only one image continue to display correctly without thumbnail or swipe requirements.

## Edge Cases

- Products only define a single image.
- Products define multiple images but one fails to load.
- The image preview modal is opened on small screens.
- Users switch variants that change the image set.
- The gallery contains many images and must remain scrollable or navigable.
