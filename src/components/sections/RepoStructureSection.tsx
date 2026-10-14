import React, { useState } from 'react';
import { 
  FolderGit2, 
  ShieldCheck, 
  Key, 
  FileCode, 
  Copy, 
  Check, 
  AlertTriangle, 
  Lock, 
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';
import { ArchitectureBlueprint, FileItem } from '../../types/architect';

interface RepoStructureSectionProps {
  blueprint: ArchitectureBlueprint;
}

export const RepoStructureSection: React.FC<RepoStructureSectionProps> = ({ blueprint }) => {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedGitignore, setCopiedGitignore] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(() => {
    return blueprint.projectStructure.files[0] || null;
  });

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(blueprint.securitySpec.envExample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleCopyGitignore = () => {
    navigator.clipboard.writeText(blueprint.securitySpec.gitignoreItems.join('\n'));
    setCopiedGitignore(true);
    setTimeout(() => setCopiedGitignore(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                📁 GitHub 專案結構與安全規範
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-normal">
                  Security First
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                標準檔案目錄架構、.gitignore 嚴密隔離金鑰、.env 規範與 GitHub Secrets 最佳實踐。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 零金鑰硬編碼合規
            </span>
          </div>
        </div>

        {/* Directory Tree & File Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* ASCII Tree Viewer (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-sky-400" /> 標準專案目錄樹 (Project Layout)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Clean Architecture</span>
            </div>
            <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed select-all">
              {blueprint.projectStructure.treeAscii}
            </pre>
          </div>

          {/* Key Security Files Viewer (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Quick File Selection Chips */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex-1">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> 核心設定檔預覽
                </span>
                <span className="text-[10px] text-slate-400 font-mono">點擊切換</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {blueprint.projectStructure.files.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFile(file)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                      selectedFile?.path === file.path
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {file.path}
                  </button>
                ))}
              </div>

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{selectedFile.description}</span>
                    <button
                      onClick={() => {
                        if (selectedFile.content) {
                          navigator.clipboard.writeText(selectedFile.content);
                        }
                      }}
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>複製內容</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-48 whitespace-pre leading-relaxed select-all">
                    {selectedFile.content || `# ${selectedFile.path}\n# ${selectedFile.description}`}
                  </pre>
                </div>
              ) : (
                <p className="text-xs text-slate-500">請由上方選取檔案以檢視內容</p>
              )}
            </div>
          </div>
        </div>

        {/* .gitignore & .env.example Security Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* .gitignore Required Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> .gitignore 必填清單 (防止意外洩漏)
              </span>
              <button
                onClick={handleCopyGitignore}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedGitignore ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedGitignore ? '已複製' : '複製'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              這幾項檔案嚴禁解除忽略！即使是 private 倉庫，硬編碼金鑰也極易遭歷史 commit 洩漏。
            </p>
            <div className="flex flex-wrap gap-1.5">
              {blueprint.securitySpec.gitignoreItems.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/30 text-red-300 border border-red-800/40"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* .env.example Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> 本地開發 .env.example 範本
              </span>
              <button
                onClick={handleCopyEnv}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEnv ? '已複製' : '複製'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              僅供團隊了解變數名稱，嚴禁填入真實金鑰；真實金鑰僅存放於本機不可簽入之 .env。
            </p>
            <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
              {blueprint.securitySpec.envExample}
            </pre>
          </div>
        </div>

        {/* GitHub Secrets Configuration Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> GitHub Repository Secrets 配置清單
            </span>
            <span className="text-[11px] text-slate-400">
              路徑：Settings ➔ Secrets and variables ➔ Actions
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Secret 名稱 (Name)</th>
                  <th className="px-4 py-3">用途說明 (Purpose)</th>
                  <th className="px-4 py-3">範例格式 (Example)</th>
                  <th className="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/50">
                {blueprint.securitySpec.githubSecrets.map((secret, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-amber-300">
                      {secret.name}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {secret.description}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                      {secret.exampleValue}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigator.clipboard.writeText(secret.name)}
                        className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                        title="複製 Secret 名稱"
                      >
                        <Copy className="w-3 h-3" />
                        <span>複製名稱</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* README.md Instructions */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5 mb-2">
            <Info className="w-3.5 h-3.5 text-sky-400" /> README.md 建議建置步驟
          </span>
          <div className="text-slate-400 leading-relaxed space-y-1">
            {blueprint.securitySpec.readmeInstructions}
          </div>
        </div>
      </div>
    </div>
  );
};
