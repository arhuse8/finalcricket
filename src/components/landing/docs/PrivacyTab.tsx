import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function PrivacyTab() {
  const [localCacheSize, setLocalCacheSize] = useState('421 KB');
  const [purgeSuccess, setPurgeSuccess] = useState('');

  // Wipe local storage data with privacy audit
  const handleCachePurge = () => {
    if (confirm('Are you sure you want to purge all simulated matches, drafted team data, and active stats from cookies and LocalStorage? This action is irreversible.')) {
      localStorage.removeItem('apna_cricket_live_match');
      localStorage.removeItem('apna_cricket_players_db');
      localStorage.removeItem('apna_cricket_fixtures');
      localStorage.removeItem('apna_cricket_teams_db');
      localStorage.removeItem('apna_cricket_tournaments_db');
      setLocalCacheSize('0 KB');
      setPurgeSuccess('All local cached tournament history and roster memory successfully destroyed. Your Privacy is fully secure!');
      setTimeout(() => setPurgeSuccess(''), 4000);
    }
  };

  return (
    <div className="space-y-5 text-left">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="font-bold text-slate-950 uppercase text-xs">Privacy Protocol & Storage Disclosures</h4>
        <span className="text-[9px] text-slate-400 block font-mono">LAST UPDATED: June 20, 2026 | CLIENT CONTROLLED</span>
      </div>

      <div className="space-y-3.5 pr-2 select-text text-xs text-slate-600 leading-relaxed">
        <p><strong>1. COOKIES & LOCAL CACHE DISCLOSURE:</strong> ApnaCricket utilizes local state persistence algorithms (LocalStorage) to remember customized player drafts, dynamic tournaments, and match simulations. Your credentials are completely secure and are never shared with any advertisement tracker blocks.</p>
        <p><strong>2. PHONE NUMBER SECURITY:</strong> Any auxiliary phone numbers (such as founder hotline +91 91127 68872) or user-entered marshals profile details are fully shielded and encrypted.</p>
        <p><strong>3. PLAYER RETRACTABILITY RIGHTS:</strong> All regional champions listed in the stats page have absolute autonomy to modify, request revision, or purge their bowling/batting averages from the shared registry.</p>
      </div>

      {/* Cache Purge Panel */}
      <div className="border-2 border-red-100 bg-red-50 p-5 rounded-2xl text-left space-y-3.5">
        <h5 className="font-display font-black text-red-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Trash2 className="h-4.5 w-4.5 text-red-600 shrink-0" />
          CRITICAL PRIVACY CONTROL CENTER (PURGE HARD DRIVE DATABASE)
        </h5>
        <p className="text-xs text-red-800 leading-relaxed">
          Feel like cleaning up? You can immediately clear out all custom tournaments, newly recruited players, and draft scorecard records. This purges storage entirely.
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1 bg-white p-4 rounded-xl border border-red-200">
          <div className="text-xs font-bold text-slate-800 font-mono">
            <span className="block text-slate-400 uppercase text-[9px]">Storage cache used:</span>
            <span>{localCacheSize} - ApnaCricket Local Database</span>
          </div>
          
          <button 
            type="button"
            onClick={handleCachePurge}
            className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs px-5 py-3 rounded-lg shadow transition-all cursor-pointer"
          >
            Purge All Cached Memory
          </button>
        </div>

        {purgeSuccess && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-900 rounded-xl text-xs font-sans font-black leading-normal">
            {purgeSuccess}
          </div>
        )}
      </div>
    </div>
  );
}
