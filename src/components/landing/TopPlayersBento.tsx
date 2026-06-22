import React from 'react';
import { Player } from '../../types';

interface TopPlayersBentoProps {
  onSelectView: (view: any) => void;
  players?: Player[];
}

export default function TopPlayersBento({ onSelectView, players = [] }: TopPlayersBentoProps) {
  // Sort real players by runs descending and limit to top 4
  const sortedPlayers = [...players]
    .sort((a, b) => b.stats.runs - a.stats.runs)
    .slice(0, 4);

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

        {sortedPlayers.length > 0 ? (
          /* Vertical Top Leaderboard Listing */
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="font-mono text-xs text-slate-400 font-black w-4">{index + 1}</span>
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(player.name)}`} 
                    alt={player.name} 
                    className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <span className="block font-black text-xs text-slate-800 truncate" title={player.name}>
                      {player.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">{player.team} • {player.role}</span>
                  </div>
                </div>
                <div className="text-right font-mono shrink-0">
                  <span className="font-black text-slate-800 text-xs">{player.stats.runs}</span>
                  <span className="block text-[8px] text-slate-400 uppercase font-black">Runs</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Fallback */
          <div className="text-center py-8 space-y-3 flex flex-col justify-center items-center h-full">
            <span className="text-2xl text-slate-400">🛡️</span>
            <p className="text-[11px] font-bold text-slate-500 uppercase font-mono">No players registered</p>
            <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
              No custom player data found in Supabase. Recruit players to see player statistics here!
            </p>
            <button
              onClick={() => onSelectView('teams')}
              className="text-[9px] font-black uppercase tracking-wider text-blue-600 border border-blue-200 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer mt-1"
            >
              Recruit Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
