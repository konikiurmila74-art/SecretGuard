import { useApp } from '@/context/AppContext';
import type { PageId } from '@/types';

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  landing: { title: '', subtitle: '' },
  dashboard: { title: 'Security Overview', subtitle: 'Monitor exposed secrets across your projects.' },
  'scan-project': { title: 'Scan Your Project', subtitle: 'Upload or select a project to detect exposed credentials.' },
  'scan-results': { title: 'Scan Results', subtitle: 'Detailed analysis of detected secrets and vulnerabilities.' },
  findings: { title: 'Findings', subtitle: 'All detected secrets and vulnerabilities across projects.' },
  'scan-history': { title: 'Scan History', subtitle: 'Review past security scans and their results.' },
  'security-report': { title: 'Security Scan Report', subtitle: 'Comprehensive security assessment report.' },
  'pre-commit': { title: 'Pre-Commit Protection', subtitle: 'Prevent secrets from entering Git repositories before they are committed.' },
  settings: { title: 'Settings', subtitle: 'Configure scanner behavior and protection rules.' },
};

export function Header() {
  const { currentPage } = useApp();
  const info = PAGE_TITLES[currentPage];

  if (currentPage === 'landing') return null;

  return (
    <header className="px-8 py-6 border-b border-border">
      <h1 className="text-2xl font-bold tracking-tight">{info.title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{info.subtitle}</p>
    </header>
  );
}
