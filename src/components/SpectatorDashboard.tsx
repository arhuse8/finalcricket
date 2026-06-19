import React, { useState } from 'react';
import { ArrowLeft, Activity, Star, Eye, Tv, Sparkles, Heart } from 'lucide-react';
import { Match } from '../types';
import WagonWheel from './WagonWheel';

interface SpectatorDashboardProps {
  liveMatch: Match;
  setCurrentSimulatedView: (v: 'list' | 'detail') => void;
  onUnlockRequest: () => void;
}

export default function SpectatorDashboard({
  liveMatch,
  setCurrentSimulatedView,
  onUnlockRequest
}: SpectatorDashboardProps) {
  const [fanCheers, setFanCheers] = useState<{ team1: number; team2: number }>({ team1: 142, team2: 89 });
  const [cheerCooldown, setCheerCooldown] = useState(false);
  const [votedTeam, setVotedTeam] = useState<string | null>(null);

  const calculateCRR = () => {
    const totalBalls = (liveMatch.team1.score.overs * 6) + liveMatch.team1.score.balls;
    if (totalBalls === 0) return "0.00";
    return ((liveMatch.team1.score.runs / totalBalls) * 6).toFixed(2);
  };

  const calculateProjected = () => {
    const totalBalls = (liveMatch.team1.score.overs * 6) + liveMatch.team1.score.balls;
    if (totalBalls === 0) return 0;
    const crr = liveMatch.team1.score.runs / totalBalls;
    return Math.round(crr * liveMatch.oversLimit * 6);
  };

  // Safe prediction formula
  const getWinProbability = () => {
    const team1Runs = liveMatch.team1.score.runs;
    const team1Wickets = liveMatch.team1.score.wickets;
    const isSecondInnings = liveMatch.isFirstInningsComplete;
    
    if (!isSecondInnings) {
      // First Innings simulation probability 
      const crr = parseFloat(calculateCRR());
      let p = 50 + (crr * 2) - (team1Wickets * 8);
      if (p > 92) p = 92;
      if (p < 8) p = 8;
      return Math.round(p);
    } else {
      // Second Innings chase probability
      const target = liveMatch.targetRuns || 120;
      const leftRuns = target - team1Runs;
      const totalBalls = (liveMatch.team1.score.overs * 6) + liveMatch.team1.score.balls;
      const ballsLeft = (liveMatch.oversLimit * 6) - totalBalls;
      
      if (leftRuns <= 0) return 100;
      if (ballsLeft <= 0 && leftRuns > 0) return 0;
      if (team1Wickets >= 10) return 0;

      const rrr = (leftRuns / ballsLeft) * 6;
      let p = 100 - (rrr * 12) + (10 - team1Wickets) * 3;
      if (p > 99) p = 99;
      if (p < 1) p = 1;
      return Math.round(p);
    }
  };

  const winBiasT1 = getWinProbability();
  const winBiasT2 = 100 - winBiasT1;

  const handleCheer = (team: 'team1' | 'team2') => {
    if (cheerCooldown) return;
    setFanCheers(prev => ({ ...prev, [team]: prev[team] + 1 }));
    setCheerCooldown(true);
    setTimeout(() => setCheerCooldown(false), 900);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left" id="spectator-view-container">
      {/* Left Columns: Real-Time Scorecard, Batsmen/Bowlers stats, & Live commentary feed */}
      <div className="xl:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              ⚡ LIVE SPECTATOR DASHBOARD
            </span>
            <h3 className="font-display text-2xl font-black text-slate-800 uppercase tracking-tight mt-1.5 flex items-center gap-1.5">
              <span>📡</span> Broadcast Arena
            </h3>
          </div>
          
          <button
            onClick={() => setCurrentSimulatedView('list')}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-[10px] uppercase font-black tracking-widest cursor-pointer border border-slate-200"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Matches</span>
          </button>
        </div>

        {/* Hero Scorecard Widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden" id="live-hero-card">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
          
          <div className="relative flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-5">
            <span className="flex items-center gap-1.5 rounded bg-red-600 px-3 py-1 text-[10px] font-black text-white tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              BROADCAST LIVE
            </span>
            <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">{liveMatch.title}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Team Display */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-2xl shadow-md border border-amber-300">
                🏏
              </div>
              <div className="text-left">
                <h3 className="font-display text-2xl font-black text-slate-900 leading-none">{liveMatch.team1.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{liveMatch.venue}</p>
              </div>
            </div>

            {/* Live Scores */}
            <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <div className="text-left md:text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CHASING TARGET RUNS</span>
                <span className="font-mono text-3xl font-black text-slate-800 flex items-baseline gap-1 mt-0.5">
                  {liveMatch.team1.score.runs}
                  <span className="text-3xl text-slate-300 font-semibold">/</span>
                  {liveMatch.team1.score.wickets}
                </span>
              </div>

              <div className="flex flex-col border-l border-slate-200 pl-4 text-left">
                <span className="font-mono text-xs font-black text-slate-700">
                  OVERS: {liveMatch.team1.score.overs}.{liveMatch.team1.score.balls}
                  <span className="text-slate-400 font-normal"> / {liveMatch.oversLimit} MAX</span>
                </span>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1 font-mono">
                  {liveMatch.isFirstInningsComplete ? 'SECOND INNINGS' : 'FIRST INNINGS'}
                </span>
              </div>
            </div>
          </div>

          {liveMatch.tossResult && (
            <p className="mt-5 text-xs italic text-slate-600 border-l-2 border-blue-500 pl-3 bg-slate-50 py-2.5 shadow-inner rounded-r">
              🏏 {liveMatch.tossResult}
            </p>
          )}
        </div>

        {/* Run Rate Prediction Info Banner */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Current Run Rate (CRR)</span>
            <span className="font-mono text-2xl font-black text-slate-800 mt-1 block">
              {calculateCRR()}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 block">Projected Runs (Based on CRR)</span>
            <span className="font-mono text-2xl font-black text-blue-700 mt-1 block">
              {calculateProjected()}
            </span>
          </div>
        </div>

        {/* Star Players State Widget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Batsmen details */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <span>🏏</span> Batsmen on Strike
            </h4>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between font-bold text-slate-400 pb-1 border-b border-dashed border-slate-100">
                <span>Batter</span>
                <span>Runs (Balls)</span>
              </div>
              <div className="flex justify-between font-bold text-blue-600 bg-blue-50/50 p-2 rounded-lg">
                <span className="flex items-center gap-1">
                  {liveMatch.miniScore.batsman1.name} 
                  <span className="text-amber-500 text-[10px] animate-pulse">★</span>
                </span>
                <span>{liveMatch.miniScore.batsman1.runs} ({liveMatch.miniScore.batsman1.balls})</span>
              </div>
              <div className="flex justify-between text-slate-600 p-2">
                <span>{liveMatch.miniScore.batsman2.name}</span>
                <span>{liveMatch.miniScore.batsman2.runs} ({liveMatch.miniScore.batsman2.balls})</span>
              </div>
            </div>
          </div>

          {/* Bowler Details */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <span>🥎</span> Active Bowler
            </h4>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between font-bold text-slate-400 pb-1 border-b border-dashed border-slate-100">
                <span>Bowler</span>
                <span>Overs (Runs/Wkts)</span>
              </div>
              <div className="flex justify-between text-slate-800 bg-slate-50 p-2 rounded-lg font-bold">
                <span>{liveMatch.miniScore.bowler.name}</span>
                <span>{liveMatch.miniScore.bowler.overs} ({liveMatch.team1.score.runs}/{liveMatch.team1.score.wickets})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Commentary Feed */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" /> Live Broadcast Commentary
            </h4>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">Sync: Realtime</span>
          </div>

          <div className="space-y-4 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
            {liveMatch.ballByBallHistory.length > 0 ? (
              liveMatch.ballByBallHistory.map((history, idx) => (
                <div key={idx} className="text-xs flex gap-3 border-b border-slate-50 last:border-none pb-3 last:pb-0">
                  <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono font-black shrink-0 h-fit self-start">
                    {history.overNumber}.{history.ballOfOver}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {history.batsmanName} faced {history.bowlerName} ({history.run} runs)
                    </span>
                    <p className="text-slate-500 leading-relaxed mt-0.5">{history.commentary}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">
                Waiting for the tournament commentators to file real-time feedback overs...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Wagon Wheel, Live Win Predictor, and Fan Cheer Poll */}
      <div className="space-y-6">
        {/* Wagon Wheel Visualizer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest block font-mono">RADIAL SHOT SPREAD</span>
          <h4 className="font-display font-black text-slate-900 text-base uppercase tracking-tight mt-1 flex items-center gap-1.5">
            <span>🎯</span> Match Wagon Wheel
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 mb-4 leading-normal font-medium">
            Visual SVG representation of boundary hits, drives, and run dispersion points on the pitch.
          </p>
          
          <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
            <WagonWheel />
          </div>
        </div>

        {/* Win Predictor */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-[-10px] text-7xl opacity-5 select-none font-black text-blue-700">🏆</div>
          <span className="bg-blue-600 text-white font-black uppercase text-[8px] tracking-widest px-2 py-0.5 rounded font-mono">STATISTICAL METRIC</span>
          
          <h4 className="font-display font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 mt-3.5 mb-1.5">
            <Activity className="h-4 w-4 text-blue-600" />
            Live Victory Predictor
          </h4>
          <p className="text-[11px] text-slate-500 mb-4 leading-normal font-medium">
            Recalculated instantly on dynamic run updates, overs remaining, and wicket density metrics.
          </p>

          <div className="space-y-3.5 font-mono text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>{liveMatch.team1.shortName} Live Probability</span>
                <span className="text-blue-600 font-black">{winBiasT1}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" style={{ width: `${winBiasT1}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>{liveMatch.team2.shortName} Live Probability</span>
                <span className="text-slate-500 font-semibold">{winBiasT2}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full rounded-full" style={{ width: `${winBiasT2}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Fan Zone cheer meter */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest block font-mono">LIVE CHEER BOARD</span>
          <h4 className="font-display font-black text-slate-900 text-base uppercase tracking-tight mt-1 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-rose-500" />
            Fan Zone Pulse
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 mb-4 leading-normal font-medium">
            Cheer for your team in real-time! Tap below to boost your team's live cheer bias.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => handleCheer('team1')}
              disabled={cheerCooldown}
              className="p-3 border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 rounded-xl text-center active:scale-95 transition-all cursor-pointer group"
            >
              <Heart className="h-4 w-4 text-blue-500 mx-auto group-hover:scale-125 transition-transform" />
              <span className="block font-bold text-slate-800 text-sm mt-1">{liveMatch.team1.shortName}</span>
              <span className="text-xs font-mono font-black text-blue-600">{fanCheers.team1} Cheers</span>
            </button>
            <button
              onClick={() => handleCheer('team2')}
              disabled={cheerCooldown}
              className="p-3 border border-slate-200 hover:border-red-500 bg-slate-50 hover:bg-rose-50 rounded-xl text-center active:scale-95 transition-all cursor-pointer group"
            >
              <Heart className="h-4 w-4 text-red-500 mx-auto group-hover:scale-125 transition-transform" />
              <span className="block font-bold text-slate-800 text-sm mt-1">{liveMatch.team2.shortName}</span>
              <span className="text-xs font-mono font-black text-red-650">{fanCheers.team2} Cheers</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-4 p-2 bg-amber-50 rounded-xl border border-amber-100">
            <span className="text-[10px] text-slate-500 leading-normal">
              🔑 Want to simulate run rates, trigger wickets, or configure live scoreboard values? Select the <strong>Developer (Admin) Mode</strong> toggle at the top of the interface screen.
            </span>
          </div>
        </div>

        {/* Security / System Access Notice */}
        <div className="text-center py-2">
          <p className="text-[10px] text-slate-400 font-medium">
            APNA CRICKET SYSTEM ACCESS • SECURE BROADCAST CHANNELS
          </p>
        </div>
      </div>
    </div>
  );
}
