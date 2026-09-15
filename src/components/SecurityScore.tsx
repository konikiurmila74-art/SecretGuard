import { getScoreLabel, getScoreColor } from '@/utils/scoring';
import { cn } from '@/lib/utils';

interface SecurityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function SecurityScore({ score, size = 'lg', label }: SecurityScoreProps) {
  const { label: scoreLabel } = getScoreLabel(score);
  const color = getScoreColor(score);
  const displayLabel = label || scoreLabel;

  const dimensions = {
    sm: { box: 120, stroke: 8, font: 'text-2xl', sub: 'text-[10px]' },
    md: { box: 160, stroke: 10, font: 'text-4xl', sub: 'text-xs' },
    lg: { box: 220, stroke: 12, font: 'text-5xl', sub: 'text-sm' },
  };
  const d = dimensions[size];
  const radius = (d.box - d.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: d.box, height: d.box }}>
        <svg width={d.box} height={d.box} className="-rotate-90">
          <circle
            cx={d.box / 2}
            cy={d.box / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={d.stroke}
          />
          <circle
            cx={d.box / 2}
            cy={d.box / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={d.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold tracking-tight', d.font)} style={{ color }}>
            {score}
          </span>
          <span className={cn('text-muted-foreground font-medium uppercase tracking-wider', d.sub)}>
            / 100
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className={cn('text-sm font-semibold uppercase tracking-wide')} style={{ color }}>
          {displayLabel}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Security Score</p>
      </div>
    </div>
  );
}
