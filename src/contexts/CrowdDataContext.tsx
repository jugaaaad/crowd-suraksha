import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { GHATS, type GhatLocation } from '@/data/ghats';
import { generateMuhurats, type Muhurat } from '@/data/muhurats';

export type AlertType = 'conflict' | 'muhurat' | 'panic' | 'separation' | 'capacity' | 'general';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  location: string;
  ghatId: string;
  confidence: number;
  timestamp: Date;
  acknowledged: boolean;
  details: string;
}

export interface GhatData {
  ghat: GhatLocation;
  crowdCount: number;
  density: number; // 0-1
  flowDirection: number; // degrees
  flowMagnitude: number;
  hotspots: number;
  capacityPercent: number;
  minutesToBreach: number | null;
  conflictDetected: boolean;
  separationRisk: number; // 0-1
}

export interface SimConfig {
  globalThreshold: number;
  scalingFactor: number;
  frameSkip: number;
  dbscanEps: number;
  dbscanMinSamples: number;
  noiseLevel: number;
  surgeProbability: number;
  alertSoundEnabled: boolean;
}

export interface CrowdDataState {
  ghatsData: GhatData[];
  selectedGhatId: string;
  alerts: Alert[];
  muhurats: Muhurat[];
  totalCount: number;
  activeHotspots: number;
  avgFlowDirection: number;
  overallStatus: 'normal' | 'warning' | 'critical';
  panicWaveActive: boolean;
  panicWaveDirection: number;
  panicWaveCountdown: number;
  config: SimConfig;
  systemHealth: {
    cameraStatus: boolean[];
    fps: number;
    dbRecords: number;
    modelLoaded: boolean;
    lastFrameMs: number;
    uptime: number;
  };
  crowdHistory: { time: string; count: number; threshold: number }[];
  theme: 'dark' | 'light';
}

interface CrowdDataContextType extends CrowdDataState {
  selectGhat: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
  acknowledgeAll: () => void;
  updateConfig: (config: Partial<SimConfig>) => void;
  toggleTheme: () => void;
}

const defaultConfig: SimConfig = {
  globalThreshold: 45000,
  scalingFactor: 0.0060,
  frameSkip: 30,
  dbscanEps: 30,
  dbscanMinSamples: 5,
  noiseLevel: 0.3,
  surgeProbability: 0.15,
  alertSoundEnabled: true,
};

const CrowdDataContext = createContext<CrowdDataContextType | null>(null);

export const useCrowdData = () => {
  const ctx = useContext(CrowdDataContext);
  if (!ctx) throw new Error('useCrowdData must be used within CrowdDataProvider');
  return ctx;
};

export const CrowdDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedGhatId, setSelectedGhatId] = useState('sangam-nose');
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('cs-alerts');
    return saved ? JSON.parse(saved) : [];
  });
  const [config, setConfig] = useState<SimConfig>(defaultConfig);
  const [ghatsData, setGhatsData] = useState<GhatData[]>([]);
  const [crowdHistory, setCrowdHistory] = useState<{ time: string; count: number; threshold: number }[]>([]);
  const [panicWaveActive, setPanicWaveActive] = useState(false);
  const [panicWaveDirection, setPanicWaveDirection] = useState(0);
  const [panicWaveCountdown, setPanicWaveCountdown] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('cs-theme') as 'dark' | 'light') || 'dark';
  });
  const tickRef = useRef(0);
  const muhurats = useRef(generateMuhurats()).current;

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('cs-theme', theme);
  }, [theme]);

  // Persist alerts
  useEffect(() => {
    localStorage.setItem('cs-alerts', JSON.stringify(alerts.slice(0, 100)));
  }, [alerts]);

  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date(),
      acknowledged: false,
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 200));
  }, []);

  // Main simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current++;
      const t = tickRef.current;
      const now = new Date();

      // Generate ghat data with realistic fluctuations
      const newGhatsData: GhatData[] = GHATS.map((ghat) => {
        const base = ghat.capacity * (0.4 + 0.2 * Math.sin(t * 0.05 + ghat.coords.x * 0.1));
        const noise = (Math.random() - 0.5) * ghat.capacity * config.noiseLevel * 0.3;
        const surge = Math.random() < config.surgeProbability * 0.05 ? ghat.capacity * 0.3 : 0;
        const crowdCount = Math.max(0, Math.round((base + noise + surge) * config.scalingFactor * 166));
        const density = Math.min(1, crowdCount / ghat.capacity);
        const flowDirection = (Math.sin(t * 0.02 + ghat.coords.y * 0.05) * 180 + 180) % 360;
        const flowMagnitude = 2 + Math.random() * 5;
        const hotspots = density > 0.6 ? Math.floor(density * 5) : 0;
        const capacityPercent = Math.round(density * 100);
        const minutesToBreach = density > 0.7 ? Math.max(1, Math.round((1 - density) * 30)) : null;
        const conflictDetected = density > 0.65 && Math.random() < 0.1;
        const separationRisk = density > 0.5 ? Math.min(1, density * 1.2 + (Math.random() - 0.5) * 0.3) : Math.random() * 0.2;

        return { ghat, crowdCount, density, flowDirection, flowMagnitude, hotspots, capacityPercent, minutesToBreach, conflictDetected, separationRisk };
      });

      setGhatsData(newGhatsData);

      // Crowd history
      const totalCount = newGhatsData.reduce((s, g) => s + g.crowdCount, 0);
      setCrowdHistory(prev => {
        const entry = { time: now.toLocaleTimeString(), count: totalCount, threshold: config.globalThreshold };
        return [...prev.slice(-59), entry];
      });

      // Periodic alert generation
      if (t % 8 === 0) {
        const randomGhat = newGhatsData[Math.floor(Math.random() * newGhatsData.length)];
        const alertTypes: { type: AlertType; severity: AlertSeverity; title: string }[] = [
          { type: 'conflict', severity: 'critical', title: 'Counter-Flow Conflict Detected' },
          { type: 'muhurat', severity: 'warning', title: 'Muhurat Surge Warning' },
          { type: 'panic', severity: 'critical', title: 'Panic Wave Propagation Detected' },
          { type: 'separation', severity: 'warning', title: 'High Family Separation Risk' },
          { type: 'capacity', severity: 'warning', title: 'Ghat Capacity Breach Predicted' },
        ];
        const chosen = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        addAlert({
          ...chosen,
          location: randomGhat.ghat.name,
          ghatId: randomGhat.ghat.id,
          confidence: Math.round(70 + Math.random() * 25),
          details: `Detected at ${randomGhat.ghat.name} — density ${(randomGhat.density * 100).toFixed(0)}%`,
        });
      }

      // Panic wave simulation (every ~30 ticks)
      if (t % 30 === 0 && Math.random() < 0.3) {
        setPanicWaveActive(true);
        setPanicWaveDirection(Math.random() * 360);
        setPanicWaveCountdown(45);
        addAlert({
          type: 'panic',
          severity: 'critical',
          title: 'CASCADE PANIC WAVE — ULTRA RED ALERT',
          location: newGhatsData[0].ghat.name,
          ghatId: newGhatsData[0].ghat.id,
          confidence: 92,
          details: 'Synchronized density spike propagating across 3+ clusters',
        });
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [config, addAlert]);

  // Panic wave countdown
  useEffect(() => {
    if (!panicWaveActive) return;
    const interval = setInterval(() => {
      setPanicWaveCountdown(prev => {
        if (prev <= 1) {
          setPanicWaveActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [panicWaveActive]);

  const totalCount = ghatsData.reduce((s, g) => s + g.crowdCount, 0);
  const activeHotspots = ghatsData.reduce((s, g) => s + g.hotspots, 0);
  const avgFlowDirection = ghatsData.length
    ? Math.round(ghatsData.reduce((s, g) => s + g.flowDirection, 0) / ghatsData.length)
    : 0;
  const maxDensity = Math.max(0, ...ghatsData.map(g => g.density));
  const overallStatus = maxDensity > 0.8 ? 'critical' : maxDensity > 0.5 ? 'warning' : 'normal';

  const value: CrowdDataContextType = {
    ghatsData,
    selectedGhatId,
    alerts,
    muhurats,
    totalCount,
    activeHotspots,
    avgFlowDirection,
    overallStatus,
    panicWaveActive,
    panicWaveDirection,
    panicWaveCountdown,
    config,
    systemHealth: {
      cameraStatus: [true, true, true, false, true, true, true, true],
      fps: 28 + Math.round(Math.random() * 4),
      dbRecords: 12847 + tickRef.current * 3,
      modelLoaded: true,
      lastFrameMs: 35 + Math.round(Math.random() * 15),
      uptime: tickRef.current * 1.5,
    },
    crowdHistory,
    theme,
    selectGhat: setSelectedGhatId,
    acknowledgeAlert: (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a)),
    acknowledgeAll: () => setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true }))),
    updateConfig: (partial) => setConfig(prev => ({ ...prev, ...partial })),
    toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark'),
  };

  return <CrowdDataContext.Provider value={value}>{children}</CrowdDataContext.Provider>;
};
