import React from 'react';
import { useCrowdData } from '@/contexts/CrowdDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GHATS } from '@/data/ghats';
import { Settings, Plus, Trash2 } from 'lucide-react';

const Configuration: React.FC = () => {
  const { config, updateConfig, muhurats } = useCrowdData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
      {/* Detection Parameters */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
            <Settings className="w-4 h-4" /> Detection Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderRow label="Global Threshold" value={config.globalThreshold} min={10000} max={100000} step={1000}
            onChange={(v) => updateConfig({ globalThreshold: v })} unit="" />
          <SliderRow label="Scaling Factor" value={config.scalingFactor} min={0.001} max={0.02} step={0.0005}
            onChange={(v) => updateConfig({ scalingFactor: v })} unit="" format={(v) => v.toFixed(4)} />
          <SliderRow label="Frame Skip" value={config.frameSkip} min={1} max={60} step={1}
            onChange={(v) => updateConfig({ frameSkip: v })} unit="frames" />
          <SliderRow label="DBSCAN eps" value={config.dbscanEps} min={5} max={100} step={5}
            onChange={(v) => updateConfig({ dbscanEps: v })} unit="px" />
          <SliderRow label="DBSCAN min_samples" value={config.dbscanMinSamples} min={2} max={20} step={1}
            onChange={(v) => updateConfig({ dbscanMinSamples: v })} unit="" />
        </CardContent>
      </Card>

      {/* Simulation Controls */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-foreground">Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderRow label="Noise Level" value={config.noiseLevel} min={0} max={1} step={0.05}
            onChange={(v) => updateConfig({ noiseLevel: v })} unit="" format={(v) => v.toFixed(2)} />
          <SliderRow label="Surge Probability" value={config.surgeProbability} min={0} max={1} step={0.05}
            onChange={(v) => updateConfig({ surgeProbability: v })} unit="" format={(v) => v.toFixed(2)} />
          <div className="flex items-center justify-between">
            <Label className="text-xs text-foreground">Alert Sound</Label>
            <Switch checked={config.alertSoundEnabled} onCheckedChange={(v) => updateConfig({ alertSoundEnabled: v })} />
          </div>
        </CardContent>
      </Card>

      {/* ROI Zones */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-foreground">ROI Zones</CardTitle>
          <Button size="sm" variant="outline" className="text-[10px] gap-1">
            <Plus className="w-3 h-3" /> Add Zone
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {GHATS.map(g => (
            <div key={g.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
              <div>
                <p className="text-xs text-foreground">{g.name}</p>
                <p className="text-[10px] text-muted-foreground">{g.type} • Cap: {g.capacity.toLocaleString()}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Panchang Muhurat Editor */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-foreground">🕉 Panchang Muhurat Times</CardTitle>
          <Button size="sm" variant="outline" className="text-[10px] gap-1">
            <Plus className="w-3 h-3" /> Add Muhurat
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {muhurats.map(m => (
            <div key={m.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
              <div>
                <p className="text-xs text-foreground">{m.name} <span className="text-muted-foreground">({m.nameHindi})</span></p>
                <p className="text-[10px] text-muted-foreground">{m.date} {m.time} • {m.significance}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-critical h-6 w-6 p-0">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const SliderRow: React.FC<{
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; unit: string; format?: (v: number) => string;
}> = ({ label, value, min, max, step, onChange, unit, format }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <Label className="text-xs text-foreground">{label}</Label>
      <span className="text-xs font-mono text-muted-foreground">{format ? format(value) : value} {unit}</span>
    </div>
    <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
  </div>
);

export default Configuration;
