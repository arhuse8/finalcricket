import React from 'react';

interface UpcomingSliderProps {
  onSelectView: (view: any) => void;
  upcomingMatches?: any[];
}

export default function UpcomingSlider({ onSelectView, upcomingMatches = [] }: UpcomingSliderProps) {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="font-display text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
          <span>📅</span> UPCOMING MATCHES
        </h3>
        <span 
          onClick={() => onSelectView('fixtures')}
          className="text-xs font-black text-blue-600 hover:underline uppercase tracking-wider cursor-pointer"
        >
          View All
        </span>
      </div>

      <div className="relative">
        {upcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {upcomingMatches.slice(0, 5).map((match, idx) => (
              <div 
                key={idx}
                onClick={() => onSelectView('fixtures')}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 cursor-pointer hover:border-blue-600 transition-colors hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-400 font-mono text-center uppercase border-b border-slate-200 pb-1.5 font-bold">
                    {match.league}
                  </div>
                  <div className="flex items-center justify-between font-mono font-black text-slate-800 text-sm py-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl select-none">🦁</span>
                      <span className="text-xs">{match.team1.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">VS</span>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl select-none">🌀</span>
                      <span className="text-xs">{match.team2.name}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center font-mono text-[10px] space-y-0.5 pt-1.5 border-t border-slate-100">
                  <span className="block font-black text-slate-700">{match.matchDate}</span>
                  <span className="block text-slate-400 text-[8.5px] truncate" title={match.venue}>
                    {match.venue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white border border-slate-150 rounded-xl p-8 text-center space-y-3 flex flex-col items-center justify-center">
            <span className="text-2xl">📅</span>
            <p className="text-xs font-bold text-slate-500 uppercase font-mono">No Future Match Scheduled</p>
            <p className="text-[11px] text-slate-400 max-w-sm">
              Use the Matches page to define new fixtures, schedule games, and generate upcoming showdown cards!
            </p>
            <button
              onClick={() => onSelectView('fixtures')}
              className="text-[10px] font-black uppercase tracking-wider text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Add Upcoming Fixture
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
