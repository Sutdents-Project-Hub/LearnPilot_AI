# `app/`：智學領航行動應用程式

此目錄是 **智學領航 LearnPilot AI** 唯一的可執行元件，也是 React Native／Expo 的 framework root。`package.json`、`pnpm-lock.yaml`、Expo 設定與 route source 都直接位於此元件內，不應再建立第二層專案包裝目錄。

## 目前狀態

- 階段：competition interactive demo
- 已建立：Expo SDK 57 官方 `default` template、TypeScript、Expo Router、pnpm lockfile
- 已建立：Expo 官方 ESLint flat config；pnpm 11 僅允許 `unrs-resolver` 執行必要 binding script
- 已實作：今日、分析、計畫、歷程四個頂層分頁；新增紀錄、風險詳情、建議詳情與 Demo 揭露頁
- 已實作：`demo-v1` 完全合成 fixture、in-memory session、效率／黃金時段／風險／建議規則與重設流程
- 已實作：無外部圖表套件的可存取文字摘要與輕量 bar chart；Vitest 純函式測試
- 已驗證：Android release-mode APK 可由本機 native build 產出；仍未在實體裝置安裝操作
- 不包含 backend、database、帳號、外部 AI API、雲端同步或部署設定

## 元件責任

`app/` 負責：

- 呈現學生的學習狀態、風險、建議與成長趨勢
- 儲存 Demo 專用的本機假資料
- 在裝置端執行可解釋的規則式模擬分析
- 提供競賽展示所需的可重現操作流程

不負責真實學生資料、跨裝置同步、伺服器端預測、帳號權限或正式通知服務。這些能力若未來要加入，必須先重新核准架構、資料與隱私範圍。

## 已確認技術

- Node.js：24 LTS（本次使用 `24.19.0`）
- Package manager：pnpm `11.16.0`（專案 pin；初始化曾使用 `11.19.0`）
- Expo SDK：`57.0.12`
- React Native：`0.86.2`
- React：`19.2.3`
- TypeScript：`6.0.3`
- Navigation：Expo Router `57.0.12`

## 目錄重點

```text
app/
├── src/app/          # Expo Router routes（tabs 與 secondary routes）
├── src/components/learnpilot/ # 共用畫面與資料呈現元件
├── src/constants/    # 視覺 token、科目與規則設定
├── src/domain/       # 純 TypeScript 分析函式與測試
├── src/features/demo/# in-memory session state
├── src/fixtures/     # 明確標示的合成 fixture
├── app.json          # Expo application metadata
├── eslint.config.js  # Expo ESLint flat config
├── package.json      # scripts 與 dependencies
├── pnpm-workspace.yaml # pnpm 11 dependency build allowlist
└── pnpm-lock.yaml    # 鎖定的依賴版本
```

目前所有目錄都有實際使用責任；新增功能前仍依 `docs/architecture.md` 的 feature-first 邊界擴充。

## 本機指令

在 repository root 執行：

```bash
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
node --version
pnpm --version
pnpm --dir app install
pnpm --dir app lint
pnpm --dir app exec tsc --noEmit
pnpm --dir app test
pnpm --dir app start
pnpm --dir app web
```

`lint`、TypeScript no-emit、8 項 domain test 與 Expo Web static export 已在 2026-08-14 實際通過；Playwright 已驗證主要 Demo 流程。2026-08-16 已以 JDK 17、Android SDK API／Build Tools 36 與 NDK `27.1.12297006` 成功執行 `:app:assembleRelease`。Android emulator、iOS Simulator 與實體裝置尚未驗證。

預期 runtime 是 Node.js `v24.x`、pnpm `11.16.0`。App 沒有外部 API、SDK、資料上傳或可操作的外部文件連結。

## Android 側載包裝

- `app.json` 的 Android application ID 是 `ai.learnpilot.demo`，versionCode 是 `1`；這是目前展示 APK 使用的 identity，尚未註冊 Google Play。
- 本次輸出為 release-mode、Android debug certificate 簽署的 APK，僅供側載測試；供學生下載的受版本控制副本是 [`../downloads/LearnPilot-AI-v1.0.0-android-debug-signed.apk`](../downloads/LearnPilot-AI-v1.0.0-android-debug-signed.apk)，原始建置輸出仍在已忽略的 `dist/android/`。校驗碼與安裝注意事項見 [`../downloads/README.md`](../downloads/README.md)。
- `blockedPermissions` 會移除 `SYSTEM_ALERT_WINDOW` 與舊版外部儲存權限。2026-08-16 的成品 manifest 僅含 framework 所需的 normal permissions：`INTERNET`、`ACCESS_NETWORK_STATE`、`VIBRATE`。
- `expo prebuild` 會生成被忽略的 `android/` 目錄，並可能暫時改寫 `package.json` 的 Android／iOS 開發 scripts；保留 managed Expo script，且不提交生成的 native 目錄。
- iOS 尚未設定 bundle identifier、Apple Team 或 signing profile；沒有 `.ipa`、`.mobileprovision` 或 `.mobileconfig` 交付檔。

## 環境與資料

- 目前沒有必要的環境變數，因此不建立 `.env.example`。
- 不得加入真實姓名、學號、成績、作答紀錄或任何可識別學生的資料。
- Demo fixture 必須使用明確標示的匿名合成資料。
- AI 診斷必須標示為模擬／規則式結果，並能說明輸入、規則與輸出。

## 相關文件

- `../README.md`
- `../docs/project-overview.md`
- `../docs/architecture.md`
- `../docs/competition.md`
- `../docs/security-and-privacy.md`
- `../docs/data-and-storage.md`
- `../docs/integrations.md`
