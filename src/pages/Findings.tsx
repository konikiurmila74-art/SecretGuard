import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Lock, FileCode2, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SeverityBadge } from '@/components/SeverityBadge';
import { FindingModal } from '@/components/FindingModal';
import { DEMO_FINDINGS } from '@/data/demoData';
import type { Finding, Severity } from '@/types';
import { cn } from '@/lib/utils';

type FilterType = 'all' | Severity | 'resolved' | 'ignored';
type SortField = 'severity' | 'file' | 'line' | 'type';

const SEVERITY_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, info: 3 };

export function Findings() {
  const { findings, updateFindingStatus } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('severity');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  const allFindings = findings.length > 0 ? findings : DEMO_FINDINGS;

  const filtered = useMemo(() => {
    let result = allFindings.filter((f) => {
      const matchesSearch =
        f.type.toLowerCase().includes(search.toLowerCase()) ||
        f.file.toLowerCase().includes(search.toLowerCase()) ||
        f.project.toLowerCase().includes(search.toLowerCase()) ||
        f.maskedSecret.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === 'all' ? true :
        filter === 'resolved' ? f.status === 'resolved' :
        filter === 'ignored' ? f.status === 'ignored' :
        f.severity === filter && f.status === 'exposed';

      return matchesSearch && matchesFilter;
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'severity') cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      else if (sortField === 'file') cmp = a.file.localeCompare(b.file);
      else if (sortField === 'line') cmp = a.line - b.line;
      else if (sortField === 'type') cmp = a.type.localeCompare(b.type);
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [allFindings, search, filter, sortField, sortAsc]);

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: allFindings.length },
    { id: 'critical', label: 'Critical', count: allFindings.filter((f) => f.severity === 'critical' && f.status === 'exposed').length },
    { id: 'high', label: 'High', count: allFindings.filter((f) => f.severity === 'high' && f.status === 'exposed').length },
    { id: 'medium', label: 'Medium', count: allFindings.filter((f) => f.severity === 'medium' && f.status === 'exposed').length },
    { id: 'resolved', label: 'Resolved', count: allFindings.filter((f) => f.status === 'resolved').length },
  ];

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search secrets, files, or projects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg glass border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-2.5 rounded-lg glass border border-border text-sm focus:outline-none focus:border-primary/50 transition-all bg-card"
          >
            {filters.map((f) => (
              <option key={f.id} value={f.id}>{f.label} ({f.count})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              filter === f.id
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'glass border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border bg-muted/20">
                <th className="text-left p-4 font-medium">
                  <button onClick={() => toggleSort('severity')} className="flex items-center gap-1 hover:text-foreground">
                    Severity <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 font-medium">
                  <button onClick={() => toggleSort('type')} className="flex items-center gap-1 hover:text-foreground">
                    Secret Type <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 font-medium">
                  <button onClick={() => toggleSort('file')} className="flex items-center gap-1 hover:text-foreground">
                    File <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 font-medium">
                  <button onClick={() => toggleSort('line')} className="flex items-center gap-1 hover:text-foreground">
                    Line <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 font-medium">Masked Secret</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No findings match your search.</td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4"><SeverityBadge severity={f.severity} /></td>
                    <td className="p-4 font-medium">{f.type}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{f.file}</td>
                    <td className="p-4 text-muted-foreground">{f.line}</td>
                    <td className="p-4 font-mono text-xs text-red-400/70">{f.maskedSecret}</td>
                    <td className="p-4">
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-md border',
                        f.status === 'exposed' && 'text-red-400 bg-red-500/10 border-red-500/20',
                        f.status === 'resolved' && 'text-green-400 bg-green-500/10 border-green-500/20',
                        f.status === 'ignored' && 'text-muted-foreground bg-muted/50 border-border'
                      )}>
                        {f.status === 'exposed' ? 'Exposed' : f.status === 'resolved' ? 'Resolved' : 'Ignored'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedFinding(f)}
                        className="text-xs text-primary hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.slice(0, 3).map((f) => (
            <div key={f.id} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg border',
                  f.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                  f.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                  'bg-yellow-500/10 border-yellow-500/30'
                )}>
                  <Lock className={cn(
                    'h-4 w-4',
                    f.severity === 'critical' ? 'text-red-400' :
                    f.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'
                  )} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{f.type}</p>
                  <SeverityBadge severity={f.severity} />
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><FileCode2 className="h-3 w-3" />{f.file}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Line {f.line}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <FindingModal finding={selectedFinding} onClose={() => setSelectedFinding(null)} />
    </div>
  );
}
