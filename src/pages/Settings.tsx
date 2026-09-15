import { Settings2, ScanEye, FileCode2, FileText, FolderTree, GitBranch, Boxes, Gauge, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import type { ScannerSettings } from '@/types';
import { cn } from '@/lib/utils';

interface ToggleRowProps {
  icon: typeof ScanEye;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ icon: Icon, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg glass border border-border hover:bg-muted/30 transition-all">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 border border-border">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

interface ThresholdRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
}

function ThresholdRow({ label, value, onChange, color }: ThresholdRowProps) {
  return (
    <div className="p-4 rounded-lg glass border border-border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium">{label}</p>
        <span className={cn('text-sm font-bold', color)}>{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        max={100}
        step={5}
        className="w-full"
      />
    </div>
  );
}

export function Settings() {
  const { settings, updateSettings } = useApp();

  const update = (key: keyof ScannerSettings, value: boolean | number) => {
    updateSettings({ ...settings, [key]: value });
    toast.success('Settings updated');
  };

  return (
    <div className="p-8 space-y-6 max-w-3xl">
    <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
            <ScanEye className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">Scanner Settings</h3>
            <p className="text-xs text-muted-foreground">Configure what the scanner analyzes</p>
          </div>
        </div>
        <div className="space-y-3">
          <ToggleRow
            icon={Gauge}
            label="Enable entropy detection"
            description="Detect high-entropy strings that may be secrets"
            checked={settings.entropyDetection}
            onChange={(v) => update('entropyDetection', v)}
          />
          <ToggleRow
            icon={FileText}
            label="Scan configuration files"
            description="Scan .env, .yaml, .json, .properties files"
            checked={settings.scanConfigFiles}
            onChange={(v) => update('scanConfigFiles', v)}
          />
          <ToggleRow
            icon={FileCode2}
            label="Scan source files"
            description="Scan .py, .js, .ts, and other source code files"
            checked={settings.scanSourceFiles}
            onChange={(v) => update('scanSourceFiles', v)}
          />
          <ToggleRow
            icon={Boxes}
            label="Ignore node_modules"
            description="Skip node_modules directory during scanning"
            checked={settings.ignoreNodeModules}
            onChange={(v) => update('ignoreNodeModules', v)}
          />
          <ToggleRow
            icon={GitBranch}
            label="Ignore .git"
            description="Skip .git directory during scanning"
            checked={settings.ignoreGit}
            onChange={(v) => update('ignoreGit', v)}
          />
          <ToggleRow
            icon={FolderTree}
            label="Ignore build folders"
            description="Skip dist, build, and out directories"
            checked={settings.ignoreBuildFolders}
            onChange={(v) => update('ignoreBuildFolders', v)}
          />
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/30">
            <Settings2 className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">Severity Settings</h3>
            <p className="text-xs text-muted-foreground">Configure severity classification thresholds</p>
          </div>
        </div>
        <div className="space-y-3">
          <ThresholdRow
            label="Critical threshold"
            value={settings.criticalThreshold}
            onChange={(v) => update('criticalThreshold', v)}
            color="text-red-400"
          />
          <ThresholdRow
            label="High threshold"
            value={settings.highThreshold}
            onChange={(v) => update('highThreshold', v)}
            color="text-orange-400"
          />
          <ThresholdRow
            label="Medium threshold"
            value={settings.mediumThreshold}
            onChange={(v) => update('mediumThreshold', v)}
            color="text-yellow-400"
          />
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/30">
            <ShieldCheck className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">Protection</h3>
            <p className="text-xs text-muted-foreground">Configure pre-commit protection rules</p>
          </div>
        </div>
        <div className="space-y-3">
          <ToggleRow
            icon={ShieldCheck}
            label="Pre-commit protection"
            description="Enable secret scanning before git commits"
            checked={settings.preCommitProtection}
            onChange={(v) => update('preCommitProtection', v)}
          />
          <ToggleRow
            icon={Lock}
            label="Block commits with critical secrets"
            description="Prevent commits containing critical severity secrets"
            checked={settings.blockCriticalCommits}
            onChange={(v) => update('blockCriticalCommits', v)}
          />
        </div>
      </div>
    </div>
  );
}
