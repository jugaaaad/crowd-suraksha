import React from 'react';
import { useCrowdData } from '@/contexts/CrowdDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const AlertBanner: React.FC = () => {
  const { alerts, panicWaveActive, panicWaveCountdown, acknowledgeAlert } = useCrowdData();
  const latestCritical = alerts.find(a => a.severity === 'critical' && !a.acknowledged);

  if (!latestCritical && !panicWaveActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`w-full ${panicWaveActive ? 'animate-flash-banner bg-cs-critical' : 'bg-cs-critical/90'} text-destructive-foreground px-4 py-2 flex items-center gap-3`}
      >
        <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">
            {panicWaveActive
              ? `🚨 CASCADE PANIC WAVE — ULTRA RED ALERT — Early Warning: ${panicWaveCountdown}s`
              : latestCritical?.title}
          </p>
          <p className="text-xs opacity-80 truncate">
            {panicWaveActive
              ? 'Synchronized density spike propagating across 3+ clusters. Evacuate immediately.'
              : `${latestCritical?.location} — Confidence: ${latestCritical?.confidence}%`}
          </p>
        </div>
        {latestCritical && !panicWaveActive && (
          <button onClick={() => acknowledgeAlert(latestCritical.id)} className="p-1 hover:bg-destructive-foreground/20 rounded">
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertBanner;
