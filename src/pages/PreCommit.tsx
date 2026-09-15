import { useState, useEffect, useRef } from 'react';
import { Terminal, Play, ArrowRight, Copy, Check, ShieldCheck, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info';
}

const SCRIPT_LINES: TerminalLine[] = [
  { text: '$ git add .', type: 'command' },
  { text: '$ git commit -m "update configuration"', type: 'command' },
  { text: '', type: 'output' },
  { text: 'SecretGuard Scanner', type: 'info' },
  { text: 'Scanning staged files...', type: 'output' },
  { text: '', type: 'output' },
  { text: '.env ............... CRITICAL', type: 'error' },
  { text: 'config.py .......... HIGH', type: 'error' },
  { text: 'app.js ............. CLEAN', type: 'success' },
  { text: '', type: 'output' },
  { text: 'COMMIT BLOCKED', type: 'error' },
  { text: '2 secrets detected.', type: 'error' },
  { text: 'Secrets must be removed before committing.', type: 'error' },
];

export function PreCommit() {
  const { setCurrentPage } = useApp();
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const runScan = () => {
    setRunning(true);
    setLines([]);
    setCompleted(false);
  };

  useEffect(() => {
    if (!running) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i >= SCRIPT_LINES.length) {
        clearInterval(interval);
        setRunning(false);
        setCompleted(true);
        return;
      }
      setLines((prev) => [...prev, SCRIPT_LINES[i]]);
      i++;
    }, 350);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const copyCommand = () => {
    navigator.clipboard.writeText('secretguard scan');
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const lineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command': return 'text-blue-400';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/30">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Pre-Commit Protection</h3>
            <p className="text-sm text-muted-foreground">Prevent secrets from entering Git repositories before they are committed.</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex items-center gap-2 ml-2 text-xs text-muted-foreground">
            <Terminal className="h-3.5 w-3.5" />
            <span className="font-mono">bash — pre-commit-scan</span>
          </div>
        </div>
        <div ref={terminalRef} className="p-4 h-80 overflow-y-auto bg-black/50 terminal-text text-sm">
          {lines.length === 0 && !running && (
            <p className="text-muted-foreground/50">Click "Run Pre-Commit Scan" to simulate a git commit check...</p>
          )}
          {lines.map((line, i) => (
            <div key={i} className={cn('leading-relaxed', lineColor(line.type))}>
              {line.text || '\u00A0'}
            </div>
          ))}
          {running && <span className="inline-block w-2 h-4 bg-primary animate-pulse" />}
        </div>
      </div>

      {completed && (
        <div className="glass-card rounded-xl p-6 border-red-500/20 animate-slide-up">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-lg font-semibold text-red-400">Commit blocked</p>
              <p className="text-sm text-muted-foreground">Secrets must be removed before committing.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={runScan}
          disabled={running}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all glow-green disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {running ? 'Scanning...' : 'Run Pre-Commit Scan'}
        </button>
        <button
          onClick={() => setCurrentPage('findings')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-all"
        >
          View Findings
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Setup Pre-Commit Hook</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">1. Install SecretGuard CLI</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-2.5 rounded-lg bg-black/50 border border-border text-sm font-mono text-primary">
                npm install -g secretguard
              </code>
              <button onClick={copyCommand} className="p-2.5 rounded-lg glass border border-border hover:bg-muted/50 transition-all">
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">2. Configure Git hook</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-2.5 rounded-lg bg-black/50 border border-border text-sm font-mono text-primary">
                secretguard scan --pre-commit
              </code>
              <button
                onClick={() => { navigator.clipboard.writeText('secretguard scan --pre-commit'); toast.success('Copied'); }}
                className="p-2.5 rounded-lg glass border border-border hover:bg-muted/50 transition-all"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">3. Add to .pre-commit-config.yaml</p>
            <div className="px-4 py-3 rounded-lg bg-black/50 border border-border text-sm font-mono text-muted-foreground">
              <pre>{`hooks:
  - id: secretguard
    name: SecretGuard Secret Scanner
    entry: secretguard scan
    language: system`}</pre>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">
          This is a simulated frontend demonstration. SecretGuard does not install an actual Git hook in your browser.
        </p>
      </div>
    </div>
  );
}
