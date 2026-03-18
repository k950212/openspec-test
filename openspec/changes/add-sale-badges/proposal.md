## Why

目前 storefront 的商品卡雖然已能顯示圖片、名稱、價格與操作，但缺少能快速傳達促銷狀態的視覺提示。加入 sale badges 可以讓使用者在瀏覽列表時更快辨識特價或活動商品，提升商品卡的資訊密度與促購效果，同時也為後續更完整的促銷展示預留結構。

## What Changes

- 在商品資料中加入前端可用的促銷 badge 欄位，供特定商品標示活動狀態。
- 在商品列表卡片顯示 sale badge，讓使用者可在瀏覽階段立即辨識活動商品。
- 讓 quick view 與其他共用商品卡版型可沿用同樣的 sale badge 顯示方式。
- 定義 badge 在不同背景圖片上的可讀性、位置與小螢幕表現，避免遮擋主要操作。
- 保持功能為 frontend-only，不引入新的定價邏輯、後端 API 或結帳折扣計算。

## Capabilities

### New Capabilities
- `sale-badges`: Provide frontend sale badges that can be attached to products and displayed consistently across storefront product cards.

### Modified Capabilities
- `product-catalog`: Show sale badges on eligible catalog product cards without breaking existing search, filter, quick view, wishlist, or cart interactions.

## Impact

- Affected code: `src/data/products.ts`, `src/views/HomeView.vue`, and any other shared product-card surfaces that should render consistent badges.
- APIs: No backend integration required; badge content is sourced from local frontend product data.
- Dependencies: No new dependencies expected.
- Systems: Product presentation, catalog browsing cues, and shared product-card rendering.
