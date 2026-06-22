import React from 'react';

export default function HowItWorksTab() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Platform Workflow & Scorer Instructions</h4>
        <p className="text-[10px] text-slate-400">Step-by-step master guide for organizing cricket series</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4 items-start border-l-2 border-emerald-400 pl-4 py-1">
          <span className="h-6 w-6 bg-emerald-100 text-emerald-700 text-[11px] font-black rounded-full flex items-center justify-center shrink-0">1</span>
          <div>
            <h5 className="font-bold text-xs text-slate-950 uppercase">Step 1: Define Teams & Squad Roster</h5>
            <p className="text-xs text-slate-600 mt-1">Navigate to <strong>Teams</strong> or <strong>Players</strong> and recruit custom local pro players with realistic historical average, batting style and team initials.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start border-l-2 border-blue-400 pl-4 py-1">
          <span className="h-6 w-6 bg-blue-100 text-blue-700 text-[11px] font-black rounded-full flex items-center justify-center shrink-0">2</span>
          <div>
            <h5 className="font-bold text-xs text-slate-950 uppercase">Step 2: Schedule Tournament Cups</h5>
            <p className="text-xs text-slate-600 mt-1">Go to <strong>Tournaments Tab</strong>, hit <u>Launch Tournament</u> from the builder to set parameters like heavy-tape balls or leather balls, custom organizers and cash prizes.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start border-l-2 border-indigo-400 pl-4 py-1">
          <span className="h-6 w-6 bg-indigo-100 text-indigo-700 text-[11px] font-black rounded-full flex items-center justify-center shrink-0">3</span>
          <div>
            <h5 className="font-bold text-xs text-slate-950 uppercase">Step 3: Setup Fixtures & Match Simulator</h5>
            <p className="text-xs text-slate-600 mt-1">Link specific matches in your league. Send structured teams into head-to-head combat and track runs, target limits and live commentary updates.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start border-l-2 border-purple-400 pl-4 py-1">
          <span className="h-6 w-6 bg-purple-100 text-purple-700 text-[11px] font-black rounded-full flex items-center justify-center shrink-0">4</span>
          <div>
            <h5 className="font-bold text-xs text-slate-950 uppercase">Step 4: Live Points calculation</h5>
            <p className="text-xs text-slate-600 mt-1">As final simulation games complete, points tables, run rate differentials, and global team standings automatically shift rankings in real time!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
