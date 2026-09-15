import { Shield, Bug, AlertTriangle, FileSearch, FolderGit2, ScanLine, Play, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/StatCard';
import { SecurityScore } from '@/components/SecurityScore';
import { ThreatChart } from '@/components/ThreatChart';
import { FindingCard } from '@/components/FindingCard';
import { FindingModal } from '@/components/FindingModal';
import { DASHBOARD_STATS, RECENT_SCANS, DEMO_FINDINGS } from '@/data/demoData';
import { getScoreColor, getScoreLabel } from '@/utils/scoring';
import { useState } from 'react';
import type { Finding } from '@/types';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const { setCurrentPage, setFindings } = useApp();
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  const recentFindings = DEMO_FINDINGS.slice(0, 4);

  const handleScan = () => {
    setFindings(DEMO_FINDINGS);
    setCurrentPage('scan-project');
  };

  const handleDemoScan = () => {
    setFindings(DEMO_FINDINGS);
    setCurrentPage('scan-project');
  };

  const statusColors: Record<string, string> = {
    'Secure': 'text-green-400 bg-green-500/10 border-green-500/20',
    'At Risk': 'text-red-400 bg-red-500/10 border-red-500/20',
    'Needs Attention': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={handleScan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all glow-green"
        >
          <ScanLine className="h-4 w-4" />
          Scan New Project
        </button>
        <button
          onClick={handleDemoScan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass border border-border text-sm font-medium hover:bg-muted/50 transition-all"
        >
          <Play className="h-4 w-4" />
          Run Demo Scan
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-card rounded-xl p-5 col-span-2 md:col-span-1 lg:col-span-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-400">92<span className="text-sm text-muted-foreground">/100</span></p>
          <p className="text-sm text-muted-foreground">Security Score</p>
          <p className="text-xs font-medium text-green-400 mt-1">Excellent</p>
        </div>
        <StatCard label="Secrets Detected" value={7} icon={Bug} accent="red" trend="3 from last scan" />
        <StatCard label="Critical Issues" value={2} icon={AlertTriangle} accent="red" alert subtitle="Requires immediate action" />
        <StatCard label="Files Scanned" value={DASHBOARD_STATS.filesScanned.toLocaleString()} icon={FileSearch} accent="blue" />
        <StatCard label="Projects Protected" value={DASHBOARD_STATS.totalProjects} icon={FolderGit2} accent="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6 self-start">Security Score</h3>
          <SecurityScore score={92} size="lg" />
        </div>
        <div className="lg:col-span-2">
          <ThreatChart critical={2} high={3} medium={2} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recent Scans</h3>
            <button onClick={() => setCurrentPage('scan-history')} className="text-xs text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left pb-2 font-medium">Project</th>
                  <th className="text-right pb-2 font-medium">Files</th>
                  <th className="text-right pb-2 font-medium">Secrets</th>
                  <th className="text-right pb-2 font-medium">Score</th>
                  <th className="text-right pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_SCANS.slice(0, 5).map((scan) => (
                  <tr key={scan.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-mono text-xs">{scan.project}</td>
                    <td className="py-3 text-right text-muted-foreground">{scan.filesScanned}</td>
                    <td className="py-3 text-right text-muted-foreground">{scan.secretsDetected}</td>
                    <td className="py-3 text-right font-bold" style={{ color: getScoreColor(scan.securityScore) }}>{scan.securityScore}</td>
                    <td className="py-3 text-right">
                      <span className={cn('text-xs px-2 py-1 rounded-md border', statusColors[scan.status] || statusColors['Secure'])}>
                        {scan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recent Findings</h3>
            <button onClick={() => setCurrentPage('findings')} className="text-xs text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentFindings.map((f) => (
              <FindingCard key={f.id} finding={f} onClick={() => setSelectedFinding(f)} />
            ))}
          </div>
        </div>
      </div>

      <FindingModal finding={selectedFinding} onClose={() => setSelectedFinding(null)} />
    </div>
  );
}
