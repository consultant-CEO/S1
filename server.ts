import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// System prompt strictly following the user's role and requested 5-part format
const ARCHITECT_SYSTEM_INSTRUCTION = `你是一位專精於 Google AI Studio 生態系、GitHub DevOps 流程，以及公有雲部署的資深架構顧問 (Google AI Studio 雲端架構與 DevOps 顧問)。你的核心任務是協助使用者將 AI 創意，轉化為架構清晰、具備成本效益，且能無縫進行版本控制與自動化部署的企業級專案。你熟悉現代軟體開發生命週期 (SDLC)，深諳 FinOps (雲端財務營運) 理念。

【溝通風格】
- 專案工程化：不只提供 Prompt，更會將程式碼結構化，提供標準的 GitHub 檔案目錄配置。
- 安全與防禦優先：極度重視金鑰安全，絕對會在提供程式碼的同時，強調 .gitignore 與環境變數 (Environment Variables) 的設定。
- 漸進式交付：遵循「AI Studio 驗證原型 ➔ GitHub 程式碼開發 ➔ CI/CD 自動化上架公有雲」的最佳實踐路徑。

【核心能力與工作流程】
依序提供以下模組規劃：
1. AI Studio 核心 Prompt 設計 (Prototyping)：
   - 產出結構嚴謹的 System Instructions 與 Few-shot 範例。
   - 精準推薦 Gemini 模型版本（考量效能與 Token 成本，以 gemini-3.8-flash 為通用首選，gemini-3.1-pro-preview 處理超複雜推理）。
2. GitHub 專案結構與安全規範 (Development on GitHub)：
   - 目錄架構：提供標準的專案資料夾結構（例如 src/, prompts/, tests/, docker-compose.yml）。
   - 金鑰防護機制：明確列出 .gitignore 必填項目，並指導如何在地端使用 .env 檔，以及在 GitHub 倉庫設定 GitHub Secrets。
   - 文件化建議：提示 README.md 中應包含的 API 環境建置步驟與 AI 模型依賴說明。
3. 雲端架構與 CI/CD 部署 (Deployment & CI/CD)：
   - 建議適合的公有雲無伺服器方案（如 GCP Cloud Run, AWS Lambda）。
   - 提供基礎的 GitHub Actions 腳本 (.yml) 範例，實現從 GitHub main 分支推播後，自動打包 Docker Image 並部署上雲的流程。
4. 成本效益與 FinOps 分析 (Cost Optimization)：
   - 估算 API Token 消耗成本與公有雲基礎設施預期月費。
   - 點出該專案架構的「成本陷阱」與「降本策略」（如：快取機制 Context Caching、Batch API 運用）。

【預設回應格式】
請嚴格按照以下五大結構區塊輸出完整且高度可落地的技術報告：

📌 專案架構與開發藍圖（一句話總結核心價值與技術棧）
[包含一句話核心價值、推薦技術棧、交付階段規劃]

🤖 AI Studio System Prompt（直接可複製的指令與參數設定）
[包含推薦模型名稱、Temperature / TopP 參數、完整的 System Instruction 區塊、以及 Few-shot 範例]

📁 GitHub 專案結構與安全規範（樹狀目錄圖、.gitignore 建議與 Secrets 設定說明）
[包含標準 ASCII 專案檔案樹、.gitignore 必填清單、.env.example 示範、GitHub Secrets 清單與 README 建議]

☁️ 公有雲部署與 CI/CD 策略（推薦服務、架構說明與 GitHub Actions 提示）
[包含推薦公有雲服務與架構圖說明、Dockerfile、以及完整的 .github/workflows/deploy.yml 腳本範例]

💰 FinOps 成本拆解與降本策略（預估費用與避坑指南）
[包含 Token 消耗估算、每月雲端基建成本預算、常見成本陷阱與 3 項具體降本策略]`;

// API endpoint for generating architecture consultation
app.post('/api/architect/consult', async (req, res) => {
  const { query, model = 'gemini-3.8-flash', options } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: '請提供專案需求描述 (query is required)' });
  }

  // If GEMINI_API_KEY is available, call Gemini API
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI();
      const prompt = `使用者專案需求如下：\n\n"${query.trim()}"\n\n${
        options?.cloudTarget ? `偏好雲端部署平台：${options.cloudTarget}\n` : ''
      }${options?.scale ? `預估使用者規模/請求量：${options.scale}\n` : ''}
請身為 Google AI Studio 雲端架構與 DevOps 顧問，針對此專案需求，嚴格依循 5 大區塊格式產出企業級架構與 DevOps 藍圖規劃。`;

      const response = await ai.models.generateContent({
        model: model || 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: ARCHITECT_SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });

      const responseText = response.text || '';
      return res.json({
        success: true,
        source: 'gemini-live',
        model: model || 'gemini-3.8-flash',
        output: responseText,
      });
    } catch (err: any) {
      console.error('Gemini API execution error:', err);
      // If error occurs, fall back gracefully to intelligent local blueprint generator
      return res.status(500).json({
        error: err.message || 'Gemini API 調用異常',
        source: 'fallback-triggered',
      });
    }
  } else {
    // If no GEMINI_API_KEY configured, inform client so it can use internal high-fidelity blueprint generator
    return res.json({
      success: true,
      source: 'offline-mode',
      message: 'GEMINI_API_KEY 未設定，可使用工作站內建之企業級架構藍圖生成引擎。',
    });
  }
});

// Setup Vite in development or static serve in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[AI Studio Cloud & DevOps Architect] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
