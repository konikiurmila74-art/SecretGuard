import { X, Shield, Check, EyeOff, FileText, AlertTriangle, Lightbulb, Lock } from 'lucide-react';
import type { Finding } from '@/types';
import { SeverityBadge } from './SeverityBadge';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FindingModalProps {
  finding: Finding | null;
  onClose: () => void;
}

export function FindingModal({ finding, onClose }: FindingModalProps) {
  const { updateFindingStatus } = useApp();
  if (!finding) return null;

  const handleResolve = () => {
    updateFindingStatus(finding.id, 'resolved');
    toast.success('Finding marked as resolved');
    onClose();
  };

  const handleIgnore = () => {
    updateFindingStatus(finding.id, 'ignored');
    toast.info('Finding ignored');
    onClose();
  };

  const handleDocs = () => {
    toast.info('Opening documentation...');
  };

  const lines = finding.codeSnippet.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl border',
              finding.severity === 'critical' ? 'bg-red-500/10 border-red-500/30 glow-red' :
              finding.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30 glow-orange' :
              'bg-yellow-500/10 border-yellow-500/30'
            )}>
              <Lock className={cn(
                'h-6 w-6',
                finding.severity === 'critical' ? 'text-red-400' :
                finding.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'
              )} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SeverityBadge severity={finding.severity} />
              </div>
              <h2 className="text-xl font-bold">{finding.type}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">File</p>
              <p className="text-sm font-medium font-mono">{finding.file}</p>
            </div>
            <div className="glass rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Line</p>
              <p className="text-sm font-medium font-mono">{finding.line}</p>
            </div>
          </div>

          <div className="glass rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Detected Secret</p>
            <p className="text-sm font-mono text-red-400 tracking-wider">{finding.maskedSecret}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Code Snippet</p>
            <div className="rounded-lg bg-black/60 border border-border overflow-hidden">
              <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto">
                {lines.map((line, i) => {
                  const lineNum = finding.line - Math.floor(lines.length / 2) + i;
                  const isHighlighted = lineNum === finding.line;
                  return (
                    <div
                      key={i}
                      className={cn(
                        'flex gap-3 px-2 -mx-2 py-0.5',
                        isHighlighted && 'bg-red-500/15 border-l-2 border-red-500'
                      )}
                    >
                      <span className="text-muted-foreground/50 select-none w-8 text-right">{lineNum}</span>
                      <span className={cn(isHighlighted ? 'text-red-300' : 'text-foreground/80')}>{line}</span>
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>

          <div className="glass rounded-lg p-4 border-red-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400 mb-1">Why this is dangerous</p>
                <p className="text-sm text-muted-foreground">{finding.danger}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-green-400" />
              <p className="text-sm font-semibold text-green-400">Recommended Fix</p>
            </div>
            <ol className="space-y-2">
              {finding.fixes.map((fix, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{fix}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-border">
          <button
            onClick={handleResolve}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all"
          >
            <Check className="h-4 w-4" />
            Mark as Resolved
          </button>
          <button
            onClick={handleIgnore}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-muted-foreground text-sm font-medium hover:bg-muted transition-all"
          >
            <EyeOff className="h-4 w-4" />
            Ignore
          </button>
          <button
            onClick={handleDocs}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all"
          >
            <FileText className="h-4 w-4" />
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
