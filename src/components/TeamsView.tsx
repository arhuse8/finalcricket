import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, Trophy, Award, Sparkles, User, Medal, MapPin, Check, Plus } from 'lucide-react';
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
    <div className="space-y-8" id="teams-view-root">
      
      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">🛡️ Panchayat Team Standings & Squads</h2>
          <p className="text-xs text-slate-400 mt-1">Manage, recruit, or inspect neighborhood cricket rosters, records, and venues.</p>
        </div>

        <button
          onClick={() => setShowTeamBuilder(!showTeamBuilder)}
          className="flex items-center gap-2 bg-[#ccff00] hover:bg-[#bbf000] text-[#061a12] font-black uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
          id="btn-trigger-builder"
        >
          <Plus className="h-4 w-4 text-[#061a12]" />
          <span>Draft Custom Club / VPL Team</span>
        </button>
      </div>

      {/* DRAFT BUILDER MODAL-LIKE DRAWER */}
      {showTeamBuilder && (
        <form onSubmit={saveDraftTeam} className="p-6 border border-white/10 bg-black/40 rounded-2xl space-y-4 animate-slide-up" id="form-team-builder">
          <div className="flex justify-between items-center border-b border-white/15 pb-3">
            <h4 className="font-display font-black text-white uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#ccff00]" />
              Draft A Custom Village Club
            </h4>
            <button
              type="button"
              onClick={() => setShowTeamBuilder(false)}
              className="text-[#ccff00] text-xs font-black uppercase tracking-wider hover:underline"
            >
              Close Form
            </button>
          </div>

          {successMsg && (
            <div className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/25 p-3 rounded-lg text-xs font-mono">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300">Club / Team Name</label>
              <input
                type="text"
                required
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder="e.g. Khalsa Strikers"
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300">Short Name (3 Letters)</label>
              <input
                type="text"
                required
                maxLength={3}
                value={newTeamShort}
                onChange={e => setNewTeamShort(e.target.value)}
                placeholder="e.g. KHL"
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300">Club Captain Name</label>
              <input
                type="text"
                required
                value={newTeamCaptain}
                onChange={e => setNewTeamCaptain(e.target.value)}
                placeholder="e.g. Harbhajan Singh"
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300">Visual Gradient Team Palette</label>
              <select
                value={newTeamColor}
                onChange={e => setNewTeamColor(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]"
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
              className="bg-[#ccff00] hover:bg-[#bbf000] text-[#061a12] font-black uppercase tracking-widest text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all"
            >
              REGISTER SQUAD & DRAFT
            </button>
          </div>
        </form>
      )}

      {/* TEAMS LAYOUT COLUMN/GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Teams List cards */}
        <div className="lg:col-span-1 space-y-4">
          <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">
            Click A Team To Inspect Roster
          </span>

          <div className="space-y-3">
            {allActiveTeams.map(tc => {
              const capImage = tc.id === 'RAMPUR' ? '🏏' : tc.id === 'MALGUDI' ? '🌀' : tc.id === 'DANGAL' ? '🔥' : '💥';
              const teamPlayersCount = players.filter(p => p.teamId === tc.id).length;
              
              return (
                <div
                  key={tc.id}
                  onClick={() => setSelectedTeamId(tc.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all flex items-center justify-between relative overflow-hidden ${
                    selectedTeamId === tc.id
                      ? 'bg-black/60 border-[#ccff00] shadow-lg shadow-[#ccff00]/5'
                      : 'bg-black/20 border-white/10 hover:border-white/20'
                  }`}
                  id={`team-sidebar-card-${tc.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-11 w-11 rounded bg-gradient-to-tr ${tc.color} flex items-center justify-center font-display font-black text-sm text-white shadow-lg shadow-black/30`}>
                      {tc.short}
                    </div>
                    <div>
                      <span className="text-sm font-black text-white uppercase tracking-wider block">{tc.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">CAPTAIN: {tc.captain}</span>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono">
                    <span className="block text-[9px] text-slate-500 uppercase">SQUAD TYPE</span>
                    <span className="font-extrabold text-[#ccff00]">
                      {teamPlayersCount > 0 ? `${teamPlayersCount} Players` : '1 Captain'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Team Detail & squad roster listings */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {activeTeam ? (
              <motion.div
                key={activeTeam.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden p-6 space-y-6"
                id="team-active-details"
              >
                {/* Visual Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-tr ${activeTeam.color} flex items-center justify-center font-display font-black text-xl text-white shadow-2xl`}>
                      {activeTeam.short}
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">{activeTeam.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#ccff00]" />
                        Home Field Venue: {activeTeam.venue}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 font-mono text-center">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                      <span className="block text-[9px] text-slate-500 uppercase">Cups Won</span>
                      <span className="text-sm font-black text-[#ccff00]">{activeTeam.trophies || '–'} Trophies</span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                      <span className="block text-[9px] text-slate-500 uppercase">Local Rank</span>
                      <span className="text-sm font-black text-white">#{activeTeam.rank || '–'}</span>
                    </div>
                  </div>
                </div>

                {/* Team Captain Spotlight */}
                <div className="bg-[#ccff00]/5 border border-[#ccff00]/15 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-black/60 border border-white/10 rounded-full flex items-center justify-center text-lg">
                      👑
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider">APPOINTED LEAGUE CAPTAIN</span>
                      <span className="text-sm font-black uppercase text-white tracking-wide">{activeTeam.captain}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#ccff00] font-mono uppercase tracking-widest font-black bg-[#ccff00]/10 border border-[#ccff00]/25 py-1 px-2.5">
                    authority signed
                  </span>
                </div>

                {/* Squad Members Details */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    ACTIVE ROSTER SQUAD MEMBERS ({teamRoster.length})
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono">
                    {teamRoster.map(player => (
                      <div
                        key={player.id}
                        className="bg-white/5 p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-black text-white block uppercase tracking-wider font-sans">{player.name}</span>
                          <span className="text-[10px] text-slate-450 block">{player.role} • {player.battingStyle}</span>
                        </div>

                        <div className="text-right text-xs">
                          <span className="block text-[9px] text-slate-500">CAREER RUNS</span>
                          <span className="font-bold text-[#ccff00]">{player.stats.runs}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brief History summary of outcomes */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Historic League Records
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Famous for aggressive boundaries on legside. Under Captain {activeTeam.captain}, this team successfully recorded over 12 derby wins on local dirt grounds. Highly favored by local fans.
                  </p>
                </div>

              </motion.div>
            ) : (
              <div className="h-72 bg-black/10 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center text-slate-500 p-6">
                <Shield className="h-10 w-10 text-slate-650 mb-3" />
                <p className="text-sm font-sans italic">Select or Draft a team from the left side list/panel to reveal detailed squad analyses.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
