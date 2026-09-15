import { useState, useRef } from 'react';
import { Upload, FolderOpen, FileCode2, Play, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ScanProgress } from '@/components/ScanProgress';
import { createDemoScanResult } from '@/data/demoData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SUPPORTED_EXTENSIONS = ['.env', '.py', '.js', '.ts', '.json', '.yaml', '.yml', '.xml', '.properties', '.txt'];

export function ScanProject() {
  const { setCurrentPage, setCurrentScan, addHistoryEntry, setFindings } = useApp();
  const [scanning, setScanning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startDemoScan = () => {
    setScanning(true);
  };

  const completeScan = () => {
    const result = createDemoScanResult();
    setCurrentScan(result);
    setFindings(result.findings);
    addHistoryEntry({
      id: result.id,
      project: result.project,
      date: 'Just now',
      filesScanned: result.filesScanned,
      secretsDetected: result.secretsDetected,
      securityScore: result.securityScore,
      status: 'At Risk',
    });
    setScanning(false);
    toast.success('Scan completed successfully');
    setCurrentPage('scan-results');
  };

  const handleFileSelect = () => {
    toast.info('File upload is simulated in this demo. Use "Use Demo Project" for a full scan experience.');
  };

  if (scanning) {
    return (
      <div className="p-8">
        <ScanProgress onComplete={completeScan} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFileSelect();
        }}
        className={cn(
          'glass-card rounded-2xl p-12 text-center border-2 border-dashed transition-all duration-300',
          dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/40'
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            'flex h-20 w-20 items-center justify-center rounded-2xl border-2 transition-all',
            dragging ? 'bg-primary/10 border-primary glow-green' : 'bg-muted/50 border-border'
          )}>
            <Upload className={cn('h-10 w-10', dragging ? 'text-primary' : 'text-muted-foreground')} />
          </div>
          <div>
            <p className="text-lg font-semibold mb-1">Drop project folder here</p>
            <p className="text-sm text-muted-foreground">or choose an option below</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-3 rounded-xl glass border border-border text-sm font-medium hover:bg-muted/50 transition-all"
        >
          <FolderOpen className="h-4 w-4" />
          Select Project
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
        <button
          onClick={startDemoScan}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all glow-green"
        >
          <Play className="h-4 w-4" />
          Use Demo Project
        </button>
      </div>

      <div className="mt-8 glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileCode2 className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Supported File Types</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_EXTENSIONS.map((ext) => (
            <span key={ext} className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs font-mono text-muted-foreground">
              {ext}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 glass-card rounded-xl p-5">
        <p className="text-sm font-medium mb-3">Quick Start</p>
        <div className="space-y-2">
          {[
            'Click "Use Demo Project" to run a full simulated scan',
            'The scanner will analyze 6 demo files for exposed secrets',
            'View detailed results with severity classification',
            'Review findings and get remediation guidance',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold">
                {i + 1}
              </span>
              {step}
              <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
