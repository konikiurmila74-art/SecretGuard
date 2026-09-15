import type { ScannerSettings, ScanHistoryEntry, Finding } from '@/types';

const SETTINGS_KEY = 'secretguard-settings';
const HISTORY_KEY = 'secretguard-history';
const FINDINGS_KEY = 'secretguard-findings';

export const DEFAULT_SETTINGS: ScannerSettings = {
  entropyDetection: true,
  scanConfigFiles: true,
  scanSourceFiles: true,
  ignoreNodeModules: true,
  ignoreGit: true,
  ignoreBuildFolders: true,
  criticalThreshold: 80,
  highThreshold: 60,
  mediumThreshold: 40,
  preCommitProtection: true,
  blockCriticalCommits: true,
};

export function loadSettings(): ScannerSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: ScannerSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadHistory(): ScanHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function saveHistory(history: ScanHistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadFindings(): Finding[] {
  try {
    const raw = localStorage.getItem(FINDINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function saveFindings(findings: Finding[]): void {
  localStorage.setItem(FINDINGS_KEY, JSON.stringify(findings));
}
