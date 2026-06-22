import React, { useState } from 'react';
import { Player } from '../types';
import { 
  Search, Award, Users, Trophy, Shield, Bell, MapPin, Play, 
  ChevronRight, Volume2, Sparkles, Flame, Star, RefreshCw, BarChart2,
  TrendingUp, Compass, Target, HelpCircle, Activity, PlayCircle, Eye, Sliders
} from 'lucide-react';

interface PlayerStatsViewProps {
  players: Player[];
  onAddPlayer?: (player: Player) => void;
  teams: any[];
}

// Full interactive model for the players available in the scorecard
interface InteractivePlayerForm {
  name: string;
  avatar: string;
  team: string;
  role: string;
  score: number;
  avg: string;
  sr: string;
  status: string;
  scores: number[];
  traits: {
    batting: number;
    power: number;
    consistency: number;
    fitness: number;
    bowling: number;
  };
}

export default function PlayerStatsView({ players, onAddPlayer, teams }: PlayerStatsViewProps) {
  // Sidebar state
  const [selectedCategory, setSelectedCategory] = useState<'overview' | 'trending' | 'players' | 'teams' | 'tournaments' | 'records' | 'insights' | 'compare'>('overview');
  
  // Custom interactive selection
  const [selectedPlayerName, setSelectedPlayerName] = useState('Virat Kohli');
  const [searchQuery, setSearchQuery] = useState('');
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [language, setLanguage] = useState('English (India)');

  // Form states for recruitment of custom local heroes
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerTeamId, setNewPlayerTeamId] = useState(teams[0]?.id || 'RAMPUR');
  const [newPlayerRole, setNewPlayerRole] = useState<'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper'>('All-Rounder');
  const [newPlayerBatting, setNewPlayerBatting] = useState<'Right-hand bat' | 'Left-hand bat'>('Right-hand bat');
  const [newPlayerBowling, setNewPlayerBowling] = useState<'Right-arm fast' | 'Right-arm spin' | 'Left-arm fast' | 'Left-arm spin'>('Right-arm fast');
  const [initialRuns, setInitialRuns] = useState<number>(0);
  const [initialWickets, setInitialWickets] = useState<number>(0);
  const [recruitmentDoneMsg, setRecruitmentDoneMsg] = useState('');

  // All interactive players with their dataset corresponding to the screenshot details
  const playersFormDatabase: Record<string, InteractivePlayerForm> = {
    'Virat Kohli': {
      name: 'Virat Kohli',
      avatar: '👑',
      team: 'RCB',
      role: 'Top Batter',
      score: 785,
      avg: '58.12',
      sr: '145.32',
      status: 'HOT 🔥',
      scores: [12, 45, 109, 37, 76, 1, 61, 50, 86, 42],
      traits: { batting: 98, power: 91, consistency: 96, fitness: 92, bowling: 35 }
    },
    'Rohit Sharma': {
      name: 'Rohit Sharma',
      avatar: '🏏',
      team: 'MI',
      role: 'Hitman Captain',
      score: 722,
      avg: '52.12',
      sr: '138.45',
      status: 'STABLE 👍',
      scores: [82, 14, 45, 109, 23, 67, 85, 33, 10, 52],
      traits: { batting: 96, power: 95, consistency: 88, fitness: 85, bowling: 42 }
    },
    'Shubman Gill': {
      name: 'Shubman Gill',
      avatar: '⚡',
      team: 'GT',
      role: 'Opening Anchor',
      score: 698,
      avg: '51.33',
      sr: '142.18',
      status: 'STEADY 💪',
      scores: [45, 78, 12, 104, 34, 56, 89, 41, 15, 68],
      traits: { batting: 94, power: 88, consistency: 91, fitness: 90, bowling: 25 }
    },
    'Suryakumar Yadav': {
      name: 'Suryakumar Yadav',
      avatar: '👽',
      team: 'MI',
      role: 'Best Impact',
      score: 650,
      avg: '48.12',
      sr: '171.20',
      status: 'ON FIRE ⚡',
      scores: [102, 48, 8, 83, 14, 52, 64, 117, 2, 73],
      traits: { batting: 92, power: 98, consistency: 84, fitness: 89, bowling: 10 }
    },
    'Ruturaj Gaikwad': {
      name: 'Ruturaj Gaikwad',
      avatar: '🦁',
      team: 'CSK',
      role: 'Classic Opener',
      score: 610,
      avg: '49.25',
      sr: '140.33',
      status: 'BRIGHT ✨',
      scores: [54, 72, 38, 98, 10, 44, 62, 51, 80, 20],
      traits: { batting: 95, power: 86, consistency: 92, fitness: 91, bowling: 20 }
    },
    'Jasprit Bumrah': {
      name: 'Jasprit Bumrah',
      avatar: '🥎',
      team: 'MI',
      role: 'Top Bowler',
      score: 34,
      avg: 'Wickets: 34',
      sr: 'Econ. 5.80',
      status: 'LETHAL 🔥',
      scores: [3, 1, 4, 0, 2, 5, 2, 2, 3, 4],
      traits: { batting: 25, power: 45, consistency: 98, fitness: 96, bowling: 99 }
    }
  };

  // Merge custom players from the global live state so they are fully interactive
  players.forEach((p) => {
    // Generate team initials or lookup from teams
    const teamObj = teams.find(t => t.id === p.teamId);
    const teamShort = teamObj ? teamObj.short : p.teamId.substring(0, 3).toUpperCase();
    
    if (!playersFormDatabase[p.name]) {
      playersFormDatabase[p.name] = {
        name: p.name,
        avatar: p.role === 'Bowler' ? '♣️' : p.role === 'All-Rounder' ? '⚡' : '🦁',
        team: teamShort,
        role: p.role,
        score: p.stats.runs,
        avg: p.stats.average.toString(),
        sr: p.stats.strikeRate.toString(),
        status: 'DYNAMIC ⭐',
        scores: [p.stats.highestScore],
        traits: {
          batting: p.role === 'Bowler' ? 20 : 82,
          power: p.role === 'Bowler' ? 15 : 78,
          consistency: 75,
          fitness: 89,
          bowling: p.role === 'Batsman' ? 10 : 80
        }
      };
    }
  });

  const handleRecruitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim() || !onAddPlayer) return;

    const newP: Player = {
      id: `player-dynamic-${Date.now()}`,
      name: newPlayerName,
      teamId: newPlayerTeamId,
      role: newPlayerRole,
      battingStyle: newPlayerBatting,
      bowlingStyle: newPlayerBowling,
      stats: {
        matches: initialRuns > 0 || initialWickets > 0 ? 1 : 0,
        runs: initialRuns,
        highestScore: initialRuns,
        average: initialRuns,
        strikeRate: initialRuns > 0 ? 132 : 0,
        fifties: initialRuns >= 50 && initialRuns < 100 ? 1 : 0,
        hundreds: initialRuns >= 100 ? 1 : 0,
        wickets: initialWickets,
        bestBowling: initialWickets > 0 ? `${initialWickets}/15` : '0/0',
        economy: initialWickets > 0 ? 6.2 : 0
      }
    };

    onAddPlayer(newP);
    setRecruitmentDoneMsg(`Local Pro "${newPlayerName}" successfully drafted to Roster! ⚡`);
    setNewPlayerName('');
    setInitialRuns(0);
    setInitialWickets(0);

    setTimeout(() => {
      setRecruitmentDoneMsg('');
    }, 3000);
  };

  const currentPlayer = playersFormDatabase[selectedPlayerName] || playersFormDatabase['Virat Kohli'];

  // AI Insights Voice Reader Trigger
  const handleSpeakSpeech = () => {
    if ('speechSynthesis' in window) {
      if (voicePlaying) {
        window.speechSynthesis.cancel();
        setVoicePlaying(false);
        return;
      }
      
      const narrationText = `Welcome to the ApnaCricket Insight Center. Under today's analytical preview, ${currentPlayer.name} from team ${currentPlayer.team} has earned an overall performance rating of ${currentPlayer.traits.batting} in batting skill. His current season runs stand at ${currentPlayer.score} at an outstanding strike rate of ${currentPlayer.sr} percent. Our neural models predict a positive trajectory for upcoming local matches. Stay tuned for further intelligence updates.`;
      
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.onend = () => setVoicePlaying(false);
      utterance.onerror = () => setVoicePlaying(false);
      setVoicePlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech audio narration is not fully supported in your container browser environment. Reading live text: " + currentPlayer.name + " is on superb form!");
    }
  };

  return (
    <div className="text-white min-h-screen rounded-3xl overflow-hidden font-sans border border-slate-900 bg-[#070b13] p-1.5 sm:p-4 text-left shadow-2xl relative" id="stats-center-main-box">
      
      {/* Background Neon Spotlight Rings */}
      <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-gradient-radial from-violet-600/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-10 bottom-20 h-[300px] w-[300px] bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-[90px] pointer-events-none" />

      {/* Main Structural Adaptive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 relative z-10">
        
        {/* ================= LEFT SIDEBAR BAR (3 columns on desktop) ================= */}
        <div className="xl:col-span-3 space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-left">
              <span className="text-[10px] font-black tracking-widest text-[#93c5fd] uppercase block">CRICKET INTELLIGENCE</span>
              <h2 className="text-lg font-black font-display text-white uppercase tracking-tight mt-0.5">STATS CENTER</h2>
            </div>

            {/* Sidebar Buttons */}
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: <Compass className="h-4 w-4" />, badge: null },
                { id: 'trending', label: 'Trending', icon: <TrendingUp className="h-4 w-4" />, badge: null },
                { id: 'players', label: 'Players', icon: <Users className="h-4 w-4" />, badge: null },
                { id: 'teams', label: 'Teams', icon: <Shield className="h-4 w-4" />, badge: null },
                { id: 'tournaments', label: 'Tournaments', icon: <Trophy className="h-4 w-4" />, badge: null },
                { id: 'records', label: 'Grounds', icon: <MapPin className="h-4 w-4" />, badge: null },
                { id: 'insights', label: 'AI Insights', icon: <Sparkles className="h-4 w-4 text-emerald-400" />, badge: 'NEW' },
                { id: 'compare', label: 'Compare', icon: <Sliders className="h-4 w-4" />, badge: null }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCategory(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategory === item.id 
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-700 text-white shadow-lg shadow-violet-950/40 border-l-4 border-emerald-400' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded tracking-normal">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Play Like a Pro banner matching mockup exact design */}
            <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-slate-900 to-[#101625] p-5 shadow-sm relative overflow-hidden text-left" id="play-like-a-pro-card">
              <div className="absolute right-[-10px] bottom-[-20px] opacity-15 rotate-12 text-6xl">🏏</div>
              <span className="inline-block bg-violet-600/30 border border-violet-400/35 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-[#a5b4fc]">
                ANALYTICS PRO
              </span>
              <h4 className="font-display font-black text-white text-sm uppercase leading-tight tracking-tight mt-3">
                Play Like a Pro
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold mt-1">
                Track your performance, compare with others and improve every day.
              </p>
              
              {/* Graphic Player Illustration container */}
              <div className="my-4 h-28 bg-[#151c2d] rounded-xl flex items-center justify-center relative overflow-hidden border border-white/5">
                <div className="absolute bottom-0 right-0 h-24 w-24 bg-gradient-radial from-emerald-500/10 to-transparent blur-xl" />
                <span className="text-4xl">🦸‍♂️</span>
                <span className="absolute bottom-2 left-2 text-[9px] text-slate-500 font-mono">BATSMAN DEPTH MAP</span>
              </div>

              <button 
                onClick={() => alert('Opening advanced player performance comparison workbench!')}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black uppercase text-[10px] py-2.5 rounded-xl block text-center tracking-widest transition-all cursor-pointer shadow-md select-none"
              >
                Explore Now
              </button>
            </div>
          </div>

          {/* App download block on bottom left */}
          <div className="space-y-2 border-t border-white/5 pt-4 text-left">
            <span className="text-[11px] font-bold text-slate-400 font-sans block">ApnaCricket App</span>
            <p className="text-[10px] text-slate-500">Everything in your pocket.</p>
            <div className="flex gap-2 pt-1.5">
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Google Play Logo" 
                  className="h-8 border border-white/10 rounded-md"
                  referrerPolicy="no-referrer"
                />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="App Store Logo" 
                  className="h-8 border border-white/10 rounded-md"
                  referrerPolicy="no-referrer"
                />
              </a>
            </div>
          </div>

        </div>

        {/* ================= CENTER GRID AREA (6 columns on desktop) ================= */}
        <div className="xl:col-span-6 space-y-5">
          
          {/* 🏟️ GLOWING HERO HEADER BAR */}
          <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 p-6 shadow-xl text-left" id="insight-center-hero-card">
            
            {/* Mesh background effect mockups */}
            <div className="absolute right-[-40px] top-[-30px] h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 h-28 w-28 bg-[#ccff00]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/40 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest text-[#c7d2fe]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-time Analytical Engine</span>
                </div>
                
                <h1 className="font-display font-black text-white leading-[1.1] uppercase tracking-tight text-3xl sm:text-4xl">
                  {/* Title styling directly matching the template screenshot */}
                  APNA<span className="text-orange-500">CRICKET</span> <br />
                  <span className="text-white text-3xl font-light">INSIGHT</span> <span className="text-violet-400 font-extrabold text-3xl">CENTER</span>
                </h1>
                
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  Real-time Cricket Analytics. Smarter Insights. Better Performance.
                </p>
              </div>

              {/* Glowing Vector Batsman Silhouette Illustration */}
              <div className="h-28 w-28 shrink-0 bg-contain bg-center opacity-90 relative hidden sm:flex items-center justify-center text-5xl bg-gradient-to-tr from-violet-600/20 to-indigo-700/20 rounded-2xl border border-white/5 select-none" style={{ textShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
                🏏⚡
              </div>
            </div>

            {/* Glowing Soundwave spectrum graphic placeholder of image */}
            <div className="mt-5 border-t border-white/5 pt-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex gap-1 items-end h-6 max-w-xs overflow-hidden select-none opacity-60">
                {[4,8,12,6,18,10,30,12,3,15,22,8,25,35,16,10,24,19,8,14,3,20,12,28,6,12].map((h, i) => (
                  <span key={i} className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full shrink-0" style={{ height: `${h * 0.6}px` }} />
                ))}
              </div>

              {/* Counters bubbles */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { count: '25,426', label: 'ACTIVE PLAYERS' },
                  { count: '8,152', label: 'MATCHES TRACKED' },
                  { count: '512', label: 'TOURNAMENTS' },
                  { count: '1.2M', label: 'BALLS RECORDED' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg text-center font-mono">
                    <span className="block text-xs font-black text-white">{stat.count}</span>
                    <span className="block text-[8px] text-slate-400 font-sans tracking-wider font-extrabold">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 🌟 5 PLAYER SPOTLIGHT ROW ITEMS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { title: 'Top Batter', name: 'Virat Kohli', runs: '785 Runs', extra: 'Avg. 58.12', avatar: '🦁', color: 'border-yellow-500/25 bg-amber-500/5' },
              { title: 'Top Bowler', name: 'Jasprit Bumrah', wickets: '34 Wkt', extra: 'Econ. 5.80', avatar: '⚡', color: 'border-blue-500/25 bg-blue-500/5' },
              { title: 'Top All-Rounder', name: 'Hardik Pandya', runs: '385 Runs', extra: '22 Wickets', avatar: '🦅', color: 'border-purple-500/25 bg-purple-500/5' },
              { title: 'Top Team', name: 'Chennai Super Kings', runs: '16 Points', extra: 'NRR +1.35', avatar: '🏠', color: 'border-emerald-500/25 bg-emerald-500/5' },
              { title: 'Best Match Impact', name: 'Suryakumar Yadav', score: '94.2 Score', extra: 'vs GT • 21 May', avatar: '👑', color: 'border-sky-500/25 bg-sky-500/5' }
            ].map((spotlight, i) => (
              <div 
                key={i} 
                onClick={() => {
                  if (playersFormDatabase[spotlight.name]) {
                    setSelectedPlayerName(spotlight.name);
                  }
                }}
                className={`p-3 rounded-xl border ${spotlight.color} hover:border-violet-500 transition-all text-left cursor-pointer relative overflow-hidden`}
              >
                <span className="block text-[9px] text-[#ccff00] font-black uppercase tracking-wider">{spotlight.title}</span>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl">{spotlight.avatar}</span>
                  <div className="truncate">
                    <h5 className="font-display font-black text-xs text-white uppercase truncate">{spotlight.name}</h5>
                    <span className="block text-[10px] text-slate-300 font-mono font-bold mt-0.5">{spotlight.runs || spotlight.wickets || spotlight.score}</span>
                    <span className="block text-[8px] text-slate-500 leading-none">{spotlight.extra}</span>
                  </div>
                </div>

                <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-[#ccff00]/40" />
              </div>
            ))}
          </div>

          {/* 📊 MIDDLE BENTO GRID ROW - 3 COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Widget 1: PLAYER FORM - GRAPH */}
            <div className="md:col-span-4 bg-[#0a0f1d] border border-white/5 rounded-2xl p-4 flex flex-col justify-between text-left relative" id="form-score-bar-chart">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-[#ccff00] uppercase">PLAYER FORM - {currentPlayer.name.toUpperCase()}</span>
                <p className="text-[9px] text-slate-400 font-mono uppercase">Last 10 Innings Score Rate</p>
              </div>

              {/* Bar charts renderer */}
              <div className="h-28 flex items-end justify-between gap-1 my-4 px-1">
                {currentPlayer.scores.map((sc, idx) => {
                  const maxVal = Math.max(...currentPlayer.scores);
                  const minVal = Math.min(...currentPlayer.scores);
                  const isMin = sc === minVal;
                  const isMax = sc === maxVal;
                  const heightPercent = maxVal > 0 ? (sc / maxVal) * 90 : 10;
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Tooltip on hover */}
                      <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-white font-mono text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-15">
                        {sc} runs
                      </span>
                      {sc > 0 && (
                        <span className="text-[8px] font-mono font-bold text-slate-400 leading-none scale-90">{sc}</span>
                      )}
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          isMax ? 'bg-emerald-500' : isMin ? 'bg-red-500' : idx % 2 === 0 ? 'bg-indigo-500' : 'bg-violet-600'
                        }`}
                        style={{ height: `${Math.max(4, heightPercent)}px` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Player average stats details block */}
              <div className="grid grid-cols-3 gap-1 text-center bg-white/5 p-2 rounded-xl border border-white/5 font-mono text-xs">
                <div>
                  <span className="block text-[8px] text-slate-400 uppercase">State</span>
                  <span className="font-black text-[#ccff00] text-[10px] truncate block">{currentPlayer.status}</span>
                </div>
                <div className="border-x border-white/10">
                  <span className="block text-[8px] text-slate-400 uppercase">Average</span>
                  <span className="font-black text-white block text-[11px]">{currentPlayer.avg}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 uppercase">S.R.</span>
                  <span className="font-black text-slate-350 block text-[11px]">{currentPlayer.sr}</span>
                </div>
              </div>

              <button 
                onClick={() => alert(`Showing comprehensive batsman metrics analyzer for ${currentPlayer.name}`)}
                className="w-full mt-3 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white uppercase text-[9px] tracking-widest py-2 rounded-xl transition-colors"
              >
                View Full Profile
              </button>
            </div>

            {/* Widget 2: PERFORMANCE RADAR SPIDER CHART */}
            <div className="md:col-span-4 bg-[#0a0f1d] border border-white/5 rounded-2xl p-4 flex flex-col justify-between text-left relative" id="radar-spider-comparison-widget">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-[#ccff00] uppercase">PERFORMANCE RADAR</span>
                <p className="text-[9px] text-slate-400 font-mono uppercase">Comparison: {currentPlayer.name} vs Gaikwad</p>
              </div>

              {/* Spider Chart Drawing mockup using precise styled SVG overlapping polygons matching screenshot */}
              <div className="h-32 my-2 flex items-center justify-center relative">
                <svg className="w-28 h-28 opacity-80" viewBox="0 0 100 100">
                  {/* Pentagonal spider grids lines */}
                  <polygon points="50,10 88,38 73,82 27,82 12,38" className="stroke-slate-800 fill-none" strokeWidth="0.75" />
                  <polygon points="50,22 78,42 66,74 34,74 22,42" className="stroke-slate-800 fill-none" strokeWidth="0.75" />
                  <polygon points="50,35 68,47 60,65 40,65 32,47" className="stroke-slate-850 fill-none" strokeWidth="0.75" />
                  
                  {/* Radar axis lines */}
                  <line x1="50" y1="10" x2="50" y2="82" className="stroke-slate-800" strokeWidth="0.7" strokeDasharray="1,1" />
                  <line x1="12" y1="38" x2="88" y2="38" className="stroke-slate-800" strokeWidth="0.7" strokeDasharray="1,1" />
                  <line x1="27" y1="82" x2="50" y2="10" className="stroke-slate-800" strokeWidth="0.7" strokeDasharray="1,1" />

                  {/* Overlapping Player 1 (Green Polygon - Virat) */}
                  <polygon 
                    points="50,15 82,35 68,78 38,76 25,40" 
                    className="fill-emerald-500/20 stroke-emerald-400" 
                    strokeWidth="1.5" 
                  />

                  {/* Overlapping Player 2 (CSK Opener - Blue Polygon) */}
                  <polygon 
                    points="50,25 74,44 64,72 45,74 28,34" 
                    className="fill-indigo-500/20 stroke-indigo-400" 
                    strokeWidth="1.2" 
                  />
                  
                  {/* Web category labels */}
                  <text x="50" y="8" className="text-[7px] font-bold fill-slate-400 uppercase text-center font-sans" textAnchor="middle">Batting</text>
                  <text x="90" y="38" className="text-[7px] font-bold fill-indigo-450 uppercase" textAnchor="start">Power</text>
                  <text x="73" y="88" className="text-[7px] font-bold fill-slate-500 uppercase" textAnchor="middle">Consistency</text>
                  <text x="27" y="88" className="text-[7px] font-bold fill-slate-500 uppercase" textAnchor="middle">Fitness</text>
                  <text x="8" y="38" className="text-[7px] font-bold fill-slate-400 uppercase" textAnchor="end">Bowling</text>
                </svg>

                {/* Overlap badges info details */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 text-[8px] font-black tracking-wider uppercase font-mono">
                  <span className="text-emerald-400 inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{currentPlayer.name.split(' ')[0]}</span>
                  </span>
                  <span className="text-indigo-400 inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    <span>Gaikwad</span>
                  </span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-[8px] font-mono text-slate-500 uppercase block">Spider index aggregates 95% validity</span>
              </div>

              <button 
                onClick={() => alert('Launching side-by-side batting mechanics and run count comparison UI!')}
                className="w-full mt-3 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white uppercase text-[9px] tracking-widest py-2 rounded-xl transition-colors"
              >
                Compare Players
              </button>
            </div>

            {/* Widget 3: TEAM STRENGTH INDEX - CHENNAI SUPER KINGS */}
            <div className="md:col-span-4 bg-[#0a0f1d] border border-white/5 rounded-2xl p-4 flex flex-col justify-between text-left relative" id="team-strength-index-scorecard">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-[#ccff00] uppercase">TEAM STRENGTH INDEX</span>
                <p className="text-[9px] text-slate-400 font-mono uppercase">Current Selection: Chennai Super Kings</p>
              </div>

              {/* Large Circular rating circle gauge diagram matching screenshot perfectly */}
              <div className="flex items-center justify-between gap-3 my-2.5">
                <div className="relative shrink-0 flex items-center justify-center">
                  <svg className="w-16 h-16" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400"
                      strokeWidth="3.5"
                      strokeDasharray="89, 100"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="21" className="font-mono font-black text-[12px] text-white fill-current text-center" textAnchor="middle">89</text>
                  </svg>
                  <span className="absolute bottom-[-1px] text-[8px] font-sans text-slate-450 uppercase tracking-widest leading-none block font-black">CSK Rank</span>
                </div>

                {/* Team parameters progress blocks */}
                <div className="flex-1 space-y-1.5 text-[9px] font-mono">
                  {[
                    { label: 'BATTING SPEED', value: '95', color: 'bg-emerald-500' },
                    { label: 'DEFENSIVE BOWLING', value: '82', color: 'bg-emerald-500' },
                    { label: 'FIELDING ACCURACY', value: '88', color: 'bg-emerald-500' },
                    { label: 'TEAM SYNERGY', value: '90', color: 'bg-emerald-500' },
                    { label: 'NRR STRENGTH', value: '87', color: 'bg-emerald-500' }
                  ].map((attr, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-center text-slate-400 text-[8px]">
                        <span>{attr.label}</span>
                        <span className="font-black text-white">{attr.value}%</span>
                      </div>
                      <div className="w-full bg-slate-850 h-1.5 rounded-sm overflow-hidden">
                        <div className={`h-full ${attr.color}`} style={{ width: `${attr.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => alert('Opening advanced team radar matrix overlay!')}
                className="w-full mt-2.5 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white uppercase text-[9px] tracking-widest py-2 rounded-xl transition-colors"
              >
                View Team Analytics
              </button>
            </div>

          </div>

          {/* 📊 BOTTOM LEADERBOARDS ROW (4 panels/tables responsive layout) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Box 1: TOP RUN SCORERS */}
            <div className="md:col-span-4 bg-[#0a0f1d] border border-white/5 rounded-2xl p-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                <span className="font-display font-black text-white text-[11px] uppercase tracking-wider">TOP RUN SCORERS</span>
                <span className="text-[8px] text-slate-500 hover:underline cursor-pointer uppercase">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="text-slate-500 text-[8px] uppercase tracking-wider border-b border-white/5 font-black">
                      <th className="pb-1"># Player</th>
                      <th className="pb-1 text-center">Mat</th>
                      <th className="pb-1 text-right text-orange-400">Runs</th>
                      <th className="pb-1 text-right">Avg</th>
                      <th className="pb-1 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[10px]">
                    {[
                      { name: 'Virat Kohli', team: 'RCB', mat: 12, runs: 785, avg: '58.12', sr: '145.32', avatar: '👨‍💼', active: true },
                      { name: 'Rohit Sharma', team: 'MI', mat: 13, runs: 722, avg: '52.12', sr: '138.45', avatar: '👨‍🚀', active: false },
                      { name: 'Shubman Gill', team: 'GT', mat: 12, runs: 698, avg: '51.33', sr: '142.18', avatar: '👦', active: false },
                      { name: 'Suryakumar Yadav', team: 'MI', mat: 13, runs: 650, avg: '48.12', sr: '171.20', avatar: '🦸‍♂️', active: false },
                      { name: 'Ruturaj Gaikwad', team: 'CSK', mat: 11, runs: 610, avg: '49.25', sr: '140.33', avatar: '🦁', active: false }
                    ].map((player, idx) => (
                      <tr 
                        key={idx}
                        onClick={() => setSelectedPlayerName(player.name)}
                        className={`hover:bg-white/5 cursor-pointer ${player.name === selectedPlayerName ? 'bg-violet-650/20 text-[#ccff00]' : 'text-slate-300'}`}
                      >
                        <td className="py-1.5 flex items-center gap-1.5 font-sans truncate max-w-28 font-bold">
                          <span>{idx + 1}</span>
                          <span>{player.name.split(' ')[0]}</span>
                          <span className="text-[7.5px] text-slate-500 font-mono">({player.team})</span>
                        </td>
                        <td className="py-1.5 text-center text-slate-400">{player.mat}</td>
                        <td className="py-1.5 text-right font-black text-white">{player.runs}</td>
                        <td className="py-1.5 text-right text-slate-300">{player.avg}</td>
                        <td className="py-1.5 text-right text-slate-450">{player.sr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Box 2: TOP WICKET TAKERS */}
            <div className="md:col-span-4 bg-[#0a0f1d] border border-white/5 rounded-2xl p-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                <span className="font-display font-black text-white text-[11px] uppercase tracking-wider">TOP WICKET TAKERS</span>
                <span className="text-[8px] text-slate-500 hover:underline cursor-pointer uppercase">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="text-slate-500 text-[8px] uppercase tracking-wider border-b border-white/5 font-black">
                      <th className="pb-1"># Bowler</th>
                      <th className="pb-1 text-center">Mat</th>
                      <th className="pb-1 text-right text-violet-400">Wkts</th>
                      <th className="pb-1 text-right">Econ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[10px]">
                    {[
                      { name: 'Jasprit Bumrah', team: 'MI', mat: 13, wkts: 34, econ: '5.80' },
                      { name: 'Mohammed Shami', team: 'GT', mat: 12, wkts: 29, econ: '6.20' },
                      { name: 'Mohammed Siraj', team: 'RCB', mat: 12, wkts: 27, econ: '6.50' },
                      { name: 'Arshdeep Singh', team: 'PBKS', mat: 11, wkts: 25, econ: '7.10' },
                      { name: 'Ravindra Jadeja', team: 'CSK', mat: 11, wkts: 22, econ: '6.80' }
                    ].map((player, idx) => (
                      <tr 
                        key={idx}
                        className="hover:bg-white/5 cursor-pointer text-slate-300"
                        onClick={() => {
                          if (player.name === 'Jasprit Bumrah') setSelectedPlayerName('Jasprit Bumrah');
                        }}
                      >
                        <td className="py-1.5 flex items-center gap-1.5 font-sans truncate max-w-28 font-bold">
                          <span>{idx + 1}</span>
                          <span>{player.name.split(' ')[0]}</span>
                          <span className="text-[7.5px] text-slate-500 font-mono">({player.team})</span>
                        </td>
                        <td className="py-1.5 text-center text-slate-400">{player.mat}</td>
                        <td className="py-1.5 text-right font-black text-white">{player.wkts}</td>
                        <td className="py-1.5 text-right text-slate-300">{player.econ}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Box 3: MATCH IMPACT LEADERBOARD */}
            <div className="md:col-span-4 bg-[#0a0f1d] border border-white/5 rounded-2xl p-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                <span className="font-display font-black text-white text-[11px] uppercase tracking-wider">MATCH IMPACT LEADERBOARD</span>
                <span className="text-[8px] text-slate-500 hover:underline cursor-pointer uppercase">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono font-bold">
                  <thead>
                    <tr className="text-slate-500 text-[8px] uppercase tracking-wider border-b border-white/5 font-black">
                      <th className="pb-1"># Player</th>
                      <th className="pb-1 text-right text-emerald-400">Impact Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[10px]">
                    {[
                      { name: 'Virat Kohli', team: 'RCB', rating: 94.2 },
                      { name: 'Jasprit Bumrah', team: 'MI', rating: 92.1 },
                      { name: 'Suryakumar Yadav', team: 'MI', rating: 89.5 },
                      { name: 'Rohit Sharma', team: 'MI', rating: 87.8 },
                      { name: 'Hardik Pandya', team: 'MI', rating: 86.3 }
                    ].map((player, idx) => (
                      <tr 
                        key={idx}
                        className="hover:bg-white/5 text-slate-350 cursor-pointer"
                        onClick={() => {
                          if (playersFormDatabase[player.name]) setSelectedPlayerName(player.name);
                        }}
                      >
                        <td className="py-2.5 flex items-center gap-2 font-sans">
                          <span className="font-mono text-slate-500">{idx + 1}</span>
                          <span>{player.name}</span>
                          <span className="text-[7.5px] text-slate-500 font-mono">({player.team})</span>
                        </td>
                        <td className="py-2.5 text-right font-black text-[#ccff00] text-xs">{player.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Quick Stats card footer row matches screenshot exactly */}
          <div className="bg-[#0a0f1d] border border-white/5 rounded-2xl p-4 text-left">
            <span className="text-[10px] font-black tracking-widest text-[#ccff00] uppercase block">QUICK STATS ACCUMULATION</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3 text-center">
              {[
                { value: '38', label: 'MOST SIXES IN MATCH', icon: '🟢', color: 'border-emerald-500/25 text-emerald-400' },
                { value: '15 Balls', label: 'FASTEST FIFTY RECORD', icon: '🟠', color: 'border-amber-500/25 text-amber-500' },
                { value: '265/3', label: 'HIGHEST TEAM SCORE', icon: '🔵', color: 'border-blue-500/25 text-blue-400' },
                { value: '34', label: 'LOWEST TEAM SCORE', icon: '🔴', color: 'border-rose-500/25 text-rose-500' },
                { value: '8', label: 'MOST HUNDREDS AWARDED', icon: '🟣', color: 'border-purple-500/25 text-purple-400' }
              ].map((stat, idx) => (
                <div key={idx} className={`p-2 rounded-xl bg-white/5 border ${stat.color} flex flex-col justify-center items-center gap-1`}>
                  <span className="text-sm">{stat.icon}</span>
                  <span className="font-mono font-black text-sm text-white">{stat.value}</span>
                  <span className="block text-[7.5px] text-slate-450 tracking-wider font-extrabold uppercase leading-tight">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR MODULES (3 columns on desktop) ================= */}
        <div className="xl:col-span-3 space-y-5 text-left">
          
          {/* Module 1: ApnaCricket Voice Insight Narrator */}
          <div className="bg-[#0c1222] border border-violet-500/20 rounded-2xl p-5 space-y-4 relative overflow-hidden" id="ai-voice-synthesizer">
            
            <div className="flex items-center justify-between">
              <h4 className="font-display font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="h-4.5 w-4.5 text-violet-400" />
                <span>Voice Insight</span>
              </h4>
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            </div>

            {/* Custom SVG Audio Waveform Bounce illustration */}
            <div className="bg-[#070b13] p-3 rounded-xl border border-white/5 flex flex-col justify-center items-center gap-3">
              <div className="flex gap-1.5 items-center justify-center h-10 select-none">
                {[1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4].map((j, idx) => (
                  <span 
                    key={idx} 
                    className={`w-1 rounded-full transition-all duration-300 ${voicePlaying ? 'bg-[#ccff00] animate-bounce' : 'bg-violet-650'}`} 
                    style={{ 
                      height: `${j * (voicePlaying ? 6 : 3)}px`,
                      animationDelay: `${idx * 0.08}s`
                    }} 
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-300 leading-tight font-medium text-center">
                Listen to your AI-powered match & player insights in real-time.
              </p>
            </div>

            {/* Dropdown controls row */}
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-black text-slate-350 focus:outline-none focus:ring-1 focus:ring-[#ccff00] cursor-pointer"
                >
                  <option className="bg-slate-905">English (India)</option>
                  <option className="bg-slate-905">English (UK)</option>
                  <option className="bg-slate-905">Hindi (Local Dialect)</option>
                </select>
                <ChevronRight className="absolute right-2 top-2.5 h-3 w-3 text-slate-400 rotate-90" />
              </div>

              <button
                onClick={handleSpeakSpeech}
                className={`py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  voicePlaying 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow shadow-indigo-950'
                }`}
              >
                {voicePlaying ? 'Mute' : 'Speak Now'}
              </button>
            </div>

          </div>

          {/* Module 2: TRENDING PLAYERS widget */}
          <div className="bg-[#0a0f1d] border border-white/5 rounded-2xl p-5 text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
              <h4 className="font-display font-black text-slate-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>TRENDING PLAYERS</span>
              </h4>
              <span className="text-[10px] font-extrabold text-[#ccff00] hover:underline cursor-pointer uppercase">View All</span>
            </div>

            {/* Trending profiles */}
            <div className="space-y-2 text-xs font-mono">
              {[
                { name: 'Ruturaj Gaikwad', team: 'CSK', change: '▲ 15', logo: '🦁', color: 'text-emerald-400' },
                { name: 'Rohit Sharma', team: 'MI', change: '▲ 12', logo: '🌀', color: 'text-emerald-400' },
                { name: 'Suryakumar Yadav', team: 'MI', change: '▲ 10', logo: '👽', color: 'text-emerald-400' },
                { name: 'Arshdeep Singh', team: 'PBKS', change: '▲ 8', logo: '🦁', color: 'text-emerald-400' },
                { name: 'Yashasvi Jaiswal', team: 'RR', change: '▲ 7', logo: '👑', color: 'text-emerald-400' }
              ].map((item, id) => (
                <div 
                  key={id}
                  onClick={() => {
                    if (playersFormDatabase[item.name]) setSelectedPlayerName(item.name);
                  }}
                  className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between gap-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.logo}</span>
                    <div>
                      <span className="block font-bold text-white truncate max-w-32">{item.name}</span>
                      <span className="text-[8px] text-slate-450 uppercase leading-none font-sans font-extrabold">{item.team} Franchise</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black ${item.color}`}>{item.change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Module 3: AI INSIGHT widget matching screenshot gauge content */}
          <div className="bg-[#0a0f1d] border border-white/5 rounded-2xl p-5 text-left relative overflow-hidden" id="ai-insight-spin-vs-pace">
            <span className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-45 text-5xl">🧠</span>
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5">
              <h4 className="font-display font-black text-slate-350 text-xs uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span>AI INSIGHT</span>
              </h4>
              <span className="text-[8px] text-slate-500 uppercase font-bold font-mono">POWERED BY APNA AI</span>
            </div>

            <div className="space-y-4">
              <div className="bg-violet-950/20 border border-violet-500/15 p-3 rounded-xl space-y-1 text-left">
                <span className="font-sans font-black text-[#ccff00] text-xs block">{currentPlayer.name} info</span>
                <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                  {currentPlayer.name} is currently scoring <span className="font-black text-[#ccff00]">34% more runs</span> against pace bowler options than spin this season!
                </p>
              </div>

              {/* strike rates visualizer graphics */}
              <div className="flex items-center gap-3">
                <div className="relative shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400"
                      strokeWidth="3.5"
                      strokeDasharray="74, 100"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[8px] font-mono font-black text-white">74%</span>
                </div>

                <div className="flex-1 space-y-1.5 text-[8.5px] font-mono leading-none">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>STRIKE RATE VS PACE</span>
                    <span className="font-extrabold text-[#ccff00]">148.32%</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 border-t border-white/5 pt-1.5">
                    <span>STRIKE RATE VS SPIN</span>
                    <span className="font-extrabold text-blue-400">111.08%</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert('Accessing deep neural dataset profiles...')}
                className="w-full bg-slate-900 border border-white/10 hover:bg-slate-850 text-slate-300 font-black uppercase text-[9px] tracking-widest py-2.5 rounded-xl block text-center transition-all cursor-pointer shadow-sm"
              >
                More AI Insights
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
