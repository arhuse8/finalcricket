import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Trophy, Bell, Settings, Sparkles, Send, Coins } from 'lucide-react';
import { Fixture } from '../types';

interface DashboardViewProps {
  user: { name: string; email: string; teamId: string; role: string; joinedDate: string };
  fixtures: Fixture[];
  onSelectView: (view: 'matches' | 'fixtures' | 'stats' | 'teams' | 'tournaments' | 'dashboard' | 'auth' | 'admin') => void;
}

export default function DashboardView({ user, fixtures, onSelectView }: DashboardViewProps) {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Umpire Sanjay assigned to Rampur Warriors vs Malgudi Stars derby tomorrow.", date: "Today, 10:15 AM", read: false },
    { id: 2, text: "District Panchayat released the tournament ball list. Only standard heavy-duty tape balls permitted.", date: "Yesterday", read: true },
    { id: 3, text: "Your registration passport is verified. Welcome to Apna Cricket!", date: "Jun 18, 2026", read: true },
  ]);

  // Toss Spinner States
  const [isTossing, setIsTossing] = useState(false);
  const [tossResult, setTossResult] = useState<string | null>(null);

  const triggerTossSim = () => {
    setIsTossing(true);
    setTossResult(null);
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'HEADS - BATTING CHAMPIONS' : 'TAILS - FIELDING SQUAD';
      setTossResult(outcome);
      setIsTossing(false);
    }, 1200);
  };

  const getTeamLabel = (teamId: string) => {
    switch (teamId) {
      case 'RAMPUR': return 'Rampur Warriors';
      case 'MALGUDI': return 'Malgudi Stars';
      case 'DANGAL': return 'Dangal Kings';
      case 'GULLY': return 'Gully Raiders';
      default: return 'Independent Rep';
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-view-wrapper">
      
      {/* 👑 PROFILE HEADER BANNER */}
      <div className="bg-gradient-to-br from-[#020d09] via-black to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 h-32 w-32 bg-[#ccff00]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative">
          <div className="h-20 w-20 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-4xl shadow-lg shadow-[#ccff00]/5 text-white">
            🧑🏽‍💻
          </div>
          <div className="space-y-1 grow text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">{user.name}</h2>
              <span className="text-[9px] bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00] font-black px-2 py-0.5 uppercase tracking-widest font-mono">
                verified representative
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Affiliation: <span className="text-[#ccff00] font-black">{getTeamLabel(user.teamId)}</span> • {user.email}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Role Specialization: {user.role} • Registered on: {user.joinedDate}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSelectView('admin')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-white rounded-lg transition-all"
            >
              Control Desk
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Teams & Registered tournaments summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* My Teams */}
          <div className="bg-black/30 p-6 border border-white/10 rounded-2xl space-y-4">
            <h3 className="font-display text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/5 pb-2">
              <Shield className="h-5 w-5 text-[#ccff00]" />
              My Registered Teams (Squad Manager)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#ccff00]/20 transition-all flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-white uppercase block">{getTeamLabel(user.teamId)}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">Registered League: VPL 2026</span>
                  <span className="text-[10px] text-[#ccff00] font-bold">11 Players Active</span>
                </div>
                <button
                  onClick={() => onSelectView('teams')}
                  className="text-xs font-black text-[#ccff00] uppercase tracking-wider hover:underline"
                >
                  Manage
                </button>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-dashed hover:border-white/20 transition-all flex items-center justify-center text-center cursor-pointer" onClick={() => onSelectView('teams')}>
                <div className="space-y-1">
                  <span className="text-xs font-black text-[#ccff00] uppercase block">+ CREATE AUXILIARY SQUAD</span>
                  <span className="text-[9px] text-slate-500 font-mono">Draft your neighborhood squad</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected tournaments */}
          <div className="bg-black/30 p-6 border border-white/10 rounded-2xl space-y-4">
            <h3 className="font-display text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/5 pb-2">
              <Trophy className="h-5 w-5 text-[#ccff00]" />
              Allocated Tournaments
            </h3>

            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-white uppercase block">Apna Village Khalsa Cup 2026</span>
                  <p className="text-[11px] text-slate-400">8 Neighborhood areas • Turf & Tape Ball Derby • Grand Panchayat Meadow Arena</p>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900 border-none font-mono py-1 px-2 uppercase font-black tracking-wider">
                  ongoing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Ticker Notifications & Quick Toss coin flip */}
        <div className="space-y-6">
          
          {/* Notifications ticker */}
          <div className="bg-black/30 p-6 border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="font-display text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-[#ccff00]" />
                Live Notification Ticker
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-[9px] font-black text-slate-500 hover:text-red-400 uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">No new server notifications recorded for today.</p>
            ) : (
              <div className="space-y-3 max-h-[170px] overflow-y-auto">
                {notifications.map(note => (
                  <div key={note.id} className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-[11px]">
                    <p className="text-slate-300 font-medium">{note.text}</p>
                    <span className="text-[9px] text-slate-500 block text-right font-mono mt-1">{note.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Toss Flip Widget */}
          <div className="bg-black/30 p-6 border border-white/10 rounded-2xl space-y-4">
            <h3 className="font-display text-base font-black text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/5 pb-2">
              <Coins className="h-4.5 w-4.5 text-[#ccff00]" />
              Interactive Toss Assistant
            </h3>
            <p className="text-[11px] text-slate-400">
              Need on-field toss help before starting a match? Click to flip our digital coin!
            </p>

            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 text-center relative overflow-hidden">
              <motion.div
                animate={isTossing ? { rotateY: 720, scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="h-16 w-16 bg-[#ccff00]/10 border-2 border-[#ccff00]/40 rounded-full flex items-center justify-center text-2xl text-[#ccff00] font-black font-mono shadow-md shadow-[#ccff00]/5 mb-3 select-none"
              >
                {isTossing ? '?' : '🪙'}
              </motion.div>

              <AnimatePresence mode="wait">
                {tossResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-1"
                  >
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Toss Outcome:</span>
                    <span className="block text-xs font-black text-[#ccff00] uppercase tracking-wider">{tossResult}</span>
                  </motion.div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Ready to spin coin</span>
                )}
              </AnimatePresence>

              <button
                onClick={triggerTossSim}
                disabled={isTossing}
                className="mt-4 px-4 py-2 bg-[#ccff00] hover:bg-[#bbf000] text-[#061a12] text-[10px] font-black uppercase tracking-wider rounded-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isTossing ? 'SPINNING COIN...' : 'SPIN TOSS NOW'}
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
