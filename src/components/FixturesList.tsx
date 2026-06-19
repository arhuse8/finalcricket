import React, { useState } from 'react';
import { Fixture, Match } from '../types';
import { Calendar, Search, MapPin, Award, ArrowUpRight, PlayCircle, Trophy, Compass } from 'lucide-react';
import { INITIAL_FIXTURES } from '../mockData';

interface FixturesListProps {
  fixtures: Fixture[];
  onSelectFixtureToSimulate: (fixture: Fixture) => void;
  activeMatchTitle: string;
}

export default function FixturesList({ fixtures, onSelectFixtureToSimulate, activeMatchTitle }: FixturesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering fixtures
  const filteredFixtures = fixtures.filter(fix => {
    const term = searchTerm.toLowerCase();
    return (
      fix.team1Name.toLowerCase().includes(term) ||
      fix.team2Name.toLowerCase().includes(term) ||
      fix.venue.toLowerCase().includes(term) ||
      fix.tournamentName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6" id="fixtures-view-root">
      {/* 📅 Active Tournament Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#061a12] via-[#020d09] to-black p-6 border border-white/10">
        <div className="absolute right-0 bottom-0 h-40 w-40 bg-[#ccff00]/5 rounded-full blur-3xl" />
        <div className="relative space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ccff00]/10 text-[#ccff00]">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[9px] bg-[#ccff00]/10 text-[#ccff00] font-black px-2.5 py-0.5 border border-[#ccff00]/20 uppercase tracking-widest font-display">
              VILLAGE TOURNAMENT LEAGUE
            </span>
            <h2 className="font-display text-3xl font-black text-white uppercase mt-1.5 tracking-tight">Apna Village Khalsa Cup 2026</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              8 neighboring hamlets competing in standard 12-overs tape-ball matches. Top 4 teams qualify for the Grand Panchayat Meadows Final.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">📅 SCHEDULED DERBIES & ARENAS</h3>
          <p className="text-xs text-slate-400">Match dates, local timings, and pitch locations for village cricket.</p>
        </div>

        {/* Search Input bar */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search matching teams or arenas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-white/10 text-white rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#ccff00]"
            id="fixtures-search-input"
          />
        </div>
      </div>

      {/* Fixtures grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFixtures.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-black/25 rounded-xl border border-dashed border-white/10">
            <p className="text-sm text-slate-500 italic">No scheduled matches match your criteria.</p>
          </div>
        ) : (
          filteredFixtures.map(fix => {
            const isCurrentlySimulated = activeMatchTitle.includes(fix.team1Short) && activeMatchTitle.includes(fix.team2Short);
            
            return (
              <div
                key={fix.id}
                className={`group rounded-2xl border bg-black/20 p-5 transition-all duration-300 hover:border-[#ccff00]/40 hover:bg-black/40 relative overflow-hidden flex flex-col justify-between ${
                  isCurrentlySimulated ? 'border-[#ccff00] shadow-lg shadow-[#ccff00]/10' : 'border-white/10'
                }`}
                id={`fixture-card-${fix.id}`}
              >
                {/* Subtle highlight stripes */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ccff00]/20 to-transparent" />

                <div className="space-y-4">
                  {/* Tournament Cup name badge */}
                  <div className="flex items-center justify-between text-[10px] text-slate-300 font-black uppercase tracking-wider border-b border-white/10 pb-2.5">
                    <span className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-[#ccff00]" />
                      {fix.tournamentName}
                    </span>
                    <span className="text-slate-400 font-mono text-[9px] font-bold">{fix.time}</span>
                  </div>

                  {/* Matchup row */}
                  <div className="flex items-center justify-between gap-2.5">
                    {/* Team 1 */}
                    <div className="flex items-center gap-2.5 flex-1 select-none overflow-hidden">
                      <div className={`h-8 w-8 shrink-0 rounded bg-gradient-to-tr ${fix.team1Color} flex items-center justify-center font-display font-black text-xs text-white shadow`}>
                        {fix.team1Short}
                      </div>
                      <span className="font-black text-white text-xs uppercase tracking-wider truncate">
                        {fix.team1Name}
                      </span>
                    </div>

                    {/* VS divider */}
                    <div className="shrink-0 flex items-center justify-center text-[9px] font-black text-[#ccff00] bg-black border border-[#ccff00]/20 px-2.5 py-1 rounded select-none font-display uppercase tracking-widest leading-none">
                      VS
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center gap-2.5 flex-1 justify-end select-none overflow-hidden text-right">
                      <span className="font-black text-white text-xs uppercase tracking-wider truncate">
                        {fix.team2Name}
                      </span>
                      <div className={`h-8 w-8 shrink-0 rounded bg-gradient-to-tr ${fix.team2Color} flex items-center justify-center font-display font-black text-xs text-white shadow`}>
                        {fix.team2Short}
                      </div>
                    </div>
                  </div>

                  {/* Ground metadata */}
                  <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs text-slate-300 font-medium uppercase tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#ccff00] shrink-0" />
                      <span className="truncate">{fix.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{fix.date}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated action trigger */}
                <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-4">
                  {isCurrentlySimulated ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#061a12] bg-[#ccff00] px-2.5 py-1 border border-[#ccff00]">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></span>
                      Currently Live
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectFixtureToSimulate(fix)}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-[#ccff00] hover:text-white uppercase tracking-wider transition-colors"
                      id={`btn-simulate-fix-${fix.id}`}
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Simulate live score</span>
                    </button>
                  )}

                  <div className="text-[9px] text-[#ccff00] bg-white/5 border border-white/10 px-2 py-0.5 font-mono font-black uppercase tracking-wider">
                    12 OVERS
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pitch Guide details */}
      <div className="rounded-xl border border-white/10 bg-black/10 p-5 mt-6">
        <h4 className="font-display font-black text-[#ccff00] mb-3 uppercase tracking-wider text-xs flex items-center gap-2">
          <Compass className="h-5 w-5 text-[#ccff00]" />
          Quick Village Arena & Turf Report
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
            <span className="font-black text-white uppercase tracking-wider text-[11px] block text-[#ccff00]">High School Ground</span>
            <p className="text-slate-350 mt-1.5 leading-relaxed">Flat dusty dirt pitch. Massive legside boundaries. Heavy wild grass slows down covers.</p>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
            <span className="font-black text-white uppercase tracking-wider text-[11px] block text-[#ccff00]">Lake View Ground</span>
            <p className="text-slate-355 mt-1.5 leading-relaxed">Wet lake breeze triggers high swing for pace deliverers. Sticky clay wicket helps spinners.</p>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
            <span className="font-black text-white uppercase tracking-wider text-[11px] block text-[#ccff00]">Meadows Turf Cricket</span>
            <p className="text-slate-350 mt-1.5 leading-relaxed">Tarmac-like center offers rapid bounce. Perfect batsman paradise under bright sunsets.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
