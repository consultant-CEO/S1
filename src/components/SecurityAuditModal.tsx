import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Check, 
  Copy, 
  FileCode, 
  Lock,
  RefreshCw
} from 'lucide-react';

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_GITIGNORE_TEMPLATE = `# === 機密金鑰與敏感環境變數 (最優先防護) ===
.env
.env.*
!.env.example
*.pem
*.key
*.cert
credentials.json
service-account*.json
gcp-key*.json
client_secret*.json

# === 依賴套件與編譯成品 ===
node_modules/
dist/
dist-server/
build/
.next/

# === 系統暫存與日誌 ===
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
.turbo/
coverage/`;

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({ isOpen, onClose }) => {
  const [gitignoreText, setGitignoreText] = useState(DEFAULT_GITIGNORE_TEMPLATE);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Rules auditing
  const rules = [
    {
      id: 'env',
      name: '.env 與 .env.* 機密環境變數隔離',
      passed: gitignoreText.includes('.env') && gitignoreText.includes('.env.*'),
      severity: 'Critical',
      advice: '必須加入 .env 與 .env.*，並確保只保留 !.env.example 供團隊參考。',
    },
    {
      id: 'keys',
      name: 'Google Cloud / AWS 服務帳號與 JSON 密鑰防護',
      passed: gitignoreText.includes('credentials.json') || gitignoreText.includes('service-account'),
      severity: 'Critical',
      advice: '必須加入 credentials.json 與 service-account*.json，杜絕雲端 IAM 金鑰外流。',
    },
    {
      id: 'certs',
      name: 'SSL/TLS 憑證與私人密鑰 (*.pem, *.key)',
      passed: gitignoreText.includes('*.pem') || gitignoreText.includes('*.key'),
      severity: 'High',
      advice: '必須加入 *.pem 與 *.key，防止本地私人加密金鑰遭 commit。',
    },
    {
      id: 'modules',
      name: 'node_modules 龐大套件目錄隔離',
      passed: gitignoreText.includes('node_modules'),
      severity: 'Medium',
      advice: '必須忽略 node_modules/ 以保持倉庫輕量及避免 CI 混亂。',
    },
    {
      id: 'build',
      name: 'dist / build 編譯產出目錄隔離',
      passed: gitignoreText.includes('dist') || gitignoreText.includes('build'),
      severity: 'Medium',
      advice: '編譯成品應由 GitHub Actions CI/CD 在乾淨容器內構建，不簽入版本庫。',
    },
  ];

  const passedCount = rules.filter((r) => r.passed).length;
  const score = Math.round((passedCount / rules.length) * 100);

  const handleCopyStandard = () => {
    navigator.clipboard.writeText(gitignoreText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setGitignoreText(DEFAULT_GITIGNORE_TEMPLATE);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-white p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                金鑰安全與 .gitignore 深度稽核
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-normal">
                  Security Auditor
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                檢視您的版本控制設定，徹底阻絕 API 金鑰、服務憑證被誤推至 GitHub 的資安災難。
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

        {/* Security Score Badge */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold font-mono text-base ${
                score === 100
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : score >= 60
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {score}分
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {score === 100 ? '✅ 金鑰安全防護機制完整' : '⚠️ 存在金鑰意外洩漏之潛在破綻'}
              </div>
              <div className="text-[11px] text-slate-400">
                已通過 {passedCount} / {rules.length} 項核心資安忽略規則
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-1 cursor-pointer"
              title="載入標準建議規範"
            >
              <RefreshCw className="w-3 h-3" />
              <span>載入標準範本</span>
            </button>
            <button
              onClick={handleCopyStandard}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-500 hover:bg-amber-400 flex items-center gap-1 cursor-pointer shadow-sm shadow-amber-500/20"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? '已複製！' : '複製 .gitignore'}</span>
            </button>
          </div>
        </div>

        {/* Rule Check List */}
        <div className="space-y-2.5 mb-5">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                rule.passed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">
                  {rule.passed ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  )}
                </span>
                <div>
                  <div className="font-bold">{rule.name}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{rule.advice}</div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0 ${
                  rule.passed
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {rule.passed ? 'PASS' : `FAIL (${rule.severity})`}
              </span>
            </div>
          ))}
        </div>

        {/* Gitignore Editor / Viewer */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-sky-400" /> 測試或調整您的 .gitignore 內容
            </span>
            <span className="text-[10px] text-slate-500">可即時輸入內容測試評分</span>
          </label>
          <textarea
            value={gitignoreText}
            onChange={(e) => setGitignoreText(e.target.value)}
            rows={7}
            className="w-full bg-slate-950 text-slate-200 font-mono text-xs rounded-xl border border-slate-800 p-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
