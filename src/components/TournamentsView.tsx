import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Award, Users, Star, Plus, ShieldCheck, Play } from 'lucide-react';
import { Fixture } from '../types';

interface TournamentsViewProps {
  fixtures: Fixture[];
  onAddFixture: (fixture: Fixture) => void;
}

const TOURNAMENTS = [
  { id: 'KHALSA', name: 'Apna Village Khalsa Cup', organizer: 'Panchayat Council', balls: 'Heavy Tape Ball', duration: '12 Overs', count: 4 },
  { id: 'VPL', name: 'Village Premier League (VPL)', organizer: 'Malgudi Meadows Committee', balls: 'Leather Ball', duration: '12 Overs', count: 4 }
];

// Initial simulated points table rows
const INITIAL_POINTS = [
  { team: 'Rampur Warriors', played: 3, won: 2, lost: 1, pts: 4, nrr: '+1.450' },
  { team: 'Malgudi Stars', played: 3, won: 2, lost: 1, pts: 4, nrr: '+0.880' },
  { team: 'Gully Raiders', played: 3, won: 1, lost: 2, pts: 2, nrr: '-0.320' },
  { team: 'Dangal Kings', played: 3, won: 1, lost: 2, pts: 2, nrr: '-1.890' }
];

export default function TournamentsView({ fixtures, onAddFixture }: TournamentsViewProps) {
  const [selectedCup, setSelectedCup] = useState<'KHALSA' | 'VPL'>('KHALSA');
  const [pointsTable, setPointsTable] = useState(INITIAL_POINTS);
  
  // Custom tournament scheduler admin state
  const [showScheduler, setShowScheduler] = useState(false);
  const [team1, setTeam1] = useState('Rampur Warriors');
  const [team2, setTeam2] = useState('Gully Raiders');
  const [date, setDate] = useState('Jun 29, 2026');
  const [time, setTime] = useState('4:30 PM IST');
  const [venue, setVenue] = useState('Rampur Panchayat Meadow Arena');
  const [successMsg, setSuccessMsg] = useState('');

  // Interactive points adjustment to satisfy live points table modification goals
  const recordSimulatedWin = (teamIndex: number) => {
    const updated = [...pointsTable];
    updated[teamIndex].played += 1;
    updated[teamIndex].won += 1;
    updated[teamIndex].pts += 2;
    // Sort table by descending points
    setPointsTable(updated.sort((a,b) => b.pts - a.pts));
  };

  const handleAddFixtureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (team1 === team2) {
      alert('A team cannot compete against itself! Select distinct rosters.');
      return;
    }

    const shortNames: { [key: string]: string } = {
      'Rampur Warriors': 'RMP',
      'Malgudi Stars': 'MGD',
      'Dangal Kings': 'DGL',
      'Gully Raiders': 'GLY'
    };

    const gradientColors: { [key: string]: string } = {
      'Rampur Warriors': 'from-orange-500 to-amber-600',
      'Malgudi Stars': 'from-blue-500 to-indigo-600',
      'Dangal Kings': 'from-red-500 to-rose-600',
      'Gully Raiders': 'from-emerald-500 to-teal-600'
    };

    const newFix: Fixture = {
      id: `f-scheduled-${Date.now()}`,
      team1Name: team1,
      team2Name: team2,
      team1Short: shortNames[team1] || 'T1',
      team2Short: shortNames[team2] || 'T2',
      team1Color: gradientColors[team1] || 'from-indigo-500 to-blue-500',
      team2Color: gradientColors[team2] || 'from-emerald-500 to-teal-500',
      date,
      time,
      venue,
      tournamentName: selectedCup === 'KHALSA' ? 'Apna Village Khalsa Cup' : 'Village Premier League (VPL)'
    };

    onAddFixture(newFix);
    setSuccessMsg('Fixture scheduled and added to the official league roster! 📅');
    
    setTimeout(() => {
      setSuccessMsg('');
      setShowScheduler(false);
    }, 1500);
  };

  return (
    <div className="space-y-8" id="tournaments-view-root">
      
      {/* HEADER ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">🏆 Active Tournaments & Points Table</h2>
          <p className="text-xs text-slate-400 mt-1">Simulate outcome weights, access live tables, or schedule upcoming derbies.</p>
        </div>

        <button
          onClick={() => setShowScheduler(!showScheduler)}
          className="flex items-center gap-2 bg-[#ccff00] hover:bg-[#bbf000] text-[#061a12] font-black uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule New Match (Admin)</span>
        </button>
      </div>

      {/* AD-HOC FIXTURE SCHEDULER DRAWER */}
      {showScheduler && (
        <form onSubmit={handleAddFixtureSubmit} className="p-6 border border-white/10 bg-black/40 rounded-2xl space-y-4" id="scheduler-form">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h4 className="font-display font-black text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#ccff00]" />
              LEAGUE SCHEDULING UNIT
            </h4>
            <button
              type="button"
              onClick={() => setShowScheduler(false)}
              className="text-[#ccff00] text-xs font-black uppercase tracking-wider hover:underline"
            >
              Cancel
            </button>
          </div>

          {successMsg && (
            <div className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 p-2.5 rounded text-xs font-mono font-bold">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300">Team 1 (Home)</label>
              <select
                value={team1}
                onChange={e => setTeam1(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Rampur Warriors">Rampur Warriors</option>
                <option value="Malgudi Stars">Malgudi Stars</option>
                <option value="Dangal Kings">Dangal Kings</option>
                <option value="Gully Raiders">Gully Raiders</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300">Team 2 (Away)</label>
              <select
                value={team2}
                onChange={e => setTeam2(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Rampur Warriors">Rampur Warriors</option>
                <option value="Malgudi Stars">Malgudi Stars</option>
                <option value="Dangal Kings">Dangal Kings</option>
                <option value="Gully Raiders">Gully Raiders</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300">Match Date</label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300">Local Timing</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300">Arena Ground Venue</label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#ccff00] hover:bg-[#bbf000] text-[#061a12] font-black uppercase tracking-widest text-[10px] px-5 py-3 rounded-lg shadow"
            >
              COMMIT & BROADCAST SCHEDULING
            </button>
          </div>
        </form>
      )}

      {/* TOURNAMENTS CHANGER BUTTONS */}
      <div className="flex gap-2">
        {TOURNAMENTS.map(cup => (
          <button
            key={cup.id}
            onClick={() => setSelectedCup(cup.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              selectedCup === cup.id
                ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00] shadow-md shadow-[#ccff00]/5'
                : 'bg-black/20 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {cup.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Points Table & Awards list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/30 p-6 border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="font-display text-sm font-black text-rose-300 uppercase tracking-wider">
                🏆 {selectedCup === 'KHALSA' ? 'PANCHAYAT CO-HEIR TABLE' : 'VPL OFFICIAL POINTS RATING'}
              </h3>
              <span className="text-[9px] text-slate-450 uppercase tracking-widest font-mono">
                Click Live Win to Simulate Points Increments
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-500 uppercase text-[9px] font-black tracking-widest">
                    <th className="px-4 py-2 font-sans">TEAM POSITION</th>
                    <th className="px-3 py-2 text-center">P</th>
                    <th className="px-3 py-2 text-center">W</th>
                    <th className="px-3 py-2 text-center">L</th>
                    <th className="px-4 py-2 text-center text-[#ccff00]">PTS</th>
                    <th className="px-4 py-2 text-right">NRR</th>
                    <th className="px-4 py-2 text-center font-sans">SIM OPERATIVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pointsTable.map((row, index) => (
                    <tr key={index} className="hover:bg-white/5 text-slate-300">
                      <td className="px-4 py-3 font-sans font-black text-white uppercase text-xs tracking-wide">
                        {index + 1}. {row.team}
                      </td>
                      <td className="px-3 py-3 text-center">{row.played}</td>
                      <td className="px-3 py-3 text-center text-emerald-400">{row.won}</td>
                      <td className="px-3 py-3 text-center text-red-400">{row.lost}</td>
                      <td className="px-4 py-3 text-center font-black text-white bg-[#ccff00]/5">{row.pts}</td>
                      <td className="px-4 py-3 text-right">{row.nrr}</td>
                      <td className="px-4 py-3 text-center font-sans">
                        <button
                          onClick={() => recordSimulatedWin(index)}
                          className="bg-[#ccff00]/10 border border-[#ccff00]/15 hover:bg-[#ccff00] text-[#ccff05] hover:text-[#061a12] text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded transition-all"
                        >
                          +1 Win
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-black/30 p-6 border border-white/10 rounded-2xl space-y-4">
            <h4 className="font-display text-sm font-black text-white uppercase tracking-wide border-b border-white/5 pb-2 flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-[#ccff00]" />
              End-of-Season Panchayat Awards Allocation
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="block font-black text-[#ccff00] uppercase tracking-wide text-[10px]">🥇 MVP 'DORA' MEDAL</span>
                <p className="text-slate-400 mt-1 leading-relaxed">Winner gets standard dairy cattle buffalo + custom golden willow bat presentation.</p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="block font-black text-[#ccff00] uppercase tracking-wide text-[10px]">🔥 SIXER OF THE YEAR</span>
                <p className="text-slate-400 mt-1 leading-relaxed">Local bakery sponsored free sweet delicacies (Laddoo packs) for 1 full season year.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registered Teams & Venue Summaries */}
        <div className="space-y-6">
          <div className="bg-black/30 p-6 border border-white/10 rounded-2xl space-y-4">
            <h3 className="font-display text-base font-black text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/5 pb-2">
              <Users className="h-4.5 w-4.5 text-[#ccff00]" />
              Participating Teams
            </h3>

            <div className="space-y-2 text-xs">
              {INITIAL_POINTS.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-lg">
                  <span className="font-black text-white uppercase tracking-wider">{row.team}</span>
                  <span className="text-[10px] text-slate-500 font-mono">SEEDED</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/30 p-6 border border-white/10 rounded-2xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 h-24 w-24 bg-[#ccff00]/5 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="font-display text-base font-black text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/5 pb-2">
              <Star className="h-4.5 w-4.5 text-[#ccff00] fill-current" />
              Tournament Rulebook Check
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed space-y-1">
              • Under standard village tape-ball regulations, bowling is restricted to maximum 3 overs per deliverer. Wide balls grant 1 extra score and must be rebowled. Pitch width corresponds to exactly 22 steps.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
