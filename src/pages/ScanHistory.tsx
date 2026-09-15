import { useApp } from '@/context/AppContext';
import { getScoreColor } from '@/utils/scoring';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function ScanHistory() {
  const { history, setCurrentPage, setCurrentScan } = useApp();

  const statusColors: Record<string, string> = {
    'Secure': 'text-green-400 bg-green-500/10 border-green-500/20',
    'At Risk': 'text-red-400 bg-red-500/10 border-red-500/20',
    'Needs Attention': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'Poor': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Critical': 'text-red-400 bg-red-500/10 border-red-500/20',
  'critical': 'text-red-400 bg-red-500/10 border-red-500/20',
  'at-risk': 'text-red-400 bg-red-500/10 border-red-500/20',
    'needs-attention': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    'poor': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    'secure': 'text-green-400 bg-green-500/10 border-green-500/20',
  };

  const handleRowClick = (entry: typeof history[0]) => {
    setCurrentScan({
      id: entry.id,
      project: entry.project,
      date: entry.date,
      filesScanned: entry.filesScanned,
      linesAnalyzed: Math.round(entry.filesScanned * 150),
      secretsDetected: entry.secretsDetected,
      securityScore: entry.securityScore,
      status: 'at-risk',
      findings: [],
    });
    setCurrentPage('scan-results');
  };

  return (
    <div className="p-8">
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border bg-muted/20">
                <th className="text-left p-4 font-medium">Project</th>
                <th className="text-left p-4 font-medium">Scan Date</th>
                <th className="text-right p-4 font-medium">Files</th>
                <th className="text-right p-4 font-medium">Secrets</th>
                <th className="text-right p-4 font-medium">Security Score</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group"
                  onClick={() => handleRowClick(entry)}
                >
                  <td className="p-4 font-mono text-xs font-medium">{entry.project}</td>
                  <td className="p-4 text-muted-foreground">{entry.date}</td>
                  <td className="p-4 text-right text-muted-foreground">{entry.filesScanned}</td>
                  <td className="p-4 text-right text-muted-foreground">{entry.secretsDetected}</td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-lg" style={{ color: getScoreColor(entry.securityScore) }}>
                      {entry.securityScore}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn('text-xs px-2 py-1 rounded-md border', statusColors[entry.status] || statusColors['Secure'])}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View <ArrowRight className="h-3 w-3" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
