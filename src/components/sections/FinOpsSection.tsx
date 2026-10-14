import React from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles, 
  Sliders, 
  Zap, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { ArchitectureBlueprint } from '../../types/architect';

interface FinOpsSectionProps {
  blueprint: ArchitectureBlueprint;
  onOpenCalculator: () => void;
}

export const FinOpsSection: React.FC<FinOpsSectionProps> = ({ blueprint, onOpenCalculator }) => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                💰 FinOps 成本拆解與降本策略
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-normal">
                  Cost Optimization
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                精準估算 API Token 與雲端基建月費、提防架構陷阱並導入 Context Caching 與 Batch API。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCalculator}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer shadow-sm shadow-emerald-500/25"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>自訂流量試算器</span>
            </button>
          </div>
        </div>

        {/* Cost Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Token Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              API Token 預估月費
            </span>
            <div className="text-lg font-bold text-sky-400 mb-1">
              {blueprint.finOps.estimatedMonthlyTokenCost.split('(')[0].trim()}
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              {blueprint.finOps.estimatedMonthlyTokenCost}
            </p>
          </div>

          {/* Infra Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              公有雲基建 (Cloud Run)
            </span>
            <div className="text-lg font-bold text-indigo-400 mb-1">
              {blueprint.finOps.estimatedMonthlyInfraCost.split('(')[0].trim()}
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              {blueprint.finOps.estimatedMonthlyInfraCost}
            </p>
          </div>

          {/* Total Monthly */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-500/30">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> 預期營運總月費
            </span>
            <div className="text-xl font-extrabold text-emerald-300 mb-1">
              {blueprint.finOps.totalEstimatedMonthly}
            </div>
            <p className="text-[11px] text-emerald-400/80">
              已套用 Scale-to-Zero 與 Context Caching 最佳實踐
            </p>
          </div>
        </div>

        {/* Cost Traps (成本陷阱與避坑指南) */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              架構成本陷阱防護指南 (Architectural Cost Traps)
            </h4>
          </div>

          <div className="space-y-3">
            {blueprint.finOps.costTraps.map((trap, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-rose-500/20 hover:border-rose-500/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    {trap.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      trap.severity === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    風險等級: {trap.severity}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2 pt-2 border-t border-slate-900">
                  <div className="text-rose-300/90">
                    <span className="font-semibold text-rose-400 block mb-0.5">⚠️ 潛在風險：</span>
                    {trap.risk}
                  </div>
                  <div className="text-emerald-300/90">
                    <span className="font-semibold text-emerald-400 block mb-0.5">✅ 規避解法：</span>
                    {trap.mitigation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Core Savings Strategies */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              三大關鍵降本策略 (Core FinOps Strategies)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blueprint.finOps.savingsStrategies.map((strat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold text-emerald-300">
                      {strat.title}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    {strat.mechanism}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-900 space-y-1.5">
                  <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    <span>{strat.expectedSavings}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                    提示: {strat.implementationHint}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
