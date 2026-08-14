# 學生專案 Profile

## 基本資訊

- Project name：智學領航 LearnPilot AI
- Repository name：`LearnPilot_AI`
- Project slug：`learnpilot-ai`
- Local Docker Compose project：`learnpilot_ai`
- Stage：`competition`
- Product type：`app`
- Bootstrap mode：`executable`
- Deployment：`none`
- Team collaboration：`true`
- Technology policy：未指定時採公司技術基線
- Structure exception：無；使用固定 component root

## 摘要

以 React Native 與 Expo 建立的競賽型行動 Demo，透過本機假資料模擬 AI 學習狀態診斷、風險提示與下一步成長導航；不含後端、帳號與外部服務。

## 元件

- `app`：path=`app`，kind=`app`，framework=`Expo`，package_manager=`pnpm`，quality=lint，technology_source=`specified`

## 功能領域

- 學習狀態總覽與今日導航
- 學習紀錄與歷程時間線
- 高效率學習時段辨識
- 科目能力與成長趨勢分析
- 學習風險預警
- 個人化讀書計畫與下一步策略
- 競賽 Demo 展示流程

## 專案限制

- 只初始化可運行的官方 Expo TypeScript 骨架，不實作 LearnPilot 產品功能
- 只建立 app 元件；不建立 backend、database、auth、CMS、worker 或外部 API
- Demo 僅使用本機假資料與可解釋規則模擬 AI 結果，不處理真實學生個資
- 本輪不部署、不建立外部帳號、雲端資源或正式資料整合
- 保留 docs 內既有 DOCX 與 PPTX 原始企劃來源，不覆寫或改名

## 關注事項

- ai
- personal-data

## 假設

- 使用 Expo Router 作為後續多畫面導航基礎
- 使用 Node.js 24 LTS、pnpm 與 TypeScript
- 第一階段以台灣學生常見五科和一組匿名示範資料呈現完整學習循環
- 競賽團隊以本機開發與展示流程協作

## 未決定事項

- 正式展示載體尚待確認：Expo Go 實機、模擬器或 Web
- 核心目標學生年段尚待確認
- 正式資料取得方式、效率公式、風險門檻與 AI 方法尚未決定
- 競賽名稱、評分標準、提交格式、截止日與素材授權規則尚待確認
- 正式部署、真實雲端同步、跨平台整合與資料保護方案尚未核准
