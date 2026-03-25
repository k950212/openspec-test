## Context

目前 storefront 已經有商品列表、商品頁與購物車流程，但購物車尚未支援任何促銷或折扣機制。這次 proposal 定義的是一個前端限定、資料量很小的 coupon system，先以「滿額免運」作為第一個促銷規則，讓購物車更貼近真實電商場景。

這個 change 會同時影響購物車狀態管理與購物車頁面的摘要呈現，因此需要把 coupon 驗證、持久化與價格計算邏輯集中在 cart store，避免視圖與資料規則分散。

## Goals / Non-Goals

**Goals:**
- 在前端建立小型 coupon dataset，支援依 coupon code 驗證優惠資格。
- 讓 cart store 能保存已套用 coupon，並在 subtotal 變化時自動重新驗證。
- 在購物車頁面提供輸入、套用、移除 coupon 的完整互動。
- 讓 order summary 清楚顯示免運折扣、失敗原因與最終總計。
- 讓重新整理頁面後仍能保留 coupon 狀態，並在載入時重新驗證。

**Non-Goals:**
- 不串接後端 coupon API 或帳號專屬優惠。
- 不實作百分比折扣、固定金額折扣或多張 coupon 疊加。
- 不處理 coupon 使用次數、到期日、會員等級等進階行銷規則。

## Decisions

### 1. Coupon 驗證與價格規則集中在 cart store
- 決策：coupon code、套用結果、折扣後運費與自動重驗證邏輯都放在 `src/stores/cart.ts`。
- 理由：coupon 直接影響 subtotal、shipping 與 total，放在 store 可以避免 `CartView.vue` 自己重算或維護重複狀態。
- 替代方案：把 coupon 判斷寫在 view。這會讓 UI 與商業規則耦合太深，之後擴充也會更難維護。

### 2. 以本地 coupon dataset 驅動單一免運規則
- 決策：建立小型前端 coupon dataset，例如 `FREESHIP100`，其規則為 subtotal 大於 100 時免運。
- 理由：proposal 明確要求 frontend-only，且目前只需支援一種簡單促銷機制，用靜態資料即可滿足需求。
- 替代方案：直接把 coupon code 寫死在 if/else。雖然更快，但後續新增第二張 coupon 時會變得難擴充。

### 3. 已套用 coupon 必須在 cart 變動後自動失效或恢復提示
- 決策：當 cart 內容變動、subtotal 降到門檻以下，或購物車清空時，自動重新驗證目前 coupon，必要時清除已套用優惠並更新提示狀態。
- 理由：proposal 與 edge cases 都要求 coupon 在 cart 變動後重新檢查，不能只在使用者按下 apply 時驗一次。
- 替代方案：維持 coupon 不變直到使用者手動重送。這會導致總計與優惠資格不一致。

## Risks / Trade-offs

- [coupon 規則放在前端，容易被看見] → 這次 feature 本來就是 frontend-only demo，規則公開可接受。
- [cart store 狀態變多，計算更複雜] → 將 coupon 狀態明確拆成 code、applied coupon、feedback message 與折扣金額，減少混亂。
- [刷新後保留的 coupon 可能已不再符合條件] → 載入 local storage 後立刻重驗證，避免顯示過期的優惠結果。
