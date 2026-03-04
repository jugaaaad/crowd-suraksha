import React, { useRef, useEffect } from 'react';
import { useCrowdData } from '@/contexts/CrowdDataContext';

const DensityCanvas: React.FC<{ width?: number; height?: number }> = ({ width = 640, height = 400 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ghatsData, selectedGhatId, panicWaveActive, panicWaveDirection, config } = useCrowdData();
  const selectedGhat = ghatsData.find(g => g.ghat.id === selectedGhatId);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;
      ctx.clearRect(0, 0, width, height);

      // Dark feed background
      ctx.fillStyle = '#0A1428';
      ctx.fillRect(0, 0, width, height);

      // Simulated density heatmap blobs
      const density = selectedGhat?.density || 0.3;
      const numBlobs = 5 + Math.floor(density * 15);
      for (let i = 0; i < numBlobs; i++) {
        const bx = (Math.sin(f * 0.01 + i * 2.5) * 0.3 + 0.5) * width;
        const by = (Math.cos(f * 0.008 + i * 1.8) * 0.3 + 0.5) * height;
        const r = 30 + density * 80 + Math.sin(f * 0.02 + i) * 15;
        const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        const hue = density > 0.7 ? 0 : density > 0.4 ? 30 : 120;
        gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, ${0.3 + density * 0.3})`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // DBSCAN cluster circles
      const clusters = selectedGhat?.hotspots || 0;
      for (let i = 0; i < clusters; i++) {
        const cx = width * (0.2 + (i * 0.15) + Math.sin(f * 0.005 + i) * 0.05);
        const cy = height * (0.3 + Math.cos(f * 0.007 + i * 2) * 0.15);
        const cr = 25 + Math.random() * 15;
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#00E5FF';
        ctx.font = '10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`C${i + 1}`, cx, cy + 4);
      }

      // Flow arrows
      const flowDir = selectedGhat?.flowDirection || 0;
      const rad = (flowDir * Math.PI) / 180;
      for (let i = 0; i < 6; i++) {
        const ax = width * (0.15 + i * 0.12);
        const ay = height * 0.75;
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(rad);
        ctx.strokeStyle = `hsl(${flowDir}, 80%, 60%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(12, 0);
        ctx.lineTo(8, -4);
        ctx.moveTo(12, 0);
        ctx.lineTo(8, 4);
        ctx.stroke();
        ctx.restore();
      }

      // Conflict arrows (opposing)
      if (selectedGhat?.conflictDetected) {
        const offset = Math.sin(f * 0.1) * 8;
        ctx.strokeStyle = '#FF3B3B';
        ctx.lineWidth = 3;
        // Left arrow
        ctx.beginPath();
        ctx.moveTo(width * 0.3 + offset, height * 0.4);
        ctx.lineTo(width * 0.4 + offset, height * 0.4);
        ctx.stroke();
        // Right arrow (opposing)
        ctx.beginPath();
        ctx.moveTo(width * 0.5 - offset, height * 0.42);
        ctx.lineTo(width * 0.4 - offset, height * 0.42);
        ctx.stroke();
        ctx.fillStyle = '#FF3B3B';
        ctx.font = 'bold 12px Inter';
        ctx.fillText('⚠ CONFLICT ZONE', width * 0.3, height * 0.35);
      }

      // Panic wave animation
      if (panicWaveActive) {
        const waveRad = (panicWaveDirection * Math.PI) / 180;
        for (let ring = 0; ring < 3; ring++) {
          const phase = (f * 0.03 + ring * 0.5) % 2;
          const radius = phase * Math.max(width, height) * 0.3;
          ctx.strokeStyle = `hsla(0, 100%, 50%, ${1 - phase / 2})`;
          ctx.lineWidth = 3 - ring;
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 0.5, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Direction arrow
        ctx.save();
        ctx.translate(width * 0.5, height * 0.5);
        ctx.rotate(waveRad);
        ctx.fillStyle = '#FF3B3B';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('→ WAVE', 20, 5);
        ctx.restore();
      }

      // ROI boxes with capacity timers
      const roiGhats = ghatsData.slice(0, 3);
      roiGhats.forEach((g, i) => {
        const rx = width * (0.05 + i * 0.3);
        const ry = height * 0.05;
        const rw = width * 0.25;
        const rh = 30;
        const capColor = g.capacityPercent > 80 ? '#FF3B3B' : g.capacityPercent > 50 ? '#FF9500' : '#00C853';
        ctx.strokeStyle = capColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.fillStyle = capColor;
        ctx.font = '10px JetBrains Mono';
        ctx.textAlign = 'left';
        ctx.fillText(`${g.ghat.name}: ${g.capacityPercent}%`, rx + 5, ry + 12);
        if (g.minutesToBreach) {
          ctx.fillText(`Breach: ${g.minutesToBreach}min`, rx + 5, ry + 24);
        }
      });

      // Overlay text — backend placeholders
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '11px JetBrains Mono';
      ctx.textAlign = 'left';
      const count = selectedGhat?.crowdCount || 0;
      ctx.fillText(`CSRNet Count: ${count} (scaling ${config.scalingFactor})`, 10, height - 45);
      ctx.fillText(`Frame Skip: ${config.frameSkip} | DBSCAN eps: ${config.dbscanEps}`, 10, height - 30);
      ctx.fillText(`Optical Flow Avg: ${selectedGhat?.flowDirection || 0}° | Mag: ${selectedGhat?.flowMagnitude?.toFixed(1) || '0.0'}`, 10, height - 15);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [ghatsData, selectedGhatId, panicWaveActive, panicWaveDirection, config, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full rounded-lg"
      style={{ maxHeight: '100%' }}
    />
  );
};

export default DensityCanvas;
