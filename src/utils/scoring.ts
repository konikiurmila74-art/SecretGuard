import type { Finding, Severity } from '@/types';

export const SEVERITY_DEDUCTIONS: Record<Severity, number> = {
  critical: 20,
  high: 10,
  medium: 5,
  info: 1,
};

export function calculateScore(findings: Finding[]): number {
  let score = 100;
  for (const f of findings) {
    if (f.status === 'resolved' || f.status === 'ignored') continue;
    score -= SEVERITY_DEDUCTIONS[f.severity];
  }
  return Math.max(0, score);
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: 'text-green-400' };
  if (score >= 75) return { label: 'Good', color: 'text-green-400' };
  if (score >= 50) return { label: 'Needs Attention', color: 'text-yellow-400' };
  if (score >= 25) return { label: 'Poor', color: 'text-orange-400' };
  return { label: 'Critical Risk', color: 'text-red-400' };
}

export function getScoreColor(score: number): string {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#eab308';
  if (score >= 25) return '#f97316';
  return '#ef4444';
}

export function getScoreStatus(score: number): string {
  if (score >= 90) return 'secure';
  if (score >= 75) return 'secure';
  if (score >= 50) return 'needs-attention';
  if (score >= 25) return 'poor';
  return 'critical';
}

export function getSeverityCount(findings: Finding[], severity: Severity): number {
  return findings.filter((f) => f.severity === severity && f.status === 'exposed').length;
}

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case 'critical': return '#ef4444';
    case 'high': return '#f97316';
    case 'medium': return '#eab308';
    case 'info': return '#3b82f6';
  }
}
