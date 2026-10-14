import React, { useState } from 'react';
import { 
  X, 
  DollarSign, 
  TrendingDown, 
  Sliders, 
  HelpCircle, 
  Cpu, 
  Zap, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { GeminiModelName } from '../types/architect';

interface FinOpsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModel?: GeminiModelName;
}

const MODEL_PRICING: Record<GeminiModelName, { name: string; input: number; output: number; cached: number }> = {
  'gemini-3.8-flash': {
    name: 'Gemini 3.8 Flash (推薦首選)',
    input: 0.15,
    output: 0.60,
    cached: 0.0375,
  },
  'gemini-3.1-pro-preview': {
    name: 'Gemini 3.1 Pro (深度推理)',
    input: 1.25,
    output: 5.00,
    cached: 0.3125,
  },
  'gemini-3.8-live': {
    name: 'Gemini 3.8 Live (雙向音訊串流)',
    input: 0.30,
    output: 1.20,
    cached: 0.10,
  },
  'gemini-3.1-flash-lite': {
    name: 'Gemini 3.1 Flash-Lite (高頻輕量)',
    input: 0.075,
    output: 0.30,
    cached: 0.01875,
  },
};

export const FinOpsCalculatorModal: React.FC<FinOpsCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultModel = 'gemini-3.8-flash',
}) => {
  const [selectedModel, setSelectedModel] = useState<GeminiModelName>(defaultModel);
  const [monthlyRequests, setMonthlyRequests] = useState<number>(50000);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(3000);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(600);
  const [cachingHitRate, setCachingHitRate] = useState<number>(65); // 0 - 90%
  const [useBatchApi, setUseBatchApi] = useState<boolean>(false);

  if (!isOpen) return null;

  const pricing = MODEL_PRICING[selectedModel] || MODEL_PRICING['gemini-3.8-flash'];

  // Calculate unoptimized cost
  const totalInputMillions = (monthlyRequests * avgInputTokens) / 1_000_000;
  const totalOutputMillions = (monthlyRequests * avgOutputTokens) / 1_000_000;

  const rawInputCost = totalInputMillions * pricing.input;
  const rawOutputCost = totalOutputMillions * pricing.output;
  const unoptimizedApiCost = rawInputCost + rawOutputCost;

  // Calculate optimized with caching
  const cachedInputRatio = cachingHitRate / 100;
  const unCachedInputMillions = totalInputMillions * (1 - cachedInputRatio);
  const cachedInputMillions = totalInputMillions * cachedInputRatio;

  const optimizedInputCost = (unCachedInputMillions * pricing.input) + (cachedInputMillions * pricing.cached);
  let optimizedApiCost = optimizedInputCost + rawOutputCost;

  // Apply Batch API 50% discount if selected
  if (useBatchApi) {
    optimizedApiCost = optimizedApiCost * 0.5;
  }

  // Cloud Run serverless estimated compute cost (scale to zero free tier absorbs first 2M requests)
  const cloudRunCost = monthlyRequests > 100000 ? Math.round((monthlyRequests / 100000) * 4) : 2.5;

  const finalMonthlyTotal = optimizedApiCost + cloudRunCost;
  const monthlySavings = Math.max(0, unoptimizedApiCost - optimizedApiCost);
  const savingsPercent = unoptimizedApiCost > 0 ? Math.round((monthlySavings / unoptimizedApiCost) * 100) : 0;
  const usdToTwd = 32;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl text-white p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                FinOps 成本動態試算器
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                  即時模擬
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                調校請求量、Token 視窗與 Context Caching 比例，精準預估每月雲端營運費用。
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-400" /> 選擇評估之 Gemini 模型
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(MODEL_PRICING) as GeminiModelName[]).map((key) => {
              const p = MODEL_PRICING[key];
              const isSelected = selectedModel === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedModel(key)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-500 text-sky-200 ring-1 ring-sky-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold mb-1">{p.name}</div>
                  <div className="text-[10px] font-mono opacity-80">
                    輸入: ${p.input}/1M • 輸出: ${p.output}/1M • 快取: ${p.cached}/1M
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Monthly Requests */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300">每月 API 請求量</span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {monthlyRequests.toLocaleString()} 次/月
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={monthlyRequests}
              onChange={(e) => setMonthlyRequests(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>5,000 次 (PoC)</span>
              <span>100,000 次 (企業級)</span>
              <span>500,000 次 (高流量)</span>
            </div>
          </div>

          {/* Context Caching Hit Rate */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300">Context Caching 命中率</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {cachingHitRate}% (快取節省)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={cachingHitRate}
              onChange={(e) => setCachingHitRate(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0% (未快取)</span>
              <span>50% (中度快取)</span>
              <span>90% (高頻知識庫)</span>
            </div>
          </div>

          {/* Avg Input Tokens */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300">平均單次輸入 Tokens (Prompt + Context)</span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {avgInputTokens.toLocaleString()} Tokens
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="30000"
              step="500"
              value={avgInputTokens}
              onChange={(e) => setAvgInputTokens(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>500 (短指令)</span>
              <span>5,000 (RAG 文件段)</span>
              <span>30,000 (長篇手冊)</span>
            </div>
          </div>

          {/* Avg Output Tokens */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300">平均單次輸出 Tokens</span>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {avgOutputTokens.toLocaleString()} Tokens
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="2048"
              step="50"
              value={avgOutputTokens}
              onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>100 (精簡摘要)</span>
              <span>600 (一般對答)</span>
              <span>2,048 (完整代碼/報告)</span>
            </div>
          </div>
        </div>

        {/* Batch API Toggle */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs">
            <Zap className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="font-bold text-white">啟用 Gemini Batch API (享有 50% 費用折扣)</span>
              <p className="text-[11px] text-slate-400">適用非即時離線分析、夜間資料批次處理或離線內容生成任務</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUseBatchApi(!useBatchApi)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              useBatchApi ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {useBatchApi ? '已啟用 50% 折扣' : '未啟用'}
          </button>
        </div>

        {/* Dynamic Result Comparison Cards */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-950 to-slate-900 border border-emerald-500/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" /> 試算結果對比 (Monthly Financial Impact)
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold font-mono">
              降本幅度: -{savingsPercent}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {/* Unoptimized Cost */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">未優化前 API 原價</span>
              <div className="text-base font-bold text-slate-300">
                ${unoptimizedApiCost.toFixed(2)} USD
              </div>
              <div className="text-[10px] text-slate-500">
                約 NT$ {(unoptimizedApiCost * usdToTwd).toFixed(0)}
              </div>
            </div>

            {/* Optimized API Cost */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[11px] text-emerald-300 block mb-1">優化後 API 月費 (含快取)</span>
              <div className="text-lg font-extrabold text-emerald-300">
                ${optimizedApiCost.toFixed(2)} USD
              </div>
              <div className="text-[10px] text-emerald-400/80">
                每月立省 ${monthlySavings.toFixed(2)} USD
              </div>
            </div>

            {/* Grand Total with Cloud Run */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-sky-500/30">
              <span className="text-[11px] text-sky-300 block mb-1">總月費 (含 Cloud Run 基建)</span>
              <div className="text-lg font-bold text-sky-400">
                ${finalMonthlyTotal.toFixed(2)} USD
              </div>
              <div className="text-[10px] text-slate-400">
                約 NT$ {(finalMonthlyTotal * usdToTwd).toFixed(0)} / 月
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
          >
            完成試算並關閉
          </button>
        </div>
      </div>
    </div>
  );
};
