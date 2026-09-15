import { Lock, FileCode2, MapPin } from 'lucide-react';
import type { Finding } from '@/types';
import { SeverityBadge } from './SeverityBadge';
import { cn } from '@/lib/utils';

interface FindingCardProps {
  finding: Finding;
  onClick?: () => void;
}

export function FindingCard({ finding, onClick }: FindingCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left glass-card rounded-xl p-4 hover:scale-[1.01] transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg border',
            finding.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
            finding.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
            'bg-yellow-500/10 border-yellow-500/30'
          )}>
            <Lock className={cn(
              'h-5 w-5',
              finding.severity === 'critical' ? 'text-red-400' :
              finding.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'
            )} />
          </div>
          <div>
            <p className="text-sm font-semibold">{finding.type}</p>
            <div className="flex items-center gap-2 mt-1">
              <SeverityBadge severity={finding.severity} />
            </div>
          </div>
        </div>
        {finding.status === 'resolved' && (
          <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">Resolved</span>
        )}
        {finding.status === 'ignored' && (
          <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border">Ignored</span>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <FileCode2 className="h-3 w-3" />
          {finding.file}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          Line {finding.line}
        </span>
        <span className="font-mono text-red-400/70">{finding.maskedSecret}</span>
      </div>
    </button>
  );
}
