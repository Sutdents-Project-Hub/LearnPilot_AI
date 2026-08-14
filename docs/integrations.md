# 智學領航 LearnPilot AI｜外部整合與 AI 邊界

## 1. 目前整合狀態

本階段沒有外部整合：

- 無 LLM／ML API
- 無登入供應商
- 無學習平台 API
- 無 analytics／crash reporting
- 無 push notification
- 無 cloud database／storage
- 無 production environment variable

`app/` 不建立 `.env.example`，因為沒有必要的環境變數。

Expo 官方 starter 的 Explore 頁與外部文件連結已移除。Web build 的瀏覽器驗收顯示主要 Demo 流程只有靜態本機資源請求，沒有外部整合或外部請求。

## 2. 「AI」在 Demo 中的定義

Demo 的 AI 是「可解釋的規則式學習診斷模擬」：

- 輸入：匿名合成的學習紀錄
- 處理：純 TypeScript 規則與權重
- 輸出：效率、黃金時段、風險因素與建議
- 執行位置：App 裝置端
- 可重現性：同一輸入與 rule version 產生同一輸出

畫面與簡報需使用「模擬診斷」「規則式分析」「趨勢提示」等誠實語言，不宣稱已使用未存在的生成式 AI、預測模型或 24 小時雲端助教。

## 3. 解釋契約

每個分析輸出必須包含：

- `result`：數值或等級
- `reason`：白話原因
- `evidence`：使用的指標與時間範圍
- `sampleSize`：資料量
- `ruleVersion`：規則版本
- `disclaimer`：限制與非保證性

資料不足時回傳不足狀態，不以模型口吻補出答案。

## 4. 未來外部 AI 的核准關卡

若未來要加入 LLM 或預測模型，必須先確認：

- 明確用途，以及規則式方法不足的證據
- 官方供應商、模型版本、授權與成本
- 輸入資料是否含個資、成績或未成年人資料
- data retention、training opt-out 與資料所在地
- backend secret boundary；API key 不得放入 App bundle
- timeout、rate limit、離線與降級行為
- prompt injection、錯誤建議與不當內容風險
- evaluation dataset、準確率／召回率與誤報處理
- 使用者覆核、申訴與建議拒絕機制
- 競賽 AI 使用揭露

未完成前不新增 SDK、key 或 network call。

## 5. 未來學習平台整合關卡

原企劃提到自動同步平台足跡，但未指定平台。新增前必須逐一確認：

- 平台名稱與官方 API
- OAuth／權限範圍
- 可取得欄位與更新頻率
- 學生與學校授權
- rate limit、錯誤、撤銷與刪除
- 對應到 LearnPilot schema 的方式
- API 停止或資料缺漏時的行為

不得以爬蟲、共用帳密或未授權方式取得學生資料。

## 6. 研究與素材來源

原企劃中的 Gallup 與《AI 教育大調查》引用資訊不完整，正式使用前需補齊原始來源、樣本與指標定義。企劃內的效率、風險、雷達與成長圖目前視為示意，不是驗證結果。

未來新增的資料集、模型、圖片、icon、字型與程式碼需記錄：

- 名稱與原始 URL
- 作者／提供者
- 版本或存取日期
- 授權
- 在專案中的用途
- 是否允許競賽公開與再散布

## 7. 降級原則

未來即使加入外部服務，主要 Demo 仍應保留：

- 合法的離線 fixture
- 無 key 的展示模式
- 可理解的服務不可用訊息
- 不影響資料安全的重試
- 不把外部服務錯誤偽裝成有效建議
