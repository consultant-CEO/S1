import React, { useState } from 'react';
import { 
  X, 
  FileDown, 
  Copy, 
  Check, 
  FileText, 
  Download, 
  Share2, 
  Layers,
  Code
} from 'lucide-react';
import { ArchitectureBlueprint } from '../types/architect';
import { formatBlueprintAsMarkdown } from '../data/architectBlueprints';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: ArchitectureBlueprint;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  blueprint,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPromptOnly, setCopiedPromptOnly] = useState(false);
  const [copiedActionsOnly, setCopiedActionsOnly] = useState(false);

  if (!isOpen) return null;

  const markdownContent = formatBlueprintAsMarkdown(blueprint);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyPromptOnly = () => {
    navigator.clipboard.writeText(blueprint.systemPrompt);
    setCopiedPromptOnly(true);
    setTimeout(() => setCopiedPromptOnly(false), 2000);
  };

  const handleCopyActionsOnly = () => {
    navigator.clipboard.writeText(blueprint.deployment.githubActionsYml);
    setCopiedActionsOnly(true);
    setTimeout(() => setCopiedActionsOnly(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Architecture_Blueprint_${blueprint.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                匯出企業級架構與 DevOps 藍圖報告
                <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-normal">
                  Standard 5-Module Export
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                符合規範之標準格式 Markdown，可直接簽入 GitHub README、發送技術審查或團隊文檔庫。
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

        {/* Action Toolbar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold bg-sky-500 hover:bg-sky-400 text-white transition-all cursor-pointer shadow-sm shadow-sky-500/20"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? '已複製完整五大模組！' : '一鍵複製完整 Markdown 報告'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>下載 .md 藍圖檔案</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={handleCopyPromptOnly}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white cursor-pointer"
            >
              {copiedPromptOnly ? '已複製' : '僅複製 System Prompt'}
            </button>
            <button
              onClick={handleCopyActionsOnly}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white cursor-pointer"
            >
              {copiedActionsOnly ? '已複製' : '僅複製 deploy.yml'}
            </button>
          </div>
        </div>

        {/* Markdown Content Preview */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-950/60 font-mono text-xs text-slate-300 leading-relaxed select-all">
          <pre className="whitespace-pre-wrap">{markdownContent}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>包含：📌 藍圖總結 · 🤖 System Prompt · 📁 GitHub結構 · ☁️ CI/CD部署 · 💰 FinOps成本</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer transition-colors"
          >
            完成並關閉
          </button>
        </div>
      </div>
    </div>
  );
};
