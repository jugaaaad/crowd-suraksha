import React from 'react';
import { useCrowdData } from '@/contexts/CrowdDataContext';
import { GHATS } from '@/data/ghats';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Shield, Radio, Bell, CheckCheck, MapPin, Users, Flame, Navigation, Sun, Moon } from 'lucide-react';

const DashboardSidebar: React.FC = () => {
  const {
    selectedGhatId, selectGhat, totalCount, activeHotspots, avgFlowDirection,
    overallStatus, muhurats, acknowledgeAll, theme, toggleTheme,
  } = useCrowdData();

  const statusColors = {
    normal: 'text-safe',
    warning: 'text-warning',
    critical: 'text-critical',
  };

  // Muhurat countdowns
  const now = Date.now();
  const upcomingMuhurats = muhurats.slice(0, 3).map(m => {
    const target = new Date(`${m.date}T${m.time}`).getTime();
    const diff = Math.max(0, Math.round((target - now) / 60000));
    return { ...m, minutesLeft: diff };
  });

  return (
    <div className="w-72 min-h-screen bg-card border-r border-border flex flex-col p-4 gap-4 overflow-y-auto">
      {/* Logo & Branding */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-foreground leading-tight">CrowdSuraksha</h1>
          <p className="text-[10px] text-muted-foreground">Kumbh Mela Control Room</p>
        </div>
        <button onClick={toggleTheme} className="p-1.5 rounded-md hover:bg-accent transition-colors">
          {theme === 'dark' ? <Sun className="w-4 h-4 text-cs-gold" /> : <Moon className="w-4 h-4 text-foreground" />}
        </button>
      </div>

      {/* Location Selector */}
      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Active Location</label>
        <Select value={selectedGhatId} onValueChange={selectGhat}>
          <SelectTrigger className="h-9 text-xs bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GHATS.map(g => (
              <SelectItem key={g.id} value={g.id}>
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {g.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mini Map */}
      <div className="glass-panel rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Prayagraj Sangam Area</p>
        <div className="relative w-full h-36 bg-secondary/50 rounded-md overflow-hidden">
          {/* River lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <path d="M0,35 Q30,30 50,40 Q70,50 100,45" stroke="hsl(var(--cs-gold))" strokeWidth="0.8" fill="none" opacity="0.4" />
            <path d="M0,55 Q20,50 50,45 Q80,40 100,35" stroke="hsl(var(--cs-gold))" strokeWidth="0.8" fill="none" opacity="0.4" />
            <text x="85" y="28" fill="hsl(var(--cs-gold))" fontSize="3.5" opacity="0.6">Ganga</text>
            <text x="85" y="43" fill="hsl(var(--cs-gold))" fontSize="3.5" opacity="0.6">Yamuna</text>
          </svg>
          {GHATS.map(g => (
            <button
              key={g.id}
              onClick={() => selectGhat(g.id)}
              className={`absolute w-2.5 h-2.5 rounded-full transition-all ${
                g.id === selectedGhatId ? 'bg-primary scale-150 ring-2 ring-primary/50' : 'bg-muted-foreground/60 hover:bg-primary/70'
              }`}
              style={{ left: `${g.coords.x}%`, top: `${g.coords.y}%`, transform: 'translate(-50%,-50%)' }}
              title={g.name}
            />
          ))}
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={<Users className="w-4 h-4" />} label="Total Count" value={totalCount.toLocaleString()} className="col-span-2 text-lg" mono />
        <StatCard icon={<Flame className="w-3.5 h-3.5" />} label="Hotspots" value={String(activeHotspots)} />
        <StatCard icon={<Navigation className="w-3.5 h-3.5" style={{ transform: `rotate(${avgFlowDirection}deg)` }} />} label="Avg Flow" value={`${avgFlowDirection}°`} />
        <div className="col-span-2 glass-panel rounded-lg p-2 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase">Status</span>
          <span className={`text-xs font-bold uppercase font-mono ${statusColors[overallStatus]}`}>
            ● {overallStatus}
          </span>
        </div>
      </div>

      {/* Muhurat Countdown */}
      <div className="glass-panel rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">🕉 Next Muhurats</p>
        <div className="space-y-2">
          {upcomingMuhurats.map(m => (
            <div key={m.id} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-foreground">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.nameHindi}</p>
              </div>
              <span className={`text-xs font-mono font-bold ${
                m.minutesLeft < 60 ? 'text-critical' : m.minutesLeft < 120 ? 'text-warning' : 'text-safe'
              }`}>
                {m.minutesLeft < 60 ? `${m.minutesLeft}m` : `${Math.floor(m.minutesLeft / 60)}h ${m.minutesLeft % 60}m`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-auto space-y-2">
        <Button size="sm" className="w-full bg-cs-critical hover:bg-cs-critical/90 text-destructive-foreground text-xs gap-2">
          <Radio className="w-3.5 h-3.5" /> Broadcast PA
        </Button>
        <Button size="sm" variant="outline" className="w-full text-xs gap-2 border-cs-warning text-warning hover:bg-cs-warning/10">
          <Bell className="w-3.5 h-3.5" /> Alert Officers
        </Button>
        <Button size="sm" variant="ghost" className="w-full text-xs gap-2" onClick={acknowledgeAll}>
          <CheckCheck className="w-3.5 h-3.5" /> Acknowledge All
        </Button>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; className?: string; mono?: boolean }> = ({
  icon, label, value, className, mono,
}) => (
  <div className={`glass-panel rounded-lg p-2 ${className || ''}`}>
    <div className="flex items-center gap-1.5 mb-0.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
    </div>
    <p className={`font-bold text-foreground ${mono ? 'font-mono' : ''} ${className?.includes('text-lg') ? 'text-lg' : 'text-sm'}`}>
      {value}
    </p>
  </div>
);

export default DashboardSidebar;
