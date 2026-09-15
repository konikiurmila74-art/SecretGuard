import { Shield, Search, GitBranch, BarChart3, ArrowRight, ScanLine } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Landing() {
  const { setCurrentPage } = useApp();

  const features = [
    { icon: Search, title: 'Detect', desc: 'Find exposed credentials in source code.', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { icon: GitBranch, title: 'Protect', desc: 'Prevent secrets from entering Git repositories.', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    { icon: BarChart3, title: 'Monitor', desc: 'Track security posture with actionable reports.', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-20" />

      <div className="relative max-w-4xl text-center animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">SecretGuard — Secret Leak Detection Platform</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Stop Secrets Before
          <br />
          They Become <span className="text-primary">Breaches</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          SecretGuard automatically detects exposed API keys, passwords, tokens and credentials before they reach production.
        </p>

        <div className="flex items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setCurrentPage('scan-project')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all glow-green hover:scale-105"
          >
            <ScanLine className="h-5 w-5" />
            Start Security Scan
          </button>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-border text-foreground font-medium hover:bg-muted/50 transition-all"
          >
            View Demo
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass-card rounded-xl p-6 text-left transition-all hover:scale-[1.02]">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} border ${f.border} mb-4`}>
                  <Icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
