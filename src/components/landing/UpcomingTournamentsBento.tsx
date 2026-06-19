import React from 'react';
import { Calendar } from 'lucide-react';
import { LANDING_CONFIG } from '../../config/landingConfig';

interface UpcomingTournamentsBentoProps {
  onSelectView: (view: any) => void;
}

export default function UpcomingTournamentsBento({ onSelectView }: UpcomingTournamentsBentoProps) {
  const { tournamentPromo } = LANDING_CONFIG;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between text-left h-full">
      <div className="space-y-4">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="font-display font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-blue-600">🏆</span> Upcoming Tournaments
          </h4>
          <span 
            onClick={() => onSelectView('tournaments')}
            className="text-[10px] font-extrabold text-blue-600 hover:underline uppercase tracking-wider cursor-pointer"
          >
            View All
          </span>
        </div>

        {/* Big Graphic Showcase Block matching styling exactly */}
        <div 
          className="rounded-xl p-4 text-white relative border border-white/5 shadow-inner overflow-hidden min-h-[96px] bg-cover bg-center flex flex-col justify-end"
          style={{ backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.4)), url(${tournamentPromo.bannerUrl})` }}
        >
          <span className="absolute top-2 right-2 bg-blue-600 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">
            {tournamentPromo.badge}
          </span>
          <div className="space-y-0.5">
            <p className="text-[10px] text-amber-300 uppercase font-black tracking-widest leading-none">
              {tournamentPromo.subtitle}
            </p>
            <h5 className="font-display font-black text-xs sm:text-sm uppercase tracking-tight leading-none">
              {tournamentPromo.year}
            </h5>
          </div>
        </div>

        {/* Tournament Metrics info metrics columns grid */}
        <div className="grid grid-cols-3 gap-1 divide-x divide-slate-100 text-center font-mono text-[10px]">
          <div>
            <span className="block text-slate-400 uppercase text-[8px] font-bold">Teams</span>
            <span className="font-black text-slate-800">{tournamentPromo.teamsCount} Teams</span>
          </div>
          <div>
            <span className="block text-slate-400 uppercase text-[8px] font-bold">Games</span>
            <span className="font-black text-slate-800">{tournamentPromo.matchesCount} Matches</span>
          </div>
          <div>
            <span className="block text-slate-400 uppercase text-[8px] font-bold">Grounds</span>
            <span className="font-black text-blue-600">{tournamentPromo.groundsCount} Grounds</span>
          </div>
        </div>
      </div>

      {/* Primary red action banner */}
      <div className="space-y-3 mt-3">
        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
          <Calendar className="h-3 w-3 text-blue-500" />
          <span>{tournamentPromo.dates}</span>
        </div>

        <button
          onClick={() => onSelectView('tournaments')}
          className="w-full bg-blue-600 hover:bg-blue-750 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl block text-center transition-all cursor-pointer shadow-sm"
        >
          VIEW TOURNAMENT
        </button>
      </div>
    </div>
  );
}
