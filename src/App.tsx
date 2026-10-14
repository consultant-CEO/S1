import React, { useState } from 'react';
import { ArchitectureBlueprint, GeminiModelName, CloudPlatform } from './types/architect';
import { 
  PRESET_BLUEPRINTS, 
  synthesizeCustomBlueprint 
} from './data/architectBlueprints';
import { Header } from './components/Header';
import { ConsultantInput } from './components/ConsultantInput';
import { BlueprintDashboard } from './components/BlueprintDashboard';
import { FinOpsCalculatorModal } from './components/FinOpsCalculatorModal';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { ExportModal } from './components/ExportModal';
import { 
  CheckCircle2, 
  AlertCircle, 
  Cloud, 
  ShieldCheck, 
  Terminal, 
  Sparkles,
  GitBranch
} from 'lucide-react';

export default function App() {
  const [currentBlueprint, setCurrentBlueprint] = useState<ArchitectureBlueprint>(() => {
    return PRESET_BLUEPRINTS[0];
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isFinOpsCalculatorOpen, setIsFinOpsCalculatorOpen] = useState<boolean>(false);
  const [isSecurityAuditOpen, setIsSecurityAuditOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSelectPreset = (id: string) => {
    const found = PRESET_BLUEPRINTS.find((b) => b.id === id);
    if (found) {
      setCurrentBlueprint(found);
      showToast(`已載入企業藍圖「${found.title}」`, 'info');
    }
  };

  const handleConsultSubmit = async (query: string, cloudTarget: CloudPlatform, model: GeminiModelName) => {
    setIsGenerating(true);
    setActiveStage(0);

    // Simulate progressive architect stages while processing
    const stageTimer1 = setTimeout(() => setActiveStage(1), 700);
    const stageTimer2 = setTimeout(() => setActiveStage(2), 1500);
    const stageTimer3 = setTimeout(() => setActiveStage(3), 2200);

    try {
      // Attempt backend Gemini call
      const res = await fetch('/api/architect/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          model,
          options: {
            cloudTarget,
          },
        }),
      });

      const data = await res.json();
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setActiveStage(3);

      // Synthesize high-fidelity blueprint
      const newBlueprint = synthesizeCustomBlueprint(query, cloudTarget, model);

      if (data && data.success && data.output) {
        newBlueprint.rawMarkdownReport = data.output;
      }

      setCurrentBlueprint(newBlueprint);
      showToast('已完成企業級雲端架構與 DevOps 藍圖規劃！', 'success');
    } catch (err) {
      console.warn('API error, using local architectural synthesizer:', err);
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      const localBlueprint = synthesizeCustomBlueprint(query, cloudTarget, model);
      setCurrentBlueprint(localBlueprint);
      showToast('已依據專案需求生成標準架構藍圖！', 'success');
    } finally {
      setIsGenerating(false);
      setActiveStage(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold text-white bg-slate-900 border border-slate-700/80 animate-in fade-in slide-in-from-top-3 duration-200 backdrop-blur-md">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentBlueprint={currentBlueprint}
        onSelectPreset={handleSelectPreset}
        onOpenFinOpsCalculator={() => setIsFinOpsCalculatorOpen(true)}
        onOpenSecurityAudit={() => setIsSecurityAuditOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onNewConsultation={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isGenerating={isGenerating}
      />

      {/* Main Application Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Architecture Consultation Input Box */}
        <ConsultantInput
          onSubmit={handleConsultSubmit}
          isGenerating={isGenerating}
          activeStage={activeStage}
        />

        {/* 5-Section Architecture Dashboard */}
        <BlueprintDashboard
          blueprint={currentBlueprint}
          onOpenCalculator={() => setIsFinOpsCalculatorOpen(true)}
          onOpenSecurityAudit={() => setIsSecurityAuditOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />
      </main>

      {/* Modals */}
      <FinOpsCalculatorModal
        isOpen={isFinOpsCalculatorOpen}
        onClose={() => setIsFinOpsCalculatorOpen(false)}
        defaultModel={currentBlueprint.recommendedModel}
      />

      <SecurityAuditModal
        isOpen={isSecurityAuditOpen}
        onClose={() => setIsSecurityAuditOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        blueprint={currentBlueprint}
      />

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/80 py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">
              Google AI Studio 雲端架構與 DevOps 顧問工作站
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Enterprise SDLC & FinOps Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
            <span>SDLC: Prototype ➔ GitHub ➔ Serverless CI/CD</span>
            <span>•</span>
            <span className="text-sky-400">Model: Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
