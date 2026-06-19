import React, { useState } from 'react';
import { Match } from '../types';
import { Eye, Clock, MapPin, Users, Award, ChevronDown, ListEnd, HelpCircle } from 'lucide-react';

interface ScorecardViewProps {
  match: Match;
}

export default function ScorecardView({ match }: ScorecardViewProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'full' | 'commentary'>('quick');

  // Calculates stats
  const score = match.team1.score; // assume first innings for now
  const totalBalls = score.overs * 6 + score.balls;
  const currentRunRate = totalBalls > 0 ? ((score.runs / totalBalls) * 6).toFixed(2) : '0.00';
  const projectedScore = totalBalls > 0 ? Math.round((parseFloat(currentRunRate) * match.oversLimit)) : 0;

  // Render ball item helper
  const getBallBadgeStyle = (ball: string) => {
    if (ball === 'W') {
      return 'bg-red-600 border-red-500 text-white font-black ring-2 ring-red-500/20';
    }
    if (ball === '6') {
      return 'bg-[#ccff00] border-[#ccff00] text-[#061a12] font-black shadow-md shadow-[#ccff00]/15 scale-105';
    }
    if (ball === '4') {
      return 'bg-emerald-500 border-emerald-400 text-black font-black scale-105';
    }
    if (ball.includes('Wd') || ball.includes('Nb')) {
      return 'bg-blue-950/80 border-blue-800 text-blue-300 font-bold';
    }
    return 'bg-emerald-950/60 border-emerald-900/40 text-emerald-300 font-bold';
  };

  return (
    <div className="flex flex-col gap-6" id={`scorecard-container-${match.id}`}>
      {/* 🏟️ The Live Ground Layout Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-[#ccff00]/20 bg-[#020d09] pb-6 shadow-xl shadow-slate-950/50">
        {/* Animated Village grass background */}
        <div className="absolute inset-0 village-grass-gradient opacity-15" />
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#ccff00]/5 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-24 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

        {/* Header - Tournament info */}
        <div className="relative flex flex-wrap items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4 gap-2">
          <div className="flex items-center gap-3">
            <span className="live-badge-glow flex items-center gap-1.5 rounded-none bg-[#ccff00] px-3 py-1 text-[10px] font-black text-[#061a12] tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></span>
              LIVE STREAM
            </span>
            <span className="text-xs text-white/80 font-bold uppercase tracking-wider">{match.title}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#ccff00]" />
              {match.venue}
            </span>
          </div>
        </div>

        {/* Score display area */}
        <div className="relative px-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Run score metrics */}
            <div>
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${match.team1.logoColor}`} />
                <h3 className="font-display text-xl font-black text-white uppercase tracking-tight">{match.team1.name}</h3>
              </div>
              
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-6xl font-black tracking-tighter text-white hover:text-[#ccff00] transition-colors leading-none">
                  {score.runs}
                  <span className="text-4xl text-white/30 font-semibold">/</span>
                  {score.wickets}
                </span>

                <div className="flex flex-col border-l border-white/10 pl-4">
                  <span className="font-mono text-sm font-black text-white/95">
                    OVERS: {score.overs}.{score.balls}
                    <span className="text-xs text-slate-400 font-normal"> / {match.oversLimit} MAX</span>
                  </span>
                  <span className="text-[10px] font-black text-[#ccff00] uppercase tracking-widest mt-0.5">
                    {match.isFirstInningsComplete ? 'SECOND INNINGS' : 'FIRST INNINGS'}
                  </span>
                </div>
              </div>

              {match.tossResult && (
                <p className="mt-4 text-xs italic text-slate-300 border-l-2 border-[#ccff00] pl-3 bg-white/5 py-2.5 rounded-r">
                   🏏 {match.tossResult}
                </p>
              )}
            </div>

            {/* Run Rate Speeds and predictions */}
            <div className="grid grid-cols-2 gap-3.5 bg-black/40 p-4 rounded-xl border border-white/10">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#ccff00]">Current Run Rate</span>
                <span className="font-mono text-2xl font-black text-white">{currentRunRate}</span>
                <span className="text-[10px] text-slate-400">runs per over</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#ccff00]">Projected Score</span>
                <span className="font-mono text-2xl font-black text-[#ccff00]">~{projectedScore}</span>
                <span className="text-[10px] text-slate-400">at current rate</span>
              </div>
              {match.targetRuns && (
                <div className="col-span-2 mt-2 pt-2 border-t border-white/10 text-xs font-black text-[#ccff00] flex items-center justify-between uppercase tracking-wider">
                  <span>🎯 TARGET FOR {match.team2.name}:</span>
                  <span>{match.targetRuns} RUNS</span>
                </div>
              )}
            </div>
          </div>

          {/* 🥎 Over Progress Circle / Last Balls ticker */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">This Over Tracker:</span>
              <div className="flex gap-1.5 shrink-0">
                {match.recentBalls.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No balls bowled in this over yet</span>
                ) : (
                  match.recentBalls.map((ball, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-none border text-xs font-black transition-all ${getBallBadgeStyle(ball)}`}
                    >
                      {ball}
                    </span>
                  ))
                )}
              </div>
            </div>
            
            <div className="text-[10px] font-black text-[#ccff00] uppercase tracking-wider bg-white/5 px-3 py-1.5 border border-white/10 rounded-lg">
              🏏 GROUND STATUS: <span className="font-black">COW CORNER BOUNDARIES ENABLED</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📑 Tab controls for detailed views */}
      <div className="flex border border-white/10 bg-black/40 p-1.5 rounded-xl">
        <button
          onClick={() => setActiveTab('quick')}
          className={`flex-1 py-3 text-center rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'quick' ? 'bg-[#ccff00] text-[#061a12] shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
          id="btn-tab-quick"
        >
          ⚡ Live Crease
        </button>
        <button
          onClick={() => setActiveTab('full')}
          className={`flex-1 py-3 text-center rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'full' ? 'bg-[#ccff00] text-[#061a12] shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
          id="btn-tab-full"
        >
          📋 Team Cards
        </button>
        <button
          onClick={() => setActiveTab('commentary')}
          className={`flex-1 py-3 text-center rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'commentary' ? 'bg-[#ccff00] text-[#061a12] shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
          id="btn-tab-commentary"
        >
          💬 Commentary
        </button>
      </div>

      {/* Content depending on selected tab */}
      {activeTab === 'quick' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="scorecard-quick-tab">
          {/* Active Batsmen Block */}
          <div className="rounded-xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
            <h4 className="font-display font-black text-white uppercase tracking-wider border-b border-white/15 pb-3 mb-4 flex items-center justify-between text-xs">
              <span>🏏 Batting Partnership (Live crease)</span>
              <span className="text-[9px] font-black text-[#061a12] bg-[#ccff00] px-2 py-0.5 tracking-wider">LIVE RECORDERS</span>
            </h4>
            
            <div className="space-y-4">
              {/* Batsman 1 */}
              <div className={`p-4 rounded-xl border transition-all ${
                match.onStrikeIndex === 0 
                  ? 'border-[#ccff00] bg-[#ccff00]/10' 
                  : 'border-white/5 bg-black/40'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {match.onStrikeIndex === 0 && <span className="text-[#ccff00] animate-bounce">⚡</span>}
                    <span className="font-black text-white text-sm uppercase tracking-wide">{match.miniScore.batsman1.name}</span>
                    {match.onStrikeIndex === 0 && <span className="rounded bg-[#ccff00] text-[#061a12] text-[9px] font-black px-1.5 py-0.2 tracking-wider">STRIKER</span>}
                  </div>
                  <div className="font-mono text-2xl font-black text-white">
                    {match.miniScore.batsman1.runs}
                    <span className="text-sm text-slate-400 font-normal"> ({match.miniScore.batsman1.balls}b)</span>
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-white/10 pt-2.5 text-center text-xs text-slate-400">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Fours</span>
                    <span className="font-black text-slate-100">{match.miniScore.batsman1.fours}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Sixes</span>
                    <span className="font-black text-[#ccff00]">{match.miniScore.batsman1.sixes}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Strike Rate</span>
                    <span className="font-mono font-bold text-slate-100">{match.miniScore.batsman1.strikeRate.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Batsman 2 */}
              <div className={`p-4 rounded-xl border transition-all ${
                match.onStrikeIndex === 1 
                  ? 'border-[#ccff00] bg-[#ccff00]/10' 
                  : 'border-white/5 bg-black/40'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {match.onStrikeIndex === 1 && <span className="text-[#ccff00] animate-bounce">⚡</span>}
                    <span className="font-black text-white text-sm uppercase tracking-wide">{match.miniScore.batsman2.name}</span>
                    {match.onStrikeIndex === 1 && <span className="rounded bg-[#ccff00] text-[#061a12] text-[9px] font-black px-1.5 py-0.2 tracking-wider">STRIKER</span>}
                  </div>
                  <div className="font-mono text-2xl font-black text-white">
                    {match.miniScore.batsman2.runs}
                    <span className="text-sm text-slate-400 font-normal"> ({match.miniScore.batsman2.balls}b)</span>
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-white/10 pt-2.5 text-center text-xs text-slate-400">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Fours</span>
                    <span className="font-black text-slate-100">{match.miniScore.batsman2.fours}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Sixes</span>
                    <span className="font-black text-[#ccff00]">{match.miniScore.batsman2.sixes}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Strike Rate</span>
                    <span className="font-mono font-bold text-slate-100">{match.miniScore.batsman2.strikeRate.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Bowler Block */}
          <div className="rounded-xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
            <h4 className="font-display font-black text-white uppercase tracking-wider border-b border-white/15 pb-3 mb-4 flex items-center justify-between text-xs">
              <span>🥎 Bowlers Spell Control</span>
              <span className="text-[9px] font-black text-[#ccff00] bg-white/5 border border-white/15 px-2 py-0.5 tracking-wider">SPELL DATA</span>
            </h4>

            <div className="p-4 rounded-xl border border-white/10 bg-black/40">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#ccff00] uppercase tracking-widest font-black">Wicket Hunter</span>
                  <p className="font-black text-white text-base uppercase tracking-tight">{match.miniScore.bowler.name}</p>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-bold">Wickets</span>
                  <span className="font-mono text-3xl font-black text-red-500">{match.miniScore.bowler.wickets}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/10 pt-3.5 text-center text-xs text-slate-400">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Overs</span>
                  <span className="font-mono font-black text-slate-100">{match.miniScore.bowler.overs.toFixed(1)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Maidens</span>
                  <span className="font-mono font-black text-slate-100">{match.miniScore.bowler.maidens}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Runs</span>
                  <span className="font-mono font-black text-slate-100">{match.miniScore.bowler.runs}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Economy</span>
                  <span className="font-mono font-black text-[#ccff00]">{match.miniScore.bowler.economy.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Quick Pitch Condition metadata */}
            <div className="mt-4 bg-[#ccff00]/5 border border-[#ccff00]/10 p-4 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
              <span className="text-base">🌾</span>
              <p className="leading-relaxed">
                <strong className="text-[#ccff00] uppercase tracking-wider font-extrabold block mb-0.5">Panchayat Turf Note</strong> Dusty village configurations favor spin bowlers. Extra dry friction triggers ball spin and dry-grip trajectory.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'full' && (
        <div className="space-y-6" id="scorecard-full-tab">
          {/* Batting Card */}
          <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
            <div className="bg-black/60 px-5 py-4 border-b border-white/10 flex justify-between items-center">
              <h4 className="font-display font-black text-white uppercase tracking-wider text-xs">Batting Card: {match.team1.name}</h4>
              <span className="text-xs bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] font-mono px-2.5 py-0.5 tracking-wider font-bold">
                RUNS: {score.runs}/{score.wickets}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40 text-slate-400 uppercase tracking-widest text-[9px] font-black">
                    <th className="px-5 py-3.5">Batsman</th>
                    <th className="px-4 py-3.5">Out Status</th>
                    <th className="px-4 py-3.5 text-right">Runs</th>
                    <th className="px-4 py-3.5 text-right">Balls</th>
                    <th className="px-4 py-3.5 text-right">4s</th>
                    <th className="px-4 py-3.5 text-right">6s</th>
                    <th className="px-4 py-3.5 text-right">SR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {match.team1.battingCard.map((bat, idx) => (
                    <tr key={idx} className="hover:bg-white/5 text-slate-300">
                      <td className="px-5 py-3.5 font-sans font-black text-white uppercase tracking-wide">{bat.playerName}</td>
                      <td className="px-4 py-3.5 text-slate-400 italic font-sans">{bat.status}</td>
                      <td className="px-4 py-3.5 text-right text-white font-black">{bat.runs}</td>
                      <td className="px-4 py-3.5 text-right">{bat.balls}</td>
                      <td className="px-4 py-3.5 text-right text-[#ccff00] font-bold">{bat.fours}</td>
                      <td className="px-4 py-3.5 text-right text-[#ccff00] font-black">{bat.sixes}</td>
                      <td className="px-4 py-3.5 text-right text-slate-405">
                        {bat.balls > 0 ? ((bat.runs / bat.balls) * 100).toFixed(1) : '–'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bowling Card */}
          <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
            <div className="bg-black/60 px-5 py-4 border-b border-white/10">
              <h4 className="font-display font-black text-white uppercase tracking-wider text-xs">Bowling Card: {match.team2.name}</h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40 text-slate-400 uppercase tracking-widest text-[9px] font-black">
                    <th className="px-5 py-3.5">Bowler</th>
                    <th className="px-4 py-3.5 text-right">Overs</th>
                    <th className="px-4 py-3.5 text-right">Maidens</th>
                    <th className="px-4 py-3.5 text-right">Runs Conceded</th>
                    <th className="px-4 py-3.5 text-right">Wickets</th>
                    <th className="px-4 py-3.5 text-right">Economy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {match.team1.bowlingCard.map((bowl, idx) => (
                    <tr key={idx} className="hover:bg-white/5 text-slate-300">
                      <td className="px-5 py-3.5 font-sans font-black text-white uppercase tracking-wide">{bowl.playerName}</td>
                      <td className="px-4 py-3.5 text-right text-slate-200">{bowl.overs.toFixed(1)}</td>
                      <td className="px-4 py-3.5 text-right text-slate-450">{bowl.maidens}</td>
                      <td className="px-4 py-3.5 text-right text-slate-205">{bowl.runs}</td>
                      <td className="px-4 py-3.5 text-right text-red-500 font-extrabold">{bowl.wickets}</td>
                      <td className="px-4 py-3.5 text-right text-[#ccff00] font-black">
                        {bowl.overs > 0 ? (bowl.runs / bowl.overs).toFixed(2) : '–'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'commentary' && (
        <div className="rounded-xl border border-white/10 bg-black/20 p-5 font-sans" id="scorecard-commentary-tab">
          <h4 className="font-display font-black text-white uppercase border-b border-white/10 pb-3 mb-4 tracking-wider text-xs">
            🎙️ Live Ball-by-Ball Commentary Timeline
          </h4>

          {match.ballByBallHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm italic font-medium uppercase tracking-wider">
              Ready to bowl! Click 'Simulate Ball' to see commentary print out live.
            </div>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {match.ballByBallHistory.map((item, idx) => {
                const isBoundary = item.run === 4 || item.run === 6;
                
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all text-xs flex gap-3.5 items-start ${
                      item.isWicket
                        ? 'bg-red-950/20 border-red-900/60 shadow-lg shadow-red-950/10'
                        : isBoundary
                        ? 'bg-[#ccff00]/5 border-[#ccff00]/25'
                        : 'bg-black/30 border-white/5'
                    }`}
                  >
                    {/* Overs indicator */}
                    <span className="shrink-0 rounded bg-[#ccff00]/10 px-2.5 py-1 text-center font-mono font-black text-[#ccff00] border border-[#ccff00]/20 select-none min-w-[50px] text-[10px]">
                      {item.overNumber}.{item.ballOfOver}
                    </span>

                    {/* Commentary body text */}
                    <div className="space-y-1 grow">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white text-xs uppercase tracking-wide">
                          {item.bowlerName} to {item.batsmanName}
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded-none font-mono font-black text-[9px] tracking-wider uppercase ${
                          item.isWicket 
                            ? 'bg-red-600 text-white' 
                            : item.run === 6
                            ? 'bg-[#ccff00] text-[#061a12]'
                            : item.run === 4
                            ? 'bg-emerald-500 text-black'
                            : 'bg-white/10 text-slate-300'
                        }`}>
                          {item.isWicket ? 'WICKET !' : `${item.run} RUNS`}
                        </span>
                      </div>
                      
                      <p className="text-slate-300 font-sans leading-relaxed text-xs">
                        {item.commentary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
