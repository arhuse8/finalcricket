import React from 'react';
import { LANDING_CONFIG } from '../../config/landingConfig';

interface TopPlayersBentoProps {
  onSelectView: (view: any) => void;
}

export default function TopPlayersBento({ onSelectView }: TopPlayersBentoProps) {
  const { topPlayers } = LANDING_CONFIG;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between text-left h-full">
      <div className="space-y-4 w-full">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="font-display font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-blue-600">👑</span> Top Players
          </h4>
          <span 
            onClick={() => onSelectView('stats')}
            className="text-[10px] font-extrabold text-blue-600 hover:underline uppercase tracking-wider cursor-pointer"
          >
            View All
          </span>
        </div>

        {/* Vertical Top Leaderboard Listing */}
        <div className="space-y-3">
          {topPlayers.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="font-mono text-xs text-slate-400 font-black w-4">{index + 1}</span>
                <img 
                  src={player.photo} 
                  alt={player.name} 
                  className="h-8 w-8 rounded-full bg-slate-50 border border-slate-250 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <span className="block font-black text-xs text-slate-800 truncate" title={player.name}>
                    {player.name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">{player.team}</span>
                </div>
              </div>
              <div className="text-right font-mono shrink-0">
                <span className="font-black text-slate-800 text-xs">{player.score}</span>
                <span className="block text-[8px] text-slate-400 uppercase font-black">{player.metricType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
