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

- `app`：path=`app`，kind=`app`，framework=`Expo`，package_manager=`pnpm`，quality=lint+test，technology_source=`specified`

## Bootstrap 證據

- Framework root：`app/`
- Manifest：`app/package.json`
- Lockfile：`app/pnpm-lock.yaml`
- Expo config：`app/app.json`
- Android package：`ai.learnpilot.demo`；versionCode：`1`
- Source routes：`app/src/app/`
- Node.js：`24.19.0`
- pnpm：`11.16.0`（專案 pin；初始化曾使用 `11.19.0`）
- Expo SDK：`57.0.12`
- React Native：`0.86.2`
- TypeScript：`6.0.3`
- Nested Git：已移除由 Expo initializer 產生的 `app/.git`；repository 只保留根 `.git/`
- LICENSE：MIT License（依使用者明確要求新增）
- 產品功能：已實作 competition Demo；包含四個主分頁、secondary detail routes、合成 fixture、in-memory session、規則式分析與重設
- Initial local commit：`3ba6263`（只包含 Students Project Init 建立的 11 個初始化文件）
- Remote：未設定；未 push
- `pnpm --dir app lint`：已通過
- `pnpm --dir app exec tsc --noEmit`：已通過
- `pnpm --dir app test`：8 項 domain test 已通過
- Expo Web：`expo export --platform web` 已產生 14 條靜態路由；Playwright 已完成主要流程與 375px 視覺檢查
- Browser console：0 errors、0 warnings
- Browser localStorage：無項目；非靜態外部請求：0
- Android release APK：2026-08-16 已由 `:app:assembleRelease` 成功建置，v2 簽章與 manifest 已驗證；debug certificate 僅供側載測試
- iOS Simulator／Android Emulator／實體裝置：尚未驗證

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

## 來源文件狀態

- `docs/AI 學習狀態分析系統Jason11.pptx`：10 頁概念簡報，保留原檔；品牌與能力狀態尚待未來另案同步。
- `docs/智慧學習隊_黑客松創意構想.docx`：2 頁創意構想與故事板，保留原檔。
- 兩份來源內的外部統計缺少完整出處，暫不作為已驗證證據。
