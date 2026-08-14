# 系統架構與元件邊界

## 架構原則

- Repository 預設為單一 Git repository，只有根目錄可擁有 `.git/`。
- `web/`、`app/`、`cms/`、`backend/`、`worker/` 等 component 本身就是 framework root；manifest 與 lockfile 直接位於該目錄。
- 不建立 project-name 或 framework-name wrapper。跨 component 共用程式碼只有在至少兩個真實使用者存在時才放入 `packages/`。
- 未指定技術時採公司基線：Node.js 24 LTS、TypeScript、pnpm、Next.js、React Native with Expo、Payload CMS、NestJS 與 PostgreSQL。
- 學生因競賽、既有 starter、硬體、授權或團隊能力採不同技術時，以核准 Profile 記錄的選型為準。
- 本機 Docker Compose project 固定為 `learnpilot_ai`。
- 主要 Compose 檔明確設定頂層 `name: learnpilot_ai`，service 使用責任角色且原則上不設定 `container_name`。



## 已核准元件

- `app/`：行動應用程式；framework=`Expo`；package_manager=`pnpm`；technology_source=`specified`。

## 結構例外

無；使用公司固定 component root。

## 跨元件與信任邊界

- UI 可見性不是授權；秘密、資料庫、重要外部 API 與高風險操作由可信任的 backend／platform 邊界持有。
- 新增 component、改變 framework／runtime／package manager、移動責任或建立新的外部服務前，先更新本文件與 Profile 並取得批准。

## 專案限制

- 只初始化可運行的官方 Expo TypeScript 骨架，不實作 LearnPilot 產品功能
- 只建立 app 元件；不建立 backend、database、auth、CMS、worker 或外部 API
- Demo 僅使用本機假資料與可解釋規則模擬 AI 結果，不處理真實學生個資
- 本輪不部署、不建立外部帳號、雲端資源或正式資料整合
- 保留 docs 內既有 DOCX 與 PPTX 原始企劃來源，不覆寫或改名
