import { useState } from 'react';
import { CheckCircle2, AlertTriangle, FileSearch, FileText, Eye, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SecurityScore } from '@/components/SecurityScore';
import { SeverityBadge } from '@/components/SeverityBadge';
import { FindingModal } from '@/components/FindingModal';
import { createDemoScanResult } from '@/data/demoData';
import { getSeverityCount } from '@/utils/scoring';
import type { Finding } from '@/types';
import { cn } from '@/lib/utils';

export function ScanResults() {
  const { currentScan, setCurrentPage } = useApp();
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  const scan = currentScan || createDemoScanResult();
  const critical = getSeverityCount(scan.findings, 'critical');
  const high = getSeverityCount(scan.findings, 'high');
  const medium = getSeverityCount(scan.findings, 'medium');

  const severityCards = [
    { label: 'Critical', count: critical, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', glow: 'glow-red' },
    { label: 'High', count: high, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', glow: 'glow-orange' },
    { label: 'Medium', count: medium, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', glow: '' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="glass-card rounded-xl p-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/30">
          <CheckCircle2 className="h-7 w-7 text-green-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Scan Completed Successfully</h2>
          <p className="text-sm text-muted-foreground">Project: <span className="font-mono text-foreground">{scan.project}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileSearch className="h-4 w-4 text-blue-400" />
            <p className="text-xs text-muted-foreground uppercase">Files Scanned</p>
          </div>
          <p className="text-2xl font-bold">{scan.filesScanned}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-400" />
            <p className="text-xs text-muted-foreground uppercase">Lines Analyzed</p>
          </div>
          <p className="text-2xl font-bold">{scan.linesAnalyzed.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <p className="text-xs text-muted-foreground uppercase">Secrets Detected</p>
          </div>
          <p className="text-2xl font-bold text-red-400">{scan.secretsDetected}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs text-muted-foreground uppercase">Status</p>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <p className="text-sm font-semibold text-yellow-400">Security Risk Detected</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center">
          <SecurityScore score={scan.securityScore} size="md" />
        </div>
        <div className="lg:col-span-2 grid grid-cols-3 gap-4">
          {severityCards.map((card) => (
            <div key={card.label} className={cn('glass-card rounded-xl p-5 text-center', card.glow)}>
              <p className={cn('text-4xl font-bold mb-1', card.color)}>{card.count}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <div className={cn('mt-3 h-1 rounded-full', card.bg)} />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Findings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left pb-3 font-medium">Severity</th>
                <th className="text-left pb-3 font-medium">Secret Type</th>
                <th className="text-left pb-3 font-medium">File</th>
                <th className="text-right pb-3 font-medium">Line</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-right pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {scan.findings.map((f) => (
                <tr key={f.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3"><SeverityBadge severity={f.severity} /></td>
                  <td className="py-3 font-medium">{f.type}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">{f.file}</td>
                  <td className="py-3 text-right text-muted-foreground">{f.line}</td>
                  <td className="py-3">
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-md border',
                      f.status === 'exposed' && 'text-red-400 bg-red-500/10 border-red-500/20',
                      f.status === 'resolved' && 'text-green-400 bg-green-500/10 border-green-500/20',
                      f.status === 'ignored' && 'text-muted-foreground bg-muted/50 border-border'
                    )}>
                      {f.status === 'exposed' ? 'Exposed' : f.status === 'resolved' ? 'Resolved' : 'Ignored'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedFinding(f)}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentPage('scan-project')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass border border-border text-sm font-medium hover:bg-muted/50 transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          Scan Another Project
        </button>
        <button
          onClick={() => setCurrentPage('security-report')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
        >
          View Full Report
        </button>
      </div>

      <FindingModal finding={selectedFinding} onClose={() => setSelectedFinding(null)} />
    </div>
  );
}
