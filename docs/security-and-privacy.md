# 智學領航 LearnPilot AI｜安全、身份與隱私規劃

## 1. 本階段安全姿態

competition Demo 採最低權限設計：

- 無登入
- 無帳號、角色或遠端權限
- LearnPilot 核心 Demo 流程無 network request；Expo starter 的外部文件連結已移除
- 無秘密或 production environment
- 無真實學生資料
- 無裝置敏感權限
- 無資料持久化

因此本階段不宣稱具有 production 級身份、安全或法規合規能力。

## 2. 威脅與控制

| 風險 | 本階段控制 |
|---|---|
| 真實學生資料誤入 Demo | 只允許 versioned synthetic fixture；review 與 Git 前掃描 |
| App bundle 洩漏 key | 不使用外部 API／secret；任何 client 值視為公開 |
| AI 建議造成誤導 | 規則可解釋、顯示證據與 disclaimer、允許略過 |
| 把模擬結果當成真實成效 | UI、README、簡報標示 synthetic／simulated／planned |
| 錯誤輸入造成崩潰 | 表單驗證、domain guard、可恢復錯誤與重設 |
| 第三方素材未授權 | 使用前記錄來源與授權，未確認素材不提交 |

## 3. 資料最小化

Demo 只需要：

- 匿名顯示名稱
- 合成科目與單元
- 合成時間、專注度、正確率、完成度與成績

不需要：

- 真實姓名、學號、Email、電話、學校或班級
- 定位、相機、麥克風、聯絡人、健康或裝置識別資料
- 家長／教師資訊

實作時如果 framework 或 dependency 要求上述權限，必須先說明必要性並取得核准。

## 4. 使用者溝通

Demo 需在可到達位置揭露：

- 目前使用合成資料
- 診斷由規則式模擬產生
- 風險提示不是對成績的保證或專業教育評估
- 使用者可以忽略或重設建議
- 目前沒有資料上傳或雲端同步

不使用恐嚇、羞辱或過度確定的語言；風險文字應描述趨勢與可改善行動。

## 5. Logging 與錯誤

- 不記錄完整 profile、學習紀錄或建議內容到 production log。
- 初始化與 Demo 開發可記錄非敏感 error code。
- 錯誤訊息不顯示本機絕對路徑、token 或內部 stack 給一般使用者。
- 未來若加入 crash reporting，先檢查資料欄位、sampling、retention 與 opt-out。

## 6. Git 與檔案安全

- `.env`、key、certificate、credentials、contracts、legal、quotations 已由根 `.gitignore` 排除。
- 原始企劃 PPTX／DOCX 不是合約，但仍需在公開 repository 前確認素材、學生／團隊資訊與再散布權。
- 不自行選擇 LICENSE。
- Commit／push 前依 `AGENTS.md` 掃描 staged、unstaged 與 untracked。

## 7. 真實產品前置條件

若產品開始處理真實學生或未成年人資料，必須重新進行威脅模型與法規／校方要求確認，至少涵蓋：

- 使用者、家長／監護人與學校的同意
- 身份、角色、最小權限與 session 安全
- 資料傳輸與靜態加密
- 保存、更正、下載、刪除與撤回
- 管理員稽核與異常存取告警
- 第三方處理者與資料所在地
- 模型輸入、保留與訓練政策
- incident response、備份與復原
- 安全測試與人工審查

在這些邊界核准前，不把 prototype 直接公開給真實學生使用。
