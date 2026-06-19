import React from 'react';
import { LANDING_CONFIG } from '../../config/landingConfig';

interface PointsTableBentoProps {
  onSelectView: (view: any) => void;
}

export default function PointsTableBento({ onSelectView }: PointsTableBentoProps) {
  const { pointsTable } = LANDING_CONFIG;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between text-left h-full">
      <div className="space-y-4 w-full">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="font-display font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-blue-600">📊</span> Points Table - SPL 2024
          </h4>
          <span 
            onClick={() => onSelectView('tournaments')}
            className="text-[10px] font-extrabold text-blue-600 hover:underline uppercase tracking-wider cursor-pointer"
          >
            View All
          </span>
        </div>

        {/* Small League standings table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-mono text-[10px] border-collapse">
            <thead>
              <tr className="text-slate-400 font-extrabold uppercase text-[9px] border-b border-slate-100">
                <th className="py-1">#</th>
                <th className="py-1">Team</th>
                <th className="py-1 text-center">P</th>
                <th className="py-1 text-center">W</th>
                <th className="py-1 text-center">L</th>
                <th className="py-1 text-center font-bold text-slate-800">PTS</th>
                <th className="py-1 text-right">NRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {pointsTable.map((row) => (
                <tr key={row.rank} className="hover:bg-slate-50">
                  <td className="py-2.5 font-bold text-slate-400">{row.rank}</td>
                  <td className="py-2.5 font-bold text-slate-800 flex items-center gap-1 shrink-0">
                    <span className="text-[11px] select-none">{row.icon}</span> 
                    <span>{row.team}</span>
                  </td>
                  <td className="py-2.5 text-center">{row.played}</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">{row.won}</td>
                  <td className="py-2.5 text-center text-red-500">{row.lost}</td>
                  <td className="py-2.5 text-center font-black text-slate-900 bg-slate-50 rounded">{row.pts}</td>
                  <td className="py-2.5 text-right font-semibold text-slate-500">{row.nrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
