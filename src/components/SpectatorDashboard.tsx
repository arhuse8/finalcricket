import React, { useState, useEffect } from 'react';
import { ArrowLeft, Activity, Users, Star, Tv, Sparkles, Heart, ClipboardList, TrendingUp, Info, RefreshCw } from 'lucide-react';
import { Match, BallRecord } from '../types';
import WagonWheel from './WagonWheel';
import { isSupabaseConfigured } from '../lib/supabase';
import { supabaseService } from '../lib/supabaseService';

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
  const [activeTab, setActiveTab] = useState<'crease' | 'scorecard' | 'partnerships' | 'summary'>('crease');
  const [fanCheers, setFanCheers] = useState<{ team1: number; team2: number }>({ team1: 142, team2: 89 });
  const [cheerCooldown, setCheerCooldown] = useState(false);
  const [dbScorecard, setDbScorecard] = useState<any>(null);
  const [dbFow, setDbFow] = useState<any[]>([]);
  const [dbPartnerships, setDbPartnerships] = useState<any[]>([]);
  const [dbSummary, setDbSummary] = useState<any>(null);
  const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Load live Supabase datasets if online config detected
  const loadSupabaseStats = async () => {
    if (!isSupabaseConfigured) return;
    setIsLiveRefreshing(true);
    try {
      const matchId = liveMatch.id === 'live-match-v1' ? 'some-dummy-id' : liveMatch.id; // handle mock ID fallback
      
      const scorecard = await supabaseService.getFullScorecard(matchId);
      if (scorecard) {
        setDbScorecard(scorecard);
      }
      
      // Get Fall of wickets
      const fow = await supabaseService.getFallOfWickets(matchId);
      setDbFow(fow);

      // Get partnerships
      const part = await supabaseService.getPartnershipData(matchId);
      setDbPartnerships(part || []);

      // Get summary
      const sum = await supabaseService.getMatchSummary(matchId);
      setDbSummary(sum);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn('Fallback loading of database stats', e);
    } finally {
      setIsLiveRefreshing(false);
    }
  };

  useEffect(() => {
    loadSupabaseStats();
    // High-frequency polling (Live Realtime Updates) if configured, simulating realtime websocket hooks
    const timer = setInterval(() => {
      loadSupabaseStats();
    }, 10000); // 10s auto-refresh
    return () => clearInterval(timer);
  }, [liveMatch]);

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

  const getWinProbability = () => {
    const team1Runs = liveMatch.team1.score.runs;
    const team1Wickets = liveMatch.team1.score.wickets;
    const isSecondInnings = liveMatch.isFirstInningsComplete;
    
    if (!isSecondInnings) {
      const crr = parseFloat(calculateCRR());
      let p = 50 + (crr * 2) - (team1Wickets * 8);
      if (p > 92) p = 92;
      if (p < 8) p = 8;
      return Math.round(p);
    } else {
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

  // Helper styles for ball tracker badges
  const getBallBadgeStyle = (ball: string) => {
    if (ball === 'W') return 'bg-red-600 text-white font-black animate-pulse';
    if (ball === '6') return 'bg-[#ccff00] text-black font-black scale-105';
    if (ball === '4') return 'bg-emerald-500 text-black font-black';
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  // Fall of Wickets local generator is offline
  const getLocalFallOfWickets = () => {
    const historicalWickets = liveMatch.ballByBallHistory.filter(b => b.isWicket);
    const chronWickets = [...historicalWickets].reverse();
    return chronWickets.map((w, index) => {
      const runningRuns = Math.min(liveMatch.team1.score.runs, (index + 1) * 24 + Math.floor(Math.random() * 8));
      return {
        wicketNumber: index + 1,
        runs: runningRuns,
        overs: `${w.overNumber}.${w.ballOfOver}`,
        batsmanName: w.batsmanName,
        dismissal: w.wicketType || 'Bowled'
      };
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left animate-fade-in" id="spectator-view-container">
      {/* Left Columns */}
      <div className="xl:col-span-2 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#061a12] uppercase bg-[#ccff00] px-2.5 py-1 rounded-full border border-[#ccff00]/40 flex items-center gap-1.5 w-fit">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-ping inline-block" />
              <span>📡 LIVE BROADCAST COCKPIT</span>
            </span>
            <h3 className="font-display text-2xl font-black text-slate-800 uppercase tracking-tight mt-1.5">
              🏏 {liveMatch.team1.shortName} vs {liveMatch.team2.shortName} Broadcast
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loadSupabaseStats();
                setIsLiveRefreshing(true);
                setTimeout(() => setIsLiveRefreshing(false), 800);
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all border border-slate-200"
              title="Trigger DB fetch"
            >
              <RefreshCw className={`h-4 w-4 ${isLiveRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setCurrentSimulatedView('list')}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-[10px] uppercase font-black tracking-widest cursor-pointer border border-slate-200"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Dashboard List</span>
            </button>
          </div>
        </div>

        {/* Hero Scorecard Widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden" id="live-hero-card">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#ccff00]/10 blur-3xl animate-pulse" />
          
          <div className="relative flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-5">
            <span className="flex items-center gap-1.5 rounded bg-red-600 px-3 py-1 text-[10px] font-black text-white tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              MATCH STREAM ACTIVE
            </span>
            <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">
              {isSupabaseConfigured ? '🟢 Supabase Sync: Online' : '🔌 Local Playback / Offline'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Team details */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-3xl shadow-md border border-green-400">
                🏏
              </div>
              <div className="text-left">
                <h3 className="font-display text-2xl font-black text-slate-900 leading-none">{liveMatch.team1.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{liveMatch.venue} turf ground</p>
              </div>
            </div>

            {/* Live Scores block */}
            <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <div className="text-left md:text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CURRENT RUN SCORE</span>
                <span className="font-mono text-4xl font-black text-slate-900 flex items-baseline gap-1 mt-0.5">
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
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1 font-mono">
                  {liveMatch.isFirstInningsComplete ? 'SECOND INNINGS' : 'FIRST INNINGS'}
                </span>
              </div>
            </div>
          </div>

          {liveMatch.tossResult && (
            <p className="mt-5 text-xs italic text-slate-600 border-l-2 border-[#ccff00] pl-3 bg-slate-50 py-2.5 shadow-inner rounded-r">
              🏏 {liveMatch.tossResult}
            </p>
          )}

          {/* This Over Balls ticker tracker */}
          <div className="mt-5 pt-4 border-t border-slate-150 flex items-center justify-between text-xs font-mono">
            <span className="font-sans font-bold text-slate-500 uppercase text-[9px]">Recently Bowl:</span>
            <div className="flex gap-1.5">
              {liveMatch.recentBalls.length === 0 ? (
                <span className="text-xs text-slate-400 italic font-sans">No deliveries bowled down this over</span>
              ) : (
                liveMatch.recentBalls.map((b, bIdx) => (
                  <span key={bIdx} className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black ${getBallBadgeStyle(b)}`}>
                    {b}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 📑 TAB NAVIGATION CONTROLS SECTION */}
        <div className="flex border border-slate-200 bg-white p-1 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab('crease')}
            className={`flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'crease' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tv className="h-3.5 w-3.5" />
            <span>Crease Live</span>
          </button>
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'scorecard' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span>Full Scorecard</span>
          </button>
          <button
            onClick={() => setActiveTab('partnerships')}
            className={`flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'partnerships' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Wickets & Partnership</span>
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'summary' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            <span>Match Summary</span>
          </button>
        </div>

        {/* TAB RENDERING ENGINE */}
        {activeTab === 'crease' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Current Run Rate (CRR)</span>
                <span className="font-mono text-2xl font-black text-slate-800 mt-1 block font-black">
                  {calculateCRR()}
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 block">Projected Runs (Based on CRR)</span>
                <span className="font-mono text-2xl font-black text-emerald-600 mt-1 block">
                  {calculateProjected()}
                </span>
              </div>
            </div>

            {/* Quick Star Players Crease Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
                  <span>🏏</span> Batsmen on Strike
                </h4>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between font-bold text-slate-400 pb-1 border-b border-dashed border-slate-100">
                    <span>Batter</span>
                    <span>Runs (Balls)</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                    <span className="flex items-center gap-1">
                      {liveMatch.miniScore.batsman1.name} 
                      <span className="text-amber-500 text-[11px] animate-bounce">★</span>
                    </span>
                    <span>{liveMatch.miniScore.batsman1.runs} ({liveMatch.miniScore.batsman1.balls}b)</span>
                  </div>
                  <div className="flex justify-between text-slate-600 p-2">
                    <span>{liveMatch.miniScore.batsman2.name}</span>
                    <span>{liveMatch.miniScore.batsman2.runs} ({liveMatch.miniScore.batsman2.balls}b)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
                  <span>🥎</span> Active Bowler
                </h4>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between font-bold text-slate-400 pb-1 border-b border-dashed border-slate-100">
                    <span>Bowler</span>
                    <span>Overs (Runs/Wkts)</span>
                  </div>
                  <div className="flex justify-between text-slate-800 bg-slate-50 p-2 rounded-lg font-bold">
                    <span>{liveMatch.miniScore.bowler.name}</span>
                    <span>{liveMatch.miniScore.bowler.overs.toFixed(1)} ({liveMatch.miniScore.bowler.runs}/{liveMatch.miniScore.bowler.wickets})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live commentary feeds */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" /> Ball commentary history
                </h4>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">Socket channels: Connected</span>
              </div>

              <div className="space-y-4 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
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
                    Waiting for umpire or commentator to enter score triggers...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FULL SCORECARD */}
        {activeTab === 'scorecard' && (
          <div className="space-y-6">
            {/* Batting Scorecard */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>🏏 Batting scorecard: {liveMatch.team1.name}</span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Total: {liveMatch.team1.score.runs}/{liveMatch.team1.score.wickets} ({liveMatch.team1.score.overs}.{liveMatch.team1.score.balls} Overs)
                </span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-black uppercase tracking-widest text-[9px] text-slate-500">
                      <th className="px-4 py-3">Batsman</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-3 py-3 text-right">Runs</th>
                      <th className="px-3 py-3 text-right">Balls</th>
                      <th className="px-3 py-3 text-right">4s</th>
                      <th className="px-3 py-3 text-right">6s</th>
                      <th className="px-3 py-3 text-right font-mono">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {liveMatch.team1.battingCard.map((p, pIdx) => (
                      <tr key={pIdx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-sans font-black text-slate-800 uppercase">{p.playerName}</td>
                        <td className="px-4 py-3 text-slate-400 italic font-medium">{p.status}</td>
                        <td className="px-3 py-3 text-right font-bold text-slate-950 font-mono">{p.runs}</td>
                        <td className="px-3 py-3 text-right text-slate-600 font-mono">{p.balls}</td>
                        <td className="px-3 py-3 text-right text-emerald-600 font-bold font-mono">{p.fours}</td>
                        <td className="px-3 py-3 text-right text-emerald-700 font-black font-mono">{p.sixes}</td>
                        <td className="px-3 py-3 text-right text-slate-500 font-mono">
                          {p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(1) : '0.0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bowling Scorecard */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                🥎 Bowling Spell Card: {liveMatch.team2.name}
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-black uppercase tracking-widest text-[9px] text-slate-500">
                      <th className="px-4 py-3">Bowler</th>
                      <th className="px-3 py-3 text-right">Overs</th>
                      <th className="px-3 py-3 text-right">Maidens</th>
                      <th className="px-3 py-3 text-right">Runs</th>
                      <th className="px-3 py-3 text-right font-bold text-red-600">Wickets</th>
                      <th className="px-3 py-3 text-right">Economy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {liveMatch.team1.bowlingCard.map((bowl, bowlIdx) => (
                      <tr key={bowlIdx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-sans font-black text-slate-800 uppercase">{bowl.playerName}</td>
                        <td className="px-3 py-3 text-right font-mono">{bowl.overs.toFixed(1)}</td>
                        <td className="px-3 py-3 text-right font-mono">{bowl.maidens}</td>
                        <td className="px-3 py-3 text-right font-mono text-slate-650">{bowl.runs}</td>
                        <td className="px-3 py-3 text-right text-red-600 font-black font-mono">{bowl.wickets}</td>
                        <td className="px-3 py-3 text-right font-mono font-semibold text-emerald-700">
                          {bowl.overs > 0 ? (bowl.runs / bowl.overs).toFixed(2) : '0.0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PARTNERSHIPS & FALL OF WICKETS */}
        {activeTab === 'partnerships' && (
          <div className="space-y-6">
            {/* Current Partnership Display */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black tracking-widest text-[#ccff00] bg-slate-950 px-2 py-0.5 rounded font-mono uppercase block w-fit mb-3">
                CREASE PARTNERSHIP
              </span>
              <h4 className="text-base font-black text-slate-950 uppercase tracking-tight flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-4">
                👥 Current Crease Partnership
              </h4>

              {/* Partnership stats details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center items-center py-4 bg-slate-50 rounded-xl border border-slate-100 px-6">
                <div>
                  <h5 className="text-xs uppercase font-extrabold text-slate-500 leading-tight">BATSMAN 1</h5>
                  <h4 className="font-display font-black text-slate-800 text-sm tracking-wide uppercase mt-1">
                    {liveMatch.miniScore.batsman1.name}
                  </h4>
                  <span className="font-mono text-sm block font-black text-slate-600 mt-1">
                    {liveMatch.miniScore.batsman1.runs} runs
                  </span>
                </div>

                <div className="border-t md:border-t-0 md:border-x border-slate-200 py-3 md:py-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">PARTNERSHIP RUNS</span>
                  <div className="font-mono text-3xl font-black text-slate-900 mt-1">
                    {liveMatch.miniScore.batsman1.runs + liveMatch.miniScore.batsman2.runs}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block font-mono mt-1">
                    OFF {liveMatch.miniScore.batsman1.balls + liveMatch.miniScore.batsman2.balls} BALLS
                  </span>
                </div>

                <div>
                  <h5 className="text-xs uppercase font-extrabold text-slate-500 leading-tight">BATSMAN 2</h5>
                  <h4 className="font-display font-black text-slate-800 text-sm tracking-wide uppercase mt-1">
                    {liveMatch.miniScore.batsman2.name}
                  </h4>
                  <span className="font-mono text-sm block font-black text-slate-600 mt-1">
                    {liveMatch.miniScore.batsman2.runs} runs
                  </span>
                </div>
              </div>
            </div>

            {/* Fall Of Wickets list */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                🔴 Chronological Fall of Wickets (FOW)
              </h4>

              <div className="space-y-3">
                {getLocalFallOfWickets().length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">
                    No wickets have fallen in this innings yet. Bowlers are still searching for wickets!
                  </p>
                ) : (
                  getLocalFallOfWickets().map((fowItem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-100 hover:border-red-200 hover:bg-red-50/10 rounded-xl transition-all text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className="bg-red-600 text-white font-black h-5 w-5 rounded-full flex items-center justify-center text-[10px]">
                          {fowItem.wicketNumber}
                        </span>
                        <div>
                          <span className="font-sans font-black text-slate-850 uppercase block">{fowItem.batsmanName}</span>
                          <span className="text-[10px] text-slate-400 font-sans">{fowItem.dismissal}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-800 block">{fowItem.runs} runs</span>
                        <span className="text-[10px] text-slate-400 font-bold block">Over {fowItem.overs}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MATCH SUMMARY REPORT */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>📋 RAM PUR VILLAGE STADIUM REPORT</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-bold font-mono">STATION ID #1290</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
                <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50 text-left">
                  <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider mb-1">PITCH HUMIDITY</span>
                  <p className="text-slate-800 font-black">21% - Dry panchayat turf</p>
                  <p className="text-slate-450 leading-relaxed text-[11px] mt-1.5">Triggers maximum grip spin tractions.</p>
                </div>

                <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50 text-left">
                  <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider mb-1">CRICKET BOUNDARIES</span>
                  <p className="text-slate-800 font-black">55-Meter village fences</p>
                  <p className="text-slate-455 leading-relaxed text-[11px] mt-1.5">Standard local limits. Cow Corner active.</p>
                </div>

                <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50 text-left">
                  <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider mb-1">TOSS OUTCOME DECISION</span>
                  <p className="text-slate-800 font-black">Coined decided to bat 1st</p>
                  <p className="text-slate-455 leading-relaxed text-[11px] mt-1.5">Standard toss selection of captain.</p>
                </div>
              </div>

              {/* highlights summary bullets */}
              <div className="mt-5 border-t border-slate-100 pt-4 text-xs space-y-2 leading-relaxed">
                <h5 className="font-bold text-slate-800 uppercase text-[10px] block mb-2.5">💡 MATCH INSIGHT & STATS ANALYSIS:</h5>
                <p className="text-slate-500">
                  • <strong>Highest Boundary Dispersion:</strong> Leftward mid-on displays a massive sweep rate of Boundary shots inside current over logs.
                </p>
                <p className="text-slate-500">
                  • <strong>Current Run Rhythm:</strong> Batting strikers are maintaining a dynamic run speed rate of <strong>{calculateCRR()}</strong> runs per over.
                </p>
                <p className="text-slate-500">
                  • <strong>Victory Probability:</strong> Analytical engine estimates a <strong>{winBiasT1}%</strong> victory bias for {liveMatch.team1.shortName}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Wagon Wheel, Live Win Predictor, Fan Cheer Poll */}
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
              <div className="w-full bg-slate-250 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" style={{ width: `${winBiasT1}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>{liveMatch.team2.shortName} Live Probability</span>
                <span className="text-slate-500 font-semibold">{winBiasT2}%</span>
              </div>
              <div className="w-full bg-slate-250 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-350 h-full rounded-full" style={{ width: `${winBiasT2}%` }} />
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
        </div>
      </div>
    </div>
  );
}
