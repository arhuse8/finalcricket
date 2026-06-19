import React from 'react';
import { ArrowLeft, Settings, Award, ShieldAlert, Star } from 'lucide-react';
import { Match } from '../types';
import MatchSimulator from './MatchSimulator';

interface AdminSandboxProps {
  liveMatch: Match;
  setLiveMatch: (m: Match) => void;
  onPlayerStatUpdate: any;
  setCurrentSimulatedView: (v: 'list' | 'detail') => void;
}

export default function AdminSandbox({
  liveMatch,
  setLiveMatch,
  onPlayerStatUpdate,
  setCurrentSimulatedView
}: AdminSandboxProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left" id="admin-sandbox-container">
      {/* Left columns: High fidelity Simulator & scoring action table */}
      <div className="xl:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
              🛠️ ADMINISTRATOR PRIVILEGED LEVEL
            </span>
            <h3 className="font-display text-2xl font-black text-slate-800 uppercase tracking-tight mt-1.5 flex items-center gap-1.5">
              <span>⚙️</span> Sandbox Cockpit
            </h3>
          </div>
          
          <button
            onClick={() => setCurrentSimulatedView('list')}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-[10px] uppercase font-black tracking-widest cursor-pointer border border-slate-200"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Matches</span>
          </button>
        </div>

        {/* Dynamic Umpire & Match Simulator panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-violet-600 animate-spin" />
            <h4 className="font-display text-lg font-black text-slate-900 uppercase">Interactive Score Control</h4>
          </div>
          <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
            Direct access to the simulation engine. You can play overs, auto-run entire innings, log custom wicket states, and trigger real-time updates that are broadcasted instantly to the Spectator Viewport.
          </p>

          <MatchSimulator
            match={liveMatch}
            setMatch={setLiveMatch}
            onPlayerStatUpdate={onPlayerStatUpdate}
          />
        </div>
      </div>

      {/* Right Column: Rule Book settings, Security logs, and State indicators */}
      <div className="space-y-6">
        {/* Administrator Credentials & Active State Box */}
        <div className="rounded-2xl border border-red-150 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white p-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-[-10px] text-7xl opacity-5 select-none font-black text-violet-300">🛡️</div>
          
          <span className="inline-flex items-center gap-1.5 bg-red-600 text-white font-black uppercase text-[8px] tracking-widest px-2 py-0.5 rounded">
            <span className="h-1 w-1 bg-white rounded-full animate-ping" />
            LIVE SECURITY SESSION
          </span>

          <h4 className="font-display font-black text-slate-100 text-sm uppercase tracking-wider flex items-center gap-1.5 mt-4 mb-2">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            RBAC Access Verification
          </h4>
          
          <div className="space-y-3 font-mono text-xs text-slate-300 pt-2 border-t border-white/10 mt-3">
            <div className="flex justify-between">
              <span>Token Level:</span>
              <span className="text-yellow-400 font-bold">DEV_ROOT</span>
            </div>
            <div className="flex justify-between">
              <span>Client State:</span>
              <span className="text-emerald-400 font-bold">Authenticated</span>
            </div>
            <div className="flex justify-between">
              <span>Sync Endpoint:</span>
              <span className="text-blue-400 font-bold">Express API</span>
            </div>
          </div>
        </div>

        {/* Local Rulebook / Ground Rules Customizer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="font-display font-black text-[#5b21b6] text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Star className="h-4 w-4 text-[#5b21b6] fill-current" />
            Local Arena Rules Config
          </h4>
          <ul className="text-xs text-slate-500 space-y-2.5 leading-relaxed list-disc list-inside">
            <li>Matches strictly limited to {liveMatch.oversLimit} overs maximum.</li>
            <li>Wides and No-Balls award exactly 1 run to the active batting side.</li>
            <li>Hitting to the Cow Corner boundary uses high strike density factors (6s or Caught!).</li>
          </ul>
        </div>

        {/* Staging & Local Simulation instructions */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
          <h5 className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5 font-mono">STAGING MODE NOTES</h5>
          <p className="text-[11px] text-slate-500 leading-normal font-medium">
            Remember: Any score modifications made in this sandbox are reactive. Toggling between viewers at the top allows you to instantly inspect how spectators see your mock data overlays.
          </p>
        </div>
      </div>
    </div>
  );
}
