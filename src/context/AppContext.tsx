import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PageId, ScannerSettings, ScanHistoryEntry, Finding, ScanResult } from '@/types';
import { loadSettings, saveSettings, loadHistory, saveHistory, loadFindings, saveFindings, DEFAULT_SETTINGS } from '@/utils/storage';
import { RECENT_SCANS } from '@/data/demoData';

interface AppContextValue {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  settings: ScannerSettings;
  updateSettings: (settings: ScannerSettings) => void;
  history: ScanHistoryEntry[];
  addHistoryEntry: (entry: ScanHistoryEntry) => void;
  findings: Finding[];
  setFindings: (findings: Finding[]) => void;
  updateFindingStatus: (id: string, status: Finding['status']) => void;
  currentScan: ScanResult | null;
  setCurrentScan: (scan: ScanResult | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [settings, setSettings] = useState<ScannerSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [findings, setFindingsState] = useState<Finding[]>([]);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
    const loadedHistory = loadHistory();
    setHistory(loadedHistory.length > 0 ? loadedHistory : RECENT_SCANS);
    setFindingsState(loadFindings());
  }, []);

  const updateSettings = (s: ScannerSettings) => {
    setSettings(s);
    saveSettings(s);
  };

  const addHistoryEntry = (entry: ScanHistoryEntry) => {
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const setFindings = (f: Finding[]) => {
    setFindingsState(f);
    saveFindings(f);
  };

  const updateFindingStatus = (id: string, status: Finding['status']) => {
    const updated = findings.map((f) => (f.id === id ? { ...f, status } : f));
    setFindings(updated);
    if (currentScan) {
      const updatedScanFindings = currentScan.findings.map((f) =>
        f.id === id ? { ...f, status } : f
      );
      setCurrentScan({ ...currentScan, findings: updatedScanFindings });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        settings,
        updateSettings,
        history,
        addHistoryEntry,
        findings,
        setFindings,
        updateFindingStatus,
        currentScan,
        setCurrentScan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
