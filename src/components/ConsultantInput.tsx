import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Layers, 
  Cpu, 
  Cloud, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Wand2, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { GeminiModelName, CloudPlatform } from '../types/architect';

interface ConsultantInputProps {
  onSubmit: (query: string, cloudTarget: CloudPlatform, model: GeminiModelName) => Promise<void>;
  isGenerating: boolean;
  activeStage?: number;
}

const QUICK_IDEAS = [
  { label: '多模態 RAG 知識庫', prompt: '構建企業百萬技術手冊多模態 RAG 知識庫，支援 PDF/表格查詢並以 Context Caching 降低輸入成本' },
  { label: '電商客服 Tool Calling', prompt: '開發電商智能客服 Agent，支援 Function Calling 串接 ERP 訂單查詢與退貨審核，並以 Cloud Run 無伺服器高併發部署' },
  { label: 'PR 資安 Code Reviewer', prompt: '建立 GitHub Actions 自動化 AI 程式碼審查機器人，在 PR 提出時依 OWASP 標準掃描 SQL Injection 與金鑰洩漏風險' },
  { label: 'Live 雙向會議音訊', prompt: '使用 Gemini 3.8 Live API 與 WebSocket 建立低延遲即時會議逐字稿與行動清單整理服務' },
  { label: 'Batch 行銷在地化', prompt: '建立跨國電商行銷文案批次生成管線，利用 Gemini Batch API 享 50% 折扣並以 Cloud Run Jobs 執行' },
  { label: '醫療病歷隱私去識別化', prompt: '醫療病歷結構化與個資去識別化管線，符合 HIPAA 規範，在本地 Regex 預過濾後由 Gemini 進行模糊上下文遮蔽' },
];

export const ConsultantInput: React.FC<ConsultantInputProps> = ({
  onSubmit,
  isGenerating,
  activeStage = 0,
}) => {
  const [query, setQuery] = useState('');
  const [cloudTarget, setCloudTarget] = useState<CloudPlatform>('GCP Cloud Run');
  const [model, setModel] = useState<GeminiModelName>('gemini-3.8-flash');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isGenerating) return;
    onSubmit(query.trim(), cloudTarget, model);
  };

  const handleSelectIdea = (prompt: string) => {
    setQuery(prompt);
  };

  const stages = [
    { title: 'AI Studio 原型設計', desc: '規劃 System Instructions、Few-shot 範例與模型推薦' },
    { title: 'GitHub 專案結構與安全', desc: '設計標準專案目錄樹、.gitignore 防護與 Secrets 清單' },
    { title: '雲端架構與 CI/CD', desc: '規劃 Cloud Run 容器、Dockerfile 與 deploy.yml 工作流' },
    { title: 'FinOps 成本拆解', desc: '試算 Token 費用、點出成本陷阱並導入 Context Caching' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-5 sm:p-6 text-white mb-6">
      {/* Consultant Avatar & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 p-0.5 flex-shrink-0 shadow-md shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              提出您的 AI 專案需求
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-normal">
                架構顧問隨時在線
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              輸入產品構想或技術指標，顧問將為您自動生成「Prompt原型 ➔ GitHub架構 ➔ CI/CD部署 ➔ FinOps降本」完整企業方案。
            </p>
          </div>
        </div>

        {/* Quick idea chips button toggle */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>部署參數設定</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Advanced Settings Drawer */}
      {showAdvanced && (
        <div className="mb-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in duration-200">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" /> 推薦 Gemini 模型
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as GeminiModelName)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash（速度極快、成本超低，推薦企業首選）</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview（高難度複雜推理與程式碼生成）</option>
              <option value="gemini-3.8-live">gemini-3.8-live（雙向低延遲即時音訊/視訊串流）</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite（極致輕量高頻吞吐）</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-sky-400" /> 目標公有雲無伺服器平台
            </label>
            <select
              value={cloudTarget}
              onChange={(e) => setCloudTarget(e.target.value as CloudPlatform)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="GCP Cloud Run">GCP Cloud Run (推薦：自動縮放至 0、Secret Manager 原生整合)</option>
              <option value="AWS Lambda / ECS">AWS Lambda / ECS (Container-based Serverless)</option>
              <option value="Cloudflare Workers + Containers">Cloudflare Workers + Container Workflows</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isGenerating}
            placeholder="請描述您的專案需求（例如：我們需要為電商平台構建一個 24/7 智能售後客服，能利用 Function Calling 查詢黑貓物流狀態，並部署在 Cloud Run 上，預計每月 50,000 次查詢...）"
            rows={3}
            className="w-full bg-slate-950/90 text-slate-100 placeholder-slate-500 text-sm rounded-xl border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 p-4 pb-12 focus:outline-none transition-all resize-y disabled:opacity-60"
          />

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Ctrl + Enter 送出
            </span>
            <button
              type="submit"
              disabled={!query.trim() || isGenerating}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 transition-all shadow-md shadow-sky-500/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>架構規劃中...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>生成架構藍圖</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Idea Suggestion Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
          <Wand2 className="w-3 h-3 text-sky-400" /> 常見藍圖靈感：
        </span>
        {QUICK_IDEAS.map((idea, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectIdea(idea.prompt)}
            disabled={isGenerating}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 hover:border-sky-500/50 transition-colors cursor-pointer"
          >
            {idea.label}
          </button>
        ))}
      </div>

      {/* Progress / Step Generation Indicator when isGenerating */}
      {isGenerating && (
        <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-sky-500/30 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>DevOps 顧問正在工程化您的 AI 專案...</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              進度：{activeStage + 1} / 4 階段
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {stages.map((stage, idx) => {
              const isDone = activeStage > idx;
              const isCurrent = activeStage === idx;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : isCurrent
                      ? 'bg-sky-950/50 border-sky-500/60 text-sky-200 ring-1 ring-sky-500/40 animate-pulse'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-medium mb-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-current text-[9px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                    )}
                    <span>{stage.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
