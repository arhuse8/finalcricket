import React from 'react';
import { MapPin } from 'lucide-react';
import { LANDING_CONFIG } from '../../config/landingConfig';

interface LiveMatchesBentoProps {
  onSelectView: (view: any) => void;
}

export default function LiveMatchesBento({ onSelectView }: LiveMatchesBentoProps) {
  const { hero } = LANDING_CONFIG;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between text-left h-full">
      <div className="space-y-4">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="font-display font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-red-500">🏏</span> Live Matches
          </h4>
          <span 
            onClick={() => onSelectView('matches')}
            className="text-[10px] font-extrabold text-[#ff3b30] hover:underline uppercase tracking-wider cursor-pointer"
          >
            View All
          </span>
        </div>

        {/* Content Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="bg-red-500/10 text-[#ff3b30] font-black text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
              Live Now
            </span>
            <span className="text-[10px] text-slate-400 font-mono font-bold">{hero.badgeLabel}</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Team 1 Standings Line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🦁</span>
                <span className="font-extrabold text-slate-800">{hero.liveMatch.team1Short}</span>
              </div>
              <span className="font-black text-slate-900">
                {hero.liveMatch.team1Score} <span className="text-[10px] text-slate-400 font-normal">({hero.liveMatch.team1Overs.split(' ')[0]})</span>
              </span>
            </div>

            {/* Team 2 Standings Line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🌀</span>
                <span className="font-extrabold text-slate-800">{hero.liveMatch.team2Short}</span>
              </div>
              <span className="font-black text-slate-900">
                145/8 <span className="text-[10px] text-slate-400 font-normal">(20.0)</span>
              </span>
            </div>
          </div>

          {/* specific chase logic warning badge */}
          <p className="text-[11px] font-black text-[#ff3b30] bg-red-50 p-2.5 rounded-xl text-center font-mono">
            {hero.liveMatch.statusMessage}
          </p>
        </div>
      </div>

      {/* Footer info containing address of pitch */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-3 pt-3 border-t border-slate-50">
        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
        <span className="truncate">{hero.liveMatch.venue}</span>
      </div>
    </div>
  );
}
