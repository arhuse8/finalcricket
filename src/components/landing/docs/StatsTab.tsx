import React, { useState } from 'react';
import { Sparkles, BarChart2, Award, Zap, Users, Search } from 'lucide-react';

export default function StatsTab() {
  const [runsSim, setRunsSim] = useState(36);
  const [ballsSim, setBallsSim] = useState(15);
  const [playerStyle, setPlayerStyle] = useState('All-Rounder');
  const [statsSearch, setStatsSearch] = useState('');

  // Srate formula
  const calculatedStrikeRate = ballsSim > 0 ? ((runsSim / ballsSim) * 100).toFixed(1) : '0.0';

  const famousPlayers = [
    { name: "Srinivas 'Sixer' Raju", team: "Rampur Warriors", style: "Right-hand Batsman", SR: "185.3", best: "84*" },
    { name: "Kiran Kumar", team: "Malgudi Stars", style: "All-Rounder", SR: "145.2", best: "62" },
    { name: "Bablu 'Helicopter' Dhoni", team: "Gully Raiders", style: "Wicketkeeper Batsman", SR: "201.5", best: "98*" },
    { name: "Sunny 'Gabru' Singh", team: "Dangal Kings", style: "Right-arm Fast Bowler", SR: "110.0", best: "42" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-2xl text-left">
        <BarChart2 className="h-7 w-7 text-yellow-300 mb-3 animate-pulse" />
        <h4 className="font-display font-black tracking-wide text-md uppercase font-sans">Player Metrics & Stats Analytics Engine</h4>
        <p className="text-indigo-50 text-xs mt-2 max-w-2xl leading-relaxed">
          Unlock professional stats recording for any grassroots tournament. Calculate strike rates, batting averages, bowling economies, and maiden logs cleanly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Strike rate estimator */}
        <div className="lg:col-span-6 bg-white border border-slate-150 p-5 rounded-2xl text-left space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h5 className="font-display font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <span>⚡</span> STRIKE RATE ESTIMATION WIDGET
            </h5>
            <span className="text-[8px] bg-blue-50 border border-indigo-100 text-blue-700 px-2 py-0.5 rounded-full font-mono font-black uppercase tracking-wider select-none">
              CALCULATOR
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-normal font-medium">
            Fine-tune runs scored and balls faced parameters to preview how strike rates (SR) are updated across players listings files:
          </p>

          <div className="space-y-4">
            <div className="space-y-1.5 text-xs font-bold text-slate-800">
              <div className="flex justify-between items-center">
                <span>Runs Scored in innings:</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono font-black">{runsSim} Runs</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="120" 
                value={runsSim} 
                onChange={(e) => setRunsSim(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
            </div>

            <div className="space-y-1.5 text-xs font-bold text-slate-800">
              <div className="flex justify-between items-center">
                <span>Balls Faced:</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono font-black">{ballsSim} Balls</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="60" 
                value={ballsSim} 
                onChange={(e) => setBallsSim(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
            </div>

            {/* Simulated output metrics */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col items-center justify-center space-y-1">
              <span className="text-slate-400 uppercase text-[9px] font-black">PLAYER ESTIMATED STRIKE RATE (SR):</span>
              <span className="text-2xl font-mono text-indigo-900 font-black">{calculatedStrikeRate}<span className="text-xs text-slate-500 font-sans font-bold"> %</span></span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                Recommendation: {parseFloat(calculatedStrikeRate) >= 150 ? '👑 Elite aggressive finisher style' : '🏏 Solid anchor-role batsman'}
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Star profiles */}
        <div className="lg:col-span-6 bg-white border border-slate-150 p-5 rounded-2xl text-left space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-2 border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h5 className="font-display font-black text-slate-950 text-xs uppercase tracking-wide">
                ⭐ HEROES OF THE SEASON
              </h5>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Search and view active star players listed in village cups</p>
            </div>
            
            <div className="relative w-full sm:w-40">
              <input 
                type="text" 
                placeholder="Search Hero..."
                value={statsSearch}
                onChange={(e) => setStatsSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-800 focus:outline-none"
              />
              <Search className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {famousPlayers
              .filter(p => p.name.toLowerCase().includes(statsSearch.toLowerCase()) || p.team.toLowerCase().includes(statsSearch.toLowerCase()))
              .map((p, idx) => (
                <div key={idx} className="p-3 border border-slate-150 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 transition-all flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 block uppercase tracking-wide text-xs">{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{p.team} — {p.style}</span>
                  </div>
                  <div className="text-right font-mono font-bold shrink-0">
                    <span className="text-indigo-600 block text-xs">SR {p.SR}</span>
                    <span className="text-[9px] text-slate-400 block">Best: {p.best}</span>
                  </div>
                </div>
            ))}
            {famousPlayers.filter(p => p.name.toLowerCase().includes(statsSearch.toLowerCase()) || p.team.toLowerCase().includes(statsSearch.toLowerCase())).length === 0 && (
              <p className="text-center text-slate-400 font-bold uppercase text-[9px] py-10">No matching players detected!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
