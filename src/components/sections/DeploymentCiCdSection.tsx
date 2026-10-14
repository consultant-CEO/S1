import React, { useState } from 'react';
import { 
  Cloud, 
  Workflow, 
  Copy, 
  Check, 
  Server, 
  Container, 
  ShieldCheck, 
  Activity, 
  GitCommit, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { ArchitectureBlueprint } from '../../types/architect';

interface DeploymentCiCdSectionProps {
  blueprint: ArchitectureBlueprint;
}

export const DeploymentCiCdSection: React.FC<DeploymentCiCdSectionProps> = ({ blueprint }) => {
  const [copiedActions, setCopiedActions] = useState(false);
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [activeTab, setActiveTab] = useState<'actions' | 'docker'>('actions');

  const handleCopyActions = () => {
    navigator.clipboard.writeText(blueprint.deployment.githubActionsYml);
    setCopiedActions(true);
    setTimeout(() => setCopiedActions(false), 2000);
  };

  const handleCopyDocker = () => {
    navigator.clipboard.writeText(blueprint.deployment.dockerfile);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ☁️ 公有雲部署與 CI/CD 策略
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-normal">
                  Serverless CI/CD
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                GCP Cloud Run / AWS Lambda 現代化無伺服器架構、自動打包 Docker 映像與 GitHub Actions 流水線。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              {blueprint.deployment.cloudService}
            </span>
          </div>
        </div>

        {/* Architecture Sequence Flow */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-3">
            <Workflow className="w-3.5 h-3.5 text-sky-400" /> 部署管線自動化流程 (Automated Pipeline Steps)
          </span>
          <div className="space-y-2 text-xs">
            {blueprint.deployment.architectureFlow.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-slate-300"
              >
                <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Viewers: GitHub Actions vs Dockerfile */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeTab === 'actions'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>GitHub Actions (.github/workflows/deploy.yml)</span>
              </button>

              <button
                onClick={() => setActiveTab('docker')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeTab === 'docker'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Container className="w-3.5 h-3.5" />
                <span>生產級 Dockerfile (Multi-stage)</span>
              </button>
            </div>

            {activeTab === 'actions' ? (
              <button
                onClick={handleCopyActions}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                {copiedActions ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedActions ? '已複製！' : '複製 YAML 腳本'}</span>
              </button>
            ) : (
              <button
                onClick={handleCopyDocker}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                {copiedDocker ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDocker ? '已複製！' : '複製 Dockerfile'}</span>
              </button>
            )}
          </div>

          {activeTab === 'actions' ? (
            <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>.github/workflows/deploy.yml</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> WIF Keyless Auth
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed select-all">
                {blueprint.deployment.githubActionsYml}
              </pre>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Dockerfile (Multi-Stage Production)</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Non-root User
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed select-all">
                {blueprint.deployment.dockerfile}
              </pre>
            </div>
          )}
        </div>

        {/* Security & Health Check Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> IAM 最小權限與安全原則
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {blueprint.deployment.iamBestPractice}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5 mb-1">
              <Activity className="w-3.5 h-3.5 text-sky-400" /> 健康檢查探針 (Healthcheck Probe)
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              端點：<code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded font-mono">{blueprint.deployment.healthCheckPath}</code>。Cloud Run 與負載均衡器每 30 秒探測存活狀態，未正常響應時自動重啟容器。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
