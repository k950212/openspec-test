## Context

目前專案的基礎色彩主要由 `src/assets/base.css` 與 `prefers-color-scheme` 控制，應用程式本身沒有任何可切換的主題狀態。這次 change 需要把主題切換提升為 app-level UI capability，因此設計重點會放在全域 state、CSS variables 與 header 互動控制之間的協調，同時避免讓單一頁面各自處理主題邏輯。

## Goals / Non-Goals

**Goals:**
- 在應用程式中提供可切換的主題控制。
- 支援明亮與深色主題，並在重新整理後保留使用者選擇。
- 讓現有全域樣式 token 能跟著主題切換更新，而不需要逐頁硬編碼顏色。
- 確保 header 中的切換控制在桌機與手機排版下都可用。

**Non-Goals:**
- 不實作超過兩種以上的主題變體。
- 不同步主題偏好到後端帳號資料。
- 不在本次變更中重設所有頁面的個別設計語言，只聚焦於可切換的基礎主題架構。

## Decisions

### 1. 用 Pinia 或既有 UI store 管理全域主題狀態
- 決策：將主題選擇放在全域 UI state，而不是由 `App.vue` 臨時管理。
- 理由：主題屬於跨頁的持久 UI 偏好，放在共用 store 比較容易在 layout 與未來功能重用。
- 替代方案：僅在 `App.vue` 使用本地 state。這能工作，但後續擴充與持久化會較零散。

### 2. 透過根節點 data attribute 或 class 切換 CSS variables
- 決策：在 app 根節點或 `document.documentElement` 上掛主題標記，讓 `base.css` 依標記切換變數。
- 理由：這能保持現有頁面大部分樣式不變，只需要讓語意色票跟著主題變化。
- 替代方案：逐頁面根據 store 寫條件 class。這會讓主題邏輯分散到多個頁面。

### 3. 使用 localStorage 保留主題偏好
- 決策：把使用者主題偏好存到瀏覽器 localStorage，初始化時先讀取，再回退到預設主題。
- 理由：本次是 frontend-only，localStorage 成本最低，也能滿足持久化需求。
- 替代方案：只套用當前 session 記憶。這無法滿足重新開啟仍保留偏好的需求。

### 4. 在 header 放置輕量切換控制
- 決策：將主題切換控制放在 `App.vue` header，讓它成為全站皆可觸達的全域偏好設定。
- 理由：主題切換不是單頁功能，放在 header 最符合使用者預期，也便於手機版一起使用。
- 替代方案：放到 profile 或 settings 頁。這會降低可發現性。

## Risks / Trade-offs

- [Risk] 若初始化讀取主題晚於畫面渲染，可能出現短暫閃爍。 → Mitigation：在 app 啟動時盡早套用根節點主題標記。
- [Risk] 現有部分元件顏色可能沒有完全使用語意變數，切換後對比不一致。 → Mitigation：優先讓共用 token 生效，必要時補齊少數高可見區塊。
- [Risk] Header 再新增一個控制後，手機排版可能變擠。 → Mitigation：沿用現有 responsive header，讓切換按鈕可和 auth/導覽一起換行。
