import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function HelpCenterTab() {
  const [helpTitle, setHelpTitle] = useState('');
  const [helpCat, setHelpCat] = useState('Scoring Bug');
  const [helpPriority, setHelpPriority] = useState('Medium');
  const [helpTicketSuccess, setHelpTicketSuccess] = useState('');
  
  const [tickets, setTickets] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('apnacricket_help_tickets');
      return stored ? JSON.parse(stored) : [
        { id: 'TKT-8271', title: 'Need support configuring Heavy Tape overs limit', category: 'Rules Configuration', priority: 'High', date: 'June 20, 2026', status: 'Open' },
        { id: 'TKT-1928', title: 'Added 12 players to Rampur club instead of 11', category: 'Team Edit', priority: 'Low', date: 'June 19, 2026', status: 'Resolved' }
      ];
    } catch {
      return [];
    }
  });

  // Sync tickets with localStorage
  useEffect(() => {
    localStorage.setItem('apnacricket_help_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Handle support ticket creation
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpTitle.trim()) return;

    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: helpTitle,
      category: helpCat,
      priority: helpPriority,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Open'
    };

    setTickets([newTicket, ...tickets]);
    setHelpTitle('');
    setHelpTicketSuccess('Support case created successfully! Our team will contact you shortly.');
    setTimeout(() => setHelpTicketSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Active Interactive Support Station</h4>
        <p className="text-[10px] text-slate-400">Declare issues, submit tickets, and monitor support log history in real time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Submit ticket form */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-150 p-5 rounded-2xl text-left">
          <h5 className="font-display font-black text-xs text-slate-950 uppercase mb-4 tracking-wide">
            Submit Support Case Ticket
          </h5>

          {helpTicketSuccess && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3.5 rounded-xl text-xs font-sans font-black mb-4">
              {helpTicketSuccess}
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-bold text-slate-800">
            <div className="space-y-1.55">
              <label className="text-[10px] uppercase text-slate-400 tracking-wider">Short Issue Description</label>
              <input 
                type="text"
                required
                value={helpTitle}
                onChange={(e) => setHelpTitle(e.target.value)}
                placeholder="e.g. Matches point calculation formula glitch"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400 tracking-wider">Ticket Category</label>
                <select 
                  value={helpCat}
                  onChange={(e) => setHelpCat(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5"
                >
                  <option value="Scoring Bug">Scoring Bug</option>
                  <option value="Team Edit">Team Edit</option>
                  <option value="Rules Config">Rules Config</option>
                  <option value="Verification">Verification</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400 tracking-wider">Priority Code</label>
                <select 
                  value={helpPriority}
                  onChange={(e) => setHelpPriority(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5"
                >
                  <option value="Low">Low - Informational</option>
                  <option value="Medium">Medium - Standard</option>
                  <option value="High">High - Blocking Series</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs py-3.5 rounded-xl transition-all shadow cursor-pointer"
            >
              Register New Case File
            </button>
          </form>
        </div>

        {/* Right Side: Active tickets feed */}
        <div className="lg:col-span-6 space-y-4 text-left">
          <h5 className="font-display font-black text-xs text-slate-900 uppercase tracking-wide">
            YOUR REGISTERED TICKETS LOG (PERSISTENT REPO)
          </h5>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2 pb-4">
            {tickets.map((t: any) => (
              <div key={t.id} className="p-4 border border-slate-150 rounded-xl bg-white space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-blue-600 font-extrabold">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono ${
                    t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h6 className="font-extrabold text-slate-950 uppercase tracking-wide leading-tight">{t.title}</h6>
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                  <span>Cat: {t.category}</span>
                  <span>Pr: {t.priority} • Filed: {t.date}</span>
                </div>
              </div>
            ))}

            {tickets.length === 0 && (
              <p className="text-slate-400 text-center text-xs py-10">No support tickets currently listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
