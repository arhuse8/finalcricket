import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AboutTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl">
        <Sparkles className="h-7 w-7 text-amber-300 animate-pulse mb-3" />
        <h4 className="font-display font-black tracking-wide text-md uppercase">Our Mission: Grassroots Cricket Digitization</h4>
        <p className="text-blue-100 text-xs mt-2 max-w-2xl leading-relaxed">
          We believe grassroots street, school and village tournament cricket in India is not just a game; it is an emotion. ApnaCricket acts as the record keeper, points calculator and champion builder for local tournament administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-slate-150 p-5 rounded-2xl space-y-3.5 bg-slate-50">
          <h5 className="font-display font-black text-slate-950 text-xs uppercase tracking-wide flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-100 text-blue-600">👨🏽‍💼</span>
            MEET THE FOUNDER & VISIONARY
          </h5>
          <div className="space-y-2">
            <h6 className="font-sans font-black text-xs text-blue-700">AVINASH R HUSE</h6>
            <p className="text-xs text-slate-600 leading-relaxed">
              Founder, Managing Director & Head of Product. Avinash set out to create ApnaCricket with a clear mandate: bypass over-engineered corporate portals and make a lightning-fast, high-utility live scoreboard and metrics tracking system for India's local premier leagues.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              "Every player logging their first half-century in Rampur or Malgudi deserves their stats archived alongside world legends. That's the vision of ApnaCricket."
            </p>
          </div>
        </div>

        <div className="border border-slate-150 p-5 rounded-2xl space-y-3.5 bg-slate-50">
          <h5 className="font-display font-black text-slate-950 text-xs uppercase tracking-wide flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-100 text-indigo-600">🤝</span>
            THE MANAGEMENT TEAM
          </h5>
          <p className="text-xs text-slate-600 leading-relaxed">
            Under the leadership of <strong>Avinash R Huse</strong>, ApnaCricket is engineered, supported, and expanded by an active group of grassroots organizers across Pune and Maharashtra.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 font-bold list-disc pl-4">
            <li><span className="text-indigo-600">Technical Ops:</span> 4 Full-stack React engineers building sub-second WebSockets updates.</li>
            <li><span className="text-indigo-600">Field Scoring Marshals:</span> Direct match score oversight group.</li>
            <li><span className="text-indigo-600">Regional Outreach:</span> Regional coordinators managing community relations.</li>
          </ul>
        </div>
      </div>

      <div className="border border-slate-150 p-5 rounded-2xl space-y-3.5 bg-white">
        <h5 className="font-display font-black text-slate-950 text-xs uppercase tracking-widest text-center">INDUSTRY SCALE ACHIEVEMENTS</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <span className="block text-xl font-mono font-black text-blue-600">3,400+</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Registered Heroes</span>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <span className="block text-xl font-mono font-black text-indigo-600">120+</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Leagues</span>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <span className="block text-xl font-mono font-black text-emerald-600">99.9%</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Score Real-time</span>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <span className="block text-xl font-mono font-black text-purple-600">₹2.5L+</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Disbursed Prizes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
