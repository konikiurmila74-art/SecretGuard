import { Shield, LayoutDashboard, ScanLine, FileSearch, Bug, History, FileText, GitBranch, Settings, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { PageId } from '@/types';
import { cn } from '@/lib/utils';

const NAV_ITEMS: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scan-project', label: 'Scan Project', icon: ScanLine },
  { id: 'scan-results', label: 'Scan Results', icon: FileSearch },
  { id: 'findings', label: 'Findings', icon: Bug },
  { id: 'scan-history', label: 'Scan History', icon: History },
  { id: 'security-report', label: 'Security Report', icon: FileText },
  { id: 'pre-commit', label: 'Pre-Commit Protection', icon: GitBranch },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { currentPage, setCurrentPage } = useApp();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/40 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/30 glow-green">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">SecretGuard</h1>
            <p className="text-[11px] text-muted-foreground">Secret Leak Detection</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary/10 text-primary border border-primary/20 glow-green'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', active && 'text-primary')} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/10">
          <div className="relative">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          </div>
          <div>
            <p className="text-xs font-medium text-primary">System Protected</p>
            <p className="text-[10px] text-muted-foreground">Last scan: 2 minutes ago</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
