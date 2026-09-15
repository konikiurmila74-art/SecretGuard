import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Download, Printer, FileText, Shield, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SecurityScore } from '@/components/SecurityScore';
import { SeverityBadge } from '@/components/SeverityBadge';
import { createDemoScanResult } from '@/data/demoData';
import { getSeverityCount } from '@/utils/scoring';
import { downloadReport, printReport } from '@/utils/report';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SecurityReport() {
  const { currentScan } = useApp();
  const scan = currentScan || createDemoScanResult();

  const critical = getSeverityCount(scan.findings, 'critical');
  const high = getSeverityCount(scan.findings, 'high');
  const medium = getSeverityCount(scan.findings, 'medium');

  const chartData = [
    { name: 'Critical', value: critical, color: '#ef4444' },
    { name: 'High', value: high, color: '#f97316' },
    { name: 'Medium', value: medium, color: '#eab308' },
  ];

  const criticalFindings = scan.findings.filter((f) => f.severity === 'critical' && f.status === 'exposed');
  const highFindings = scan.findings.filter((f) => f.severity === 'high' && f.status === 'exposed');
  const mediumFindings = scan.findings.filter((f) => f.severity === 'medium' && f.status === 'exposed');

  const handleDownload = () => {
    downloadReport(scan);
    toast.success('Report downloaded successfully');
  };

  const handlePrint = () => {
    printReport(scan);
    toast.info('Opening print dialog...');
  };

  const recommendedActions = [
    'Revoke all exposed critical credentials immediately',
    'Rotate all API keys and tokens found in source code',
    'Move all secrets to environment variables or a secrets manager',
    'Add .env and config files to .gitignore',
    'Install pre-commit hooks to prevent future secret leaks',
    'Conduct a full security audit of all repositories',
    'Train developers on secure credential management practices',
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Security Scan Report</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div><p className="text-xs text-muted-foreground">Project</p><p className="text-sm font-mono font-medium">{scan.project}</p></div>
              <div><p className="text-xs text-muted-foreground">Scan Date</p><p className="text-sm font-medium">{scan.date}</p></div>
              <div><p className="text-xs text-muted-foreground">Files Scanned</p><p className="text-sm font-medium">{scan.filesScanned}</p></div>
              <div><p className="text-xs text-muted-foreground">Lines Analyzed</p><p className="text-sm font-medium">{scan.linesAnalyzed.toLocaleString()}</p></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all glow-green">
              <Download className="h-4 w-4" />
              Download Report
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass border border-border text-sm font-medium hover:bg-muted/50 transition-all">
              <Printer className="h-4 w-4" />
              Print Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center">
          <SecurityScore score={scan.securityScore} size="md" />
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">Total Findings: <span className="font-bold text-foreground">{scan.secretsDetected}</span></p>
          </div>
        </div>
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(20,24,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wide">Executive Summary</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A security scan of <span className="font-mono text-foreground">{scan.project}</span> analyzed {scan.filesScanned} files
          and {scan.linesAnalyzed.toLocaleString()} lines of code. The scan detected {scan.secretsDetected} exposed secrets,
          including {critical} critical, {high} high, and {medium} medium severity findings. The overall security score
          is <span className="font-bold" style={{ color: scan.securityScore >= 75 ? '#22c55e' : scan.securityScore >= 50 ? '#eab308' : '#ef4444' }}>{scan.securityScore}/100</span>.
          {critical > 0 && ' Immediate action is required to revoke and rotate exposed critical credentials.'}
        </p>
      </div>

      {criticalFindings.length > 0 && (
        <div className="glass-card rounded-xl p-6 border-red-500/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide">Critical Findings</h3>
          </div>
          <div className="space-y-3">
            {criticalFindings.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-sm font-medium">{f.type}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{f.file}:{f.line}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {highFindings.length > 0 && (
        <div className="glass-card rounded-xl p-6 border-orange-500/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide">High Severity Findings</h3>
          </div>
          <div className="space-y-3">
            {highFindings.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-sm font-medium">{f.type}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{f.file}:{f.line}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {mediumFindings.length > 0 && (
        <div className="glass-card rounded-xl p-6 border-yellow-500/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">Medium Severity Findings</h3>
          </div>
          <div className="space-y-3">
            {mediumFindings.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-sm font-medium">{f.type}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{f.file}:{f.line}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-green-400" />
          <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide">Recommended Actions</h3>
        </div>
        <ol className="space-y-2">
          {recommendedActions.map((action, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{action}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
