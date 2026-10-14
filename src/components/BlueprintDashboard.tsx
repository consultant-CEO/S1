import React, { useState } from 'react';
import { 
  Layers, 
  Bot, 
  FolderGit2, 
  Cloud, 
  DollarSign, 
  FileText, 
  Share2, 
  Copy, 
  Check, 
  Download,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ArchitectureBlueprint } from '../types/architect';
import { BlueprintOverviewSection } from './sections/BlueprintOverviewSection';
import { SystemPromptSection } from './sections/SystemPromptSection';
import { RepoStructureSection } from './sections/RepoStructureSection';
import { DeploymentCiCdSection } from './sections/DeploymentCiCdSection';
import { FinOpsSection } from './sections/FinOpsSection';

interface BlueprintDashboardProps {
  blueprint: ArchitectureBlueprint;
  onOpenCalculator: () => void;
  onOpenSecurityAudit: () => void;
  onOpenExportModal: () => void;
}

export const BlueprintDashboard: React.FC<BlueprintDashboardProps> = ({
  blueprint,
  onOpenCalculator,
  onOpenSecurityAudit,
  onOpenExportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'prompt' | 'repo' | 'deployment' | 'finops' | 'all'>('overview');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(blueprint.summaryTagline);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const navItems = [
    { id: 'overview', label: '📌 專案架構總覽', icon: Layers },
    { id: 'prompt', label: '🤖 AI Studio Prompt', icon: Bot },
    { id: 'repo', label: '📁 GitHub 專案與安全', icon: FolderGit2 },
    { id: 'deployment', label: '☁️ 雲端部署與 CI/CD', icon: Cloud },
    { id: 'finops', label: '💰 FinOps 成本分析', icon: DollarSign },
    { id: 'all', label: '📑 完整報告連續檢視', icon: FileText },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Navigation Sub-header / Pill Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-lg flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick action shortcuts */}
        <div className="flex items-center gap-1.5 px-2">
          <button
            onClick={handleCopySummary}
            className="text-[11px] px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
            title="複製一句話架構藍圖總結"
          >
            {copiedSummary ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedSummary ? '已複製！' : '複製總結'}</span>
          </button>
          <button
            onClick={onOpenExportModal}
            className="text-[11px] px-2.5 py-1.5 rounded-lg text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 flex items-center gap-1 transition-colors cursor-pointer font-medium"
          >
            <Download className="w-3 h-3" />
            <span>匯出 .md</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'overview' && (
        <BlueprintOverviewSection blueprint={blueprint} />
      )}

      {activeTab === 'prompt' && (
        <SystemPromptSection blueprint={blueprint} />
      )}

      {activeTab === 'repo' && (
        <RepoStructureSection blueprint={blueprint} />
      )}

      {activeTab === 'deployment' && (
        <DeploymentCiCdSection blueprint={blueprint} />
      )}

      {activeTab === 'finops' && (
        <FinOpsSection blueprint={blueprint} onOpenCalculator={onOpenCalculator} />
      )}

      {/* Continuous All-in-One View */}
      {activeTab === 'all' && (
        <div className="space-y-10">
          <div className="border-l-2 border-sky-500 pl-4 py-1">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
              MODULE 01
            </span>
            <h3 className="text-base font-bold text-white">📌 專案架構與開發藍圖</h3>
          </div>
          <BlueprintOverviewSection blueprint={blueprint} />

          <div className="border-l-2 border-sky-500 pl-4 py-1">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
              MODULE 02
            </span>
            <h3 className="text-base font-bold text-white">🤖 AI Studio System Prompt</h3>
          </div>
          <SystemPromptSection blueprint={blueprint} />

          <div className="border-l-2 border-amber-500 pl-4 py-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              MODULE 03
            </span>
            <h3 className="text-base font-bold text-white">📁 GitHub 專案結構與安全規範</h3>
          </div>
          <RepoStructureSection blueprint={blueprint} />

          <div className="border-l-2 border-blue-500 pl-4 py-1">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              MODULE 04
            </span>
            <h3 className="text-base font-bold text-white">☁️ 公有雲部署與 CI/CD 策略</h3>
          </div>
          <DeploymentCiCdSection blueprint={blueprint} />

          <div className="border-l-2 border-emerald-500 pl-4 py-1">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              MODULE 05
            </span>
            <h3 className="text-base font-bold text-white">💰 FinOps 成本拆解與降本策略</h3>
          </div>
          <FinOpsSection blueprint={blueprint} onOpenCalculator={onOpenCalculator} />
        </div>
      )}
    </div>
  );
};
