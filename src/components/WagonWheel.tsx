import React, { useRef, useEffect, useState } from 'react';
import { Target, Star, Shield, Award } from 'lucide-react';

interface Shot {
  x: number;
  y: number;
  runs: 1 | 2 | 3 | 4 | 6;
  angle: number;
}

export default function WagonWheel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shots, setShots] = useState<Shot[]>([
    { x: 150, y: 50, runs: 6, angle: -65 },
    { x: 260, y: 150, runs: 4, angle: 15 },
    { x: 80, y: 180, runs: 1, angle: 160 },
    { x: 190, y: 60, runs: 6, angle: -80 },
    { x: 110, y: 90, runs: 2, angle: -125 }
  ]);

  const [simRuns, setSimRuns] = useState<1 | 2 | 3 | 4 | 6>(4);

  // Redraw canvas whenever shots modify
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#020d09';
    ctx.fillRect(0, 0, 300, 300);

    const cx = 150;
    const cy = 150;
    const r = 135;

    // Draw grass circle border
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ccff00';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Fill inner grass boundary outline
    ctx.fillStyle = '#061a12';
    ctx.beginPath();
    ctx.arc(cx, cy, r - 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw divisional lines (30 yard circle)
    ctx.beginPath();
    ctx.arc(cx, cy, r - 50, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]); // Reset

    // Draw the pitch in the center
    ctx.fillStyle = '#baa37d'; // Clay brown pitch
    ctx.fillRect(cx - 8, cy - 22, 16, 44);

    // Draw batters creases
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 18);
    ctx.lineTo(cx + 8, cy - 18);
    ctx.moveTo(cx - 8, cy + 18);
    ctx.lineTo(cx + 8, cy + 18);
    ctx.stroke();

    // Sector Text division highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '8px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Sector labels
    ctx.fillText('COW CORNER', cx + 70, cy - 80);
    ctx.fillText('COVERS', cx - 70, cy - 80);
    ctx.fillText('THIRD MAN', cx - 80, cy + 80);
    ctx.fillText('FINE LEG', cx + 80, cy + 80);
    ctx.fillText('STRAIGHT', cx, cy - 110);
    ctx.fillText('LONG ON', cx + 45, cy - 115);
    ctx.fillText('LONG OFF', cx - 45, cy - 115);

    // Draw all recorded shots
    shots.forEach(shot => {
      ctx.beginPath();
      ctx.moveTo(cx, cy); // Start at pitch center
      ctx.lineTo(shot.x, shot.y);

      // Color scheme based on run amount
      let color = '#22c55e'; // Singles
      if (shot.runs === 4) color = '#3b82f6'; // Blues
      if (shot.runs === 6) color = '#ccff00'; // Lime

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Plot point at landing location
      ctx.beginPath();
      ctx.arc(shot.x, shot.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    });

  }, [shots]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Translate click relative to 300x300 coordinates regardless of element resize
    const scaleX = 300 / rect.width;
    const scaleY = 300 / rect.height;

    const x = clickX * scaleX;
    const y = clickY * scaleY;

    // Calculate hit trajectory angle
    const dx = x - 150;
    const dy = y - 150;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const newShot: Shot = {
      x,
      y,
      runs: simRuns,
      angle
    };

    setShots(prev => [newShot, ...prev]);
  };

  const clearShots = () => {
    setShots([]);
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4" id="wagon-wheel-widget">
      <div className="flex justify-between items-center border-b border-white/11 pb-2">
        <h4 className="font-display font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Target className="h-4.5 w-4.5 text-[#ccff00]" />
          Wagon Wheel Hit Analysis
        </h4>
        <button
          onClick={clearShots}
          className="text-[9px] font-black text-slate-500 hover:text-red-400 uppercase tracking-widest"
        >
          Reset Plot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Clickable canvas box */}
        <div className="flex justify-center" ref={containerRef}>
          <div className="border-4 border-[#ccff00]/10 rounded-full p-2 bg-black overflow-hidden relative">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              onClick={handleCanvasClick}
              className="cursor-crosshair rounded-full max-w-[260px] md:max-w-full"
            />
            
            <div className="absolute inset-x-0 bottom-4 text-[8px] text-center pointer-events-none text-[#ccff00]/60 uppercase tracking-widest font-mono">
              ★ CLICK TARGET AREA ★
            </div>
          </div>
        </div>

        {/* Configurations panel */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
            Scatter Plot Run Selector:
          </span>

          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 6].map(amt => (
              <button
                key={amt}
                onClick={() => setSimRuns(amt as any)}
                className={`h-9 w-9 rounded-lg font-mono font-black text-xs transition-colors ${
                  simRuns === amt
                    ? 'bg-[#ccff05] text-[#061a12] shadow'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Click anywhere inside the circle on-screen to simulate a batted ball outcome. Hits accumulate onto the sector map instantly!
          </p>

          <div className="bg-white/5 p-3 rounded-lg text-[9px] font-mono text-slate-450 uppercase flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span>🟡 GREEN PATHS</span>
              <span>Singles / Twos</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-1.5">
              <span>🔵 BLUE PATHS</span>
              <span>Classic Fours</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-1.5">
              <span>🌟 NEON PATHS</span>
              <span>Immense Sixers</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
