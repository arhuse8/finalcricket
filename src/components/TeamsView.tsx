import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, Trophy, Award, Sparkles, User, Medal, MapPin, Check, Plus, BookOpen, Crown, UserPlus, RefreshCw, AlertCircle, Database, Sparkle, Trash2 } from 'lucide-react';
import { Player } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';
import { supabaseService } from '../lib/supabaseService';

interface TeamsViewProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onDeletePlayer?: (playerId: string) => void;
  teams: any[];
  setTeams: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function TeamsView({ players, onAddPlayer, onDeletePlayer, teams, setTeams }: TeamsViewProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeletePlayerClick = async (playerId: string, playerName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${playerName} from the system / database permanently?`)) {
      return;
    }
    setDeletingId(playerId);
    try {
      if (isSupabaseConfigured) {
        await supabaseService.deletePlayer(playerId);
      }
      if (onDeletePlayer) {
        onDeletePlayer(playerId);
      }
    } catch (e) {
      console.error('Failed to delete player:', e);
    } finally {
      setDeletingId(null);
    }
  };

  // Player Register Form States
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [regPlayerName, setRegPlayerName] = useState('');
  const [regPlayerRole, setRegPlayerRole] = useState('All-Rounder');
  const [regBattingStyle, setRegBattingStyle] = useState('Right-hand bat');
  const [regBowlingStyle, setRegBowlingStyle] = useState('Right-arm fast');
  
  // Custom statistics defaults
  const [regMatchesPlayed, setRegMatchesPlayed] = useState(0);
  const [regTotalRuns, setRegTotalRuns] = useState(0);
  const [regHighestScore, setRegHighestScore] = useState(0);
  const [regWicketsTaken, setRegWicketsTaken] = useState(0);
  const [regBowlingEconomy, setRegBowlingEconomy] = useState(6.0);
  const [regStrikeRate, setRegStrikeRate] = useState(120.0);

  const [regLoading, setRegLoading] = useState(false);
  const [regSuccessMsg, setRegSuccessMsg] = useState('');
  const [regErrorMsg, setRegErrorMsg] = useState('');

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleRegisterPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPlayerName.trim()) {
      setRegErrorMsg('Please provide a valid player full name.');
      return;
    }
    if (!selectedTeamId) {
      setRegErrorMsg('Please select a team before registering a player.');
      return;
    }

    setRegLoading(true);
    setRegSuccessMsg('');
    setRegErrorMsg('');

    const targetTeam = teams.find(t => t.id === selectedTeamId);
    const generatedId = generateUUID();

    const initialStatsObj = {
      matches: regMatchesPlayed,
      runs: regTotalRuns,
      highestScore: regHighestScore,
      average: regMatchesPlayed > 0 ? parseFloat((regTotalRuns / regMatchesPlayed).toFixed(2)) : 0,
      strikeRate: regStrikeRate,
      fifties: regTotalRuns >= 50 ? Math.floor(regTotalRuns / 75) : 0, 
      hundreds: regTotalRuns >= 100 ? Math.floor(regTotalRuns / 175) : 0,
      wickets: regWicketsTaken,
      bestBowling: regWicketsTaken > 0 ? `${regWicketsTaken}/${Math.max(1, Math.round(regWicketsTaken * 8))}` : '0/0',
      economy: regBowlingEconomy
    };

    const newLocalPlayer: Player = {
      id: generatedId,
      name: regPlayerName,
      teamId: selectedTeamId,
      role: regPlayerRole,
      battingStyle: regBattingStyle,
      bowlingStyle: regBowlingStyle,
      stats: initialStatsObj
    };

    // Check if it's a real live DB team
    const isRealDbTeam = selectedTeamId && !selectedTeamId.startsWith('draft-');
    
    if (isSupabaseConfigured && isRealDbTeam) {
      try {
        const result = await supabaseService.registerPlayer({
          player_id: generatedId,
          full_name: regPlayerName,
          team_id: selectedTeamId,
          playing_role: regPlayerRole,
          batting_style: regBattingStyle,
          bowling_style: regBowlingStyle,
          matches_played: regMatchesPlayed,
          total_runs: regTotalRuns,
          highest_score: regHighestScore,
          batting_average: regMatchesPlayed > 0 ? parseFloat((regTotalRuns / regMatchesPlayed).toFixed(2)) : 0,
          strike_rate: regStrikeRate,
          fifties: regTotalRuns >= 50 ? Math.floor(regTotalRuns / 75) : 0,
          hundreds: regTotalRuns >= 100 ? Math.floor(regTotalRuns / 175) : 0,
          wickets_taken: regWicketsTaken,
          best_bowling: regWicketsTaken > 0 ? `${regWicketsTaken}/${Math.max(1, Math.round(regWicketsTaken * 8))}` : '0/0',
          bowling_economy: regBowlingEconomy
        });

        if (result) {
          onAddPlayer(newLocalPlayer);
          setRegSuccessMsg(`Successfully registered ${regPlayerName} into the ${targetTeam?.name || 'team'} live database! 🏏✨`);
          
          setRegPlayerName('');
          setRegMatchesPlayed(0);
          setRegTotalRuns(0);
          setRegHighestScore(0);
          setRegWicketsTaken(0);

          setTimeout(() => {
            setRegSuccessMsg('');
            setShowPlayerForm(false);
          }, 3500);
        } else {
          setRegErrorMsg('Received null response from Supabase database. Please try again.');
        }
      } catch (err: any) {
        console.error('Player database registration failure:', err);
        setRegErrorMsg(`Supabase insertion failed: ${err.message || String(err)}`);
      } finally {
        setRegLoading(false);
      }
    } else {
      onAddPlayer(newLocalPlayer);
      if (!isSupabaseConfigured) {
        setRegSuccessMsg(`Successfully registered ${regPlayerName} locally under ${targetTeam?.name || 'team'} Roster (No Supabase Connected). ⚡`);
      } else {
        setRegSuccessMsg(`Recruited ${regPlayerName} to Drafted Club ${targetTeam?.name || 'team'}! 🛡️`);
      }
      
      setRegPlayerName('');
      setRegMatchesPlayed(0);
      setRegTotalRuns(0);
      setRegHighestScore(0);
      setRegWicketsTaken(0);
      
      setRegLoading(false);
      
      setTimeout(() => {
        setRegSuccessMsg('');
        setShowPlayerForm(false);
      }, 3500);
    }
  };

  // Draft Creation Form States
  const [showTeamBuilder, setShowTeamBuilder] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamShort, setNewTeamShort] = useState('');
  const [newTeamCaptain, setNewTeamCaptain] = useState('');
  const [newTeamVenue, setNewTeamVenue] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('from-purple-500 to-indigo-600');
  const [successMsg, setSuccessMsg] = useState('');

  const saveDraftTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !newTeamShort || !newTeamCaptain) return;

    const newTeam = {
      id: `draft-${Date.now()}`,
      name: newTeamName,
      short: newTeamShort.toUpperCase(),
      color: newTeamColor,
      captain: newTeamCaptain,
      venue: newTeamVenue || 'Village Common Ground',
      rank: teams.length + 1,
      trophies: 0,
      isDrafted: true
    };

    const updated = [...teams, newTeam];
    setTeams(updated);

    // Register primary player (The Captain) to global database automatically
    const capPlayer: Player = {
      id: `p-cap-${Date.now()}`,
      name: newTeamCaptain,
      teamId: newTeam.id,
      role: 'All-Rounder',
      battingStyle: 'Right-hand bat',
      stats: { matches: 1, runs: 25, highestScore: 25, average: 25, strikeRate: 140, fifties: 0, hundreds: 0, wickets: 1, bestBowling: '1/15', economy: 7.5 }
    };
    onAddPlayer(capPlayer);

    setSuccessMsg(`Team ${newTeamName} registered & Captain assigned! 🎉`);
    
    // Reset Form
    setNewTeamName('');
    setNewTeamShort('');
    setNewTeamCaptain('');
    setNewTeamVenue('');
    
    setTimeout(() => {
      setSuccessMsg('');
      setShowTeamBuilder(false);
    }, 1500);
  };

  const allActiveTeams = teams;
  const activeTeam = allActiveTeams.find(t => t.id === selectedTeamId);
  const teamRoster = players.filter(p => p.teamId === selectedTeamId);

  return (
    <div className="space-y-8 text-slate-800" id="teams-view-root">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5 text-left">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-900 uppercase tracking-tight">
            🛡️ Teams & Rosters
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">
            Manage club registrations, recruit local heroes, or browse team rosters
          </p>
        </div>

        <button
          onClick={() => setShowTeamBuilder(!showTeamBuilder)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs px-5 py-3 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          id="btn-trigger-builder"
        >
          <Plus className="h-4 w-4" />
          <span>Draft Custom Club</span>
        </button>
      </div>

      {/* DRAFT BUILDER MODAL-LIKE DRAWER */}
      {showTeamBuilder && (
        <form 
          onSubmit={saveDraftTeam} 
          className="p-6 border border-slate-200 bg-white rounded-3xl space-y-5 shadow-lg text-left transition-all max-w-4xl mx-auto" 
          id="form-team-builder"
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h4 className="font-display font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600" />
              DRAFT A CUSTOM VILLAGE CLUB
            </h4>
            <button
              type="button"
              onClick={() => setShowTeamBuilder(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Close Drawer
            </button>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 p-3 rounded-xl text-xs font-mono font-bold">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Club / Team Name</label>
              <input
                type="text"
                required
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder="e.g. Khalsa Strikers"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-805 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Short Name (3 Letters)</label>
              <input
                type="text"
                required
                maxLength={3}
                value={newTeamShort}
                onChange={e => setNewTeamShort(e.target.value)}
                placeholder="e.g. KHL"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-805 font-bold focus:outline-none' focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Club Captain Name</label>
              <input
                type="text"
                required
                value={newTeamCaptain}
                onChange={e => setNewTeamCaptain(e.target.value)}
                placeholder="e.g. Harbhajan Singh"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-805 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Visual Gradient Team Palette</label>
              <select
                value={newTeamColor}
                onChange={e => setNewTeamColor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
              >
                <option value="from-purple-500 to-indigo-600">💜 Royal Indigo</option>
                <option value="from-fuchsia-500 to-pink-600">💖 Fuchsia Fire</option>
                <option value="from-cyan-500 to-blue-600">💙 Lake Blue Spin</option>
                <option value="from-yellow-400 to-orange-500">💛 Solar Yellow</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-750 text-white font-black uppercase tracking-widest text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all"
            >
              Register & Save Squad
            </button>
          </div>
        </form>
      )}

      {/* TEAMS LAYOUT COLUMN/GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Teams List cards */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-left">
            Select A Team To Inspect Roster
          </span>

          <div className="space-y-3">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block text-left mb-1.5 matches-list-side-header">
              Official Neighborhood Teams (Old Data)
            </span>
            {allActiveTeams.filter(tc => !tc.isDrafted).map(tc => {
              const teamPlayersCount = players.filter(p => p.teamId === tc.id).length;
              const isSelected = selectedTeamId === tc.id;
              
              return (
                <div
                  key={tc.id}
                  onClick={() => setSelectedTeamId(tc.id)}
                  className={`cursor-pointer rounded-2xl border p-4.5 transition-all flex items-center justify-between relative overflow-hidden text-left ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:shadow-sm'
                  }`}
                  id={`team-sidebar-card-${tc.id}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`h-11 w-11 rounded bg-gradient-to-tr ${tc.color} flex items-center justify-center font-display font-black text-sm text-white shadow-sm`}>
                      {tc.short}
                    </div>
                    <div>
                      <span className={`text-sm font-black uppercase tracking-wider block ${isSelected ? 'text-white' : 'text-slate-900'}`}>{tc.name}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block mt-0.5 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                        Captain: {tc.captain}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono shrink-0 pl-1">
                    <span className={`block text-[8px] font-bold uppercase ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>ROSTER SIZE</span>
                    <span className={`font-black uppercase text-xs tracking-wider ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                      {teamPlayersCount > 0 ? `${teamPlayersCount} Active` : '1 Captain'}
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="border-t border-slate-200 my-4 pt-4">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block text-left mb-1.5 matches-list-side-header">
                Dynamically Registered Clubs (New Data)
              </span>
            </div>

            {allActiveTeams.filter(tc => tc.isDrafted).length === 0 ? (
              <div className="p-4.5 border border-dashed border-slate-300 rounded-2xl text-center text-slate-400 font-bold text-[11px] uppercase tracking-wide leading-relaxed bg-slate-50/50">
                No custom clubs registered yet. Click "Draft Custom Club" to dynamically insert one!
              </div>
            ) : (
              allActiveTeams.filter(tc => tc.isDrafted).map(tc => {
                const teamPlayersCount = players.filter(p => p.teamId === tc.id).length;
                const isSelected = selectedTeamId === tc.id;
                
                return (
                  <div
                    key={tc.id}
                    onClick={() => setSelectedTeamId(tc.id)}
                    className={`cursor-pointer rounded-2xl border p-4.5 transition-all flex items-center justify-between relative overflow-hidden text-left ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:shadow-sm'
                    }`}
                    id={`team-sidebar-card-${tc.id}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`h-11 w-11 rounded bg-gradient-to-tr ${tc.color} flex items-center justify-center font-display font-black text-sm text-white shadow-sm`}>
                        {tc.short}
                      </div>
                      <div>
                        <span className={`text-sm font-black uppercase tracking-wider block ${isSelected ? 'text-white' : 'text-slate-900'}`}>{tc.name}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mt-0.5 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                          Captain: {tc.captain}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono shrink-0 pl-1">
                      <span className={`block text-[8px] font-bold uppercase ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>ROSTER SIZE</span>
                      <span className={`font-black uppercase text-xs tracking-wider ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                        {teamPlayersCount > 0 ? `${teamPlayersCount} Active` : '1 Captain'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Team Detail & squad roster listings */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeTeam ? (
              <motion.div
                key={activeTeam.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6"
                id="team-active-details"
              >
                {/* Visual Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 text-left">
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-tr ${activeTeam.color} flex items-center justify-center font-display font-black text-xl text-white shadow-sm`}>
                      {activeTeam.short}
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-black text-slate-900 uppercase tracking-tight">{activeTeam.name}</h3>
                      <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-0.5 uppercase tracking-wider">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>Home Venue: {activeTeam.venue}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 font-mono text-center self-start sm:self-center">
                    <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">CUP TROPHIES</span>
                      <span className="text-xs font-black text-blue-600 uppercase tracking-wider">{activeTeam.trophies || '0'} Titles</span>
                    </div>
                    <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">LOCAL RANK</span>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">#{activeTeam.rank || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Team Captain Spotlight */}
                <div className="bg-blue-50/50 border border-blue-100 p-4.5 rounded-xl flex items-center justify-between text-left">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 bg-white border border-blue-200 rounded-full flex items-center justify-center text-lg shadow-inner">
                      <Crown className="h-5 w-5 text-blue-650" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase block tracking-widest">OFFICIAL CLUB CAPTAIN</span>
                      <span className="text-sm font-black uppercase text-slate-900 tracking-wide">{activeTeam.captain}</span>
                    </div>
                  </div>

                  <span className="text-[9px] text-blue-700 font-mono font-black uppercase tracking-wider bg-blue-100/50 border border-blue-100 px-2.5 py-1 rounded-md">
                    verified leader
                  </span>
                </div>

                {/* Squad Members Details */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      ACTIVE ROSTER SQUAD MEMBERS ({teamRoster.length})
                    </span>

                    <button
                      type="button"
                      onClick={() => setShowPlayerForm(!showPlayerForm)}
                      className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-black uppercase tracking-wider text-[9px] px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      <UserPlus className="h-3 w-3" />
                      <span>{showPlayerForm ? 'Cancel Registration' : 'Register Player Live'}</span>
                    </button>
                  </div>

                  {showPlayerForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 overflow-hidden"
                    >
                      <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Database className="h-4 w-4 text-blue-600" />
                          <h4 className="font-display font-black text-slate-900 text-xs uppercase tracking-wider">
                            {isSupabaseConfigured && !activeTeam.id.startsWith('draft-') ? 'Register Player Live (To Supabase)' : 'Register Player (Fallback Offline State)'}
                          </h4>
                        </div>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded font-mono ${
                          isSupabaseConfigured && !activeTeam.id.startsWith('draft-') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isSupabaseConfigured && !activeTeam.id.startsWith('draft-') ? '⚡ GLOBAL SUPABASE' : '⚙️ Fallback Engine'}
                        </span>
                      </div>

                      {regSuccessMsg && (
                        <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 p-3.5 rounded-xl text-xs font-semibold leading-relaxed flex items-start gap-2 animate-pulse font-mono">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>{regSuccessMsg}</div>
                        </div>
                      )}

                      {regErrorMsg && (
                        <div className="bg-rose-50 text-rose-800 border border-rose-250 p-3.5 rounded-xl text-xs font-semibold leading-relaxed flex items-start gap-2 font-mono">
                          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <div>{regErrorMsg}</div>
                        </div>
                      )}

                      <form onSubmit={handleRegisterPlayer} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                          <div className="space-y-1 sm:col-span-2 md:col-span-3">
                            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Player Full Name</label>
                            <input
                              type="text"
                              required
                              value={regPlayerName}
                              onChange={e => setRegPlayerName(e.target.value)}
                              placeholder="e.g. Yashaswi Jaiswal"
                              className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Playing Role</label>
                            <select
                              value={regPlayerRole}
                              onChange={e => setRegPlayerRole(e.target.value)}
                              className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-black focus:outline-none cursor-pointer"
                            >
                              <option value="Batsman">🏏 Batsman</option>
                              <option value="Bowler">🍒 Bowler</option>
                              <option value="All-Rounder">⭐ All-Rounder</option>
                              <option value="Wicketkeeper">🧤 Wicketkeeper</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Batting Style</label>
                            <select
                              value={regBattingStyle}
                              onChange={e => setRegBattingStyle(e.target.value)}
                              className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-black focus:outline-none cursor-pointer"
                            >
                              <option value="Right-hand bat">👉 Right-hand bat</option>
                              <option value="Left-hand bat">👈 Left-hand bat</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Bowling Style</label>
                            <select
                              value={regBowlingStyle}
                              onChange={e => setRegBowlingStyle(e.target.value)}
                              className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-black focus:outline-none cursor-pointer"
                            >
                              <option value="Right-arm fast">👉 Right-arm fast</option>
                              <option value="Right-arm medium">👉 Right-arm medium</option>
                              <option value="Left-arm fast">👈 Left-arm fast</option>
                              <option value="Right-arm offbreak">👉 Right-arm offbreak</option>
                              <option value="Slow left-arm orthodox">👈 Slow left-arm orthodox</option>
                              <option value="None">❌ None</option>
                            </select>
                          </div>
                        </div>

                        {/* Optional Custom Initial Stats fields */}
                        <div className="border-t border-slate-200/60 pt-3.5 mt-2 space-y-3">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans">
                            Initial Career Stats Record (Defaults to Zero)
                          </span>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider block">Matches Played</label>
                              <input
                                type="number"
                                min={0}
                                value={regMatchesPlayed}
                                onChange={e => setRegMatchesPlayed(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-white border border-slate-250 rounded-xl px-2.5 py-2 text-xs font-mono font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider block">Career Runs</label>
                              <input
                                type="number"
                                min={0}
                                value={regTotalRuns}
                                onChange={e => setRegTotalRuns(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-white border border-slate-250 rounded-xl px-2.5 py-2 text-xs font-mono font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider block">Highest Score</label>
                              <input
                                type="number"
                                min={0}
                                value={regHighestScore}
                                onChange={e => setRegHighestScore(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-white border border-slate-250 rounded-xl px-2.5 py-2 text-xs font-mono font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider block">Wickets Taken</label>
                              <input
                                type="number"
                                min={0}
                                value={regWicketsTaken}
                                onChange={e => setRegWicketsTaken(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-white border border-slate-250 rounded-xl px-2.5 py-2 text-xs font-mono font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider block">Batting Strike Rate</label>
                              <input
                                type="number"
                                step="0.1"
                                min={0}
                                value={regStrikeRate}
                                onChange={e => setRegStrikeRate(Math.max(0, parseFloat(e.target.value) || 0))}
                                className="w-full bg-white border border-slate-250 rounded-xl px-2.5 py-2 text-xs font-mono font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider block">Bowling Economy</label>
                              <input
                                type="number"
                                step="0.01"
                                min={0}
                                value={regBowlingEconomy}
                                onChange={e => setRegBowlingEconomy(Math.max(0, parseFloat(e.target.value) || 0))}
                                className="w-full bg-white border border-slate-250 rounded-xl px-2.5 py-2 text-xs font-mono font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-slate-200/60">
                          <button
                            type="submit"
                            disabled={regLoading}
                            className="bg-blue-650 hover:bg-blue-755 disabled:bg-blue-300 text-white font-black uppercase tracking-wider text-xs px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                          >
                            {regLoading ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                <span>COMMITTING REGISTRATION LIVE...</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-3.5 w-3.5" />
                                <span>SUBMIT PLATFORM REGISTRATION</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono">
                    {teamRoster.map(player => (
                      <div
                        key={player.id}
                        className="bg-slate-50/60 p-4 rounded-xl border border-slate-150 hover:border-slate-250 transition-all flex items-center justify-between group"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-black text-slate-900 block uppercase tracking-wider font-sans truncate">{player.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 block truncate">{player.role} • {player.battingStyle}</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 pl-2">
                          <div className="text-right text-xs">
                            <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">CAREER RUNS</span>
                            <span className="font-black text-blue-600 text-xs tracking-wider">{player.stats.runs}</span>
                          </div>

                          <button
                            onClick={() => handleDeletePlayerClick(player.id, player.name)}
                            disabled={deletingId !== null}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg border border-rose-200 opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer duration-200"
                            title={`Delete ${player.name} permanently`}
                          >
                            {deletingId === player.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brief History summary of outcomes */}
                <div className="space-y-2 border-t border-slate-150 pt-4.5 text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">
                    Historic League Performance Summary
                  </span>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    Widely celebrated by enthusiasts for their highly aggressive boundary hitting on legside deliveries. Under Captain {activeTeam.captain}, this neighborhood club successfully registered over 12 high-tension derby wins to dates. Supported by a passionate crowd of dedicated fans.
                  </p>
                </div>

              </motion.div>
            ) : (
              <div className="h-72 bg-white border border-dashed border-slate-250 rounded-2xl flex flex-col items-center justify-center text-center text-slate-400 p-6 shadow-sm">
                <Shield className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Select or draft a club team from the left side panel to inspect roster</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
