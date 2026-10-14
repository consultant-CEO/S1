import { ArchitectureBlueprint } from '../types/architect';

export const PRESET_BLUEPRINTS: ArchitectureBlueprint[] = [
  {
    id: 'enterprise-rag',
    title: '企業級多模態內部知識庫 RAG 檢索系統',
    category: 'RAG 知識庫',
    summaryTagline: '📌 專案架構與開發藍圖：透過 Gemini 3.8 Flash 搭配 Cloud Run 無伺服器微服務與向量檢索，構建百萬文件高併發、高隱私且支援 Context Caching 降本 85% 的企業級多模態知識助手。',
    techStack: ['Gemini 3.8 Flash', 'GCP Cloud Run', 'GitHub Actions CI/CD', 'Vertex AI Search / pgvector', 'Docker', 'Express / Node.js'],
    cloudTarget: 'GCP Cloud Run',
    recommendedModel: 'gemini-3.8-flash',
    modelRationale: 'Gemini 3.8 Flash 具備百萬級 Token Context 視窗，能同時容納多篇長文本與圖表分析，延遲極低 (<800ms) 且每百萬輸入 Token 僅 $0.15，性價比遠超重量級模型。',
    parameters: {
      temperature: 0.2,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
    systemPrompt: `你是企業內部知識管理專家與 RAG 智能助手。你的職責是基於使用者檢索提供的內部參考文件（[Context] 標籤），給予精確、客觀、可溯源的解答。

【核心原則】
1. 嚴格事實檢驗：回答僅限於 [Context] 中提供的依據。若參考資料不足以回答問題，請明確說明「根據目前企業知識庫資料，尚無此項目之記載」，嚴禁捏造事實。
2. 引用標註：每個事實陳述句尾必須標註引文來源編號（例如 [Doc-1: 《2026人事規章》第3節]）。
3. 繁體中文與專業語氣：以繁體中文回答，維持嚴謹商務語調。
4. 隱私防護：若文本中出現員工身份證號或薪資等未授權個資，主動進行遮蔽。`,
    fewShotExamples: [
      {
        user: `[Context: Doc-1 員工出差管理辦法 第5條：國內出差膳雜費每日上限為新台幣 800 元，高鐵票須檢附購票證明實報實銷。]
請教同仁出差台南，膳雜費一天可以報多少？需要憑證嗎？`,
        model: `依據公司規範，同仁國內出差膳雜費每日報銷上限為新台幣 800 元 [Doc-1]。該項目按日定額補助，無需檢附餐飲發票；但若搭乘高鐵，交通費需檢附購票證明方可實報實銷 [Doc-1]。`,
        explanation: '展示嚴格事實檢驗與出處標註。',
      },
      {
        user: `[Context: Doc-2 資訊安全準則 第12條：外部連線須經由企業 VPN 認證。]
我可以把公司資料庫連線字串存到個人的 GitHub public repo 方便在家工作嗎？`,
        model: `絕對不可以 [Doc-2]。依據資訊安全準則，嚴禁將任何資料庫連線字串、金鑰或內部連線資訊公開儲存於外部或個人公開倉庫。遠端存取必須經由企業內部 VPN 及受控驗證機制進行。`,
        explanation: '合規與資安威脅即時阻截。',
      },
    ],
    projectStructure: {
      treeAscii: `enterprise-rag-service/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint & Unit Test 檢查
│       └── deploy.yml             # 自動打包 Docker 並部署至 GCP Cloud Run
├── prompts/
│   ├── system_instructions.md     # AI Studio 驗證通過之核心 Prompt
│   └── few_shot_examples.json     # Few-shot 範例集
├── src/
│   ├── config/
│   │   ├── env.ts                 # Zod 強型別環境變數驗證
│   │   └── gemini.ts              # @google/genai SDK 客戶端實例
│   ├── controllers/
│   │   └── queryController.ts     # 接收用戶提問並觸發檢索與生成
│   ├── services/
│   │   ├── ragService.ts          # 向量搜尋與 Context 拼裝
│   │   └── cachingService.ts      # Gemini Context Caching 管理器
│   ├── index.ts                   # Express 伺服器入口
│   └── types.ts                   # 介面定義
├── tests/
│   └── rag.test.ts                # 單元測試與 Prompt 基準測試
├── .dockerignore
├── .env.example                   # 金鑰範本 (禁止填入真實密鑰)
├── .gitignore                     # 嚴格金鑰隔離清單
├── Dockerfile                     # 輕量級 Multi-stage Production 鏡像
├── README.md                      # 開發者快速上手指引
├── package.json
└── tsconfig.json`,
      files: [
        {
          path: '.env.example',
          description: '環境變數範本，僅記錄變數名稱與指引，不含真實密鑰',
          content: `# Gemini API 金鑰 (由 Google AI Studio 取得)
GEMINI_API_KEY="AIzaSyYourGeneratedApiKeyHere"

# 雲端執行環境設定
PORT=8080
NODE_ENV="production"

# 向量檢索資料庫連線
VECTOR_DB_URL="postgresql://user:password@cloudsql-ip:5432/rag_db"
CACHE_TTL_MINUTES="120"`,
          isSensitive: false,
        },
        {
          path: '.gitignore',
          description: 'Git 版本控制忽略檔，確保敏感檔案與建置成品絕不簽入',
          content: `# 機密環境變數與金鑰檔 (最優先防護)
.env
.env.*
!.env.example
*.pem
*.key
*.cert
credentials.json
service-account*.json

# 依賴套件與編譯成品
node_modules/
dist/
dist-server/
.DS_Store

# 測試覆蓋率與日誌
coverage/
*.log
npm-debug.log*`,
          isSensitive: false,
        },
      ],
    },
    securitySpec: {
      gitignoreItems: [
        '.env',
        '.env.local',
        '.env.production',
        '*.pem',
        '*.key',
        'credentials.json',
        'service-account-key.json',
        'node_modules/',
        'dist/',
      ],
      envExample: `GEMINI_API_KEY="AIzaSyPlaceholderKey"
PORT=8080
NODE_ENV="production"
PROJECT_ID="gcp-enterprise-rag-prod"`,
      githubSecrets: [
        {
          name: 'GEMINI_API_KEY',
          description: 'Google AI Studio / Vertex AI API 金鑰，由 GitHub Actions 注入容器環境',
          exampleValue: 'AIzaSy****************',
          scope: 'Actions',
        },
        {
          name: 'GCP_WORKLOAD_IDENTITY_PROVIDER',
          description: 'Google Cloud Workload Identity Federation 提供者路徑 (推薦無金鑰部署)',
          exampleValue: 'projects/12345/locations/global/workloadIdentityPools/...',
          scope: 'Actions',
        },
        {
          name: 'GCP_SERVICE_ACCOUNT',
          description: '具備 Cloud Run Developer 與 Artifact Registry Writer 權限的服務帳戶',
          exampleValue: 'github-deployer@my-proj.iam.gserviceaccount.com',
          scope: 'Actions',
        },
      ],
      readmeInstructions: `### 🚀 快速開始
1. 複製專案後執行 \`npm install\`。
2. 複製 \`.env.example\` 為 \`.env\`，並填入由 Google AI Studio 取得之 \`GEMINI_API_KEY\`。
3. 嚴禁將 \`.env\` 或金鑰簽入 Git！請確認 \`git status\` 中未顯示任何機密檔案。
4. 本地啟動：\`npm run dev\`，測試端點：\`curl http://localhost:8080/healthz\`。`,
    },
    deployment: {
      serviceName: 'enterprise-rag-api',
      cloudService: 'Google Cloud Run (全託管無伺服器容器)',
      architectureFlow: [
        '1. 工程師推播程式碼至 GitHub `main` 分支',
        '2. GitHub Actions 觸發 CI 測試並透過 Workload Identity 取得短期 GCP Token',
        '3. 建立 Multi-stage Docker Image 並推送至 Google Artifact Registry',
        '4. Cloud Run 自動拉取新版本容器，透過 Secret Manager 動態掛載 GEMINI_API_KEY',
        '5. 服務具備 Scale-to-Zero 能力，未有請求時費用為 0，遇突發流量秒級自動擴展至 N 實例',
      ],
      dockerfile: `# ---- Stage 1: Build ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: Production Runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# 遵循最小權限原則，使用非 root 用戶運行
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 nodejs
USER nodejs

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

CMD ["node", "dist/index.js"]`,
      githubActionsYml: `name: Build & Deploy to Google Cloud Run

on:
  push:
    branches: [ "main" ]

env:
  PROJECT_ID: \${{ secrets.GCP_PROJECT_ID }}
  REGION: asia-east1 # 台灣機房，延遲最低
  SERVICE_NAME: enterprise-rag-api
  IMAGE_NAME: asia-east1-docker.pkg.dev/\${{ secrets.GCP_PROJECT_ID }}/cloudrun-apps/enterprise-rag-api

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # 必備：Workload Identity Federation 認證授權

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Authenticate to Google Cloud (WIF)
      uses: google-github-actions/auth@v2
      with:
        workload_identity_provider: \${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
        service_account: \${{ secrets.GCP_SERVICE_ACCOUNT }}

    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v2

    - name: Configure Docker for Artifact Registry
      run: gcloud auth configure-docker asia-east1-docker.pkg.dev --quiet

    - name: Build and Push Docker Image
      run: |
        docker build -t \${IMAGE_NAME}:\${{ github.sha }} -t \${IMAGE_NAME}:latest .
        docker push \${IMAGE_NAME}:\${{ github.sha }}
        docker push \${IMAGE_NAME}:latest

    - name: Deploy to Cloud Run
      uses: google-github-actions/deploy-cloudrun@v2
      with:
        service: \${{ env.SERVICE_NAME }}
        region: \${{ env.REGION }}
        image: \${{ env.IMAGE_NAME }}:\${{ github.sha }}
        flags: >-
          --allow-unauthenticated
          --min-instances=0
          --max-instances=10
          --memory=512Mi
          --cpu=1
          --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest`,
      healthCheckPath: '/healthz',
      iamBestPractice: '強烈推薦使用 Google Cloud Workload Identity Federation (WIF) 取代傳統 Service Account JSON Key，徹底杜絕金鑰過期或洩漏風險。',
    },
    finOps: {
      pricingModel: {
        inputPerMillion: 0.15,
        outputPerMillion: 0.60,
        cachedInputPerMillion: 0.0375,
      },
      estimatedMonthlyTokenCost: '約 $18.50 USD (以每月 50,000 次查詢，平均每次檢索 4,000 Token 輸入、500 Token 輸出估算)',
      estimatedMonthlyInfraCost: '約 $6.20 USD (Cloud Run 512MB/1vCPU 享受免費額度，搭配 Artifact Registry 儲存費)',
      totalEstimatedMonthly: '約 $24.70 USD / 月 (約合 NT$ 790)',
      costTraps: [
        {
          title: '陷阱 1：檢索 Context 過度膨脹未精煉',
          risk: '直接把 20 頁 PDF 原封不動塞入 Prompt，導致每次提問耗費 50,000+ Tokens，帳單瞬間翻倍 10 倍。',
          severity: 'Critical',
          mitigation: '導入 Reranker 或長度篩選，僅提取 Top-3 最相關段落（控制在 3,000 Tokens 內）。',
        },
        {
          title: '陷阱 2：固定 System Prompt 重複付費',
          risk: '當知識庫基礎手冊超過 32,768 Tokens 時，每次重複發送完整手冊需支付全額輸入費用。',
          severity: 'High',
          mitigation: '啟用 Google AI Studio Context Caching API，可節省 75%~88% 的快取重複讀取費用。',
        },
        {
          title: '陷阱 3：Cloud Run Min-instances 設為大於 0',
          risk: '常時維持 2 台冷啟動備援機器，每月無意義空轉產生 $40+ USD 固定底層開銷。',
          severity: 'Medium',
          mitigation: 'Node.js 容器冷啟動僅需約 1.2 秒，生產預設請設 --min-instances=0 (Scale-to-Zero)。',
        },
      ],
      savingsStrategies: [
        {
          title: 'Context Caching (語境快取機制)',
          mechanism: '將常用公司規章、產品手冊等靜態大資料進行 Gemini Context Cache，命中快取之輸入計費大幅降至 $0.0375 / 1M Tokens。',
          expectedSavings: '節省約 75% ~ 85% 輸入 Token 費用',
          implementationHint: '透過 ai.caches.create() 預先建立快取並設定 TTL 為 24 小時。',
        },
        {
          title: 'Batch API 離線文件索引處理',
          mechanism: '夜間批次處理新上傳文件摘要或自動問答生成時，改用 Gemini Batch API，享 50% 費用折扣。',
          expectedSavings: '批次作業成本直降 50%',
          implementationHint: '適合無即時互動要求之知識庫入庫管線。',
        },
        {
          title: 'Token Budgeting 輸出上限約束',
          mechanism: '嚴格在 GenerationConfig 設定 maxOutputTokens=2048，防止惡意注入或模型陷入無限長文字生成迴圈。',
          expectedSavings: '防範單次異常請求超支與 DoS 風險',
          implementationHint: '配合溫度參數 0.2，輸出收斂迅速。',
        },
      ],
    },
  },
  {
    id: 'customer-care-agent',
    title: '電商智慧多模態客服與訂單處理 Agent (Function Calling)',
    category: 'Agent 自動化',
    summaryTagline: '📌 專案架構與開發藍圖：採用 Gemini 3.8 Flash 工具呼叫 (Tool Calling) 連接 ERP 訂單系統，於 Cloud Run 部署零伺服器安全閘道，實現 24/7 自動退換貨核准與物流追蹤。',
    techStack: ['Gemini 3.8 Flash', 'Tool / Function Calling', 'GCP Cloud Run', 'GitHub Actions', 'FastAPI / Express', 'Secret Manager'],
    cloudTarget: 'GCP Cloud Run',
    recommendedModel: 'gemini-3.8-flash',
    modelRationale: '客服場景需超快反應時間與準確的結構化 Function Call JSON 產出，Gemini 3.8 Flash 具備出色的 Tool Calling 成功率與超低 Token 計費。',
    parameters: {
      temperature: 0.1,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
    systemPrompt: `你是「星光購物」官方智能客服助理。你擁有調用內部系統查詢訂單、確認商品庫存及發起退換貨的授權工具。

【工作守則】
1. 身份認證：在執行任何變更訂單或退款操作前，必須向使用者確認【訂單編號】與【購買者手機末三碼】。
2. 工具使用準則：若使用者提出訂單進度查詢，請主動調用 \`lookup_order_status(order_id)\` 函數，嚴格根據回傳結果如實告知。
3. 禮貌與同理心：若商品延遲送達或缺貨，表達誠摯歉意並提供專屬購物金補償方案說明。
4. 升級人工客服：若使用者情緒激動或提出三次以上無法解決之特殊客訴，主動提供轉接真人客服選項。`,
    fewShotExamples: [
      {
        user: `你好，我昨天訂的衣服什麼時候會送到？訂單編號是 ORD-99281，手機 0912-345-678。`,
        model: `[Tool Call] lookup_order_status({"orderId": "ORD-99281", "phoneSuffix": "678"})
您好！已為您查詢訂單 ORD-99281。目前商品已於今早 08:30 完成理貨出庫，由黑貓宅急便配送中，預計最快將於明日（10/14）下午送達您的指定超商，抵達時將以簡訊通知您領取！`,
        explanation: '觸發結構化工具呼叫並整合外部系統狀態親切回覆。',
      },
    ],
    projectStructure: {
      treeAscii: `customer-care-agent/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── prompts/
│   └── agent_system.md
├── src/
│   ├── tools/
│   │   ├── orderTools.ts          # 訂單查詢與退貨宣告函式 (Tool Declaration)
│   │   └── logisticsTools.ts      # 宅配追蹤串接
│   ├── handlers/
│   │   └── chatHandler.ts         # Agent 迴圈與 Tool 執行委派
│   ├── server.ts                  # Webhook API 伺服器
│   └── config.ts
├── .env.example
├── .gitignore
├── Dockerfile
└── package.json`,
      files: [
        {
          path: '.env.example',
          description: '金鑰設定範本',
          content: `GEMINI_API_KEY="AIzaSyCustomerCareAgentKey"
ERP_API_BASE_URL="https://api.erp.internal"
ERP_SECRET_TOKEN="token_placeholder"
PORT=8080`,
        },
        {
          path: '.gitignore',
          description: 'Git 忽略設定',
          content: `.env\n.env.*\nnode_modules/\ndist/\n*.log`,
        },
      ],
    },
    securitySpec: {
      gitignoreItems: ['.env', '.env.*', 'credentials.json', 'node_modules/', 'dist/'],
      envExample: `GEMINI_API_KEY="AIzaSyPlaceholderKey"\nERP_API_BASE_URL="https://erp.example.com"`,
      githubSecrets: [
        {
          name: 'GEMINI_API_KEY',
          description: 'Google AI Studio API Key',
          exampleValue: 'AIzaSy*****',
          scope: 'Actions',
        },
        {
          name: 'ERP_SECRET_TOKEN',
          description: '企業 ERP 內部系統存取金鑰',
          exampleValue: 'erp_sec_***',
          scope: 'Actions',
        },
      ],
      readmeInstructions: '嚴格禁止將 ERP 金鑰簽入專案，請在 GCP Secret Manager 建立並透過 Cloud Run 注入。',
    },
    deployment: {
      serviceName: 'ecommerce-care-agent',
      cloudService: 'Google Cloud Run',
      architectureFlow: [
        '用戶 LINE/Web 聊天室發送文字或圖片',
        'Cloud Run Webhook 接收並調用 Gemini 3.8 Flash',
        '模型判斷是否呼叫 ERP 工具 API',
        '後端執行 ERP 邏輯並將 Tool Response 送回 Gemini',
        'Gemini 輸出最終同理心客服回覆',
      ],
      dockerfile: `FROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY --from=build /app/dist ./dist\nEXPOSE 8080\nCMD ["node", "dist/server.js"]`,
      githubActionsYml: `name: Deploy Customer Care Agent\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n    - name: Deploy to Cloud Run\n      run: echo "Automated Deploy via Artifact Registry and Cloud Run"`,
      healthCheckPath: '/healthz',
      iamBestPractice: '為 Cloud Run 指定獨立 Service Account，僅授予 Secret Manager Secret Accessor 權限。',
    },
    finOps: {
      pricingModel: {
        inputPerMillion: 0.15,
        outputPerMillion: 0.60,
        cachedInputPerMillion: 0.0375,
      },
      estimatedMonthlyTokenCost: '約 $12.00 USD (每月 30,000 通客服對話)',
      estimatedMonthlyInfraCost: '約 $5.00 USD (Cloud Run + Secret Manager)',
      totalEstimatedMonthly: '約 $17.00 USD / 月',
      costTraps: [
        {
          title: '陷阱 1：對話歷史未做滑動視窗 (Sliding Window)',
          risk: '隨對話輪數增加，每次送出累積數十輪對話歷史，導致 Token 呈二次方暴增。',
          severity: 'Critical',
          mitigation: '實施滑動視窗或摘要機制，僅保留最近 4 輪對話與關鍵訂單狀態摘要。',
        },
        {
          title: '陷阱 2：Function Declaration Schema 描述過度冗長',
          risk: '把 50 個無關的 API 完整 JSON Schema 全部塞在每一輪請求中，白白消耗大量輸入 Tokens。',
          severity: 'Medium',
          mitigation: '動態依據用戶意圖篩選所需之 Tool 子集，避免全面無差別傳遞。',
        },
      ],
      savingsStrategies: [
        {
          title: '工具定義 Context Caching',
          mechanism: '若固定有 15 個以上複雜工具宣告與客服 System Prompt，快取系統架構，大幅降低輸入費用。',
          expectedSavings: '節省約 70% 提示詞重複計費',
          implementationHint: '固定系統指令與 Tool Definitions，單一快取實例複用。',
        },
      ],
    },
  },
  {
    id: 'devsecops-code-reviewer',
    title: 'AI 程式碼審查與資安弱點稽核 GitHub Actions Bot',
    category: 'CI/CD DevSecOps',
    summaryTagline: '📌 專案架構與開發藍圖：整合 Gemini 3.8 Flash 與 GitHub Actions 自動化管線，在 Pull Request 建立時自動執行 OWASP Top 10 資安弱點掃描、Code Smell 建議與行內註解 (Inline Comments)。',
    techStack: ['Gemini 3.8 Flash', 'GitHub Actions', 'GitHub Octokit API', 'TypeScript / Node.js', 'Docker'],
    cloudTarget: 'GCP Cloud Run',
    recommendedModel: 'gemini-3.8-flash',
    modelRationale: '程式碼審查需精確理解 diff、辨識語法錯誤與隱私金鑰洩漏風險。Gemini 3.8 Flash 在程式碼分析基準上表現優異，且 Token 計費低廉，適合頻繁 PR 觸發。',
    parameters: {
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 2048,
    },
    systemPrompt: `你是一位資深 DevSecOps 雲端架構與程式碼安全審查專家 (AI Code Reviewer)。
你的目標是審查開發者提交之 Pull Request Git Diff，揪出安全隱患、效能瓶頸及潛在 Bug。

【審查重點】
1. 機密資訊洩漏：檢查程式碼是否硬編碼 API Key、密碼、Token 或 AWS/GCP 憑證。
2. 安全弱點：SQL Injection、XSS、路徑穿越、不安全的反序列化、未處理的非同步例外。
3. 效能與最佳實踐：N+1 查詢、記憶體洩漏、未關閉的連線池。
4. 結構化格式：以 Markdown 輸出，提供具體改善程式碼建議（包含 Before / After 範例）。`,
    fewShotExamples: [
      {
        user: `[File: src/db.ts]
+ const client = new Client({ connectionString: "postgresql://postgres:Admin123@prod-db.internal/app" });
+ export const getUser = (id) => client.query("SELECT * FROM users WHERE id = " + id);`,
        model: `### 🚨 嚴重資安與架構問題警告

1. **硬編碼資料庫密碼 (CWE-798: Critical)**
- 問題：資料庫連線字串內含明文密碼 \`Admin123\`。
- 改善：請立即撤換該密碼，並改用環境變數讀取：
\`\`\`typescript
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
\`\`\`

2. **SQL 注入弱點 (CWE-89: High)**
- 問題：使用字串拼接構造 SQL 語法，攻擊者可帶入惡意 \`id\` 提權或拖庫。
- 改善：請改用參數化查詢 (Parameterized Query)：
\`\`\`typescript
export const getUser = (id: string) => client.query("SELECT * FROM users WHERE id = $1", [id]);
\`\`\``,
        explanation: '精準指出 CWE 編號、嚴重等級與可直接套用的修復範例。',
      },
    ],
    projectStructure: {
      treeAscii: `devsecops-ai-reviewer/
├── .github/
│   └── workflows/
│       └── ai-pr-review.yml       # 當 PR 開啟時自動執行 AI 審查
├── src/
│   ├── github/
│   │   ├── diffParser.ts          # 解析 PR Git Diff 並過濾非程式碼檔案
│   │   └── prCommenter.ts         # 將審查結果回寫為 PR 行內評論
│   ├── review/
│   │   └── promptBuilder.ts       # 構造包含 OWASP 標準之提示詞
│   └── index.ts
├── .env.example
├── .gitignore
├── action.yml                     # 自定義 GitHub Action 定義檔
└── package.json`,
      files: [
        {
          path: '.github/workflows/ai-pr-review.yml',
          description: 'PR 觸發時執行的自動化工作流',
          content: `name: AI Code & Security Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write # 需寫入 PR 審查評論

    steps:
    - name: Checkout
      uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 22

    - name: Run AI Reviewer
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
      run: |
        npm ci
        npx tsx src/index.ts`,
        },
      ],
    },
    securitySpec: {
      gitignoreItems: ['.env', 'node_modules/', 'dist/'],
      envExample: `GEMINI_API_KEY="AIzaSyPlaceholder"\nGITHUB_TOKEN="ghp_placeholder"`,
      githubSecrets: [
        {
          name: 'GEMINI_API_KEY',
          description: 'AI Studio 生成之金鑰',
          exampleValue: 'AIzaSy*****',
          scope: 'Actions',
        },
      ],
      readmeInstructions: '在 GitHub 倉庫設定 Secrets > Actions，新增 GEMINI_API_KEY。',
    },
    deployment: {
      serviceName: 'github-action-ai-reviewer',
      cloudService: 'GitHub-Hosted Runners + Gemini API',
      architectureFlow: [
        '開發者提交 PR，GitHub Actions 事件觸發 runner',
        'diffParser 抓取變更檔案，自動過濾 package-lock.json、SVG 與圖片檔案',
        '將程式碼差異切片發送至 Gemini 3.8 Flash 進行資安稽核',
        '透過 GitHub REST API 將違規項目精準貼回 PR Specific Code Line',
      ],
      dockerfile: `FROM node:22-alpine\nWORKDIR /action\nCOPY . .\nRUN npm ci\nENTRYPOINT ["npx", "tsx", "src/index.ts"]`,
      githubActionsYml: `name: Run Reviewer\non: [pull_request]\njobs:\n  run:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4`,
      healthCheckPath: 'N/A (CLI / Action)',
      iamBestPractice: '僅使用 GitHub Actions 自動生成的短期 GITHUB_TOKEN，權限最小化僅開啟 pull-requests: write。',
    },
    finOps: {
      pricingModel: {
        inputPerMillion: 0.15,
        outputPerMillion: 0.60,
        cachedInputPerMillion: 0.0375,
      },
      estimatedMonthlyTokenCost: '約 $3.50 USD (以團隊每月 400 次 PR 審查估算)',
      estimatedMonthlyInfraCost: '$0.00 USD (使用 GitHub Actions 免費額度 2,000 分鐘/月)',
      totalEstimatedMonthly: '約 $3.50 USD / 月 (約 NT$ 110)',
      costTraps: [
        {
          title: '陷阱 1：將 package-lock.json 或自動生成代碼發給 AI',
          risk: '單次 PR 的 lockfile 可能包含數萬行 JSON，浪費 100,000+ Tokens 且毫無審查意義。',
          severity: 'Critical',
          mitigation: '在 diffParser 加入嚴格副檔名與檔案過濾黑名單（排除 lock、min.js、svg、map）。',
        },
      ],
      savingsStrategies: [
        {
          title: 'Diff-only Slicing (僅傳遞變更差異行)',
          mechanism: '不要傳送整份完整檔案，僅擷取前後各 5 行 Context 的 Git Hunk 區塊。',
          expectedSavings: '節省高達 80% Token 消耗',
          implementationHint: '使用 git diff -U5 參數控制上下文邊界。',
        },
      ],
    },
  },
  {
    id: 'live-meeting-assistant',
    title: '即時雙向音訊會議摘要與即時翻譯系統 (Gemini 3.8 Live API)',
    category: '多模態即時服務',
    summaryTagline: '📌 專案架構與開發藍圖：採用全新 Gemini 3.8 Live API 透過雙向 WebSocket 傳輸串流音訊，結合 Cloud Run 容器支援長連線，實現超低延遲會議即時逐字稿與行動代辦 (Action Items) 自動提煉。',
    techStack: ['Gemini 3.8 Live API', 'WebSocket', 'GCP Cloud Run', 'WebRTC / PCM Audio', 'TypeScript'],
    cloudTarget: 'GCP Cloud Run',
    recommendedModel: 'gemini-3.8-live',
    modelRationale: '專為低延遲雙向串流語音/視訊設計之旗艦模型，支援原生音訊直接輸入與輸出，無須經過傳統 STT -> LLM -> TTS 三段式延遲拼裝。',
    parameters: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
    systemPrompt: `你是企業高階會議即時秘書。你正透過即時音訊串流連線聆聽跨國商務會議。
你的職責：
1. 實時抓取發言重點並標記發言者與時間戳記。
2. 若發言語言為日文或英文，同步以正體中文在側欄提供關鍵詞對應翻譯。
3. 偵測到代辦事項（如「某某人請在週五前完成簡報」）時，即時標記為 [ACTION ITEM]。`,
    fewShotExamples: [
      {
        user: `[Audio Stream Input: "Alex, could you please review the Q3 budget spreadsheet and send me the revisions by this Thursday?"]`,
        model: `[即時摘要] 專案負責人指派 Alex 審閱 Q3 預算報表。
[ACTION ITEM] 👤 負責人: Alex | 📋 任務: 審閱 Q3 預算報表並回傳修訂版 | ⏰ 期限: 本週四`,
        explanation: '即時解析口語意圖並結構化輸出行動清單。',
      },
    ],
    projectStructure: {
      treeAscii: `meeting-live-gateway/
├── src/
│   ├── websocket/
│   │   └── liveSession.ts         # 轉發用戶端 PCM 16kHz 音訊至 Gemini Live API
│   ├── audio/
│   │   └── pcmBuffer.ts           # 音訊分塊與緩衝
│   └── server.ts                  # Cloud Run 8080 WebSocket 伺服器
├── Dockerfile
├── .env.example
└── package.json`,
      files: [
        {
          path: '.env.example',
          description: '環境變數設定',
          content: 'GEMINI_API_KEY="AIzaSyLiveApiKey"\nPORT=8080\nMAX_SESSION_DURATION_MINUTES=60',
        },
      ],
    },
    securitySpec: {
      gitignoreItems: ['.env', 'node_modules/'],
      envExample: 'GEMINI_API_KEY="AIzaSyPlaceholder"',
      githubSecrets: [
        {
          name: 'GEMINI_API_KEY',
          description: 'Gemini Live API 憑證',
          exampleValue: 'AIzaSy***',
          scope: 'Actions',
        },
      ],
      readmeInstructions: 'Cloud Run 部署時需開啟 Session Affinity 並將 request timeout 設為 3600 秒以支援會議 WebSocket。',
    },
    deployment: {
      serviceName: 'meeting-live-gateway',
      cloudService: 'Google Cloud Run (開啟 WebSockets & 3600s 逾時)',
      architectureFlow: [
        '瀏覽器端 AudioContext 採集 16kHz PCM 音訊',
        '透過 WSS 傳送至 Cloud Run Gateway',
        'Gateway 建立雙向 gRPC/WebSocket 連線至 Gemini 3.8 Live API',
        'Gemini 即時返回 Delta 文本與結構化事件通知',
      ],
      dockerfile: `FROM node:22-alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\nEXPOSE 8080\nCMD ["node", "dist/server.js"]`,
      githubActionsYml: `name: Deploy Live Gateway\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4`,
      healthCheckPath: '/healthz',
      iamBestPractice: '限制 WebSocket 連線驗證 Token 需包含簽章，避免未經授權佔用即時連線。',
    },
    finOps: {
      pricingModel: {
        inputPerMillion: 0.30,
        outputPerMillion: 1.20,
        cachedInputPerMillion: 0.10,
      },
      estimatedMonthlyTokenCost: '約 $45.00 USD (以每週 10 場 1 小時會議音訊即時連線估算)',
      estimatedMonthlyInfraCost: '約 $12.00 USD (Cloud Run 長時間連線 CPU 佔用費用)',
      totalEstimatedMonthly: '約 $57.00 USD / 月',
      costTraps: [
        {
          title: '陷阱 1：會議靜音或閒置未中斷連線 (Zombie WebSocket)',
          risk: '會議結束後使用者忘記關閉分頁，後台持續串流無效靜音數據，造成 API Token 與 Cloud Run 雙重計費。',
          severity: 'Critical',
          mitigation: '加入靜音偵測 (VAD) 與 60 秒無發言自動暫停串流機制，強制釋放閒置連線。',
        },
      ],
      savingsStrategies: [
        {
          title: '語音活動偵測 (Voice Activity Detection - VAD)',
          mechanism: '在前端瀏覽器端先透過 Web Audio API 進行能量門檻過濾，僅在有人說話時才上傳音訊封包。',
          expectedSavings: '節省 40% ~ 60% 冗餘音訊傳輸與分析費用',
          implementationHint: '使用輕量級 Meyda 或 WebRTC VAD 演算法。',
        },
      ],
    },
  },
  {
    id: 'batch-marketing-engine',
    title: '多語言行銷文案批次生產與在地化引擎 (Batch API FinOps)',
    category: '批次數據管線',
    summaryTagline: '📌 專案架構與開發藍圖：利用 Gemini 3.8 Flash Batch Prediction API 享 50% 折扣優惠，搭配 Cloud Storage 與 Cloud Run Jobs 建立極度低成本、自動化之數萬篇電商 SEO 內容生成工廠。',
    techStack: ['Gemini 3.8 Flash Batch API', 'GCP Cloud Run Jobs', 'Cloud Storage (GCS)', 'Python / TypeScript', 'GitHub Actions'],
    cloudTarget: 'GCP Cloud Run',
    recommendedModel: 'gemini-3.8-flash',
    modelRationale: '批次工作不需要毫秒級即時互動回應，使用 Gemini Batch API 可享半價優惠（50% Discount），適合非即時的海量文字生成。',
    parameters: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    systemPrompt: `你是全球跨境電商 SEO 文案總監。根據輸入的產品規格與目標國家語言（正體中文、日文、英文、德文），產出吸睛、具備高轉換率且符合當地文化語境的行銷描述。`,
    fewShotExamples: [
      {
        user: `[產品: 降噪藍牙耳機 | 目標市場: 日本 | 特色: 40小時續航, 極致降噪, 輕量化設計]`,
        model: `【靜寂の極み、驚異の40時間連続再生】
忙しい都会の喧騒を、ボタン一つであなただけの特別な音楽空間へ。わずか210gの羽のような軽さで、一日中着けていてもストレスフリー。出張も通勤も、これ一台で充電の不安から解放されます。`,
        explanation: '符合目標語言在地文化語境的高水準文案。',
      },
    ],
    projectStructure: {
      treeAscii: `batch-marketing-pipeline/
├── src/
│   ├── batchJob.ts                # 讀取 CSV 建立 Batch JSONL 請求檔
│   └── uploader.ts                # 上傳至 GCS 並呼叫 Batch API
├── Dockerfile
├── .env.example
└── package.json`,
      files: [
        {
          path: '.env.example',
          description: '環境變數設定',
          content: 'GEMINI_API_KEY="AIzaSyBatchKey"\nGCS_BUCKET_NAME="marketing-batch-output"',
        },
      ],
    },
    securitySpec: {
      gitignoreItems: ['.env', 'data/output/*.jsonl'],
      envExample: 'GEMINI_API_KEY="AIzaSyPlaceholder"',
      githubSecrets: [
        {
          name: 'GEMINI_API_KEY',
          description: 'Gemini API 金鑰',
          exampleValue: 'AIzaSy***',
          scope: 'Actions',
        },
      ],
      readmeInstructions: '利用 Cloud Run Jobs 排程觸發，完成後自動終止容器，不浪費任何伺服器費用。',
    },
    deployment: {
      serviceName: 'marketing-batch-job',
      cloudService: 'Google Cloud Run Jobs (無伺服器批次作業)',
      architectureFlow: [
        '營運團隊將 1,000 筆商品資料上傳至 GCS 儲存庫',
        'Cloud Scheduler 於夜間 02:00 觸發 Cloud Run Job',
        'Job 打包 JSONL 檔案並呼叫 Gemini Batch API (享 50% 折扣)',
        '隔日 06:00 提取完成結果並寫回資料庫，容器執行完畢自動關閉 (0 伺服器常態開銷)',
      ],
      dockerfile: `FROM node:22-alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\nCMD ["node", "dist/batchJob.js"]`,
      githubActionsYml: `name: Deploy Batch Job\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4`,
      healthCheckPath: 'N/A (Job 模式)',
      iamBestPractice: '透過 Cloud IAM 授予 Cloud Run Job 專用 GCS Object Admin 權限。',
    },
    finOps: {
      pricingModel: {
        inputPerMillion: 0.075, // 50% off
        outputPerMillion: 0.30,  // 50% off
        cachedInputPerMillion: 0.01875,
      },
      estimatedMonthlyTokenCost: '約 $4.50 USD (生成 10,000 篇商品文案，享受 Batch 50% 折扣後)',
      estimatedMonthlyInfraCost: '約 $0.80 USD (Cloud Run Job 每日僅執行 5 分鐘 + GCS 儲存費)',
      totalEstimatedMonthly: '約 $5.30 USD / 月',
      costTraps: [
        {
          title: '陷阱 1：對非緊急批次任務使用即時 API',
          risk: '在白天尖峰時間以普通即時 generateContent 呼叫 10,000 次，白白付出 2 倍全額費用。',
          severity: 'High',
          mitigation: '嚴格規範非同步數據管線全數走 Batch API，享受 50% 成本節省。',
        },
      ],
      savingsStrategies: [
        {
          title: 'Gemini Batch API 降本機制',
          mechanism: '批次處理容許在 24 小時內回傳結果，Google 官方直接給予 50% Token 折扣。',
          expectedSavings: '全額節省 50% API 費用',
          implementationHint: '使用 ai.batches.create() 並以 JSONL 檔案作為輸入。',
        },
      ],
    },
  },
  {
    id: 'healthcare-pii-redaction',
    title: '醫療病歷結構化與個資 (PII) 隱私去識別化服務',
    category: '自訂企業架構',
    summaryTagline: '📌 專案架構與開發藍圖：以 Gemini 3.8 Flash 搭配結構化 JSON Schema 輸出與專用 VPC 隔離 Cloud Run，自動遮蔽健保卡號、姓名與病歷機密個資，符合 HIPAA/GDPR 隱私法遵。',
    techStack: ['Gemini 3.8 Flash', 'GCP Private Cloud Run', 'VPC Service Controls', 'TypeScript', 'Secret Manager'],
    cloudTarget: 'GCP Cloud Run',
    recommendedModel: 'gemini-3.8-flash',
    modelRationale: '具備極佳的實體辨識 (NER) 能力，並支援 responseSchema 嚴格保證產出無個資殘留之 JSON，每百萬輸入 Token 僅 $0.15。',
    parameters: {
      temperature: 0.0,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
    systemPrompt: `你是醫療數據隱私保護與個資去識別化稽核專家。
當接收到醫生病歷、檢驗筆記或護理記錄時，你的首要任務是：
1. 找出並徹底替換所有個人直接與間接識別資訊（PII）：
   - 姓名 ➔ [PATIENT_NAME_MASKED]
   - 身分證/居留證字號 ➔ [NATIONAL_ID_MASKED]
   - 聯絡電話/地址 ➔ [CONTACT_INFO_MASKED]
   - 醫院病歷號 (MRN) ➔ [MRN_MASKED]
2. 保留所有醫學術語、劑量、檢驗數值與診斷代碼 (ICD-10) 之完整性。
3. 輸出乾淨的標準化結構。`,
    fewShotExamples: [
      {
        user: `病患陳曉明（身分證字號 A123456789，病歷號 990182）今日至心臟內科門診。主訴胸悶三日，血壓 145/95 mmHg，給予 Amlodipine 5mg QD。`,
        model: `病患 [PATIENT_NAME_MASKED]（身分證字號 [NATIONAL_ID_MASKED]，病歷號 [MRN_MASKED]）今日至心臟內科門診。主訴胸悶三日，血壓 145/95 mmHg，給予 Amlodipine 5mg QD。
[審計摘要: 已遮蔽姓名 1 處、身分證號 1 處、病歷號 1 處。醫學處方與數值完整保留。]`,
        explanation: '確保個資完整遮蔽，同時醫學數據零失真。',
      },
    ],
    projectStructure: {
      treeAscii: `healthcare-redaction-svc/
├── src/
│   ├── rules/
│   │   └── regexPreFilter.ts      # 確定性正則表達式快速預篩 (省 Token)
│   ├── redaction/
│   │   └── geminiRedactor.ts      # 語義層次模糊個資遮蔽
│   └── server.ts
├── Dockerfile
├── .env.example
└── package.json`,
      files: [
        {
          path: '.env.example',
          description: '環境變數',
          content: 'GEMINI_API_KEY="AIzaSyHealthcareKey"\nVPC_CONNECTOR_NAME="healthcare-vpc"',
        },
      ],
    },
    securitySpec: {
      gitignoreItems: ['.env', 'test-data/*.txt', 'node_modules/'],
      envExample: 'GEMINI_API_KEY="AIzaSyPlaceholder"',
      githubSecrets: [
        {
          name: 'GEMINI_API_KEY',
          description: 'AI Studio 金鑰 (需存放於 Secret Manager)',
          exampleValue: 'AIzaSy***',
          scope: 'Actions',
        },
      ],
      readmeInstructions: '本服務處理醫療數據，嚴禁透過公開網際網路直連，必須透過 Cloud Run 專用 VPC 存取。',
    },
    deployment: {
      serviceName: 'healthcare-redact-api',
      cloudService: 'Google Cloud Run (VPC Private Endpoint + Secret Manager)',
      architectureFlow: [
        '院內 HIS/EMR 系統透過 VPC 內網發送原始病歷至 Cloud Run',
        '前置處理模組先行以確定性 Regex 清理標準格式身分證號',
        '非結構化對話紀錄傳送至 Gemini 3.8 Flash 完成語境級 PII 遮蔽',
        '回傳去識別化資料予研究資料庫，全程無金鑰外洩或數據留存',
      ],
      dockerfile: `FROM node:22-alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\nEXPOSE 8080\nCMD ["node", "dist/server.js"]`,
      githubActionsYml: `name: Deploy Healthcare Redactor\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4`,
      healthCheckPath: '/healthz',
      iamBestPractice: '在 GCP 啟用 VPC Service Controls，限定資料傳輸範圍在授權邊界內。',
    },
    finOps: {
      pricingModel: {
        inputPerMillion: 0.15,
        outputPerMillion: 0.60,
        cachedInputPerMillion: 0.0375,
      },
      estimatedMonthlyTokenCost: '約 $15.00 USD (每月 40,000 份病歷摘要遮蔽)',
      estimatedMonthlyInfraCost: '約 $9.00 USD (Cloud Run + VPC Connector)',
      totalEstimatedMonthly: '約 $24.00 USD / 月',
      costTraps: [
        {
          title: '陷阱 1：未做本機 Regex 預過濾，全部送給 LLM',
          risk: '標準格式的台灣身分證字號與手機號碼可透過本機 Regex 秒級過濾，全部仰賴 LLM 會增加 2-3 倍 Token 成本與延遲。',
          severity: 'High',
          mitigation: '採用混合架構：本地端 Regex 預過濾 ➔ Gemini 處理非結構化上下文模糊個資。',
        },
      ],
      savingsStrategies: [
        {
          title: '混合式預篩漏斗架構 (Hybrid Pipeline)',
          mechanism: '本地先行 Regex 確定性遮蔽已知欄位，縮減 LLM 需推論之字元長度。',
          expectedSavings: '節省約 40% 的 Token 與回應延遲',
          implementationHint: '在發送 Gemini 請求前執行 regexPreFilter()。',
        },
      ],
    },
  },
];

// Helper to synthesize a structured architecture blueprint from any user query
export function synthesizeCustomBlueprint(userQuery: string, cloudTarget: string = 'GCP Cloud Run', modelName: string = 'gemini-3.8-flash'): ArchitectureBlueprint {
  const cleanQuery = userQuery.trim();
  const slug = cleanQuery.slice(0, 15).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
  const serviceId = `ai-service-${Date.now().toString().slice(-4)}`;

  return {
    id: `custom-${Date.now()}`,
    title: cleanQuery.length > 25 ? `${cleanQuery.slice(0, 25)}... 架構藍圖` : `${cleanQuery} 架構藍圖`,
    category: '自訂企業架構',
    summaryTagline: `📌 專案架構與開發藍圖：採用 ${modelName} 配合 ${cloudTarget} 完全無伺服器容器架構，並以 GitHub Actions 串接 CI/CD 與自動化金鑰隔離，打造針對「${cleanQuery}」之高可用、低延遲且嚴密防護金鑰的企業級 AI 生產系統。`,
    techStack: [modelName, cloudTarget, 'GitHub Actions CI/CD', 'Docker', 'Secret Manager', 'Node.js / TypeScript'],
    cloudTarget: cloudTarget as any,
    recommendedModel: modelName as any,
    modelRationale: `${modelName} 提供百萬 Token 視窗、出色推理品質與低延遲表現，每百萬輸入 Token 僅 $0.15，是落實企業級高頻應用的黃金性價比首選。`,
    parameters: {
      temperature: 0.3,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
    systemPrompt: `你是針對「${cleanQuery}」設計之專業企業級 AI 智能架構助手。

【角色任務與規範】
1. 嚴謹專業：始終依據使用者指令與相關領域標準流程給出清晰、精確且可落地的建議。
2. 結構化輸出：優先採用清晰的 Markdown 階層、條列清單與程式碼區塊。
3. 安全與防護原則：嚴禁洩露內部機密資料、金鑰或敏感憑證；若涉及金鑰設定，始終強調透過環境變數與安全管理庫注入。
4. 繁體中文語境：維持專業、得體且高度精練的技術語調。`,
    fewShotExamples: [
      {
        user: `請針對「${cleanQuery}」的核心任務，提供首發測試指令範例。`,
        model: `已為您完成核心處理流程。以下為執行範例輸出：\n\n- 處理狀態: ✅ 成功解析\n- 關鍵指標: 延遲 < 850ms | 品質評分: 9.6/10\n- 建議後續行動: 請將結果透過 Webhook 非同步推播至下游通知服務。`,
        explanation: '結構化執行回報範例。',
      },
    ],
    projectStructure: {
      treeAscii: `${serviceId}/
├── .github/
│   └── workflows/
│       ├── test.yml               # 自動化單元測試與 Lint 稽核
│       └── deploy.yml             # 主幹合併後自動打包與部署至 ${cloudTarget}
├── prompts/
│   ├── system_instructions.md     # AI Studio 驗證通過之 System Prompt
│   └── config.json                # 模型溫度與參數調校檔案
├── src/
│   ├── config/
│   │   ├── env.ts                 # 強型別環境變數驗證 (防呆機制)
│   │   └── geminiClient.ts        # @google/genai SDK 單例客戶端
│   ├── controllers/
│   │   └── coreController.ts      # 核心業務邏輯與 API 轉發
│   ├── services/
│   │   └── aiService.ts           # 呼叫 ${modelName} 之核心封裝
│   ├── index.ts                   # 伺服器啟動入口 (監聽 PORT 8080)
│   └── types.ts
├── .dockerignore
├── .env.example                   # 金鑰範本 (禁止提交機密)
├── .gitignore                     # 必填金鑰防護清單
├── Dockerfile                     # Multi-stage 輕量安全容器鏡像
├── README.md                      # 工程團隊建置指南
├── package.json
└── tsconfig.json`,
      files: [
        {
          path: '.env.example',
          description: '環境變數範例檔',
          content: `# Google AI Studio 金鑰 (由 AI Studio 控制台取得)
GEMINI_API_KEY="AIzaSyYourGeneratedApiKeyHere"

# 服務設定
PORT=8080
NODE_ENV="production"`,
        },
        {
          path: '.gitignore',
          description: 'Git 版本控制忽略檔',
          content: `# 機密金鑰與設定 (絕不可提交)
.env
.env.*
!.env.example
*.pem
*.key
credentials.json
service-account*.json

# 依賴與編譯目錄
node_modules/
dist/
dist-server/
.DS_Store`,
        },
      ],
    },
    securitySpec: {
      gitignoreItems: ['.env', '.env.*', '*.pem', '*.key', 'credentials.json', 'node_modules/', 'dist/'],
      envExample: `GEMINI_API_KEY="AIzaSyPlaceholderKey"\nPORT=8080\nNODE_ENV="production"`,
      githubSecrets: [
        {
          name: 'GEMINI_API_KEY',
          description: 'Google AI Studio API Key，嚴格保存在 GitHub 倉庫 Secrets',
          exampleValue: 'AIzaSy*****',
          scope: 'Actions',
        },
        {
          name: 'GCP_WORKLOAD_IDENTITY_PROVIDER',
          description: 'Google Cloud Workload Identity Federation (無實體金鑰安全認證)',
          exampleValue: 'projects/123/locations/global/workloadIdentityPools/...',
          scope: 'Actions',
        },
        {
          name: 'GCP_SERVICE_ACCOUNT',
          description: '部署所使用之最小權限 Service Account',
          exampleValue: 'sa-deployer@my-proj.iam.gserviceaccount.com',
          scope: 'Actions',
        },
      ],
      readmeInstructions: `### 🔐 安全規範指引
1. 請絕不將 \`.env\` 簽入任何 Git 分支。
2. 在 GitHub 倉庫中前往 Settings ➔ Secrets and variables ➔ Actions，新增 \`GEMINI_API_KEY\`。
3. 本地開發時，請將 \`.env.example\` 複製為 \`.env\` 並填入測試金鑰。`,
    },
    deployment: {
      serviceName: serviceId,
      cloudService: `${cloudTarget} (完全託管無伺服器容器)`,
      architectureFlow: [
        '1. 開發者完成程式碼與 Prompt 驗證後，發起 Pull Request 合併至 `main`',
        '2. GitHub Actions 觸發 CI 測試並構建 Multi-stage Docker Image',
        '3. 映像檔推播至 Google Artifact Registry 容器倉庫',
        '4. 自動部屬至 Cloud Run，透過 Secret Manager 動態掛載 GEMINI_API_KEY',
        '5. 容器預設開啟 Scale-to-Zero，無流量時不產生伺服器運算費用',
      ],
      dockerfile: `# Multi-stage Build for Maximum Security & Minimum Image Size
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
USER nodejs

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

CMD ["node", "dist/index.js"]`,
      githubActionsYml: `name: Build & Deploy to ${cloudTarget}

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Authenticate to Google Cloud (Workload Identity)
      uses: google-github-actions/auth@v2
      with:
        workload_identity_provider: \${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
        service_account: \${{ secrets.GCP_SERVICE_ACCOUNT }}

    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v2

    - name: Deploy to Cloud Run
      uses: google-github-actions/deploy-cloudrun@v2
      with:
        service: ${serviceId}
        region: asia-east1
        source: ./
        flags: >-
          --allow-unauthenticated
          --min-instances=0
          --max-instances=10
          --memory=512Mi
          --cpu=1
          --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest`,
      healthCheckPath: '/healthz',
      iamBestPractice: '採用 Workload Identity Federation 取代靜態 Service Account JSON 金鑰檔案，徹底杜絕金鑰過期與資安洩漏。',
    },
    finOps: {
      pricingModel: {
        inputPerMillion: 0.15,
        outputPerMillion: 0.60,
        cachedInputPerMillion: 0.0375,
      },
      estimatedMonthlyTokenCost: '約 $15.00 USD (以每月 30,000 次 API 請求，每次約 2,500 Tokens 估算)',
      estimatedMonthlyInfraCost: '約 $5.50 USD (Cloud Run 享受每月免費運算時間，僅酌收輕量儲存與網路費用)',
      totalEstimatedMonthly: '約 $20.50 USD / 月 (約合 NT$ 650)',
      costTraps: [
        {
          title: '陷阱 1：System Instructions 未進行 Context Caching',
          risk: '若系統提示詞或領域知識手冊超過數萬字，每次未快取請求皆付全額輸入費。',
          severity: 'High',
          mitigation: '將固定知識庫提示詞啟用 Context Caching，單項成本下降 75% 以上。',
        },
        {
          title: '陷阱 2：未設定 Max Instances 導致突發流量費用失控',
          risk: '遭爬蟲或惡意高併發刷請求時，無伺服器無限制自動擴展至數百台實例造成超支。',
          severity: 'Critical',
          mitigation: '在 Cloud Run 嚴格設定 --max-instances=10，並配合 Cloud Armor 或 API Gateway 速率限制 (Rate Limiting)。',
        },
      ],
      savingsStrategies: [
        {
          title: 'Context Caching (語境快取)',
          mechanism: '固定知識庫提示詞可進行快取，命中時享受極低輸入計費。',
          expectedSavings: '節省 70% ~ 85% 輸入 Token 費用',
          implementationHint: '使用 @google/genai 之 ai.caches 模組。',
        },
        {
          title: 'Scale-to-Zero (零實例冷啟動架構)',
          mechanism: '離峰與夜間無人存取時，Cloud Run 實例自動縮減至 0，完全不耗費伺服器成本。',
          expectedSavings: '節省 100% 離峰伺服器閒置開銷',
          implementationHint: '設定 --min-instances=0。',
        },
      ],
    },
  };
}

// Convert a blueprint to the exact 5-section markdown format requested by the user
export function formatBlueprintAsMarkdown(b: ArchitectureBlueprint): string {
  return `# ${b.title}

${b.summaryTagline}

---

## 🤖 AI Studio System Prompt（直接可複製的指令與參數設定）

- **推薦模型 (Model)**: \`${b.recommendedModel}\`
- **模型選型依據**: ${b.modelRationale}
- **建議參數設定**:
  - Temperature: \`${b.parameters.temperature}\`
  - TopP: \`${b.parameters.topP}\`
  - Max Output Tokens: \`${b.parameters.maxOutputTokens || 2048}\`

### 系統指令 (System Instruction)
\`\`\`markdown
${b.systemPrompt}
\`\`\`

### Few-shot 驗證範例
${b.fewShotExamples.map((ex, idx) => `
#### 範例 ${idx + 1}
- **User**:
\`\`\`
${ex.user}
\`\`\`
- **Model**:
\`\`\`
${ex.model}
\`\`\`
${ex.explanation ? `> *驗證重點: ${ex.explanation}*` : ''}
`).join('\n')}

---

## 📁 GitHub 專案結構與安全規範（樹狀目錄圖、.gitignore 建議與 Secrets 設定說明）

### 檔案目錄配置 (Directory Tree)
\`\`\`text
${b.projectStructure.treeAscii}
\`\`\`

### 金鑰防護與 .gitignore 建議清單
\`\`\`gitignore
${b.securitySpec.gitignoreItems.join('\n')}
\`\`\`

### 環境變數範本 (.env.example)
\`\`\`env
${b.securitySpec.envExample}
\`\`\`

### GitHub Secrets 安全設定說明
| Secret 名稱 | 用途說明 | 範例值 |
|---|---|---|
${b.securitySpec.githubSecrets.map(s => `| \`${s.name}\` | ${s.description} | \`${s.exampleValue}\` |`).join('\n')}

### README.md 建置指引
${b.securitySpec.readmeInstructions}

---

## ☁️ 公有雲部署與 CI/CD 策略（推薦服務、架構說明與 GitHub Actions 提示）

- **推薦公有雲服務**: ${b.deployment.cloudService}
- **架構流程說明**:
${b.deployment.architectureFlow.map(f => `- ${f}`).join('\n')}
- **IAM 與金鑰最佳實踐**: ${b.deployment.iamBestPractice}
- **健康檢查端點**: \`${b.deployment.healthCheckPath}\`

### Dockerfile 範例
\`\`\`dockerfile
${b.deployment.dockerfile}
\`\`\`

### GitHub Actions 自動化部署腳本 (.github/workflows/deploy.yml)
\`\`\`yaml
${b.deployment.githubActionsYml}
\`\`\`

---

## 💰 FinOps 成本拆解與降本策略（預估費用與避坑指南）

### 預估每月總費用
- **Token 消耗預估**: ${b.finOps.estimatedMonthlyTokenCost}
- **雲端基礎設施 (Cloud Run + Storage) 預估**: ${b.finOps.estimatedMonthlyInfraCost}
- **預期每月總營運成本**: **${b.finOps.totalEstimatedMonthly}**

### 架構成本陷阱 (Cost Traps)
${b.finOps.costTraps.map((trap, i) => `
${i + 1}. **${trap.title}** [嚴重等級: ${trap.severity}]
   - **潛在風險**: ${trap.risk}
   - **規避解法**: ${trap.mitigation}
`).join('')}

### 關鍵降本策略 (Cost Optimization)
${b.finOps.savingsStrategies.map((strat, i) => `
${i + 1}. **${strat.title}**
   - **機制說明**: ${strat.mechanism}
   - **預期降本成效**: ${strat.expectedSavings}
   - **落地提示**: ${strat.implementationHint}
`).join('')}
`;
}
