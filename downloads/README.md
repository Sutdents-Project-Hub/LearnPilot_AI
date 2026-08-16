# 學生下載區

此目錄存放可直接從 GitHub repository 下載的競賽展示檔，與可重現的原始建置目錄 `app/dist/` 分開管理。

| 檔案 | 用途 | 狀態 |
|---|---|---|
| [`LearnPilot-AI-v1.0.0-android-debug-signed.apk`](LearnPilot-AI-v1.0.0-android-debug-signed.apk) | Android 7.0（API 24）以上裝置的側載展示 App | debug certificate 簽署；僅限競賽展示與測試 |
| [`LearnPilot-AI-v1.0.0-android-debug-signed.apk.sha256`](LearnPilot-AI-v1.0.0-android-debug-signed.apk.sha256) | APK 的 SHA-256 完整性校驗碼 | 已依本次建置檔產生 |

## 安裝

1. 從根目錄 README 的「直接下載並安裝 Android APK」連結下載 APK。
2. 從 Android 的「下載」開啟 APK；系統要求時，只授權該下載來源安裝未知 App。
3. 完成安裝後開啟「智學領航 LearnPilot AI」。

若安全機制封鎖 APK、檔案無法下載或 SHA-256 不吻合，請不要略過警告或停用 Play Protect，改為回報專案維護者。此版本尚未完成實體 Android 裝置驗收。

## 界線

- 此檔為 `ai.learnpilot.demo`、version `1.0.0`／versionCode `1` 的 release-mode APK。
- APK 採 Android debug certificate 簽署，不能上傳 Google Play，也不是正式發行簽署版。
- 尚無 Windows `.exe`、macOS `.dmg`、iOS `.ipa` 或描述檔。
- App 使用匿名合成資料與可解釋的規則式模擬分析，沒有帳號、雲端同步或真實學生資料。
