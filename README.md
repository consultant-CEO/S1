# Google AI Studio 雲端架構與 DevOps 顧問工作站 (AI Studio Cloud & DevOps Architect)

專精於 Google AI Studio 生態系、GitHub DevOps 流程，以及公有雲無伺服器部署的企業級架構工作站。協助開發團隊將 AI 創意與 Prompt 原型，轉化為架構清晰、具備成本效益，且能無縫進行版本控制與自動化部署的企業級專案。

---

## 🚀 核心工作流程（五大標準模組）

1. **📌 專案架構與開發藍圖**：一句話總結核心價值、推薦技術棧與漸進式交付拓撲。
2. **🤖 AI Studio System Prompt**：精準選型 Gemini 模型版本（如 `gemini-3.8-flash`）、結構嚴謹之 System Instructions 與 Few-shot 範例。
3. **📁 GitHub 專案結構與安全規範**：提供標準專案資料夾結構、嚴格 `.gitignore` 金鑰防護與 GitHub Secrets 設定說明。
4. **☁️ 公有雲部署與 CI/CD 策略**：GCP Cloud Run / AWS Lambda 無伺服器架構、Multi-stage Dockerfile 與 GitHub Actions (`deploy.yml`) 自動化部署。
5. **💰 FinOps 成本拆解與降本策略**：Token 與雲端基建預估月費、成本陷阱警示與 Context Caching / Batch API 降本策略。

---

## 🛠️ 本地開發與啟動指南

### 1. 安裝依賴套件
```bash
npm install
```

### 2. 設定環境變數
複製範本檔案建立本機專用 `.env`：
```bash
cp .env.example .env
```
編輯 `.env` 並填入您的 Google AI Studio API Key：
```env
GEMINI_API_KEY="您的_GEMINI_API_KEY"
PORT=3000
```
> ⚠️ **資安提醒**：`.env` 已列入 `.gitignore`，**絕對不可以將含有真實金鑰的 `.env` 簽入 Git 或公開上傳！**

### 3. 啟動開發伺服器
```bash
npm run dev
```
瀏覽器開啟：`http://localhost:3000`

### 4. 專案打包建置
```bash
npm run build
```

---

## 🔐 GitHub Secrets 設定說明 (CI/CD 必備)
若欲啟用 GitHub Actions 自動化部署，請至 GitHub 倉庫之 **Settings ➔ Secrets and variables ➔ Actions** 新增以下機密：

- `GEMINI_API_KEY`: 由 Google AI Studio 控制台取得之 API 金鑰。
- `GCP_PROJECT_ID`: Google Cloud 專案 ID（若部署至 Cloud Run）。
- `GCP_WORKLOAD_IDENTITY_PROVIDER`: GCP Workload Identity Provider 路徑（無金鑰認證）。
- `GCP_SERVICE_ACCOUNT`: 具備 Cloud Run 部署權限之服務帳號。

---

## 📄 License
Apache-2.0
