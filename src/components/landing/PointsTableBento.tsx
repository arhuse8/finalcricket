import React from 'react';

interface PointsTableBentoProps {
  onSelectView: (view: any) => void;
  teams?: any[];
  matches?: any[];
}

export default function PointsTableBento({ onSelectView, teams = [], matches = [] }: PointsTableBentoProps) {
  
  // Dynamically compute standings for each team from matches
  const computedStandings = teams.map((team) => {
    // Find all completed matches involving this team
    const teamHasPlayedMatch = (m: any) => {
      // Check both database structures (matching names or matching raw ids)
      const matchesName1 = m.team1.fullName?.toLowerCase() === team.name?.toLowerCase() || m.team1.name?.toLowerCase() === team.short?.toLowerCase();
      const matchesName2 = m.team2.fullName?.toLowerCase() === team.name?.toLowerCase() || m.team2.name?.toLowerCase() === team.short?.toLowerCase();
      const matchesRawId = m.dbMatchRaw?.team_a_id === team.id || m.dbMatchRaw?.team_b_id === team.id || m.dbMatchRaw?.team_1_id === team.id || m.dbMatchRaw?.team_2_id === team.id;
      return matchesName1 || matchesName2 || matchesRawId;
    };

    const teamWonMatch = (m: any) => {
      // Check if this team is the winner
      if (m.winnerId === team.id) return true;
      // If winner name is written in notes or statusMessage
      const noteContainsWin = m.statusMessage?.toLowerCase().includes(team.name?.toLowerCase()) || m.statusMessage?.toLowerCase().includes(team.short?.toLowerCase());
      const noteContainsWon = noteContainsWin && m.statusMessage?.toLowerCase().includes('won');
      return noteContainsWon;
    };

    const completedMatchesInvolvingTeam = matches.filter(
      (m) => m.status === 'Completed' && teamHasPlayedMatch(m)
    );

    const played = completedMatchesInvolvingTeam.length;
    const won = completedMatchesInvolvingTeam.filter((m) => teamWonMatch(m)).length;
    const lost = played - won;
    const pts = won * 2;

    return {
      id: team.id,
      name: team.name,
      short: team.short,
      color: team.color,
      played,
      won,
      lost,
      pts,
      nrr: won > lost ? `+0.${won * 5}0` : won === lost ? '0.00' : `-0.${lost * 3}0`
    };
  });

  // Sort by Points (descending)
  const sortedStandings = [...computedStandings]
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between text-left h-full">
      <div className="space-y-4 w-full">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="font-display font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <span className="text-blue-600">📊</span> Standings - Live
          </h4>
          <span 
            onClick={() => onSelectView('tournaments')}
            className="text-[10px] font-extrabold text-blue-600 hover:underline uppercase tracking-wider cursor-pointer"
          >
            View All
          </span>
        </div>

        {sortedStandings.length > 0 ? (
          /* Small League standings table */
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left font-mono text-[10px] border-collapse">
              <thead>
                <tr className="text-slate-400 font-extrabold uppercase text-[9px] border-b border-slate-100">
                  <th className="py-1">#</th>
                  <th className="py-1">Team</th>
                  <th className="py-1 text-center">P</th>
                  <th className="py-1 text-center">W</th>
                  <th className="py-1 text-center font-bold text-slate-800">PTS</th>
                  <th className="py-1 text-right">NRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {sortedStandings.map((row, index) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-400">{index + 1}</td>
                    <td className="py-2.5 font-bold text-slate-800 flex items-center gap-1 shrink-0">
                      <span className="text-[11px] select-none">🏏</span> 
                      <span className="truncate max-w-[50px]" title={row.name}>{row.short}</span>
                    </td>
                    <td className="py-2.5 text-center">{row.played}</td>
                    <td className="py-2.5 text-center text-emerald-600 font-bold">{row.won}</td>
                    <td className="py-2.5 text-center font-black text-slate-900 bg-slate-50 rounded">{row.pts}</td>
                    <td className="py-2.5 text-right font-semibold text-slate-400">{row.nrr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State Fallback */
          <div className="text-center py-8 space-y-3 flex flex-col justify-center items-center h-full">
            <span className="text-2xl text-slate-400">📊</span>
            <p className="text-[11px] font-bold text-slate-500 uppercase font-mono">Standings empty</p>
            <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed text-center">
              No registered teams yet in Supabase. Create teams to calculate point tables!
            </p>
            <button
              onClick={() => onSelectView('teams')}
              className="text-[9px] font-black uppercase tracking-wider text-blue-600 border border-blue-200 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer mt-1"
            >
              Add Teams
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
