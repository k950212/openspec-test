## Why

目前 storefront 只依賴系統偏好套用色彩，使用者無法在介面中主動切換明亮或深色主題，也無法保留自己的偏好設定。加入 theme switcher 可以提升可用性與個人化程度，讓整體體驗更貼近真實產品。

## What Changes

- 在應用程式層新增 theme switcher，讓使用者可在介面中切換主題。
- 支援至少明亮與深色兩種主題，並將選擇結果保留到下次開啟。
- 讓全域樣式變數與主要頁面配色跟著主題切換更新。
- 讓主題切換控制在桌機與手機版 header 中都可使用且不影響既有導覽。
- 保持功能為 frontend-only，不引入後端帳號設定同步。

## Capabilities

### New Capabilities
- `theme-switcher`: Provide an in-app theme switcher that lets shoppers choose and persist their preferred storefront theme.

### Modified Capabilities

## Impact

- Affected code: `src/App.vue`, `src/main.ts`, `src/assets/base.css`, and any shared UI state used for global presentation preferences.
- APIs: No backend integration required; theme preference is stored locally in the browser.
- Dependencies: No new dependencies expected.
- Systems: Global layout, design tokens, and persisted UI preferences.
