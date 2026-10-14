import React, { useState } from 'react';
import { 
  Bot, 
  Copy, 
  Check, 
  Download, 
  Sliders, 
  Cpu, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { ArchitectureBlueprint } from '../../types/architect';

interface SystemPromptSectionProps {
  blueprint: ArchitectureBlueprint;
}

export const SystemPromptSection: React.FC<SystemPromptSectionProps> = ({ blueprint }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedParams, setCopiedParams] = useState(false);
  const [activeFewShotIndex, setActiveFewShotIndex] = useState(0);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(blueprint.systemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyParams = () => {
    const paramsJson = JSON.stringify(
      {
        model: blueprint.recommendedModel,
        ...blueprint.parameters,
      },
      null,
      2
    );
    navigator.clipboard.writeText(paramsJson);
    setCopiedParams(true);
    setTimeout(() => setCopiedParams(false), 2000);
  };

  const handleDownloadPrompt = () => {
    const content = `# Google AI Studio - System Instructions
# Target Model: ${blueprint.recommendedModel}
# Temperature: ${blueprint.parameters.temperature}
# TopP: ${blueprint.parameters.topP}
# Max Output Tokens: ${blueprint.parameters.maxOutputTokens || 2048}

${blueprint.systemPrompt}

---

## Few-Shot Examples
${blueprint.fewShotExamples.map((ex, i) => `
### Example ${i + 1}
**User**:
${ex.user}

**Model**:
${ex.model}
${ex.explanation ? `\n*Note: ${ex.explanation}*` : ''}
`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_instructions_${blueprint.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                🤖 AI Studio 核心 Prompt 與模型設計
                <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-normal">
                  Prototyping
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                結構嚴謹之 System Instructions、Few-shot 原型與精準 Gemini 模型版本選型建議。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPrompt}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>下載 .md 指令檔</span>
            </button>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-sm shadow-sky-500/25 transition-all cursor-pointer"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>已複製指令！</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>複製 System Instruction</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Model Selection & Rationale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" /> 推薦 Gemini 模型版本
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                {blueprint.recommendedModel}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {blueprint.modelRationale}
            </p>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span>輸入: ${blueprint.finOps.pricingModel.inputPerMillion}/1M tokens</span>
              <span>•</span>
              <span>輸出: ${blueprint.finOps.pricingModel.outputPerMillion}/1M tokens</span>
              <span>•</span>
              <span className="text-emerald-400">快取: ${blueprint.finOps.pricingModel.cachedInputPerMillion}/1M</span>
            </div>
          </div>

          {/* Hyperparameters Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-400" /> 參數配置 (GenerationConfig)
              </span>
              <button
                onClick={handleCopyParams}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                title="複製參數 JSON"
              >
                {copiedParams ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedParams ? '已複製' : 'JSON'}</span>
              </button>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Temperature</span>
                <span className="text-sky-300 font-bold">{blueprint.parameters.temperature}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">TopP</span>
                <span className="text-sky-300 font-bold">{blueprint.parameters.topP}</span>
              </div>
              {blueprint.parameters.topK && (
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">TopK</span>
                  <span className="text-sky-300 font-bold">{blueprint.parameters.topK}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">MaxOutputTokens</span>
                <span className="text-sky-300 font-bold">{blueprint.parameters.maxOutputTokens || 2048}</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Instructions Viewer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" /> System Instructions (直接可貼入 AI Studio 控制台)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              長度: {blueprint.systemPrompt.length} 字元
            </span>
          </div>

          <div className="relative group">
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 whitespace-pre-wrap select-all">
              {blueprint.systemPrompt}
            </pre>
          </div>
        </div>

        {/* Few-Shot Examples Interactive Tabs */}
        {blueprint.fewShotExamples && blueprint.fewShotExamples.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Few-shot 原型驗證範例集 ({blueprint.fewShotExamples.length} 組)
              </span>
              <div className="flex items-center gap-1">
                {blueprint.fewShotExamples.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFewShotIndex(idx)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                      activeFewShotIndex === idx
                        ? 'bg-sky-500 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    範例 {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {blueprint.fewShotExamples[activeFewShotIndex] && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wide block mb-1">
                    👤 User 提示詞 (Input)
                  </span>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap">
                    {blueprint.fewShotExamples[activeFewShotIndex].user}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide block mb-1">
                    🤖 Model 預期輸出 (Expected Output)
                  </span>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap">
                    {blueprint.fewShotExamples[activeFewShotIndex].model}
                  </div>
                </div>

                {blueprint.fewShotExamples[activeFewShotIndex].explanation && (
                  <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-800/40 text-[11px] text-sky-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">驗證重點：</strong>{' '}
                      {blueprint.fewShotExamples[activeFewShotIndex].explanation}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
