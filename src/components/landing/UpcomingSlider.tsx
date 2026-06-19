import React from 'react';
import { MapPin } from 'lucide-react';
import { LANDING_CONFIG } from '../../config/landingConfig';

interface UpcomingSliderProps {
  onSelectView: (view: any) => void;
}

export default function UpcomingSlider({ onSelectView }: UpcomingSliderProps) {
  const { upcomingMatches } = LANDING_CONFIG;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {upcomingMatches.map((match, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectView('fixtures')}
              className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 cursor-pointer hover:border-blue-600 transition-colors hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] text-slate-400 font-mono text-center uppercase border-b border-slate-50 pb-1.5 font-bold">
                  SPL 2024 - {match.matchNo}
                </div>
                <div className="flex items-center justify-between font-mono font-black text-slate-800 text-sm py-2">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl select-none">{match.team1Icon}</span>
                    <span className="text-xs">{match.team1Short}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">VS</span>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl select-none">{match.team2Icon}</span>
                    <span className="text-xs">{match.team2Short}</span>
                  </div>
                </div>
              </div>
              <div className="text-center font-mono text-[10px] space-y-0.5 pt-1.5 border-t border-slate-50">
                <span className="block font-black text-slate-700">{match.dateLabel}</span>
                <span className="block text-slate-400 text-[8.5px] truncate" title={match.venue}>
                  {match.venue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
