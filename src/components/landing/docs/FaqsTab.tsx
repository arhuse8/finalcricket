import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function FaqsTab() {
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqData = [
    { q: "Is ApnaCricket live score keeping 100% free?", a: "Yes, our core live score broadcasting tool, ball-by-ball simulator, players records registry, and team management platforms are absolutely free for everyone, forever." },
    { q: "What cricket balls are supported in the Tournament scheduler?", a: "We support heavy tape ball, cricket leather ball, tennis ball, and rubber ball. You can customize ball types in the match builder on the dynamic tournaments tab." },
    { q: "Can we add customized players that do not belong to the primary list?", a: "Most definitely! Head to Player Stats page, hit 'Recruit Local Professional', and customize their names, styles, specific runs database, and teams list." },
    { q: "How are regional tournament point calculations structured?", a: "Winners receive 2 league points. Draw/abandon averages 1 point, and net run rate is computed automatically using overs completed and overall scores." },
    { q: "Who can edit local matches or declare innings?", a: "Any official authorized under the registered organizer names has exclusive secure rights to update active runs, wickets, and play-by-play balls." }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-3">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">FAQ Panel</h4>
          <p className="text-[10px] text-slate-400">Search and find questions relating to database operations and scores logging</p>
        </div>
        {/* Search input inside FAQ */}
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Type to filter FAQs..." 
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-3.5 text-left">
        {faqData
          .filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase()))
          .map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="border border-slate-150 rounded-2xl overflow-hidden transition-all bg-slate-50">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex justify-between items-center bg-white hover:bg-slate-50 cursor-pointer font-bold text-xs text-slate-900 uppercase tracking-wide gap-3"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-blue-600 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
        })}

        {faqData.filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase())).length === 0 && (
          <div className="text-center py-10 space-y-2">
            <p className="text-slate-400 font-bold text-xs uppercase font-mono">No matching FAQs discovered!</p>
            <p className="text-[10px] text-slate-400">Try typing another query such as "balls" or "scoring".</p>
          </div>
        )}
      </div>
    </div>
  );
}
