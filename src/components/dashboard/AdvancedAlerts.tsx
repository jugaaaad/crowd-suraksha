import React, { useState } from 'react';
import { useCrowdData } from '@/contexts/CrowdDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PAScriptModal from './PAScriptModal';
import { ArrowLeftRight, Clock, Users, Zap, BarChart3, Send, Volume2 } from 'lucide-react';

const AdvancedAlerts: React.FC = () => {
  const { ghatsData, panicWaveActive, panicWaveCountdown, panicWaveDirection, muhurats, alerts } = useCrowdData();
  const [paModal, setPaModal] = useState<{ open: boolean; type: string; location: string }>({ open: false, type: '', location: '' });
  const [snapshotOpen, setSnapshotOpen] = useState(false);

  const conflictGhats = ghatsData.filter(g => g.conflictDetected);
  const highSepGhats = ghatsData.filter(g => g.separationRisk > 0.6);
  const capacityGhats = ghatsData.filter(g => g.minutesToBreach !== null).sort((a, b) => (a.minutesToBreach || 99) - (b.minutesToBreach || 99));

  const openPA = (type: string, location: string) => setPaModal({ open: true, type, location });

  const nextMuhurat = muhurats[0];
  const muhuratMinutes = nextMuhurat ? Math.max(0, Math.round((new Date(`${nextMuhurat.date}T${nextMuhurat.time}`).getTime() - Date.now()) / 60000)) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-1">
      {/* 1. Counter-Flow Conflict */}
      <Card className="border-cs-critical/40 bg-cs-critical/5 glass-panel">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-critical">
              <ArrowLeftRight className="w-4 h-4" /> Counter-Flow Conflict
            </CardTitle>
            <Badge variant="destructive" className="text-[10px]">RED ALERT</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-center gap-4 py-3">
            <span className="text-2xl animate-counter-flow text-critical">→</span>
            <span className="text-xs text-muted-foreground font-mono">vs</span>
            <span className="text-2xl animate-counter-flow-reverse text-critical">←</span>
          </div>
          {conflictGhats.length > 0 ? conflictGhats.map(g => (
            <div key={g.ghat.id} className="flex items-center justify-between text-xs">
              <span className="text-foreground">{g.ghat.name}</span>
              <span className="text-critical font-mono">{(g.density * 100).toFixed(0)}% density</span>
            </div>
          )) : <p className="text-xs text-muted-foreground">No conflicts detected</p>}
          <p className="text-[10px] text-muted-foreground">{'>'} 30% high-magnitude vectors with opposing angles (90°–180°)</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-[10px] flex-1" onClick={() => openPA('conflict', conflictGhats[0]?.ghat.name || 'Zone A')}>
              <Volume2 className="w-3 h-3 mr-1" /> Generate PA
            </Button>
            <Button size="sm" variant="outline" className="text-[10px] flex-1">
              <Send className="w-3 h-3 mr-1" /> Send to Officers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Muhurat Surge Forecaster */}
      <Card className="border-cs-warning/40 bg-cs-warning/5 glass-panel">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-warning">
              <Clock className="w-4 h-4" /> Muhurat Surge Forecaster
            </CardTitle>
            <Badge className="bg-cs-warning text-primary-foreground text-[10px]">WARNING</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {nextMuhurat && (
            <div className="text-center py-2">
              <p className="text-2xl font-mono font-bold text-warning">{muhuratMinutes}m</p>
              <p className="text-xs text-foreground">{nextMuhurat.name} ({nextMuhurat.nameHindi})</p>
              <p className="text-[10px] text-muted-foreground mt-1">Expected: {(nextMuhurat.expectedCrowd / 1000000).toFixed(1)}M pilgrims</p>
            </div>
          )}
          <div className="rounded-md bg-cs-warning/10 p-2 border border-cs-warning/30">
            <p className="text-[10px] text-warning font-bold">⚠ Threshold auto-lowered by 20%</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase mb-1">Predicted Hotspots</p>
            {nextMuhurat?.hotspots.map(id => (
              <Badge key={id} variant="outline" className="text-[10px] mr-1 mb-1 border-warning text-warning">{id}</Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-[10px] flex-1" onClick={() => openPA('muhurat', nextMuhurat?.hotspots[0] || 'Sangam Nose')}>
              <Volume2 className="w-3 h-3 mr-1" /> Generate PA
            </Button>
            <Button size="sm" variant="outline" className="text-[10px] flex-1">
              <Send className="w-3 h-3 mr-1" /> Send to Officers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Family Separation Risk */}
      <Card className="border-yellow-500/40 bg-yellow-500/5 glass-panel">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-yellow-400">
              <Users className="w-4 h-4" /> Family Separation Risk
            </CardTitle>
            <Badge className="bg-yellow-500/80 text-primary-foreground text-[10px]">ELEVATED</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Mini heatmap thumbnail */}
          <button onClick={() => setSnapshotOpen(true)} className="w-full h-24 rounded-md bg-gradient-to-br from-green-900/40 via-yellow-900/60 to-red-900/40 border border-yellow-500/30 flex items-center justify-center hover:brightness-110 transition-all cursor-pointer">
            <span className="text-[10px] text-yellow-200 font-mono">Click for 10s snapshot</span>
          </button>
          {highSepGhats.slice(0, 3).map(g => (
            <div key={g.ghat.id} className="flex items-center justify-between text-xs">
              <span className="text-foreground">{g.ghat.name}</span>
              <span className="text-yellow-400 font-mono">{(g.separationRisk * 100).toFixed(0)}% risk</span>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground">Sudden density drop {'>'} 15% + high flow variance</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-[10px] flex-1" onClick={() => openPA('separation', highSepGhats[0]?.ghat.name || 'Main Ghat')}>
              <Volume2 className="w-3 h-3 mr-1" /> Generate PA
            </Button>
            <Button size="sm" variant="outline" className="text-[10px] flex-1">
              <Send className="w-3 h-3 mr-1" /> Send to Officers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. Panic Wave Propagation — STAR FEATURE */}
      <Card className={`border-cs-critical/60 bg-cs-critical/5 glass-panel md:col-span-2 xl:col-span-2 ${panicWaveActive ? 'animate-pulse-glow' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-critical">
              <Zap className="w-4 h-4" /> Panic Wave Propagation
            </CardTitle>
            <Badge variant="destructive" className={`text-[10px] ${panicWaveActive ? 'animate-flash-banner' : ''}`}>
              {panicWaveActive ? 'ACTIVE — ULTRA RED' : 'MONITORING'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {/* Wave animation */}
            <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
              {panicWaveActive ? (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-cs-critical animate-wave-ripple" />
                  <div className="absolute inset-4 rounded-full border-2 border-cs-critical animate-wave-ripple" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute inset-8 rounded-full border-2 border-cs-critical animate-wave-ripple" style={{ animationDelay: '1s' }} />
                  <div className="text-center z-10">
                    <p className="text-3xl font-mono font-bold text-critical">{panicWaveCountdown}s</p>
                    <p className="text-[10px] text-critical">EARLY WARNING</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">No wave detected</p>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              {panicWaveActive ? (
                <>
                  <p className="text-xs text-critical font-bold">CASCADE PANIC WAVE — Propagating across 3+ clusters</p>
                  <p className="text-xs text-foreground">Direction: {panicWaveDirection.toFixed(0)}° | Correlation: {'>'}0.7 | Magnitude jump: {'>'}40%</p>
                  <p className="text-xs text-muted-foreground">30–60s early warning active. Coordinated evacuation recommended.</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl" style={{ transform: `rotate(${panicWaveDirection}deg)`, display: 'inline-block' }}>➤</span>
                    <span className="text-xs text-critical font-mono">Wave propagation direction</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">Monitoring density gradient + flow acceleration across adjacent clusters every 5 processed frames.</p>
                  <p className="text-xs text-muted-foreground">Will trigger when synchronized spike propagates across 3+ clusters.</p>
                </>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="text-[10px]" onClick={() => openPA('panic', 'North-East Sector')}>
                  <Volume2 className="w-3 h-3 mr-1" /> Generate PA
                </Button>
                <Button size="sm" variant="outline" className="text-[10px]">
                  <Send className="w-3 h-3 mr-1" /> Send to Officers
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Ghat Capacity Forecaster */}
      <Card className="border-border glass-panel">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
              <BarChart3 className="w-4 h-4" /> Ghat Capacity Forecaster
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">ACTIVE</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1.5">
            {capacityGhats.slice(0, 5).map(g => (
              <div key={g.ghat.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-secondary/50">
                <span className="text-foreground">{g.ghat.name}</span>
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${
                    (g.minutesToBreach || 99) < 10 ? 'text-critical' : 'text-warning'
                  }`}>
                    Breach: {g.minutesToBreach}min
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-md bg-secondary/30 p-2 text-[10px] text-muted-foreground">
            <p><strong className="text-foreground">Suggested Action:</strong> Open Side Gate at nearest congested ghat</p>
            <p className="mt-1">LinearRegression on last 7 days same-muhurat data + inflow/outflow per ROI</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-[10px] flex-1" onClick={() => openPA('capacity', capacityGhats[0]?.ghat.name || 'Main Entry')}>
              <Volume2 className="w-3 h-3 mr-1" /> Generate PA
            </Button>
            <Button size="sm" variant="outline" className="text-[10px] flex-1">
              <Send className="w-3 h-3 mr-1" /> Send to Officers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Snapshot Modal */}
      <Dialog open={snapshotOpen} onOpenChange={setSnapshotOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Family Separation — Last 10s Snapshot</DialogTitle>
          </DialogHeader>
          <div className="w-full h-64 rounded-lg bg-gradient-to-br from-green-900/30 via-yellow-900/50 to-red-900/60 flex items-center justify-center border border-yellow-500/30">
            <p className="text-xs text-muted-foreground font-mono text-center">
              [Placeholder: OpenCV snapshot with flow vectors]<br />
              Backend integration: cv2.imwrite → API → display
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <PAScriptModal open={paModal.open} onOpenChange={(open) => setPaModal(p => ({ ...p, open }))} alertType={paModal.type} location={paModal.location} />
    </div>
  );
};

export default AdvancedAlerts;
