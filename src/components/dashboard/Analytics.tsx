import React from 'react';
import { useCrowdData } from '@/contexts/CrowdDataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, AlertTriangle } from 'lucide-react';

const Analytics: React.FC = () => {
  const { crowdHistory, alerts, ghatsData, config } = useCrowdData();

  const alertCounts = alerts.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxCount = Math.max(0, ...crowdHistory.map(h => h.count));
  const mostCongestedGhat = [...ghatsData].sort((a, b) => b.density - a.density)[0];

  // Daily separation risk heatmap data (7x24 grid simulated)
  const heatmapData = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 12 }, (_, hour) => Math.random())
  );

  return (
    <div className="space-y-4 p-1">
      {/* Live Chart */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
            <TrendingUp className="w-4 h-4" /> Crowd Count vs Time (Live)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={crowdHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 18%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip
                contentStyle={{ background: 'hsl(220, 50%, 10%)', border: '1px solid hsl(220, 30%, 18%)', borderRadius: '8px', fontSize: 12 }}
                labelStyle={{ color: 'hsl(210, 40%, 92%)' }}
              />
              <Line type="monotone" dataKey="count" stroke="hsl(45, 100%, 50%)" strokeWidth={2} dot={false} />
              <ReferenceLine y={config.globalThreshold} stroke="hsl(0, 100%, 61%)" strokeDasharray="5 5" label={{ value: 'Threshold', fill: 'hsl(0, 100%, 61%)', fontSize: 10 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Separation Risk Heatmap */}
        <Card className="glass-panel border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">Daily Separation Risk Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(12, 1fr)` }}>
              {heatmapData.flat().map((val, i) => (
                <button key={i} className="aspect-square rounded-sm transition-all hover:ring-1 hover:ring-foreground/20" style={{
                  backgroundColor: val > 0.7 ? 'hsl(0, 100%, 40%)' : val > 0.4 ? 'hsl(45, 100%, 45%)' : 'hsl(145, 100%, 30%)',
                  opacity: 0.5 + val * 0.5,
                }} title={`Risk: ${(val * 100).toFixed(0)}%`} />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card className="glass-panel border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatRow label="Max Count Today" value={maxCount.toLocaleString()} />
            <StatRow label="Most Congested" value={mostCongestedGhat?.ghat.name || '-'} />
            <StatRow label="Total Alerts" value={String(alerts.length)} />
            <StatRow label="Conflict Alerts" value={String(alertCounts.conflict || 0)} color="text-critical" />
            <StatRow label="Muhurat Alerts" value={String(alertCounts.muhurat || 0)} color="text-warning" />
            <StatRow label="Panic Wave Events" value={String(alertCounts.panic || 0)} color="text-critical" />
            <StatRow label="Separation Risks" value={String(alertCounts.separation || 0)} color="text-yellow-400" />
            <StatRow label="Capacity Breaches" value={String(alertCounts.capacity || 0)} color="text-warning" />
          </CardContent>
        </Card>
      </div>

      {/* Ghat-wise Table */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-foreground">Ghat-wise Statistics</CardTitle>
          <Button size="sm" variant="outline" className="text-[10px] gap-1">
            <Download className="w-3 h-3" /> Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Ghat</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Count</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Density</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Hotspots</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ghatsData.map(g => (
                  <tr key={g.ghat.id} className="border-b border-border/50">
                    <td className="py-1.5 text-foreground">{g.ghat.name}</td>
                    <td className="py-1.5 text-right font-mono">{g.crowdCount.toLocaleString()}</td>
                    <td className="py-1.5 text-right font-mono">{(g.density * 100).toFixed(0)}%</td>
                    <td className="py-1.5 text-right font-mono">{g.hotspots}</td>
                    <td className="py-1.5 text-right">
                      <Badge variant="outline" className={`text-[10px] ${
                        g.density > 0.7 ? 'border-critical text-critical' : g.density > 0.4 ? 'border-warning text-warning' : 'border-safe text-safe'
                      }`}>
                        {g.density > 0.7 ? 'CRITICAL' : g.density > 0.4 ? 'WARNING' : 'NORMAL'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatRow: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className={`text-xs font-mono font-bold ${color || 'text-foreground'}`}>{value}</span>
  </div>
);

export default Analytics;
