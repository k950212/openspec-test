## Why

目前商品列表已經支援搜尋、篩選、收藏與加入購物車，但使用者若想快速確認商品描述、圖片與價格，仍需要離開列表頁進入商品詳情。加入 quick view 可以讓使用者在不打斷瀏覽節奏的情況下快速預覽商品，提升列表頁的探索效率，也讓後續加入購物車或前往詳情頁的決策更順暢。

## What Changes

- 在商品列表的商品卡上新增 quick view 入口，讓使用者可直接開啟商品快速預覽。
- 以 modal 或 dialog 形式顯示商品主要資訊，例如圖片、名稱、價格、簡短描述與主要操作。
- 在 quick view 中提供前往商品詳情頁的入口，避免使用者被困在列表頁。
- 讓 quick view 與現有商品列表、收藏與加入購物車流程相容，不破壞既有互動。
- 補上 quick view 的關閉、空間限制與小螢幕可用性要求。

## Capabilities

### New Capabilities

- `product-quick-view`: Provide an in-context quick view dialog from the product catalog so shoppers can preview product details without navigating away.

### Modified Capabilities

- `product-catalog`: Add a quick view entry point on catalog product cards while preserving existing detail, wishlist, cart, search, and filter behaviors.

## Impact

- Affected code: `src/views/HomeView.vue` and any shared product presentation or modal utilities used by the storefront.
- APIs: No backend integration required; quick view uses the existing local product catalog data.
- Dependencies: No new dependencies expected.
- Systems: Product catalog interactions, modal/dialog behavior, and storefront browsing flow.
