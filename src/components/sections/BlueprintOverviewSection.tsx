import React from 'react';
import { 
  Layers, 
  Cpu, 
  Cloud, 
  GitBranch, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  ExternalLink
} from 'lucide-react';
import { ArchitectureBlueprint } from '../../types/architect';

interface BlueprintOverviewSectionProps {
  blueprint: ArchitectureBlueprint;
}

export const BlueprintOverviewSection: React.FC<BlueprintOverviewSectionProps> = ({ blueprint }) => {
  return (
    <div className="space-y-6">
      {/* Hero Headline Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            {blueprint.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 架構規格驗證通過
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
            Target: {blueprint.cloudTarget}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
          {blueprint.title}
        </h2>

        {/* 📌 一句話核心價值與技術棧 */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-sky-500/30 text-sky-100 text-sm leading-relaxed mb-5 shadow-inner">
          <div className="flex items-start gap-2.5">
            <span className="text-base">📌</span>
            <div>
              <span className="font-semibold text-sky-400">專案核心價值與技術棧：</span>
              <p className="mt-1 text-slate-200">
                {blueprint.summaryTagline.replace(/^📌\s*專案架構與開發藍圖[：:]\s*/, '')}
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            核心技術棧 (Tech Stack)
          </span>
          <div className="flex flex-wrap gap-2">
            {blueprint.techStack.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 shadow-sm"
              >
                <Zap className="w-3 h-3 text-sky-400" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Progressive Delivery Topology (SDLC Journey) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-sky-400" />
          漸進式架構交付拓撲 (Progressive Delivery Journey)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Phase 1 */}
          <div className="bg-slate-950/80 border border-slate-800 hover:border-sky-500/40 rounded-xl p-4 transition-all relative group">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 font-bold flex items-center justify-center text-xs mb-3 border border-sky-500/20">
              01
            </div>
            <h4 className="text-xs font-bold text-white mb-1">AI Studio 原型驗證</h4>
            <p className="text-[11px] text-slate-400 mb-2">
              快速在 Google AI Studio 迭代 System Instructions 與 Few-shot 邊界測試。
            </p>
            <div className="text-[10px] font-mono text-sky-300 bg-sky-950/40 px-2 py-1 rounded border border-sky-900/50">
              模型: {blueprint.recommendedModel}
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-4 transition-all relative group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center text-xs mb-3 border border-indigo-500/20">
              02
            </div>
            <h4 className="text-xs font-bold text-white mb-1">GitHub 專案工程化</h4>
            <p className="text-[11px] text-slate-400 mb-2">
              程式碼與提示詞解耦、嚴格配置 .gitignore、隔離 .env 並啟用 GitHub Secrets。
            </p>
            <div className="text-[10px] font-mono text-indigo-300 bg-indigo-950/40 px-2 py-1 rounded border border-indigo-900/50">
              金鑰防護: 零硬編碼安全隔離
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 transition-all relative group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs mb-3 border border-emerald-500/20">
              03
            </div>
            <h4 className="text-xs font-bold text-white mb-1">公有雲 CI/CD 自動化</h4>
            <p className="text-[11px] text-slate-400 mb-2">
              GitHub Actions main 分支推播自動構建 Multi-stage Docker 映像並部屬至無伺服器。
            </p>
            <div className="text-[10px] font-mono text-emerald-300 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/50">
              平台: {blueprint.cloudTarget}
            </div>
          </div>

          {/* Phase 4 */}
          <div className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition-all relative group">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs mb-3 border border-amber-500/20">
              04
            </div>
            <h4 className="text-xs font-bold text-white mb-1">FinOps 成本與健檢</h4>
            <p className="text-[11px] text-slate-400 mb-2">
              引入 Context Caching、Batch API 與 Scale-to-Zero，監控單一呼叫 Token 消耗。
            </p>
            <div className="text-[10px] font-mono text-amber-300 bg-amber-950/40 px-2 py-1 rounded border border-amber-900/50">
              預估月費: {blueprint.finOps.totalEstimatedMonthly}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
