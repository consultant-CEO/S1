export type CategoryType = 
  | 'RAG 知識庫'
  | 'Agent 自動化'
  | '多模態即時服務'
  | 'CI/CD DevSecOps'
  | '批次數據管線'
  | '自訂企業架構';

export type GeminiModelName = 
  | 'gemini-3.8-flash'
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.8-live'
  | 'gemini-3.1-flash-lite';

export type CloudPlatform = 'GCP Cloud Run' | 'AWS Lambda / ECS' | 'Cloudflare Workers + Containers';

export interface FewShotPair {
  user: string;
  model: string;
  explanation?: string;
}

export interface FileItem {
  path: string;
  description: string;
  content?: string;
  isSensitive?: boolean;
}

export interface GitHubSecretDef {
  name: string;
  description: string;
  exampleValue: string;
  scope: 'Actions' | 'Dependabot' | 'Environments';
}

export interface CostTrap {
  title: string;
  risk: string;
  severity: 'High' | 'Medium' | 'Critical';
  mitigation: string;
}

export interface SavingsStrategy {
  title: string;
  mechanism: string;
  expectedSavings: string;
  implementationHint: string;
}

export interface ArchitectureBlueprint {
  id: string;
  title: string;
  category: CategoryType;
  summaryTagline: string; // 📌 一句話總結核心價值與技術棧
  techStack: string[];
  cloudTarget: CloudPlatform;
  recommendedModel: GeminiModelName;
  modelRationale: string;
  parameters: {
    temperature: number;
    topP: number;
    topK?: number;
    maxOutputTokens?: number;
  };
  systemPrompt: string; // 🤖 System Instructions
  fewShotExamples: FewShotPair[];
  
  // 📁 GitHub 專案結構與安全規範
  projectStructure: {
    treeAscii: string;
    files: FileItem[];
  };
  securitySpec: {
    gitignoreItems: string[];
    envExample: string;
    githubSecrets: GitHubSecretDef[];
    readmeInstructions: string;
  };

  // ☁️ 公有雲部署與 CI/CD 策略
  deployment: {
    serviceName: string;
    cloudService: string; // e.g. "Google Cloud Run (完全託管無伺服器容器)"
    architectureFlow: string[];
    dockerfile: string;
    githubActionsYml: string;
    healthCheckPath: string;
    iamBestPractice: string;
  };

  // 💰 FinOps 成本拆解與降本策略
  finOps: {
    pricingModel: {
      inputPerMillion: number;
      outputPerMillion: number;
      cachedInputPerMillion: number;
    };
    estimatedMonthlyTokenCost: string;
    estimatedMonthlyInfraCost: string;
    totalEstimatedMonthly: string;
    costTraps: CostTrap[];
    savingsStrategies: SavingsStrategy[];
  };

  // 完整 Markdown 格式報告
  rawMarkdownReport?: string;
}
