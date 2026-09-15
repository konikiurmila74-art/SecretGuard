import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, FileCode2 } from 'lucide-react';
import { SCAN_STAGES, SCANNING_FILES } from '@/data/demoData';
import { cn } from '@/lib/utils';

interface ScanProgressProps {
  onComplete: () => void;
}

export function ScanProgress({ onComplete }: ScanProgressProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [fileIndex, setFileIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return prev + 2;
      });
    }, 70);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    setStageIndex(Math.min(Math.floor((progress / 100) * SCAN_STAGES.length), SCAN_STAGES.length - 1));
    setFileIndex(Math.min(Math.floor((progress / 100) * SCANNING_FILES.length), SCANNING_FILES.length - 1));
  }, [progress]);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <div>
            <h2 className="text-xl font-bold">Scanning Project...</h2>
            <p className="text-sm text-muted-foreground">Analyzing files for exposed secrets</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-200"
              style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(34,197,94,0.5)' }}
            />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {SCAN_STAGES.map((stage, i) => (
            <div
              key={stage}
              className={cn(
                'flex items-center gap-3 text-sm transition-all duration-300',
                i < stageIndex && 'text-green-400',
                i === stageIndex && 'text-primary',
                i > stageIndex && 'text-muted-foreground/40'
              )}
            >
              {i < stageIndex ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : i === stageIndex ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border border-muted-foreground/30" />
              )}
              {stage}
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-black/40 border border-border p-4">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Scanning Files</p>
          <div className="space-y-1.5">
            {SCANNING_FILES.map((file, i) => (
              <div
                key={file}
                className={cn(
                  'flex items-center gap-2 text-xs font-mono transition-all duration-300',
                  i < fileIndex && 'text-green-400',
                  i === fileIndex && 'text-primary',
                  i > fileIndex && 'text-muted-foreground/30'
                )}
              >
                <FileCode2 className="h-3 w-3 shrink-0" />
                {file}
                {i < fileIndex && <CheckCircle2 className="h-3 w-3 ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
