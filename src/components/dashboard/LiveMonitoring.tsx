import React from 'react';
import { useCrowdData } from '@/contexts/CrowdDataContext';
import DensityCanvas from './DensityCanvas';
import { Badge } from '@/components/ui/badge';
import { Radio, Clock } from 'lucide-react';

const LiveMonitoring: React.FC = () => {
  const { ghatsData, selectedGhatId, alerts, panicWaveActive, panicWaveCountdown } = useCrowdData();
  const selected = ghatsData.find(g => g.ghat.id === selectedGhatId);
  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex flex-1 gap-3 min-h-0">
        {/* Video Feed */}
        <div className="flex-[2] glass-panel rounded-lg p-2 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">LIVE FEED — {selected?.ghat.name || 'No Selection'}</span>
            </div>
            {panicWaveActive && (
              <Badge className="bg-cs-critical text-destructive-foreground animate-flash-banner text-[10px]">
                ⚠ PANIC WAVE — {panicWaveCountdown}s
              </Badge>
            )}
          </div>
          <div className="flex-1 min-h-0">
            <DensityCanvas />
          </div>
        </div>

        {/* Right Metrics Panel */}
        <div className="w-64 flex flex-col gap-2 overflow-y-auto">
          <MetricCard label="Crowd Count" value={selected?.crowdCount?.toLocaleString() || '0'} color={
            (selected?.density || 0) > 0.7 ? 'critical' : (selected?.density || 0) > 0.4 ? 'warning' : 'safe'
          } />
          <MetricCard label="Density" value={`${((selected?.density || 0) * 100).toFixed(0)}%`} color={
            (selected?.density || 0) > 0.7 ? 'critical' : 'safe'
          } />
          <MetricCard label="Hotspots" value={String(selected?.hotspots || 0)} color="warning" />
          <MetricCard label="Flow Direction" value={`${selected?.flowDirection?.toFixed(0) || 0}°`} color="safe" />
          <MetricCard label="Capacity" value={`${selected?.capacityPercent || 0}%`} color={
            (selected?.capacityPercent || 0) > 80 ? 'critical' : 'safe'
          } />
          <MetricCard label="Separation Risk" value={`${((selected?.separationRisk || 0) * 100).toFixed(0)}%`} color={
            (selected?.separationRisk || 0) > 0.6 ? 'critical' : 'warning'
          } />
          {selected?.minutesToBreach && (
            <MetricCard label="Time to Breach" value={`${selected.minutesToBreach} min`} color="critical" />
          )}
        </div>
      </div>

      {/* Bottom Alert Strip */}
      <div className="glass-panel rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Recent Alerts</p>
        <div className="flex gap-2 overflow-x-auto">
          {recentAlerts.map(a => (
            <div key={a.id} className={`flex-shrink-0 rounded-md p-2 border text-xs min-w-[200px] ${
              a.severity === 'critical' ? 'border-critical bg-cs-critical/10' : 'border-warning bg-cs-warning/10'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold ${a.severity === 'critical' ? 'text-critical' : 'text-warning'}`}>
                  {a.type.toUpperCase()}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(a.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-muted-foreground truncate">{a.location}</p>
            </div>
          ))}
          {recentAlerts.length === 0 && (
            <p className="text-xs text-muted-foreground">No alerts yet. System monitoring active.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; color: 'critical' | 'warning' | 'safe' }> = ({ label, value, color }) => {
  const colorClasses = {
    critical: 'border-critical text-critical',
    warning: 'border-warning text-warning',
    safe: 'border-safe text-safe',
  };
  return (
    <div className={`glass-panel rounded-lg p-2 border-l-2 ${colorClasses[color]}`}>
      <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
      <p className="text-sm font-mono font-bold">{value}</p>
    </div>
  );
};

export default LiveMonitoring;
