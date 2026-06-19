import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, Trophy, Award, Sparkles, User, Medal, MapPin, Check, Plus, BookOpen, Crown } from 'lucide-react';
import { Player } from '../types';

interface TeamsViewProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
}

// Initial team objects
const TEAM_CARDS = [
  { id: 'RAMPUR', name: 'Rampur Warriors', short: 'RMP', color: 'from-orange-500 to-amber-600', captain: "Raju 'Sixer' Yadav", venue: "Rampur Local School Ground", rank: 1, trophies: 3 },
  { id: 'MALGUDI', name: 'Malgudi Stars', short: 'MGD', color: 'from-blue-500 to-indigo-600', captain: 'Kiran Kumar', venue: 'Malgudi Lake View Ground', rank: 2, trophies: 2 },
  { id: 'DANGAL', name: 'Dangal Kings', short: 'DGL', color: 'from-red-500 to-rose-600', captain: 'Sunny "Gabru" Singh', venue: 'Panchayat Ground', rank: 3, trophies: 1 },
  { id: 'GULLY', name: 'Gully Raiders', short: 'GLY', color: 'from-emerald-500 to-teal-600', captain: 'Bablu "Helicopter" Dhoni', venue: 'Rampur Meadows Ground', rank: 4, trophies: 4 }
];

export default function TeamsView({ players, onAddPlayer }: TeamsViewProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  // Custom Drafted Teams database
  const [draftedTeams, setDraftedTeams] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('apna_cricket_drafted_teams');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
      rank: draftedTeams.length + 5,
      trophies: 0,
      isDrafted: true
    };

    const updated = [...draftedTeams, newTeam];
    setDraftedTeams(updated);
    localStorage.setItem('apna_cricket_drafted_teams', JSON.stringify(updated));

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

  const allActiveTeams = [...TEAM_CARDS, ...draftedTeams];
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
            {allActiveTeams.map(tc => {
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
                <div className="space-y-3.5 text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    ACTIVE ROSTER SQUAD MEMBERS ({teamRoster.length})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono">
                    {teamRoster.map(player => (
                      <div
                        key={player.id}
                        className="bg-slate-50/60 p-4 rounded-xl border border-slate-150 hover:border-slate-250 transition-all flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-black text-slate-900 block uppercase tracking-wider font-sans">{player.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 block">{player.role} • {player.battingStyle}</span>
                        </div>

                        <div className="text-right text-xs shrink-0 pl-1">
                          <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">CAREER RUNS</span>
                          <span className="font-black text-blue-600 text-xs tracking-wider">{player.stats.runs}</span>
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
