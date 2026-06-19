import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Sliders, Play, Award, Trophy, Users, Shield, Bell, MapPin, ArrowLeft, RefreshCw, Calendar, Eye, Activity, Star, User, Settings, Tv, Lock, Unlock } from 'lucide-react';
import { Match } from '../types';
import SpectatorDashboard from './SpectatorDashboard';
import AdminSandbox from './AdminSandbox';

interface MatchesListViewProps {
  liveMatch: Match;
  setLiveMatch: (m: Match) => void;
  onSelectFixtureToSimulate: (fixture: any) => void;
  onPlayerStatUpdate: any;
  currentSimulatedView: 'list' | 'detail';
  setCurrentSimulatedView: (v: 'list' | 'detail') => void;
  onReset: () => void;
}

export default function MatchesListView({
  liveMatch,
  setLiveMatch,
  onSelectFixtureToSimulate,
  onPlayerStatUpdate,
  currentSimulatedView,
  setCurrentSimulatedView,
  onReset
}: MatchesListViewProps) {
  // Filters & Tabs state
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');
  const [detailMode, setDetailMode] = useState<'user' | 'developer'>('user');
  
  // SECURE ROLE-BASED ACCESS CONTROL (RBAC) STATES
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Industry Route/Url Separation Pattern
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const authParam = params.get('auth');
    if (roleParam === 'developer' || roleParam === 'admin' || authParam === 'admin123') {
      setIsAdminAuthenticated(true);
      setDetailMode('developer');
      triggerToast("🔐 Developer Mode unlocked automatically via URL query params!");
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode.trim() === 'admin123') {
      setIsAdminAuthenticated(true);
      setDetailMode('developer');
      setShowAuthModal(false);
      setAuthError('');
      setAuthCode('');
      triggerToast("🔓 Access Granted: Developer Mode activated successfully.");
    } else {
      setAuthError("❌ Invalid developer key. Access Denied.");
    }
  };

  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [selectedTournament, setSelectedTournament] = useState('All Tournaments');

  // Interactive match selected for detail view (could be liveMatch or a mockup)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // Match list mock database mimicking the user's uploaded screenshot perfectly
  const allMatchesData = [
    {
      id: 'm-csk-mi',
      league: 'SPL 2024 - Match 23',
      status: 'Live',
      team1: { name: 'CSK', runs: 154, wickets: 5, overs: 18.3, logoColor: 'from-yellow-400 to-amber-500', logo: '🦁' },
      team2: { name: 'MI', runs: 145, wickets: 8, overs: 20.0, logoColor: 'from-blue-500 to-indigo-600', logo: '🌀' },
      statusMessage: 'CSK need 9 runs in 9 balls',
      runRateInfo: 'Required RR: 6.00 | CRR: 8.32',
      recentBalls: ['1', '4', '0', 'W', '2', '6'],
      venue: 'Wankhede Stadium, Mumbai',
      format: 'T20',
      tournament: 'Shivaji Premier League 2024',
      watchLive: true
    },
    {
      id: 'm-gt-pbks',
      league: 'GPL 2024 - Match 12',
      status: 'Live',
      team1: { name: 'GT', runs: 98, wickets: 3, overs: 12.0, logoColor: 'from-slate-600 to-slate-800', logo: '⚡' },
      team2: { name: 'PBKS', runs: 0, wickets: 0, overs: 0.0, logoColor: 'from-red-500 to-rose-600', logo: '🦁' },
      statusMessage: 'Gujarat Titans won the toss, opted to bat first',
      runRateInfo: 'Projected score: 163 runs',
      recentBalls: ['0', '1', '4', '1', '0', '2'],
      venue: 'Narendra Modi Stadium, Ahmedabad',
      format: 'T20',
      tournament: 'Gujarat Premier League 2024',
      watchLive: false
    },
    {
      id: 'm-rr-srh',
      league: 'RPL 2024 - Match 8',
      status: 'Live',
      team1: { name: 'RR', runs: 67, wickets: 2, overs: 8.1, logoColor: 'from-pink-500 to-rose-600', logo: '👑' },
      team2: { name: 'SRH', runs: 0, wickets: 0, overs: 0.0, logoColor: 'from-orange-500 to-red-650', logo: '🦅' },
      statusMessage: 'Rajasthan Royals need 112 runs',
      runRateInfo: 'Required RR: 13.71 | CRR: 8.20',
      recentBalls: ['4', '0', '1', '4', '0', 'W'],
      venue: 'Sawai Mansingh Stadium, Jaipur',
      format: '12 Overs',
      tournament: 'Rajasthan Premier League 2024',
      watchLive: true
    },
    {
      id: 'm-dc-lsg',
      league: 'DPL 2024 - Match 15',
      status: 'Live',
      team1: { name: 'DC', runs: 120, wickets: 6, overs: 16.0, logoColor: 'from-blue-600 to-sky-500', logo: '🐅' },
      team2: { name: 'LSG', runs: 0, wickets: 0, overs: 0.0, logoColor: 'from-cyan-600 to-teal-500', logo: '🦅' },
      statusMessage: 'Delhi Capitals won the toss, opted to bat',
      runRateInfo: 'Projected score: 150 runs',
      recentBalls: ['1', '1', '4', '6', '0', 'W'],
      venue: 'Arun Jaitley Stadium, Delhi',
      format: 'T20',
      tournament: 'Delhi Premier League 2024',
      watchLive: false
    },
    {
      id: 'm-local-sim',
      league: 'Village Derby - Live Simulator',
      status: 'Live',
      team1: { name: liveMatch.team1.shortName, runs: liveMatch.team1.score.runs, wickets: liveMatch.team1.score.wickets, overs: parseFloat(`${liveMatch.team1.score.overs}.${liveMatch.team1.score.balls}`), logoColor: liveMatch.team1.logoColor, logo: '🏏' },
      team2: { name: liveMatch.team2.shortName, runs: liveMatch.team2.score.runs, wickets: liveMatch.team2.score.wickets, overs: parseFloat(`${liveMatch.team2.score.overs}.${liveMatch.team2.score.balls}`), logoColor: liveMatch.team2.logoColor, logo: '🌀' },
      statusMessage: liveMatch.isFirstInningsComplete ? `${liveMatch.team2.shortName} needs ${liveMatch.targetRuns} runs to win!` : liveMatch.tossResult,
      runRateInfo: liveMatch.isFirstInningsComplete ? `Target: ${liveMatch.targetRuns}` : 'Direct active simulation playground',
      recentBalls: liveMatch.recentBalls.length > 0 ? liveMatch.recentBalls.slice(0, 6) : ['0', '1', '4', '6', '0', 'W'],
      venue: liveMatch.venue,
      format: '12 Overs',
      tournament: 'Panchayat Village Cup',
      watchLive: true,
      isActiveSimulation: true
    },
    // Upcoming matches
    {
      id: 'm-up-01',
      league: 'SPL 2024 - Match 24',
      status: 'Upcoming',
      team1: { name: 'RCB', runs: 0, wickets: 0, overs: 0, logoColor: 'from-red-600 to-yellow-500', logo: '🦁' },
      team2: { name: 'KKR', runs: 0, wickets: 0, overs: 0, logoColor: 'from-purple-600 to-indigo-700', logo: '👑' },
      statusMessage: 'Match starts at 7:30 PM IST',
      runRateInfo: 'Jun 19, 2026',
      recentBalls: [],
      venue: 'M. Chinnaswamy Stadium, Bengaluru',
      format: 'T20',
      tournament: 'Shivaji Premier League 2024'
    },
    {
      id: 'm-up-02',
      league: 'VPL 2024 - Match 5',
      status: 'Upcoming',
      team1: { name: 'RMP', runs: 0, wickets: 0, overs: 0, logoColor: 'from-orange-500 to-amber-600', logo: '🏹' },
      team2: { name: 'DGL', runs: 0, wickets: 0, overs: 0, logoColor: 'from-red-500 to-rose-600', logo: '⚔️' },
      statusMessage: 'Local village rivalry match starts tomorrow',
      runRateInfo: 'Jun 20, 2026 • 2:00 PM',
      recentBalls: [],
      venue: 'Panchayat Meadow Ground',
      format: '12 Overs',
      tournament: 'Village Premier League (VPL)'
    },
    // Finished matches
    {
      id: 'm-comp-01',
      league: 'BCL 2024 - Match 7',
      status: 'Completed',
      team1: { name: 'BIL', runs: 210, wickets: 4, overs: 20.0, logoColor: 'from-green-600 to-emerald-500', logo: '🦁' },
      team2: { name: 'HYD', runs: 198, wickets: 7, overs: 20.0, logoColor: 'from-amber-500 to-yellow-600', logo: '👑' },
      statusMessage: 'Bengaluru won by 12 runs',
      runRateInfo: 'Match Completed',
      recentBalls: ['1', '4', '2', '1', 'W', '0'],
      venue: 'M. Chinnaswamy Stadium, Bengaluru',
      format: 'T20',
      tournament: 'Bangalore Champions League'
    }
  ];

  // Filtering logic
  const filteredMatches = allMatchesData.filter(m => {
    // Tab filter
    if (activeTab === 'live' && m.status !== 'Live') return false;
    if (activeTab === 'upcoming' && m.status !== 'Upcoming') return false;
    if (activeTab === 'finished' && m.status !== 'Completed') return false;

    // Dropdown filters
    if (selectedFormat !== 'All Formats' && m.format !== selectedFormat) return false;
    if (selectedTournament !== 'All Tournaments' && m.tournament !== selectedTournament) return false;

    return true;
  });

  const liveMatchesCount = allMatchesData.filter(m => m.status === 'Live').length;

  const handleOpenMatch = (match: any) => {
    if (match.isActiveSimulation) {
      setCurrentSimulatedView('detail');
    } else {
      // Setup a dynamic live scratch match for view
      const selectedAsMatch: Match = {
        id: match.id,
        title: `${match.tournament} - Match Day`,
        venue: match.venue,
        date: 'Live Tracker Mode',
        status: 'Live',
        oversLimit: match.format === '12 Overs' ? 12 : 20,
        battingTeamId: 'T1',
        bowlingTeamId: 'T2',
        team1: {
          id: 'T1',
          name: match.team1.name === 'CSK' ? 'Chennai Super Kings' : match.team1.name,
          shortName: match.team1.name,
          logoColor: match.team1.logoColor,
          score: { runs: match.team1.runs, wickets: match.team1.wickets, overs: Math.floor(match.team1.overs), balls: Math.round((match.team1.overs % 1) * 10) },
          battingCard: [
            { playerName: "Kiran Kumar", status: 'not out', runs: 45, balls: 24, fours: 3, sixes: 2 }
          ],
          bowlingCard: [
            { playerName: 'Ramesh Spinner', overs: 3, maidens: 0, runs: 28, wickets: 1 }
          ]
        },
        team2: {
          id: 'T2',
          name: match.team2.name === 'MI' ? 'Mumbai Indians' : match.team2.name,
          shortName: match.team2.name,
          logoColor: match.team2.logoColor,
          score: { runs: match.team2.runs, wickets: match.team2.wickets, overs: Math.floor(match.team2.overs), balls: Math.round((match.team2.overs % 1) * 10) },
          battingCard: [
            { playerName: 'Suresh Raina', status: 'yet to bat', runs: 0, balls: 0, fours: 0, sixes: 0 }
          ],
          bowlingCard: [
            { playerName: 'Kapil Dev (Junior)', overs: 2, maidens: 0, runs: 12, wickets: 0 }
          ]
        },
        isFirstInningsComplete: match.status === 'Completed' ? true : false,
        targetRuns: match.status === 'Completed' ? match.team1.runs + 1 : undefined,
        onStrikeIndex: 0,
        miniScore: {
          batsman1: { name: 'Kiran Kumar', runs: 45, balls: 24, fours: 3, sixes: 2, strikeRate: 187.5 },
          batsman2: { name: 'Partner Batsman', runs: 12, balls: 8, fours: 1, sixes: 0, strikeRate: 150 },
          bowler: { name: 'Ramesh Spinner', overs: 3, maidens: 0, runs: 28, wickets: 1, economy: 9.33 }
        },
        recentBalls: match.recentBalls,
        ballByBallHistory: [
          { overNumber: 8, ballOfOver: 1, run: 4, isWide: false, isNoBall: false, isWicket: false, batsmanName: 'Kiran Kumar', bowlerName: 'Ramesh Spinner', commentary: 'LOFTED! Hit high into the clear sky, splitting deep mid-wicket for four runs!' }
        ]
      };
      setLiveMatch(selectedAsMatch);
      setCurrentSimulatedView('detail');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 text-slate-900 bg-slate-50 min-h-screen pb-12" id="live-matches-viewport">
      
      {/* Return header trigger when in detail scorecard mode */}
      {currentSimulatedView === 'detail' && (
        <div className="flex items-center gap-3 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm mb-6">
          <button 
            onClick={() => setCurrentSimulatedView('list')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            id="btn-back-to-list"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Matches List</span>
          </button>
          <div className="border-l border-slate-200 h-6 pl-3 text-left">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">CURRENT SIMULATOR ACTIVE:</span>
            <span className="text-xs text-slate-900 font-black ml-1 uppercase">{liveMatch.title}</span>
          </div>
        </div>
      )}

      {currentSimulatedView === 'list' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Main Left column: Lists & Tabs */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Main view header badge */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h1 className="font-display text-3xl font-black tracking-tight text-slate-900 uppercase">
                  LIVE MATCHES
                </h1>
                <p className="text-xs text-slate-500 mt-1 uppercase font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-650 animate-pulse"></span>
                  <span>{liveMatchesCount} Matches Live Now</span>
                </p>
              </div>
              
              <button 
                onClick={onReset}
                className="p-2 bg-white text-slate-500 rounded-xl border border-slate-200 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
                title="Refresh fixtures list"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh Listings</span>
              </button>
            </div>

            {/* Segment Controls Tab Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div className="flex flex-wrap gap-1.5 bg-slate-200/60 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'live'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Live</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === 'live' ? 'bg-red-500 text-white' : 'bg-slate-300 text-slate-700'}`}>
                    {liveMatchesCount}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'upcoming'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('finished')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'finished'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Recently Finished
                </button>
              </div>

              {/* Filters Actions Row */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option>All Formats</option>
                    <option>T20</option>
                    <option>ODI</option>
                    <option>Test</option>
                    <option>12 Overs</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedTournament}
                    onChange={(e) => setSelectedTournament(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-40 truncate"
                  >
                    <option>All Tournaments</option>
                    <option>Shivaji Premier League 2024</option>
                    <option>Gujarat Premier League 2024</option>
                    <option>Rajasthan Premier League 2024</option>
                    <option>Delhi Premier League 2024</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>

                <button className="p-2 bg-white text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold">
                  <Sliders className="h-4 w-4 text-slate-400" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* List of Match Cards */}
            <div className="space-y-4">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((m) => (
                  <div 
                    key={m.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col md:grid md:grid-cols-12 gap-5 items-center text-left"
                  >
                    {/* Top status header */}
                    <div className="absolute top-0 left-0 right-0 border-b border-slate-50 bg-slate-50/50 px-5 py-1.5 flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${m.status === 'Live' ? 'bg-red-500 animate-pulse' : m.status === 'Upcoming' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                        <span className={`font-mono font-black uppercase ${m.status === 'Live' ? 'text-red-500' : 'text-slate-500'}`}>{m.status}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500 font-bold uppercase tracking-wider">{m.league}</span>
                      </div>
                      <div className="text-slate-400 font-mono flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{m.venue}</span>
                      </div>
                    </div>

                    {/* Team Logos and Scoreboard */}
                    <div className="col-span-5 w-full flex items-center justify-between md:justify-start gap-12 mt-4 md:mt-2">
                      <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${m.team1.logoColor} flex items-center justify-center font-black text-xl shadow-sm text-white select-none`}>
                          {m.team1.logo}
                        </div>
                        <div>
                          <span className="text-base font-black text-slate-900 tracking-wider block">{m.team1.name}</span>
                          <span className="font-mono text-xs text-slate-500 block leading-none mt-1">
                            {m.team1.runs}/{m.team1.wickets} <span className="text-[10px] text-slate-400">({m.team1.overs} Ov)</span>
                          </span>
                        </div>
                      </div>

                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">vs</span>

                      <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${m.team2.logoColor} flex items-center justify-center font-black text-xl shadow-sm text-white select-none`}>
                          {m.team2.logo}
                        </div>
                        <div>
                          <span className="text-base font-black text-slate-900 tracking-wider block">{m.team2.name}</span>
                          <span className="font-mono text-xs text-slate-500 block leading-none mt-1">
                            {m.team2.runs > 0 ? (
                              `${m.team2.runs}/${m.team2.wickets} (${m.team2.overs} Ov)`
                            ) : (
                              <span className="text-slate-400 italic">Yet to Bat</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Chase summary */}
                    <div className="col-span-4 w-full border-t border-slate-100 md:border-t-0 md:border-x border-slate-100 px-0 md:px-5 py-4 md:py-1 self-stretch flex flex-col justify-center text-left">
                      <div className="space-y-1">
                        <span className="text-xs font-black text-blue-700 tracking-wide uppercase block">
                          {m.statusMessage}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block pb-1 border-b border-slate-50">
                          {m.runRateInfo}
                        </span>
                      </div>

                      {m.recentBalls.length > 0 && (
                        <div className="mt-2.5 space-y-1">
                          <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">LAST 6 BALLS:</span>
                          <div className="flex gap-1">
                            {m.recentBalls.map((ball, idx) => {
                              let pillClass = "bg-slate-100 border border-slate-200 text-slate-600";
                              if (ball === '4') pillClass = "bg-blue-50 border border-blue-200 text-blue-700 font-bold";
                              if (ball === '6') pillClass = "bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold";
                              if (ball === 'W') pillClass = "bg-red-50 border border-red-200 text-red-700 font-bold";
                              return (
                                <span 
                                  key={idx} 
                                  className={`h-[18px] w-[18px] rounded-full flex items-center justify-center text-[9px] font-black ${pillClass}`}
                                >
                                  {ball}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Access Side action CTA button triggers */}
                    <div className="col-span-3 w-full flex flex-row md:flex-col gap-2.5 justify-end">
                      {m.status === 'Live' ? (
                        <>
                          <button
                            onClick={() => handleOpenMatch(m)}
                            className="flex-1 md:w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-wider py-2 px-3 rounded-lg text-center transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1"
                            id={`btn-view-score-${m.id}`}
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>View Live Score</span>
                          </button>

                          <button
                            onClick={() => handleOpenMatch(m)}
                            className="flex-1 md:w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider py-2 px-3 rounded-lg text-center transition-all cursor-pointer"
                          >
                            Scorecard
                          </button>

                          <button
                            onClick={() => handleOpenMatch(m)}
                            className="hidden md:block flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider py-1.5 px-3 rounded-md text-center transition-all cursor-pointer"
                          >
                            Commentary
                          </button>

                          {m.watchLive && (
                            <div className="hidden md:flex items-center justify-center gap-1 text-[9px] font-black text-red-650 animate-pulse uppercase tracking-wider mt-0.5 select-none">
                              <span>Watch Live</span>
                              <span>🚨</span>
                            </div>
                          )}
                        </>
                      ) : m.status === 'Upcoming' ? (
                        <>
                          <button
                            onClick={() => onSelectFixtureToSimulate({
                              team1Name: m.team1.name === 'RCB' ? 'Rampur Warriors' : m.team1.name,
                              team2Name: m.team2.name === 'KKR' ? 'Gully Raiders' : m.team2.name,
                              team1Short: m.team1.name,
                              team2Short: m.team2.name,
                              team1Color: m.team1.logoColor,
                              team2Color: m.team2.logoColor,
                              venue: m.venue,
                              tournamentName: m.tournament
                            })}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-wider py-3 rounded-lg text-center transition-all cursor-pointer"
                          >
                            Simulate Derby Now
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenMatch(m)}
                            className="flex-1 md:w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-wider py-2.5 rounded-lg text-center transition-all cursor-pointer"
                          >
                            View Scorecard
                          </button>
                          <button
                            onClick={() => handleOpenMatch(m)}
                            className="flex-1 md:w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider py-2.5 rounded-lg text-center transition-all cursor-pointer"
                          >
                            Match Summary
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                  <p className="font-extrabold text-sm uppercase">No matches match your filter criteria.</p>
                  <button 
                    onClick={() => { setSelectedFormat('All Formats'); setSelectedTournament('All Tournaments'); }}
                    className="text-xs text-blue-600 underline font-bold mt-2 font-mono"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar options */}
          <div className="xl:col-span-4 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-left font-sans">
              <h4 className="font-display font-black text-slate-900 text-xs uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>MATCH CENTER</span>
                <ChevronRight className="h-4 w-4 text-slate-350" />
              </h4>
              <ul className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {[
                  { name: 'Live Score', glow: true },
                  { name: 'Scorecard', glow: false },
                  { name: 'Commentary', glow: false },
                  { name: 'Match Stats', glow: false },
                  { name: 'Partnerships', glow: false },
                  { name: 'Wagon Wheel', glow: false }
                ].map((item, id) => (
                  <li 
                    key={id}
                    className="py-3.5 flex justify-between items-center hover:text-slate-950 hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <span>{item.name}</span>
                    <div className="flex items-center gap-1">
                      {item.glow && <span className="h-1.5 w-1.5 bg-red-550 rounded-full animate-pulse" />}
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
                <h4 className="font-display font-black text-slate-900 text-xs uppercase tracking-wider">
                  QUICK STATS
                </h4>
                <span className="text-[10px] font-extrabold text-blue-600 hover:underline cursor-pointer uppercase">View All</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                {[
                  { value: '1000+', label: 'Live Matches', icon: <Trophy className="h-4 w-4 text-blue-600 mx-auto" /> },
                  { value: '50K+', label: 'Players', icon: <Users className="h-4 w-4 text-indigo-600 mx-auto" /> },
                  { value: '200+', label: 'Tournaments', icon: <Award className="h-4 w-4 text-amber-500 mx-auto" /> },
                  { value: '10M+', label: 'Balls Bowled', icon: <Activity className="h-4 w-4 text-rose-500 mx-auto" /> },
                  { value: '500+', label: 'Teams', icon: <Shield className="h-4 w-4 text-teal-500 mx-auto" /> },
                  { value: '1M+', label: 'Fans', icon: <Eye className="h-4 w-4 text-purple-500 mx-auto" /> }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 flex flex-col justify-center shadow-inner">
                    {stat.icon}
                    <span className="block font-mono font-black text-slate-1000 text-base mt-2">{stat.value}</span>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-5 relative overflow-hidden shadow-lg border border-slate-800 text-left">
              <div className="absolute right-[-10px] bottom-[-20px] opacity-15 rotate-12">
                <Bell className="h-32 w-32 text-white" />
              </div>

              <div className="relative z-10 space-y-3.5 max-w-[85%]">
                <span className="inline-block bg-blue-500/20 border border-blue-400/30 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-blue-300">
                  NEW FEATURES
                </span>
                <h5 className="font-display font-black text-sm uppercase leading-tight tracking-tight">
                  Never Miss a Moment of Cricket!
                </h5>
                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                  Get high speed live scores, custom local wickets commentary and derby updates directly to your screen device.
                </p>

                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10 text-[9px] md:text-[10px] space-y-1 backdrop-blur-sm">
                  <div className="flex justify-between items-center text-slate-300 font-bold">
                    <span>🔔 APNA CRICKET LIVE</span>
                    <span>Just Now</span>
                  </div>
                  <p className="font-bold">CSK vs MI: WICKET! 🏏</p>
                  <p className="text-slate-300 leading-none">Amit Sharma takes a dynamic catch. MI is 145/8!</p>
                </div>

                <button 
                  onClick={() => triggerToast("🔔 Dynamic Push Notifications successfully enabled for your session!")}
                  className="bg-red-650 hover:bg-red-750 text-white font-black uppercase text-[10px] py-3 px-5 rounded-xl block text-center tracking-widest transition-all cursor-pointer shadow-md select-none w-full border-none"
                >
                  Enable Notifications
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="space-y-6 text-slate-900" id="match-center-layout">
          
          {/* Elegant Interface Mode Selection Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 border border-slate-200 bg-white rounded-2xl shadow-sm text-left relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-violet-500" />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5 text-[9px] font-black text-indigo-700 tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                <span>DYNAMIC VIEW CONTROL</span>
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mt-0.5">Interface View Selector</h4>
              <p className="text-xs text-slate-500 font-medium leading-normal">
                Choose the viewer screen: <strong>User View</strong> (spectator dashboard, wagon wheel) or <strong>Developer View</strong> (admin score simulation controls).
              </p>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setDetailMode('user')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  detailMode === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-blue-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Tv className="h-4 w-4" />
                <span>User View (Spectator)</span>
              </button>
              <button
                onClick={() => {
                  if (isAdminAuthenticated) {
                    setDetailMode('developer');
                  } else {
                    setShowAuthModal(true);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  detailMode === 'developer'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md border-violet-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-650 hover:bg-indigo-50/50'
                }`}
              >
                {isAdminAuthenticated ? <Unlock className="h-4 w-4 text-emerald-600" /> : <Lock className="h-4 w-4" />}
                <span>Developer View (Admin)</span>
              </button>
            </div>
          </div>

          {/* Conditional View Router based on access control */}
          <div className="transition-all duration-300">
            {detailMode === 'user' ? (
              <SpectatorDashboard
                liveMatch={liveMatch}
                setCurrentSimulatedView={setCurrentSimulatedView}
                onUnlockRequest={() => {
                  if (isAdminAuthenticated) {
                    setDetailMode('developer');
                  } else {
                    setShowAuthModal(true);
                  }
                }}
              />
            ) : (
              isAdminAuthenticated ? (
                <AdminSandbox
                  liveMatch={liveMatch}
                  setLiveMatch={setLiveMatch}
                  onPlayerStatUpdate={onPlayerStatUpdate}
                  setCurrentSimulatedView={setCurrentSimulatedView}
                />
              ) : (
                // Safe Fallback Challenge Panel on Screen
                <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto text-center shadow-lg my-10">
                  <div className="h-16 w-16 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    🔐
                  </div>
                  <h3 className="font-display font-black text-slate-900 text-lg uppercase tracking-tight">Privileged Dashboard Area</h3>
                  <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
                    Access is restricted to software administrators and developers. Please verify your role token to open sandbox controls.
                  </p>
                  
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-650 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    Authenticate with Key
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Dynamic Toast Feedback Notification System */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-850 text-white text-xs font-semibold px-4.5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-sm animate-bounce">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECURE ADMIN ACCESS MODAL (ROLE-BASED AUTHORIZATION OVERLAY) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-left">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <div>
                  <h4 className="font-display font-black text-slate-900 text-sm uppercase tracking-tight">Developer Verification</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Apna Cricket Cloud Access</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError('');
                  setAuthCode('');
                }}
                className="p-1 px-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-700 transition-colors text-xs font-bold font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminAuthSubmit} className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-normal font-medium">
                In actual software deployments, Developer/Umpire controls are restricted. To simulate this role change locally, enter our staging passcode below.
              </p>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1.5 text-xs text-indigo-800 font-semibold">
                <p className="flex items-center gap-1">
                  <span>💡</span>
                  <span><strong>Staging Credentials:</strong></span>
                </p>
                <div className="font-mono text-[11px] bg-white/70 px-2 py-1.5 rounded border border-indigo-200/50 flex justify-between items-center">
                  <span>Developer Key: <strong className="text-indigo-950">admin123</strong></span>
                  <span className="text-[9px] bg-indigo-100 px-1 py-0.5 rounded text-indigo-700">STAGING</span>
                </div>
                <p className="text-[10px] text-indigo-600">
                  You can also append <strong className="font-mono">?role=developer</strong> directly to the URL in your address bar to simulate SSO bypass!
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1.5">Enter Passcode Key</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs text-red-600 font-bold leading-normal">{authError}</p>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    setAuthError('');
                    setAuthCode('');
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider py-3.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-95 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl shadow-md cursor-pointer"
                >
                  Verify credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
