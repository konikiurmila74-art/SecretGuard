import type { LucideIcon } from 'lucide-react';
import { TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: 'green' | 'red' | 'orange' | 'blue' | 'neutral';
  trend?: string;
  alert?: boolean;
}

const ACCENTS = {
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', glow: 'glow-green' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', glow: 'glow-red' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', glow: 'glow-orange' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', glow: '' },
  neutral: { bg: 'bg-muted/50', text: 'text-foreground', border: 'border-border', glow: '' },
};

export function StatCard({ label, value, subtitle, icon: Icon, accent = 'neutral', trend, alert }: StatCardProps) {
  const a = ACCENTS[accent];
  return (
    <div className={cn('glass-card rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]', a.glow)}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg border', a.bg, a.border)}>
          <Icon className={cn('h-5 w-5', a.text)} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingDown className="h-3 w-3 text-green-400" />
            {trend}
          </div>
        )}
        {alert && <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {subtitle && <p className={cn('text-xs font-medium', a.text)}>{subtitle}</p>}
      </div>
    </div>
  );
}
