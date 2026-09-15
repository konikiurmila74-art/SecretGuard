export type Severity = 'critical' | 'high' | 'medium' | 'info';

export type FindingStatus = 'exposed' | 'resolved' | 'ignored';

export interface Finding {
  id: string;
  type: string;
  severity: Severity;
  file: string;
  line: number;
  maskedSecret: string;
  codeSnippet: string;
  highlightedLine: number;
  description: string;
  danger: string;
  fixes: string[];
  status: FindingStatus;
  confidence: number;
  project: string;
}

export interface ScanResult {
  id: string;
  project: string;
  date: string;
  filesScanned: number;
  linesAnalyzed: number;
  secretsDetected: number;
  securityScore: number;
  status: 'secure' | 'at-risk' | 'needs-attention' | 'poor' | 'critical';
  findings: Finding[];
}

export interface ScanHistoryEntry {
  id: string;
  project: string;
  date: string;
  filesScanned: number;
  secretsDetected: number;
  securityScore: number;
  status: string;
}

export interface ScannerSettings {
  entropyDetection: boolean;
  scanConfigFiles: boolean;
  scanSourceFiles: boolean;
  ignoreNodeModules: boolean;
  ignoreGit: boolean;
  ignoreBuildFolders: boolean;
  criticalThreshold: number;
  highThreshold: number;
  mediumThreshold: number;
  preCommitProtection: boolean;
  blockCriticalCommits: boolean;
}

export type PageId =
  | 'landing'
  | 'dashboard'
  | 'scan-project'
  | 'scan-results'
  | 'findings'
  | 'scan-history'
  | 'security-report'
  | 'pre-commit'
  | 'settings';
