# 智學領航 LearnPilot AI｜資料與儲存規劃

## 1. 本階段資料決策

- 資料類型：匿名合成 Demo 資料
- 擁有元件：`app/`
- 儲存方式：versioned fixture + App 記憶體 session
- 持久化：無
- 網路傳輸：無
- 真實學生資料：禁止
- production database／backup／migration：不適用

執行「重設 Demo」後會回到固定 fixture；Demo session 的新增紀錄與建議狀態不會持久化，確保競賽展示可重現。

## 2. 資料分類

### 可提交

- 虛構姓名或明確標示的匿名代號
- 合成科目、時段、分數、專注度與完成度
- 分析規則的測試輸入與預期輸出
- 不含識別資訊的 UI placeholder

### 不可提交或使用

- 真實姓名、學號、Email、學校、班級
- 真實成績、題目、作答紀錄或學習時間
- 未成年人或家長資料
- 平台 token、cookie、匯出檔與截圖
- 從真實學生資料直接改名的「假資料」

## 3. Fixture 最小範圍

建議 fixture 版本 `demo-v1`：

- 1 個匿名學生
- 5 個科目
- 6–8 週資料
- 每科至少能計算趨勢的 assessment
- 多個時段的 study session
- 至少 1 個樣本不足情境
- 至少 1 個穩定科目、1 個注意科目、1 個風險科目
- 一組調整前／後情境，清楚標示為合成示意

## 4. 資料品質規則

- 時間區間合法且結束時間晚於開始時間。
- `focusScore`、`completionScore`、百分比與標準化成績皆為 0–100。
- `questionsCorrect <= questionsAttempted`。
- 科目與單元 reference 必須存在。
- 時區固定並文件化；競賽 fixture 建議使用 `Asia/Taipei`。
- fixture 需有 `schemaVersion`、`fixtureVersion` 與 `generatedAt`。
- 合成資料不宣稱代表真實族群分布。

## 5. Session mutation

Demo 可在記憶體中支援：

- 新增一筆學習紀錄
- 接受／略過一則建議
- 切換到「調整後」展示情境
- 重設

不支援：

- App 重啟後保留
- 多裝置同步
- 真實刪除請求
- 匯入／匯出

## 6. 資料與分析可追溯性

每個 UI 指標應能追溯到：

- fixture／session record id
- rule version
- sample size
- evaluatedAt
- 使用的時間範圍

每個 Insight 應包含 reason、evidence、action 與 disclaimer。圖表的數值不得手動寫死成與 domain 計算不同的另一套結果。

## 7. 正式產品升級關卡

任何真實資料或持久化需求都屬高風險範圍變更，必須先決定：

- 資料控制者與處理者
- 學生／未成年人同意與監護人規則
- 最小蒐集與目的限制
- 帳號、角色與存取控制
- 保存期限、下載、更正與刪除
- 加密、稽核、備份與還原
- 資料所在地與第三方分享
- incident response
- migration 與 rollback

在上述事項核准前，不新增 AsyncStorage、SQLite、backend database、cloud storage 或平台串接。
