import React, { useState } from 'react';
import { Trophy, Award, Users, ShieldCheck, ChevronRight, PlusCircle } from 'lucide-react';

export default function TournamentTab() {
  const [targetPrize, setTargetPrize] = useState('English Willow Bat & Confectionaries');
  const [teamSelection, setTeamSelection] = useState<string[]>(['Rampur Warriors', 'Malgudi Stars', 'Gully Raiders', 'Dangal Kings']);
  const [newTeamInput, setNewTeamInput] = useState('');

  const handleAddTeamSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamInput.trim()) return;
    if (teamSelection.includes(newTeamInput.trim())) return;
    setTeamSelection([...teamSelection, newTeamInput.trim()]);
    setNewTeamInput('');
  };

  const handleRemoveTeamSim = (idx: number) => {
    setTeamSelection(teamSelection.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-2xl text-left">
        <Trophy className="h-7 w-7 text-amber-300 mb-3 animate-pulse" />
        <h4 className="font-display font-black tracking-wide text-md uppercase">Village Tournaments & Cup Structures</h4>
        <p className="text-emerald-50 text-xs mt-2 max-w-2xl leading-relaxed">
          Plan, schedule, and structure regional championships easily. Our software supports custom bracket calculations and live team registrations seamlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Bracket & points table designer */}
        <div className="lg:col-span-7 bg-white border border-slate-150 p-5 rounded-2xl text-left space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-2.5">
            <h5 className="font-display font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>📋</span> TEAM ROSTER SIMULATOR & BRACKETS PROTOTYPER
            </h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Draft team lists below to test bracket sizing configurations</p>
          </div>

          <form onSubmit={handleAddTeamSim} className="flex gap-2">
            <input 
              type="text" 
              value={newTeamInput}
              onChange={(e) => setNewTeamInput(e.target.value)}
              placeholder="Enter team name (e.g. Rampur Falcons)..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            />
            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <PlusCircle className="h-3.5 w-3.5" /> Admit Team
            </button>
          </form>

          {/* Drafted List Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
            {teamSelection.map((team, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 border border-slate-150 rounded-xl bg-slate-50 text-xs text-left">
                <span className="font-extrabold truncate uppercase text-slate-800">{team}</span>
                <button 
                  onClick={() => handleRemoveTeamSim(idx)}
                  className="text-[10px] font-black uppercase text-red-500 hover:text-red-700 cursor-pointer pl-2 ml-auto"
                >
                  ✕
                </button>
              </div>
            ))}
            {teamSelection.length === 0 && (
              <p className="col-span-2 text-center text-slate-400 font-bold uppercase py-6 text-[10px]">No competitors admitted!</p>
            )}
          </div>

          {/* Sizing recommendations */}
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-150 p-3.5 rounded-xl space-y-1.5 text-xs text-left">
            <span className="block font-black text-[9px] uppercase tracking-wide text-emerald-700">TOURNAMENT COMPATIBILITY METRIC:</span>
            <div className="font-mono text-[10px] space-y-0.5">
              <p>Admitted Roster: <strong>{teamSelection.length} Competitors</strong></p>
              <p>Tournament Bracket: <strong>{teamSelection.length <= 4 ? 'Round-Robin Standings (Recommended)' : 'Grand Knockout stage brackets'}</strong></p>
            </div>
          </div>
        </div>

        {/* Right column: Rule rules */}
        <div className="lg:col-span-5 bg-white border border-slate-150 p-5 rounded-2xl text-left space-y-4 shadow-sm">
          <h5 className="font-display font-black text-slate-950 text-xs uppercase tracking-wide">
            🏆 TOURNAMENT RULES & STRUCTURES
          </h5>

          <div className="space-y-3.5">
            <div className="flex gap-2.5 items-start">
              <span className="p-1 rounded bg-blue-50 text-blue-600 text-[11px] font-bold">🥇</span>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs">QUALIFYING POINT TALLY</span>
                <span className="text-[11px] text-slate-500 leading-normal block mt-0.5">
                  Winning teams receive 2 standings points. Draws or abandoned matches allocate 1 point to each side.
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <span className="p-1 rounded bg-indigo-50 text-indigo-600 text-[11px] font-bold">⚖️</span>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs">DYNAMIC NET RUN RATE</span>
                <span className="text-[11px] text-slate-500 leading-normal block mt-0.5">
                  NRR (Net Run Rate) is calculated automatically based on gross runs/overs ratios across standard innings.
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <span className="p-1 rounded bg-yellow-50 text-yellow-750 text-[11px] font-bold">🎁</span>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs font-sans">CUSTOMIZED CHAMPION PRIZES</span>
                <div className="text-[11px] text-slate-500 space-y-1 mt-0.5">
                  <span>Define physical reward descriptions for your MVP athletes easily.</span>
                  <input 
                    type="text" 
                    value={targetPrize} 
                    onChange={(e) => setTargetPrize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-800 focus:outline-none"
                    title="Edit Custom Prize Field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
