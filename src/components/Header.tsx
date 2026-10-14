import React from 'react';
import { 
  Cloud, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  FileDown, 
  Terminal,
  Zap,
  FolderGit2
} from 'lucide-react';
import { ArchitectureBlueprint } from '../types/architect';
import { PRESET_BLUEPRINTS } from '../data/architectBlueprints';

interface HeaderProps {
  currentBlueprint: ArchitectureBlueprint;
  onSelectPreset: (id: string) => void;
  onOpenFinOpsCalculator: () => void;
  onOpenSecurityAudit: () => void;
  onOpenExportModal: () => void;
  onNewConsultation: () => void;
  isGenerating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentBlueprint,
  onSelectPreset,
  onOpenFinOpsCalculator,
  onOpenSecurityAudit,
  onOpenExportModal,
  onNewConsultation,
  isGenerating,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewConsultation}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Cloud className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  Google AI Studio
                  <span className="text-sky-400 font-semibold">雲端架構與 DevOps 顧問</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  FinOps Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                原型設計 ➔ GitHub 專案工程化 ➔ GCP/AWS CI/CD 自動化 ➔ 成本優化
              </p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center space-x-2">
            {/* Presets dropdown */}
            <div className="relative group hidden md:block">
              <select
                aria-label="選擇企業範本"
                value={currentBlueprint.id}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="appearance-none bg-slate-800/90 hover:bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 pr-8 border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer font-medium"
              >
                <optgroup label="── 企業級架構藍圖範本 ──">
                  {PRESET_BLUEPRINTS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.category} · {b.title}
                    </option>
                  ))}
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* FinOps Calculator Button */}
            <button
              onClick={onOpenFinOpsCalculator}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
              title="開啟 FinOps 成本試算器"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">FinOps 試算器</span>
              <span className="lg:hidden">成本</span>
            </button>

            {/* Security Audit Button */}
            <button
              onClick={onOpenSecurityAudit}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
              title="檢查 .gitignore 與金鑰防護規範"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">金鑰防護稽核</span>
              <span className="lg:hidden">資安</span>
            </button>

            {/* Export Report Button */}
            <button
              onClick={onOpenExportModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-colors"
              title="匯出 Markdown 架構藍圖與 CI/CD 程式碼"
            >
              <FileDown className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">匯出藍圖</span>
            </button>

            {/* New Query / Consult CTA */}
            <button
              onClick={onNewConsultation}
              disabled={isGenerating}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-sm shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>發起架構諮詢</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
