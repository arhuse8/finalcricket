import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Award, Users, Star, Plus, ShieldCheck, HelpCircle, ChevronRight, BookOpen } from 'lucide-react';
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
    <div className="space-y-8 text-slate-800" id="tournaments-view-root">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5 text-left">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-900 uppercase tracking-tight">
            🏆 Tournaments Center
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">
            Qualifying stages, real-time standing points, and scheduling controls
          </p>
        </div>

        <button
          onClick={() => setShowScheduler(!showScheduler)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs px-5 py-3 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule New Match</span>
        </button>
      </div>

      {/* AD-HOC FIXTURE SCHEDULER DRAWER */}
      {showScheduler && (
        <form 
          onSubmit={handleAddFixtureSubmit} 
          className="p-6 border border-slate-200 bg-white rounded-3xl space-y-5 shadow-lg text-left transition-all max-w-4xl mx-auto" 
          id="scheduler-form"
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h4 className="font-display font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              LEAGUE SCHEDULING UNIT (ADMIN CONTROLS)
            </h4>
            <button
              type="button"
              onClick={() => setShowScheduler(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-xl text-xs font-mono font-bold">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Team 1 (Home)</label>
              <select
                value={team1}
                onChange={e => setTeam1(e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
              >
                <option value="Rampur Warriors">Rampur Warriors</option>
                <option value="Malgudi Stars">Malgudi Stars</option>
                <option value="Dangal Kings">Dangal Kings</option>
                <option value="Gully Raiders">Gully Raiders</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Team 2 (Away)</label>
              <select
                value={team2}
                onChange={e => setTeam2(e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
              >
                <option value="Rampur Warriors">Rampur Warriors</option>
                <option value="Malgudi Stars">Malgudi Stars</option>
                <option value="Dangal Kings">Dangal Kings</option>
                <option value="Gully Raiders">Gully Raiders</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Match Date</label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="e.g. Jun 29, 2026"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Local Timing</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 4:30 PM IST"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Arena Ground Venue</label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="e.g. Rampur School Arena"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-750 text-white font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow cursor-pointer transition-all duration-150"
            >
              Commit & Schedule Match
            </button>
          </div>
        </form>
      )}

      {/* TOURNAMENTS CHANGER TABS */}
      <div className="flex flex-wrap gap-2.5 border-b border-slate-200 pb-4">
        {TOURNAMENTS.map(cup => (
          <button
            key={cup.id}
            onClick={() => setSelectedCup(cup.id as any)}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
              selectedCup === cup.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cup.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns: Points Table & Awards list */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Points Table Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3.5 gap-2">
              <div>
                <h3 className="font-display text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-blue-600">🏆</span> {selectedCup === 'KHALSA' ? 'PANCHAYAT CO-HEIR STANDINGS' : 'VPL OFFICIAL POINTS RATING'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-wider">
                  Official ranking of teams for the current tournament stages
                </p>
              </div>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-mono font-black uppercase tracking-wider shrink-0 select-none">
                SIM ENABLED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[9px] font-black tracking-widest bg-slate-50/50">
                    <th className="px-4 py-3 font-sans font-black text-slate-600">TEAM POSITION</th>
                    <th className="px-3 py-3 text-center">PLAYED</th>
                    <th className="px-3 py-3 text-center">WON</th>
                    <th className="px-3 py-3 text-center">LOST</th>
                    <th className="px-4 py-3 text-center text-blue-600 font-extrabold bg-blue-50/20">PTS</th>
                    <th className="px-4 py-3 text-right">NRR</th>
                    <th className="px-4 py-3 text-center font-sans font-black text-slate-600">SIMULATE WIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-750">
                  {pointsTable.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 font-sans font-extrabold text-slate-900 uppercase text-xs tracking-wide">
                        <span className="inline-block text-slate-400 mr-2 font-mono text-[11px]">{index + 1}.</span>
                        {row.team}
                      </td>
                      <td className="px-3 py-3.5 text-center text-slate-650 font-bold">{row.played}</td>
                      <td className="px-3 py-3.5 text-center font-black text-emerald-600">{row.won}</td>
                      <td className="px-3 py-3.5 text-center text-rose-500 font-semibold">{row.lost}</td>
                      <td className="px-4 py-3.5 text-center font-black text-blue-700 bg-blue-50/30 font-semibold">{row.pts}</td>
                      <td className="px-4 py-3.5 text-right text-slate-600 font-medium">{row.nrr}</td>
                      <td className="px-4 py-3.5 text-center font-sans">
                        <button
                          onClick={() => recordSimulatedWin(index)}
                          className="bg-blue-50 border border-blue-200 hover:bg-blue-650 text-blue-700 hover:text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-lg transition-all cursor-pointer"
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

          {/* Awards Section */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4 text-left">
            <h4 className="font-display text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-150 pb-2.5 flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-blue-600" />
              <span>Current Season Awards Allocation</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl relative overflow-hidden">
                <span className="block font-black text-blue-700 uppercase tracking-wider text-[10px]">🥇 MVP 'DORA' MEDAL</span>
                <p className="text-slate-600 mt-1 pb-1 font-semibold leading-relaxed">
                  Winner benefits from a dedicated dairy buffalo calf gifted by village sponsors + a custom premium english willow batting bat presentation.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl relative overflow-hidden">
                <span className="block font-black text-indigo-700 uppercase tracking-wider text-[10px]">🔥 SIXER OF THE YEAR SOUVENIR</span>
                <p className="text-slate-600 mt-1 pb-1 font-semibold leading-relaxed">
                  Local sweet-shop sponsored fresh confectionaries (premium Laddoo treat packs) delivered directly to player’s home for 1 full season year!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Registered Teams & Rulebook */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Registered Teams card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 text-left">
            <h3 className="font-display text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
              <Users className="h-4 w-4 text-blue-600" />
              <span>Participating Teams</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {INITIAL_POINTS.map((row, idx) => {
                const colors = idx === 0 ? 'from-orange-500 to-amber-500' : idx === 1 ? 'from-blue-500 to-indigo-600' : idx === 2 ? 'from-emerald-500 to-teal-600' : 'from-red-500 to-rose-600';
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${colors}`} />
                      <span className="font-extrabold text-slate-800 uppercase tracking-wide">{row.team}</span>
                    </div>
                    <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 font-mono font-black uppercase px-2 py-0.5 rounded">
                      SEEDED
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rulebook card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 text-left relative overflow-hidden">
            <div className="absolute right-0 bottom-0 h-24 w-24 bg-blue-50/50 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="font-display text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-3.5">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>Rulebook & Conduct Regulations</span>
            </h3>
            
            <div className="space-y-2.5 text-xs text-slate-600 font-semibold leading-relaxed">
              <p className="border-l-2 border-blue-400 pl-2">
                Under standard Panchayat tape-ball cricket laws, bowing quotas are strictly restricted to maximum <strong>3 overs</strong> per player.
              </p>
              <p className="border-l-2 border-blue-400 pl-2">
                Wide deliveries grant exactly <strong>1 extra run</strong> and must be bowled again. No-balls also provide a free-hit on the next ball!
              </p>
              <p className="border-l-2 border-blue-400 pl-2">
                Pitch boundaries are accurately set to <strong>22 footsteps</strong>, marked clearly by local chalk lines prior to gameplay.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
