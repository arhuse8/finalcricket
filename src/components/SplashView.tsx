import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, ChevronRight } from 'lucide-react';

interface SplashViewProps {
  onDismiss: () => void;
}

export default function SplashView({ onDismiss }: SplashViewProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Initializing Arena turf data...');

  useEffect(() => {
    const logs = [
      'Booting Gully tape-ball wind simulator...',
      'Rolling Panchayat Meadows asphalt wicket...',
      'Aligning boundary cow cow corner coordinates...',
      'Applying fresh tape to tournament balls...',
      'Synchronizing Village Hall of Fame rankings...',
      'Apna Cricket Local System ONLINE! 🚀'
    ];

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const index = Math.min(Math.floor(next / 17), logs.length - 1);
        setStatusMsg(logs[index]);
        return Math.min(next, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#061a12] text-white p-6 overflow-hidden">
      {/* Background neon radial blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#ccff00]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative grass rows */}
      <div className="absolute inset-x-0 bottom-0 top-0 opacity-5 pointer-events-none flex flex-col justify-between">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-6 w-full border-b border-dashed border-[#ccff00]" />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center text-center space-y-8 z-10 max-w-lg"
      >
        {/* Emblem Badge */}
        <div className="relative group">
          <div className="absolute inset-0 bg-[#ccff00] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-black border-2 border-[#ccff00]/40 text-5xl shadow-2xl">
            🏏
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#ccff00] text-black font-black text-[10px] px-2 py-0.5 transform rotate-6 uppercase tracking-wider rounded border border-[#061a12]">
            12 OVERS
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <span className="text-[10px] bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] font-black px-3 py-1 uppercase tracking-widest leading-none rounded-none">
            VILLAGE CRICKET PRO PORTAL
          </span>
          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter leading-none">
            APNA<span className="text-[#ccff00]">CRICKET</span>
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-[0.25em] font-extrabold max-w-sm mx-auto">
            Grassroots Cricket League & Live scoring Desk
          </p>
        </div>

        {/* Loading progress bars */}
        <div className="w-full max-w-xs space-y-3">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              className="h-full bg-gradient-to-r from-[#ccff00] to-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[9px] text-slate-450 uppercase font-black tracking-wider">
            <span className="truncate max-w-[200px] text-left">{statusMsg}</span>
            <span>{loadingProgress}% READY</span>
          </div>
        </div>

        {/* Action Button once system loaded */}
        <motion.div
          animate={loadingProgress >= 100 ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } } : {}}
          className="pt-4"
        >
          <button
            onClick={onDismiss}
            disabled={loadingProgress < 100}
            className={`group inline-flex items-center gap-3 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all shadow-md rounded-none ${
              loadingProgress >= 100
                ? 'bg-[#ccff00] text-[#061a12] cursor-pointer hover:bg-white border hover:border-[#ccff00]'
                : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            <span>ENTER THE ARENA</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>

      {/* Credits */}
      <div className="absolute bottom-6 text-center select-none z-10 text-[10px] text-slate-600 font-mono tracking-widest uppercase">
        © 2026 APNA CRICKET ASSOCIATION • STANDARD RULES WITH VILLAGE GRIT
      </div>
    </div>
  );
}
