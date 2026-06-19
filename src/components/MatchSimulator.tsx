import React, { useState, useEffect, useRef } from 'react';
import { Match, BallRecord, Player } from '../types';
import { Play, Pause, Flame, RefreshCw, Award, Sliders, Volume2, UserPlus } from 'lucide-react';
import { COMMENTARY_PRESETS, INITIAL_PLAYERS } from '../mockData';

interface MatchSimulatorProps {
  match: Match;
  setMatch: React.Dispatch<React.SetStateAction<Match>>;
  onPlayerStatUpdate: (playerName: string, runs: number, balls: number, fours: number, sixes: number, wicket: boolean, bowlerName: string) => void;
}

export default function MatchSimulator({ match, setMatch, onPlayerStatUpdate }: MatchSimulatorProps) {
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(3000); // ms per ball
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop auto play when match is completed or component unmounts
  useEffect(() => {
    if (match.status === 'Completed') {
      setIsAutoSimulating(false);
    }
  }, [match.status]);

  useEffect(() => {
    if (isAutoSimulating) {
      intervalRef.current = setInterval(() => {
        simulateRandomBall();
      }, simulationSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoSimulating, simulationSpeed, match]);

  // Rotates who is on strike
  const rotateStrike = () => {
    setMatch(prev => ({
      ...prev,
      onStrikeIndex: prev.onStrikeIndex === 0 ? 1 : 0
    }));
  };

  // Main custom score updater logic
  const recordBallValue = (
    runs: number,
    options: { isWide?: boolean; isNoBall?: boolean; isWicket?: boolean } = {}
  ) => {
    if (match.status === 'Completed') return;

    setMatch(prev => {
      const matchState = JSON.parse(JSON.stringify(prev)) as Match;
      const score = matchState.team1.score;
      const mini = matchState.miniScore;
      
      const { isWide = false, isNoBall = false, isWicket = false } = options;

      // Identify active batsmen
      const striker = matchState.onStrikeIndex === 0 ? mini.batsman1 : mini.batsman2;
      const nonStriker = matchState.onStrikeIndex === 0 ? mini.batsman2 : mini.batsman1;
      const activeBowler = mini.bowler;

      let ballLabel = runs.toString();
      let extraRuns = 0;

      // Handle wide/no-balls (extras)
      if (isWide) {
        extraRuns = 1;
        ballLabel = 'Wd';
        score.runs += (runs + extraRuns);
        
        // Bowler concessions (Extras count as runs to bowler but no ball is added to over)
        activeBowler.runs += (runs + extraRuns);
        
        const commentary = `WIDE! ${activeBowler.name} misses the line completely. The ball swings wide down the leg side, wicket-keeper dives to save extra boundary! +1 Extra run.`;
        
        // Add Ball Record to History
        const ballRecord: BallRecord = {
          overNumber: score.overs,
          ballOfOver: score.balls + 1,
          run: runs + 1,
          isWide: true,
          isNoBall: false,
          isWicket: false,
          batsmanName: striker.name,
          bowlerName: activeBowler.name,
          commentary
        };

        matchState.recentBalls = [...matchState.recentBalls.slice(-5), ballLabel];
        matchState.ballByBallHistory.unshift(ballRecord);
        return matchState;
      }

      if (isNoBall) {
        extraRuns = 1;
        ballLabel = 'Nb';
        score.runs += (runs + extraRuns);
        striker.runs += runs;
        striker.balls += 1;
        
        if (runs === 4) striker.fours += 1;
        if (runs === 6) striker.sixes += 1;

        activeBowler.runs += (runs + extraRuns);
        
        const commentary = `NO BALL! High full toss above waist from ${activeBowler.name}. ${striker.name} plays it away for ${runs} runs. FREE HIT coming up!`;
        
        const ballRecord: BallRecord = {
          overNumber: score.overs,
          ballOfOver: score.balls,
          run: runs + 1,
          isWide: false,
          isNoBall: true,
          isWicket: false,
          batsmanName: striker.name,
          bowlerName: activeBowler.name,
          commentary
        };

        matchState.recentBalls = [...matchState.recentBalls.slice(-5), ballLabel];
        matchState.ballByBallHistory.unshift(ballRecord);
        return matchState;
      }

      // Handle Wickets
      if (isWicket) {
        ballLabel = 'W';
        score.wickets += 1;
        
        // Increment bowler stats
        activeBowler.wickets += 1;
        
        // Increment balls to bowler overs
        let currentBowlerBalls = Math.round((activeBowler.overs % 1) * 10) + 1;
        let currentBowlerOvers = Math.floor(activeBowler.overs);
        if (currentBowlerBalls >= 6) {
          activeBowler.overs = currentBowlerOvers + 1;
        } else {
          activeBowler.overs = currentBowlerOvers + (currentBowlerBalls / 10);
        }

        // Add to striker's balls faced and record wicket status
        striker.balls += 1;
        
        // Find batsman in team 1 batting card and mark them out
        const battingCardPlayer = matchState.team1.battingCard.find(
          p => p.playerName === striker.name
        );
        if (battingCardPlayer) {
          battingCardPlayer.status = `b ${activeBowler.name}`;
          battingCardPlayer.runs = striker.runs;
          battingCardPlayer.balls = striker.balls;
        }

        // Notify parent to store real-time statistics
        onPlayerStatUpdate(striker.name, striker.runs, striker.balls, striker.fours, striker.sixes, true, activeBowler.name);

        const wicketCommentary = `OUT! Absolute peach of a delivery from ${activeBowler.name}! ${striker.name} goes for a big village swipe but only finds the stumps! Deep shock in Rampur stands. ${striker.name} scored ${striker.runs} (${striker.balls}b).`;

        const ballRecord: BallRecord = {
          overNumber: score.overs,
          ballOfOver: score.balls + 1,
          run: 0,
          isWide: false,
          isNoBall: false,
          isWicket: true,
          wicketType: 'Bowled',
          batsmanName: striker.name,
          bowlerName: activeBowler.name,
          commentary: wicketCommentary
        };

        // Replace the dismissed batsman with a new local player
        const remainingPlayers = INITIAL_PLAYERS.filter(
          p => p.teamId === prev.battingTeamId && 
          p.name !== mini.batsman1.name && 
          p.name !== mini.batsman2.name
        );

        if (remainingPlayers.length > 0 && score.wickets < 10) {
          const newPlayer = remainingPlayers[Math.floor(Math.random() * remainingPlayers.length)];
          if (matchState.onStrikeIndex === 0) {
            mini.batsman1 = {
              name: `${newPlayer.name}`,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              strikeRate: 0
            };
          } else {
            mini.batsman2 = {
              name: `${newPlayer.name}`,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              strikeRate: 0
            };
          }
          
          // Also append to the match batting cards
          matchState.team1.battingCard.push({
            playerName: newPlayer.name,
            status: 'not out',
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0
          });
        }

        // Increment balls and overs
        score.balls += 1;
        if (score.balls >= 6) {
          score.overs += 1;
          score.balls = 0;
          // Swap strikes at end of over
          matchState.onStrikeIndex = matchState.onStrikeIndex === 0 ? 1 : 0;
        }

        // Match completion check (e.g., reached wickets limit or overs limit)
        if (score.wickets >= 10 || score.overs >= matchState.oversLimit) {
          matchState.status = 'Completed';
        }

        matchState.recentBalls = [...matchState.recentBalls.slice(-5), ballLabel];
        matchState.ballByBallHistory.unshift(ballRecord);
        return matchState;
      }

      // Normal Runs Scored
      score.runs += runs;
      striker.runs += runs;
      striker.balls += 1;
      
      // Update boundaries
      if (runs === 4) striker.fours += 1;
      if (runs === 6) striker.sixes += 1;
      
      // Update strike rates
      striker.strikeRate = striker.balls > 0 ? (striker.runs / striker.balls) * 100 : 0;

      // Update bowler stats
      activeBowler.runs += runs;
      
      let bowlingBalls = Math.round((activeBowler.overs % 1) * 10) + 1;
      let bowlingOvers = Math.floor(activeBowler.overs);
      if (bowlingBalls >= 6) {
        activeBowler.overs = bowlingOvers + 1;
      } else {
        activeBowler.overs = bowlingOvers + (bowlingBalls / 10);
      }
      activeBowler.economy = activeBowler.overs > 0 ? (activeBowler.runs / activeBowler.overs) : 0;

      // Fetch dynamic commentary preset
      let baseComm = COMMENTARY_PRESETS[Math.floor(Math.random() * COMMENTARY_PRESETS.length)];
      if (runs === 6) {
        baseComm = `MASSIVE BLOW! ${striker.name} hammers it right out of the center and sends it sailing over the neem trees into the village parking lot for a GIANT 6!`;
      } else if (runs === 4) {
        baseComm = `FOUR MORE! Elegant shot by ${striker.name}, cracking it down the pitch past the lunging mid-off fielder! The boundary straw fence didn't stop that!`;
      } else if (runs === 0) {
        baseComm = `Dot ball! ${activeBowler.name} throws a gorgeous dart block, ${striker.name} is bottled down with no run possible.`;
      }

      const ballRecord: BallRecord = {
        overNumber: score.overs,
        ballOfOver: score.balls + 1,
        run: runs,
        isWide: false,
        isNoBall: false,
        isWicket: false,
        batsmanName: striker.name,
        bowlerName: activeBowler.name,
        commentary: baseComm
      };

      // Notify parent of batsman live stats to save in local db
      onPlayerStatUpdate(striker.name, striker.runs, striker.balls, striker.fours, striker.sixes, false, activeBowler.name);

      // Advance balls and overs
      score.balls += 1;
      if (score.balls >= 6) {
        score.overs += 1;
        score.balls = 0;
        // End of over strike rotation
        matchState.onStrikeIndex = matchState.onStrikeIndex === 0 ? 1 : 0;
      }

      // Check boundaries trigger strike rotation on odd runs (1 or 3 runs)
      if (runs === 1 || runs === 3) {
        matchState.onStrikeIndex = matchState.onStrikeIndex === 0 ? 1 : 0;
      }

      // Check match completion
      if (score.overs >= matchState.oversLimit) {
        matchState.status = 'Completed';
      }

      // Sync batsman into general batting card
      const battingCardPlayer = matchState.team1.battingCard.find(
        p => p.playerName === striker.name
      );
      if (battingCardPlayer) {
        battingCardPlayer.runs = striker.runs;
        battingCardPlayer.balls = striker.balls;
        battingCardPlayer.fours = striker.fours;
        battingCardPlayer.sixes = striker.sixes;
      }

      matchState.recentBalls = [...matchState.recentBalls.slice(-5), ballLabel];
      matchState.ballByBallHistory.unshift(ballRecord);
      
      return matchState;
    });
  };

  const simulateRandomBall = () => {
    const randomVal = Math.random();
    if (randomVal < 0.1) {
      // 10% chance wicket
      recordBallValue(0, { isWicket: true });
    } else if (randomVal < 0.16) {
      // 6% chance wide
      recordBallValue(0, { isWide: true });
    } else if (randomVal < 0.22) {
      // 6% chance No-ball
      recordBallValue(1, { isNoBall: true });
    } else if (randomVal < 0.45) {
      // 23% chance dot ball
      recordBallValue(0);
    } else if (randomVal < 0.7) {
      // 25% chance single run
      recordBallValue(1);
    } else if (randomVal < 0.82) {
      // 12% chance 2 runs
      recordBallValue(2);
    } else if (randomVal < 0.92) {
      // 10% chance 4 boundary
      recordBallValue(4);
    } else {
      // 8% chance 6 runs massive hit
      recordBallValue(6);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md relative overflow-hidden" id="match-simulator-panel">
      {/* Decorative slider tags */}
      <div className="absolute right-0 bottom-0 h-28 w-28 bg-[#ccff00]/5 rounded-full blur-2xl" />
      
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-[#ccff00]" />
            <h4 className="font-display text-lg font-black text-white uppercase tracking-tight">💻 APNA UMPIRE PANEL</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Control live cricket scores or run rapid simulations.</p>
        </div>

        <div className="flex items-center gap-2">
          {match.status === 'Completed' ? (
            <span className="rounded-none bg-white/5 border border-white/15 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#ccff00]">
              🏁 MATCH FINISHED
            </span>
          ) : (
            <>
              {/* Speed Controller label */}
              <select
                value={simulationSpeed}
                onChange={e => setSimulationSpeed(Number(e.target.value))}
                className="bg-black border border-white/10 rounded-lg px-2.5 py-2 text-xs font-mono font-bold text-[#ccff00] focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                disabled={isAutoSimulating}
                id="select-sim-speed"
              >
                <option value={5000}>🐢 5s/BALL (Slow)</option>
                <option value={3000}>⚡ 3s/BALL (Normal)</option>
                <option value={1500}>🏎️ 1.5s/BALL (Fast)</option>
              </select>

              <button
                onClick={() => setIsAutoSimulating(!isAutoSimulating)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md ${
                  isAutoSimulating
                    ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                    : 'bg-[#ccff00] hover:bg-[#bbf000] text-[#061a12]'
                }`}
                id="btn-toggle-auto-sim"
              >
                {isAutoSimulating ? (
                  <>
                    <Pause className="h-3.5 w-3.5 fill-current" />
                    <span>Stop Auto Play</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Auto Simulate</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Direct manual umpire click buttons */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">
            🏏 KEY IN LIVE BALL RESULTS (TAP TO ACTION)
          </span>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <button
              onClick={() => recordBallValue(0)}
              disabled={match.status === 'Completed'}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-white/10 bg-black/40 hover:bg-[#ccff00]/10 hover:border-[#ccff00] text-slate-200 transition-all font-mono font-black disabled:opacity-40"
              id="umpire-btn-dot"
            >
              <span className="text-2xl">0</span>
              <span className="text-[9px] text-slate-400 font-sans uppercase font-bold mt-1">Dot Ball</span>
            </button>

            <button
              onClick={() => recordBallValue(1)}
              disabled={match.status === 'Completed'}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-white/10 bg-black/40 hover:bg-[#ccff00]/10 hover:border-[#ccff00] text-[#ccff00] transition-all font-mono font-black disabled:opacity-40"
              id="umpire-btn-1"
            >
              <span className="text-2xl">1</span>
              <span className="text-[9px] text-slate-400 font-sans uppercase font-bold mt-1">Single</span>
            </button>

            <button
              onClick={() => recordBallValue(2)}
              disabled={match.status === 'Completed'}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-white/10 bg-black/40 hover:bg-[#ccff00]/10 hover:border-[#ccff00] text-slate-200 transition-all font-mono font-black disabled:opacity-40"
              id="umpire-btn-2"
            >
              <span className="text-2xl">2</span>
              <span className="text-[9px] text-slate-400 font-sans uppercase font-bold mt-1">Double</span>
            </button>

            <button
              onClick={() => recordBallValue(3)}
              disabled={match.status === 'Completed'}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-white/10 bg-black/40 hover:bg-[#ccff00]/10 hover:border-[#ccff00] text-slate-200 transition-all font-mono font-black disabled:opacity-40"
              id="umpire-btn-3"
            >
              <span className="text-2xl">3</span>
              <span className="text-[9px] text-slate-400 font-sans uppercase font-bold mt-1">Three Runs</span>
            </button>

            <button
              onClick={() => recordBallValue(4)}
              disabled={match.status === 'Completed'}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 text-emerald-400 transition-all font-mono font-black disabled:opacity-40"
              id="umpire-btn-4"
            >
              <span className="text-2xl font-black">4</span>
              <span className="text-[9px] font-sans uppercase font-black tracking-wider mt-1">FOUR</span>
            </button>

            <button
              onClick={() => recordBallValue(6)}
              disabled={match.status === 'Completed'}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-[#ccff00]/30 bg-[#ccff00]/10 hover:bg-[#ccff00] hover:text-[#061a12] hover:border-[#ccff00] text-[#ccff00] transition-all font-mono font-black disabled:opacity-40 animate-pulse"
              id="umpire-btn-6"
            >
              <span className="text-2xl font-black">6</span>
              <span className="text-[9px] font-sans uppercase font-black tracking-wider mt-1">SIXER!</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => recordBallValue(0, { isWide: true })}
              disabled={match.status === 'Completed'}
              className="py-3 px-3 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 text-blue-400 text-xs font-black tracking-wider font-mono uppercase transition-all disabled:opacity-40"
              id="umpire-btn-wide"
            >
              +1 Wide
            </button>
            <button
              onClick={() => recordBallValue(0, { isNoBall: true })}
              disabled={match.status === 'Completed'}
              className="py-3 px-3 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 text-indigo-400 text-xs font-black tracking-wider font-mono uppercase transition-all disabled:opacity-40"
              id="umpire-btn-noball"
            >
              +1 No Ball
            </button>
            <button
              onClick={rotateStrike}
              disabled={match.status === 'Completed'}
              className="py-3 px-3 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 text-slate-300 text-xs font-black tracking-wider font-sans uppercase tracking-wide transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
              id="umpire-btn-rotate"
            >
              🔄 Strike Switch
            </button>
            <button
              onClick={() => recordBallValue(0, { isWicket: true })}
              disabled={match.status === 'Completed'}
              className="py-3 px-3 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-600 hover:text-white hover:border-red-600 text-red-400 text-xs font-black tracking-wider font-mono uppercase transition-all disabled:opacity-40"
              id="umpire-btn-wicket"
            >
              🔴 OUT (Wicket)
            </button>
          </div>
        </div>

        {/* Umpire Assistant Metadata */}
        <div className="bg-black/50 rounded-xl p-4 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase tracking-wider text-[10px] border-b border-white/10 pb-2 mb-2">
              <Volume2 className="h-4 w-4 text-[#ccff00]" />
              <span>Commentary Pitch</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every manual umpire click dynamically generates professional commentary for the live timeline feed. Use strike-swap to manage who is at bat!
            </p>
          </div>
          
          <div className="mt-4 pt-3.5 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-405">
              <span className="uppercase font-bold text-[10px]">On Crease:</span>
              <span className="font-extrabold text-white text-xs uppercase">
                {match.onStrikeIndex === 0 ? match.miniScore.batsman1.name : match.miniScore.batsman2.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-405 mt-1.5">
              <span className="uppercase font-bold text-[10px]">Stance:</span>
              <span className="text-[#ccff00] font-black uppercase text-[9px] tracking-wider">
                READY TO RECEIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
