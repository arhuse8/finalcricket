import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Award, ShieldAlert, Star, Database, Wifi, WifiOff, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { Match } from '../types';
import MatchSimulator from './MatchSimulator';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminSandboxProps {
  liveMatch: Match;
  setLiveMatch: (m: Match) => void;
  onPlayerStatUpdate: any;
  setCurrentSimulatedView: (v: 'list' | 'detail') => void;
}

export default function AdminSandbox({
  liveMatch,
  setLiveMatch,
  onPlayerStatUpdate,
  setCurrentSimulatedView
}: AdminSandboxProps) {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error' | 'not_configured'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fetchedDetails, setFetchedDetails] = useState<{ matches: number; teams: number; players: number } | null>(null);

  const testConnection = async () => {
    if (!isSupabaseConfigured) {
      setTestStatus('not_configured');
      return;
    }
    setTestStatus('testing');
    setErrorMessage(null);
    try {
      const [matchesRes, teamsRes, playersRes] = await Promise.all([
        supabase.from('matches').select('*', { count: 'exact', head: true }),
        supabase.from('teams').select('*', { count: 'exact', head: true }),
        supabase.from('players').select('*', { count: 'exact', head: true })
      ]);

      if (matchesRes.error) throw matchesRes.error;
      if (teamsRes.error) throw teamsRes.error;
      if (playersRes.error) throw playersRes.error;

      setFetchedDetails({
        matches: matchesRes.count || 0,
        teams: teamsRes.count || 0,
        players: playersRes.count || 0
      });
      setTestStatus('success');
    } catch (error: any) {
      console.error('Supabase active validation failed:', error);
      setErrorMessage(error.message || String(error));
      setTestStatus('error');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left" id="admin-sandbox-container">
      {/* Left columns: High fidelity Simulator & scoring action table */}
      <div className="xl:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
              🛠️ ADMINISTRATOR PRIVILEGED LEVEL
            </span>
            <h3 className="font-display text-2xl font-black text-slate-800 uppercase tracking-tight mt-1.5 flex items-center gap-1.5">
              <span>⚙️</span> Sandbox Cockpit
            </h3>
          </div>
          
          <button
            onClick={() => setCurrentSimulatedView('list')}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-[10px] uppercase font-black tracking-widest cursor-pointer border border-slate-200"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Matches</span>
          </button>
        </div>

        {/* Dynamic Umpire & Match Simulator panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-violet-600 animate-spin" />
            <h4 className="font-display text-lg font-black text-slate-900 uppercase">Interactive Score Control</h4>
          </div>
          <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
            Direct access to the simulation engine. You can play overs, auto-run entire innings, log custom wicket states, and trigger real-time updates that are broadcasted instantly to the Spectator Viewport.
          </p>

          <MatchSimulator
            match={liveMatch}
            setMatch={setLiveMatch}
            onPlayerStatUpdate={onPlayerStatUpdate}
          />
        </div>
      </div>

      {/* Right Column: Rule Book settings, Security logs, and State indicators */}
      <div className="space-y-6">
        {/* Supabase Connection Diagnostic & State Box */}
        <div className="rounded-2xl border border-slate-850 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-[-10px] text-7xl opacity-5 select-none font-black text-slate-400">⚡</div>
          
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 text-[8px] uppercase tracking-wider px-2 py-0.5 rounded font-black ${
              testStatus === 'success' ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-500/30' :
              testStatus === 'error' ? 'text-rose-400 bg-rose-950/50 border border-rose-500/30' :
              testStatus === 'testing' ? 'text-yellow-400 bg-yellow-950/50 border border-yellow-500/30 animate-pulse' :
              'text-orange-400 bg-orange-950/50 border border-orange-500/30'
            }`}>
              {testStatus === 'success' && <Wifi className="h-2.5 w-2.5 mr-0.5" />}
              {testStatus === 'error' && <WifiOff className="h-2.5 w-2.5 mr-0.5" />}
              {testStatus === 'success' ? 'CONNECTED' : 
               testStatus === 'error' ? 'CONNECTION ERROR' :
               testStatus === 'testing' ? 'DIAGNOSTIC ACTIVE' : 'LOCAL OFFLINE'}
            </span>

            <button 
              onClick={testConnection}
              disabled={testStatus === 'testing'}
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Rerun Supabase connection diagnostic"
            >
              <RefreshCw className={`h-3 w-3 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <h4 className="font-display font-black text-slate-100 text-sm uppercase tracking-wider flex items-center gap-1.5 mt-4 mb-1">
            <Database className="h-4 w-4 text-violet-400" />
            Supabase Connection Diagnostic
          </h4>
          <p className="text-[10px] text-slate-400 leading-normal font-sans mb-3">
            Real-time validation engine querying actual active database tables.
          </p>

          {testStatus === 'success' && (
            <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                <Check className="h-3.5 w-3.5" />
                <span>Working Correctly!</span>
              </div>
              <div className="space-y-1 font-mono text-[10px] text-slate-300">
                <div className="flex justify-between pb-1 border-b border-white/5">
                  <span>Matches count:</span>
                  <span className="text-white font-bold">{fetchedDetails?.matches}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-white/5">
                  <span>Teams count:</span>
                  <span className="text-white font-bold">{fetchedDetails?.teams}</span>
                </div>
                <div className="flex justify-between">
                  <span>Players count:</span>
                  <span className="text-white font-bold">{fetchedDetails?.players}</span>
                </div>
              </div>
            </div>
          )}

          {testStatus === 'error' && (
            <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold mb-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Connection failed</span>
              </div>
              <p className="text-[10px] font-mono text-rose-300 leading-normal bg-rose-950/40 p-2 rounded border border-rose-900/30 max-h-32 overflow-y-auto">
                {errorMessage}
              </p>
              <p className="text-[9px] text-slate-400 leading-normal pt-1">
                Check whether your <code className="text-yellow-400 font-bold font-mono">VITE_SUPABASE_URL</code> or <code className="text-yellow-400 font-bold font-mono">VITE_SUPABASE_ANON_KEY</code> credentials entered in your environment secrets have expired or carry typo characters.
              </p>
            </div>
          )}

          {testStatus === 'not_configured' && (
            <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-orange-400 font-bold mb-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Missing environment variables</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                App is currently running in fallback <strong>Local Offline</strong> mode because you have not set up your Supabase database credentials.
              </p>
              <div className="bg-slate-800 p-2 rounded border border-white/5 space-y-1 font-mono text-[9px] text-slate-300">
                <span className="block text-white font-medium mb-0.5">Required Variables:</span>
                <div>• VITE_SUPABASE_URL</div>
                <div>• VITE_SUPABASE_ANON_KEY</div>
              </div>
              <p className="text-[9px] text-slate-400 leading-normal pt-1">
                Go to <strong>Settings (cog icon) &gt; Secrets</strong> inside the workspace to enter them securely to connect real-time matches instantly!
              </p>
            </div>
          )}

          {testStatus === 'testing' && (
            <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400 space-y-2 mt-3 pt-3 border-t border-white/10">
              <RefreshCw className="h-5 w-5 text-violet-400 animate-spin" />
              <span className="text-xs font-mono">Verifying database ping...</span>
            </div>
          )}
        </div>

        {/* Local Rulebook / Ground Rules Customizer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="font-display font-black text-[#5b21b6] text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Star className="h-4 w-4 text-[#5b21b6] fill-current" />
            Local Arena Rules Config
          </h4>
          <ul className="text-xs text-slate-500 space-y-2.5 leading-relaxed list-disc list-inside">
            <li>Matches strictly limited to {liveMatch.oversLimit} overs maximum.</li>
            <li>Wides and No-Balls award exactly 1 run to the active batting side.</li>
            <li>Hitting to the Cow Corner boundary uses high strike density factors (6s or Caught!).</li>
          </ul>
        </div>

        {/* Staging & Local Simulation instructions */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
          <h5 className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5 font-mono">STAGING MODE NOTES</h5>
          <p className="text-[11px] text-slate-500 leading-normal font-medium">
            Remember: Any score modifications made in this sandbox are reactive. Toggling between viewers at the top allows you to instantly inspect how spectators see your mock data overlays.
          </p>
        </div>
      </div>
    </div>
  );
}
