import React from 'react';
import { useCrowdData } from '@/contexts/CrowdDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Camera, Database, Cpu, Clock, Zap } from 'lucide-react';

const SystemHealth: React.FC = () => {
  const { systemHealth, alerts } = useCrowdData();
  const panicAlerts = alerts.filter(a => a.type === 'panic').slice(0, 10);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-1">
      {/* Camera Status */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
            <Camera className="w-4 h-4" /> Camera Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {systemHealth.cameraStatus.map((online, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-4 h-4 rounded-full ${online ? 'bg-safe' : 'bg-cs-critical'} ${online ? '' : 'animate-pulse'}`} />
                <span className="text-[10px] text-muted-foreground">CAM {i + 1}</span>
                <span className={`text-[10px] font-mono ${online ? 'text-safe' : 'text-critical'}`}>
                  {online ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
            <Activity className="w-4 h-4" /> Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <HealthRow icon={<Activity className="w-3.5 h-3.5" />} label="FPS Processed" value={`${systemHealth.fps} fps`} status={systemHealth.fps > 25 ? 'good' : 'warn'} />
          <HealthRow icon={<Clock className="w-3.5 h-3.5" />} label="Last Frame" value={`${systemHealth.lastFrameMs} ms`} status={systemHealth.lastFrameMs < 50 ? 'good' : 'warn'} />
          <HealthRow icon={<Database className="w-3.5 h-3.5" />} label="DB Records" value={systemHealth.dbRecords.toLocaleString()} status="good" />
          <HealthRow icon={<Clock className="w-3.5 h-3.5" />} label="Uptime" value={`${(systemHealth.uptime / 60).toFixed(1)} min`} status="good" />
        </CardContent>
      </Card>

      {/* Model Status */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
            <Cpu className="w-4 h-4" /> Model Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">CSRNet Loaded</span>
            <Badge className="bg-safe/20 text-safe text-[10px]">✓ Yes</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">VGG16 Frontend</span>
            <Badge className="bg-safe/20 text-safe text-[10px]">✓ Ready</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Dilated Backend</span>
            <Badge className="bg-safe/20 text-safe text-[10px]">✓ Ready</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">DBSCAN Engine</span>
            <Badge className="bg-safe/20 text-safe text-[10px]">✓ Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Optical Flow</span>
            <Badge className="bg-safe/20 text-safe text-[10px]">✓ Farneback</Badge>
          </div>
          <div className="mt-2 p-2 rounded bg-secondary/50 text-[10px] text-muted-foreground font-mono">
            Last Processed Frame: {systemHealth.lastFrameMs}ms<br />
            Pipeline: Preprocess → CSRNet → DBSCAN → Flow → Alert
          </div>
        </CardContent>
      </Card>

      {/* Panic Wave Event Log */}
      <Card className="glass-panel border-border md:col-span-2 xl:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
            <Zap className="w-4 h-4" /> Panic Wave Event Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {panicAlerts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Timestamp</th>
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Location</th>
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Severity</th>
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Confidence</th>
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {panicAlerts.map(a => (
                    <tr key={a.id} className="border-b border-border/50">
                      <td className="py-1.5 font-mono text-muted-foreground">{new Date(a.timestamp).toLocaleTimeString()}</td>
                      <td className="py-1.5 text-foreground">{a.location}</td>
                      <td className="py-1.5"><Badge variant="destructive" className="text-[10px]">{a.severity}</Badge></td>
                      <td className="py-1.5 font-mono">{a.confidence}%</td>
                      <td className="py-1.5 text-muted-foreground truncate max-w-[200px]">{a.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No panic wave events recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const HealthRow: React.FC<{ icon: React.ReactNode; label: string; value: string; status: 'good' | 'warn' | 'bad' }> = ({
  icon, label, value, status,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <span className={`text-xs font-mono font-bold ${
      status === 'good' ? 'text-safe' : status === 'warn' ? 'text-warning' : 'text-critical'
    }`}>{value}</span>
  </div>
);

export default SystemHealth;
