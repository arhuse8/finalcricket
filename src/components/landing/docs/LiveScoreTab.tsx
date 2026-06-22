import React, { useState } from 'react';
import { Play, RotateCw, Sparkles, Tv, HelpCircle, Star } from 'lucide-react';

export default function LiveScoreTab() {
  const [runs, setRuns] = useState(145);
  const [wickets, setWickets] = useState(4);
  const [oversCount, setOversCount] = useState(14);
  const [ballsCount, setBallsCount] = useState(2);
  const [prevBalls, setPrevBalls] = useState<string[]>(['1', '4', 'wd', '6', 'W', '2']);
  const [recentEvent, setRecentEvent] = useState('Partner is rotating strike');

  const handleScoreEvent = (type: 'dot' | 'one' | 'four' | 'six' | 'wide' | 'wicket') => {
    let rollRecent = '';
    
    if (type === 'wicket') {
      if (wickets >= 10) {
        setRecentEvent('Innings All-Out!');
        return;
      }
      setWickets(prev => prev + 1);
      setPrevBalls(prev => ['W', ...prev.slice(0, 5)]);
      rollRecent = '💥 WICKET! Beautiful clean bowled under pressure!';
    } else if (type === 'wide') {
      setRuns(prev => prev + 1);
      setPrevBalls(prev => ['wd', ...prev.slice(0, 5)]);
      rollRecent = '🏃 Wide ball! Extra run awarded, bowler needs to re-bowl.';
    } else {
      let runVal = 0;
      let ballChar = '0';
      if (type === 'dot') {
        runVal = 0;
        ballChar = '0';
        rollRecent = '⚡ Dot ball. Stellar defensive block by the batsman.';
      } else if (type === 'one') {
        runVal = 1;
        ballChar = '1';
        rollRecent = '🏏 Single run taken. Smooth rotation of strike.';
      } else if (type === 'four') {
        runVal = 4;
        ballChar = '4';
        rollRecent = '🔥 FOUR! Smashed fiercely through the covers to the boundary line!';
      } else if (type === 'six') {
        runVal = 6;
        ballChar = '6';
        rollRecent = '🚀 SIXER! Lofted miles into the village sky! Dynamic strike!';
      }

      setRuns(prev => prev + runVal);
      setPrevBalls(prev => [ballChar, ...prev.slice(0, 5)]);

      // Cycle overs & balls
      if (ballsCount >= 5) {
        setBallsCount(0);
        setOversCount(prev => prev + 1);
      } else {
        setBallsCount(prev => prev + 1);
      }
    }

    setRecentEvent(rollRecent);
  };

  const resetSimulation = () => {
    setRuns(145);
    setWickets(4);
    setOversCount(14);
    setBallsCount(2);
    setPrevBalls(['1', '4', 'wd', '6', 'W', '2']);
    setRecentEvent('Simulation has been reset successfully');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-650 to-orange-600 text-white p-6 rounded-2xl">
        <Tv className="h-7 w-7 text-yellow-300 mb-3 animate-pulse" />
        <h4 className="font-display font-black tracking-wide text-md uppercase">Dynamic Live Backstage Scorer Simulator</h4>
        <p className="text-orange-50 text-xs mt-2 max-w-2xl leading-relaxed">
          Witness and experiment with ApnaCricket’s sub-second match scoring algorithms. Real-time cricket commentary updates live as our software registers each delivery’s events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Interactive Scoring console */}
        <div className="border border-slate-150 p-5 rounded-2xl bg-white space-y-4 text-left shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Scoring Simulation Deck</span>
            <button 
              onClick={resetSimulation}
              className="text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-red-500 flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="h-3 w-3" /> Reset Desk
            </button>
          </div>

          {/* Score Counter Visualizer */}
          <div className="bg-slate-900 text-white p-5 rounded-xl text-center space-y-2 relative overflow-hidden">
            <div className="absolute top-2 right-3 font-mono text-[8px] bg-red-650 text-white px-2 py-0.5 rounded-full animate-pulse font-black uppercase select-none">
              LIVE SIM
            </div>
            
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest block font-sans">
              RAMPUR WARRIORS BATTING
            </span>
            <div className="flex justify-center items-baseline gap-1.5 pt-1">
              <span className="text-3xl font-mono font-black">{runs}/{wickets}</span>
              <span className="text-slate-400 text-xs font-mono font-bold">Overs: {oversCount}.{ballsCount}</span>
            </div>

            {/* Run-Rate metrics */}
            <div className="flex justify-center gap-4 text-[9px] text-slate-400 font-mono font-bold border-t border-slate-800 pt-2 shrink-0">
              <span>CRR: {(runs / Math.max(1, (oversCount + ballsCount / 6))).toFixed(2)}</span>
              <span>Proj Score: {Math.round((runs / Math.max(1, (oversCount + ballsCount / 6))) * 12)}</span>
            </div>
          </div>

          {/* Interactive Controller buttons */}
          <div className="space-y-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
              Register Next Ball Delivery Action
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleScoreEvent('dot')}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-black uppercase text-[10px] py-2.5 rounded-xl cursor-pointer text-center"
              >
                0 - Dot Ball
              </button>
              <button 
                onClick={() => handleScoreEvent('one')}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-black uppercase text-[10px] py-2.5 rounded-xl cursor-pointer text-center"
              >
                1 Run
              </button>
              <button 
                onClick={() => handleScoreEvent('wide')}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-black uppercase text-[10px] py-2.5 rounded-xl cursor-pointer text-center"
              >
                Wide (wd)
              </button>
              <button 
                onClick={() => handleScoreEvent('four')}
                className="bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-700 font-black uppercase text-[10px] py-2.5 rounded-xl cursor-pointer transition-all text-center"
              >
                4 Boundary
              </button>
              <button 
                onClick={() => handleScoreEvent('six')}
                className="bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-800 font-black uppercase text-[10px] py-2.5 rounded-xl cursor-pointer transition-all text-center"
              >
                6 Sixer!
              </button>
              <button 
                onClick={() => handleScoreEvent('wicket')}
                className="bg-red-550 hover:bg-red-650 text-white border border-red-200 font-black uppercase text-[10px] py-2.5 rounded-xl cursor-pointer transition-all text-center"
              >
                Wicket!
              </button>
            </div>
          </div>

          {/* Commentary & Ball logs */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-1.5 text-xs">
            <span className="text-[8px] font-mono font-bold uppercase text-slate-400 block">UPDATED TELEMETRY FEED:</span>
            <p className="font-extrabold text-slate-900 italic font-sans">"{recentEvent}"</p>
            <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono tracking-wide pt-1">
              <span>RECENT BALLS LOG:</span>
              <div className="flex gap-1">
                {prevBalls.map((b, i) => (
                  <span key={i} className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[8px] font-black ${
                    b === 'W' ? 'bg-red-500 text-white' : b === '6' ? 'bg-emerald-500 text-white' : b === '4' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature listings */}
        <div className="border border-slate-150 p-5 rounded-2xl bg-white space-y-4 text-left shadow-sm">
          <h5 className="font-display font-black text-slate-950 text-xs uppercase tracking-wide">
            🏆 ADVANCED SCOREBOARD OPERATIONS
          </h5>
          <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
            ApnaCricket handles dynamic cricket rules under the hood, enabling simple ball-by-ball score tracking for any cricket type.
          </p>

          <div className="space-y-3.5 pt-1">
            <div className="flex gap-3 items-start">
              <span className="p-1 rounded bg-blue-50 text-blue-600 text-[11px] font-bold">🏏</span>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs">TAPE & LEATHER CONFIG</span>
                <span className="text-[11px] text-slate-500">Includes native code support for heavy tape boundaries, no-ball free-hits, and customized batting lineups.</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="p-1 rounded bg-indigo-50 text-indigo-600 text-[11px] font-bold">🎙️</span>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs">AUTOMATED COMMENTARY REPORT</span>
                <span className="text-[11px] text-slate-500">Generates text-based playback reporting on boundaries, critical wickets, and maiden overs.</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="p-1 rounded bg-yellow-50 text-yellow-700 text-[11px] font-bold">⚡</span>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs">OFFLINE-FIRST ARCHIVING</span>
                <span className="text-[11px] text-slate-500">Synchronizes live scorer data immediately to LocalCache, shielding you from village signal dropouts.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
