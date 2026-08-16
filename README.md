# 智學領航 LearnPilot AI

> **AI 智慧學習診斷與成長導航系統**
> 目前階段：competition interactive demo｜部署：none

## 專案簡介

智學領航把學生零散的學習紀錄轉成三個答案：

1. 我現在在哪裡？
2. 可能遇到什麼風險？
3. 下一步怎麼走？

Demo 以匿名合成資料呈現學習效率、黃金時段、科目趨勢、風險原因與個人化讀書計畫。四個主要分頁與次要互動頁已實作為可操作的 React Native／Expo Demo。

## 目前完成狀態

### 已完成

- 完整閱讀並整理 `docs/` 內 10 頁 PPTX 與 2 頁 DOCX 企劃來源
- Students Project Profile v1 驗證
- Expo SDK 57 官方 `default` template
- TypeScript、Expo Router 與 pnpm lockfile
- 單一 root Git repository 與專案工作規則
- 產品、架構、競賽、資料、AI 與隱私規劃
- LearnPilot 品牌化四分頁：今日、分析、計畫、歷程
- 本機合成 fixture、可解釋效率／黃金時段／風險／建議規則
- 新增學習紀錄、任務勾選、接受／略過建議、成長情境與重設流程
- Vitest 8 項純函式測試與 Web 互動驗收
- Android release-mode APK 建置、manifest 與簽章結構驗證

### 尚未實作／未驗證

- 真實 AI、backend、database、登入、雲端同步與部署
- iOS Simulator／實體 iPhone、Android Emulator／實體 Android 的實際安裝與操作驗收
- 元件／端對端自動化測試與正式競賽錄影

`app/` 不再保留可操作的 Expo starter 頁面；所有主要導覽皆為 LearnPilot Demo。

## 核心 Demo 範圍

- 今日學習狀態與下一步
- 學習紀錄與歷程時間線
- 高效率／黃金學習時段
- 科目能力與成長趨勢
- 可解釋的學習風險提示
- 個人化讀書計畫
- 成長回顧與競賽展示流程

LearnPilot Demo 的核心流程僅使用本機匿名合成資料與規則式模擬，不處理真實學生個資，也不依賴外部網路；已移除 Expo starter 的外部文件頁面。

## 專案資訊

| 項目 | 值 |
|---|---|
| Project name | 智學領航 LearnPilot AI |
| Repository／本機根目錄 | `LearnPilot_AI` |
| Project slug | `learnpilot-ai` |
| Stage | `competition` |
| Product type | `app` |
| Bootstrap mode | `executable` |
| Deployment | `none` |
| Local Compose name | `learnpilot_ai`（保留名稱，目前未建立 Compose） |

## 技術與元件

唯一元件是 [`app/`](app/README.md)，它本身就是 Expo framework root。

| 技術 | 實際版本 |
|---|---|
| Node.js | `24.19.0` |
| pnpm | `11.16.0`（專案 pin；初始化曾使用 `11.19.0`） |
| Expo SDK | `57.0.12` |
| React Native | `0.86.2` |
| React | `19.2.3` |
| TypeScript | `6.0.3` |
| Expo Router | `57.0.12` |

## 專案結構

```text
LearnPilot_AI/
├── downloads/              # 學生可下載的 Android 側載展示檔與校驗碼
├── app/                    # React Native／Expo framework root
│   ├── src/app/            # Expo Router routes
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── app.json
├── docs/                   # 企劃來源與權威規劃文件
├── .github/                # 團隊協作範本
├── AGENTS.md               # 專案工作與安全規則
└── README.md
```

未建立 `backend/`、`database/`、`web/` 或空的 speculative component。

## 學生下載與檔案導航

目前只提供 Android 側載展示版；Windows `.exe`、macOS `.dmg`、iOS `.ipa` 與 iPhone 描述檔尚未建立。

| 目的 | 位置 |
|---|---|
| 直接下載並安裝 Android APK | [LearnPilot-AI-v1.0.0-android-debug-signed.apk](https://github.com/Sutdents-Project-Hub/LearnPilot_AI/raw/refs/heads/main/downloads/LearnPilot-AI-v1.0.0-android-debug-signed.apk) |
| 確認下載檔完整性 | [SHA-256 校驗碼](downloads/LearnPilot-AI-v1.0.0-android-debug-signed.apk.sha256) |
| 查看可下載檔與安裝注意事項 | [downloads/README.md](downloads/README.md) |
| 啟動或修改 App | [app/README.md](app/README.md) |
| 畫面路由 | [app/src/app/](app/src/app/) |
| 規則式分析與測試 | [app/src/domain/](app/src/domain/) |
| 匿名合成示範資料 | [app/src/fixtures/](app/src/fixtures/) |
| 專案規格、架構與競賽說明 | [docs/](docs/) |

Android 安裝步驟：在 Android 7.0（API 24）以上裝置下載 APK，從「下載」開啟檔案，僅在系統要求時授權**本次下載來源**安裝未知 App，完成後點選「安裝」。若 Android 的安全機制封鎖檔案或校驗碼不一致，請停止安裝並回報專案維護者；不要停用 Play Protect 或略過系統警告。此展示版尚未完成實體 Android 裝置驗收。

## 快速開始

前置需求：

- Node.js 24 LTS
- pnpm `11.16.0`

本機若目前預設為 Node.js 26／pnpm 10，可在此 Mac 先切到已安裝的 Node.js 24；專案的 `packageManager` 會檢查 pnpm 版本：

```bash
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
node --version
pnpm --version
```

預期為 Node.js `v24.x` 與 pnpm `11.16.0`。若其他環境尚未安裝，請先安裝 Node.js 24 LTS 與 pnpm `11.16.0`，不要直接使用本機目前的 Node.js 26／pnpm 10。

在 repository root 執行：

```bash
pnpm --dir app install
pnpm --dir app start
```

可選載體：

```bash
pnpm --dir app web
pnpm --dir app ios
pnpm --dir app android
```

初始化階段已實際驗證 `lint`、TypeScript check 與 Web 啟動；Android release APK 已於 2026-08-16 實際建置，但 iOS Simulator、Android Emulator 與實體裝置尚未驗證。

## Android APK 側載測試檔

已於 2026-08-16 產出 release-mode APK，學生交付檔位於 [`downloads/LearnPilot-AI-v1.0.0-android-debug-signed.apk`](downloads/LearnPilot-AI-v1.0.0-android-debug-signed.apk)；原始建置輸出仍保留在已忽略的 `app/dist/android/`。它的 Android application ID 為 `ai.learnpilot.demo`、version `1.0.0`／versionCode `1`、最低支援 Android 7.0（API 24）。

此檔使用 Android debug certificate 簽署，僅供競賽展示與側載測試，**不可**上傳 Google Play 或視為正式簽署版。下載前可用同目錄的 SHA-256 檔確認完整性。`app.json` 明確排除不需要的 overlay 與舊版外部儲存權限；prebuild 生成的 `app/android/` 也是 ignored 衍生物，不納入 repository。

要重新建立相同類型的 APK，需要 JDK 17、Android SDK（API／Build Tools 36）與 NDK `27.1.12297006`；先執行 `expo prebuild --platform android --no-install`，再於 `app/android/` 執行 `:app:assembleRelease`。仍需在實體 Android 裝置上完成安裝與完整 Demo 操作驗收。

## 測試與品質

目前可用：

```bash
pnpm --dir app lint
pnpm --dir app exec tsc --noEmit
pnpm --dir app test
```

已完成驗證：

- `pnpm --dir app lint`：通過
- `pnpm --dir app exec tsc --noEmit`：通過
- `pnpm --dir app test`：8 項純函式測試通過
- `pnpm --dir app exec expo export --platform web`：14 條靜態路由與 Web bundle 成功
- Playwright：已操作今日／分析／計畫／歷程、風險詳情、建議接受、任務完成、新增紀錄、表單驗證、成長情境與重設
- Browser console：0 errors、0 warnings
- Browser localStorage：無項目；非靜態外部請求：0
- 375px 寬度手機版面：已檢視，無水平溢位
- 2026-08-16 `:app:assembleRelease`：成功；APK 為 98 MB，v2 簽章有效，package ID／版本／最低 SDK 與 manifest 已靜態驗證

Web 驗證確認 LearnPilot Demo 功能流程可操作；Android package 已可交付，但原生裝置操作、iOS 載體與深色模式仍需另行人工驗收。

## 環境變數與敏感資訊

- 目前沒有必要的環境變數，因此不建立 `.env.example`。
- 不得放入 API key、帳號、真實學生資料、學校資料或未授權素材。
- App bundle 中的任何值都視為公開資訊。
- Demo fixture 必須完全合成且明確標示。

## 部署狀態

目前不部署，不建立 Expo/EAS account、App Store／Google Play、domain、backend、database、Coolify 或其他雲端資源。

正式展示載體仍待確認。Expo 官方在 SDK 57 過渡期提醒商店版 Expo Go 實機可能需要 SDK 54，因此競賽應同時準備模擬器或 Web fallback。

## Git 與版本控制

- Branch：`main`
- 安全初始 commit：`3ba6263 chore(init): 初始化學生專案結構`
- Remote：`origin` → `https://github.com/Sutdents-Project-Hub/LearnPilot_AI.git`
- 目前主線已包含可執行 Demo 與 MIT License；原始企劃來源檔保留於本機，公開前仍需確認再散布權

後續操作遵守 [AGENTS.md](AGENTS.md)，每次 Git 操作先檢查 status、branch、remote 與敏感內容。

## 文件索引

- [專案 Profile](docs/project-profile.md)
- [產品範圍、功能與里程碑](docs/project-overview.md)
- [系統架構與元件邊界](docs/architecture.md)
- [競賽與 Demo 規劃](docs/competition.md)
- [資料與儲存規劃](docs/data-and-storage.md)
- [外部整合與 AI 邊界](docs/integrations.md)
- [安全、身份與隱私](docs/security-and-privacy.md)
- [App 元件說明](app/README.md)
- [原始企劃簡報](<docs/AI 學習狀態分析系統Jason11.pptx>)
- [原始黑客松創意構想](<docs/智慧學習隊_黑客松創意構想.docx>)

## 重要未決策

- 競賽正式規則、截止日、評分標準與 Demo 時長
- 目標學生年段與正式科目範圍
- 主要展示載體
- 規則權重與門檻目前為 `rules-v1` Demo 設定，尚未具教育研究驗證
- 品牌 icon、色彩、字型與素材授權
- 第三方素材與原始企劃來源的公開授權

功能、架構、資料、指令、依賴、競賽主張或限制改變時，必須在同一任務同步 README、元件 README 與相關 `docs/`；文件同步是完成條件。
