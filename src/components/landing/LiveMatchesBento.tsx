import React from 'react';
import { MapPin } from 'lucide-react';

interface LiveMatchesBentoProps {
  onSelectView: (view: any) => void;
  activeMatch?: any;
}

export default function LiveMatchesBento({ onSelectView, activeMatch }: LiveMatchesBentoProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between text-left h-full">
      <div className="space-y-4 w-full">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="font-display font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-red-500">🏏</span> Live Match
          </h4>
          <span 
            onClick={() => onSelectView('LiveMatches')}
            className="text-[10px] font-extrabold text-[#ff3b30] hover:underline uppercase tracking-wider cursor-pointer"
          >
            View All
          </span>
        </div>

        {activeMatch ? (
          /* Content Details */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-red-500/10 text-[#ff3b30] font-black text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
                {activeMatch.status === 'Live' ? 'LIVE NOW' : activeMatch.status.toUpperCase()}
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">{activeMatch.league}</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Team 1 Standings Line */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🦁</span>
                  <span className="font-extrabold text-slate-800">{activeMatch.team1.name}</span>
                </div>
                <span className="font-black text-slate-900">
                  {activeMatch.team1.runs}/{activeMatch.team1.wickets} <span className="text-[10px] text-slate-400 font-normal">({activeMatch.team1.overs}.{activeMatch.team1.balls || 0})</span>
                </span>
              </div>

              {/* Team 2 Standings Line */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🌀</span>
                  <span className="font-extrabold text-slate-800">{activeMatch.team2.name}</span>
                </div>
                {activeMatch.status === 'Upcoming' ? (
                  <span className="text-[10px] font-bold text-slate-400">Yet to bat</span>
                ) : (
                  <span className="font-black text-slate-900">
                    {activeMatch.team2.runs}/{activeMatch.team2.wickets} <span className="text-[10px] text-slate-400 font-normal">({activeMatch.team2.overs}.{activeMatch.team2.balls || 0})</span>
                  </span>
                )}
              </div>
            </div>

            {/* specific chase logic warning badge */}
            <p className="text-[11px] font-black text-[#ff3b30] bg-red-50 p-2 py-2.5 rounded-xl text-center font-mono line-clamp-2">
              {activeMatch.statusMessage}
            </p>

            {/* Footer info containing address of pitch */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-3 pt-3 border-t border-slate-100">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate">{activeMatch.venue}</span>
            </div>
          </div>
        ) : (
          /* Empty State fallback */
          <div className="text-center py-6 space-y-3 flex flex-col justify-center items-center h-full">
            <span className="text-2xl text-slate-400">📡</span>
            <p className="text-[11px] font-bold text-slate-500 uppercase font-mono">No active matches</p>
            <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
              Plan fixtures or launch Live Play directly in our Matches setup tab!
            </p>
            <button
              onClick={() => onSelectView('LiveMatches')}
              className="text-[9px] font-black uppercase tracking-wider text-blue-600 border border-blue-200 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer mt-1"
            >
              Setup Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
