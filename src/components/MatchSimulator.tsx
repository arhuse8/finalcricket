import React, { useState, useEffect, useRef } from 'react';
import { Match, BallRecord } from '../types';
import { Play, Pause, Sliders, Volume2, Database, Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { COMMENTARY_PRESETS, INITIAL_PLAYERS } from '../mockData';
import { supabaseService } from '../lib/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

interface MatchSimulatorProps {
  match: Match;
  setMatch: React.Dispatch<React.SetStateAction<Match>>;
  onPlayerStatUpdate: (playerName: string, runs: number, balls: number, fours: number, sixes: number, wicket: boolean, bowlerName: string) => void;
}

export default function MatchSimulator({ match, setMatch, onPlayerStatUpdate }: MatchSimulatorProps) {
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(3000); // ms per ball
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Supabase Integration States
  const [dbMatches, setDbMatches] = useState<any[]>([]);
  const [dbPlayers, setDbPlayers] = useState<any[]>([]);
  const [dbTeams, setDbTeams] = useState<any[]>([]);
  const [selectedDbMatch, setSelectedDbMatch] = useState<string>('');
  const [selectedDbInningsId, setSelectedDbInningsId] = useState<string>('');
  const [selectedInningsNum, setSelectedInningsNum] = useState<number>(1);
  
  const [selectedStrikerId, setSelectedStrikerId] = useState<string>('');
  const [selectedNonStrikerId, setSelectedNonStrikerId] = useState<string>('');
  const [selectedBowlerId, setSelectedBowlerId] = useState<string>('');
  
  const [selectedBattingTeamId, setSelectedBattingTeamId] = useState<string>('');
  const [selectedBowlingTeamId, setSelectedBowlingTeamId] = useState<string>('');
  
  const [syncLogs, setSyncLogs] = useState<string[]>(['Offline database driver initialized']);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch initial database entities
  useEffect(() => {
    async function loadDb() {
      if (isSupabaseConfigured) {
        setSyncLogs(prev => ['Connecting and queries running...', ...prev]);
        try {
          const matches = await supabaseService.getMatches();
          const players = await supabaseService.getPlayers();
          const teams = await supabaseService.getTeams();
          
          setDbMatches(matches);
          setDbPlayers(players);
          setDbTeams(teams);

          if (matches.length > 0) {
            setSelectedDbMatch(matches[0].match_id);
          }
          setSyncLogs(prev => [
            '🟢 Connected to Supabase! 31 Tables & 366 columns available.',
            `Successfully cached ${matches.length} matches, ${players.length} players, and ${teams.length} teams.`,
            ...prev
          ]);
        } catch (err: any) {
          setSyncLogs(prev => [`❌ Initial cache failed: ${err.message}`, ...prev]);
        }
      } else {
        setSyncLogs(prev => [
          '🔌 Running in standard local mode. No Supabase URL configured.',
          ...prev
        ]);
      }
    }
    loadDb();
  }, []);

  // Sync innings detail when selectedDbMatch changes
  useEffect(() => {
    async function bindInnings() {
      if (!selectedDbMatch || !isSupabaseConfigured) return;
      
      setSyncLogs(prev => [`Loading active innings for match ID: ${selectedDbMatch.substring(0,8)}...`, ...prev]);
      try {
        const inningsList = await supabaseService.getMatchInnings(selectedDbMatch);
        if (inningsList.length > 0) {
          const activeInn = inningsList[0];
          setSelectedDbInningsId(activeInn.innings_id);
          setSelectedInningsNum(activeInn.innings_number || 1);
          setSelectedBattingTeamId(activeInn.batting_team_id || '');
          setSelectedBowlingTeamId(activeInn.bowling_team_id || '');
          
          setSelectedStrikerId(activeInn.striker_player_id || '');
          setSelectedNonStrikerId(activeInn.non_striker_player_id || '');
          setSelectedBowlerId(activeInn.current_bowler_id || '');
          
          setSyncLogs(prev => [`🟢 Active Innings Binded: #${activeInn.innings_number}`, ...prev]);
        } else {
          // If no innings exists, try to automatically create one
          const matchedMatch = dbMatches.find(m => m.match_id === selectedDbMatch);
          if (matchedMatch) {
            setSyncLogs(prev => ['No innings found. Initiating auto-creation...', ...prev]);
            const newInn = await supabaseService.createInnings(
              selectedDbMatch,
              1,
              matchedMatch.team_a_id || 'T1',
              matchedMatch.team_b_id || 'T2'
            );
            if (newInn) {
              setSelectedDbInningsId(newInn.innings_id);
              setSelectedInningsNum(1);
              setSelectedBattingTeamId(newInn.batting_team_id || '');
              setSelectedBowlingTeamId(newInn.bowling_team_id || '');
              setSyncLogs(prev => ['🟢 Auto-created Innings #1 in your Supabase backend!', ...prev]);
            }
          }
        }
      } catch (err: any) {
        setSyncLogs(prev => [`❌ Failed to bind innings: ${err.message}`, ...prev]);
      }
    }
    bindInnings();
  }, [selectedDbMatch, dbMatches]);

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
    // Swapping striker & non-striker in database
    if (isSupabaseConfigured && selectedStrikerId && selectedNonStrikerId) {
      const temp = selectedStrikerId;
      setSelectedStrikerId(selectedNonStrikerId);
      setSelectedNonStrikerId(temp);
      setSyncLogs(prev => ['🔄 Swapped crease striker values.', ...prev.slice(0, 10)]);
    }
  };

  /**
   * Background Supabase Database Score Committer
   */
  const syncBallToSupabase = async (
    runs: number,
    options: { isWide?: boolean; isNoBall?: boolean; isWicket?: boolean } = {}
  ) => {
    if (!isSupabaseConfigured || !selectedDbMatch || !selectedDbInningsId) return;

    setIsSyncing(true);
    const { isWide = false, isNoBall = false, isWicket = false } = options;

    let extraType: 'none' | 'wide' | 'noball' | 'bye' | 'legbye' = 'none';
    let extraRuns = 0;
    let isLegal = true;

    if (isWide) {
      extraType = 'wide';
      extraRuns = 1;
      isLegal = false;
    } else if (isNoBall) {
      extraType = 'noball';
      extraRuns = 1;
      isLegal = false;
    }

    // Pick active striker named display for commentary logs
    const activeStrikerPlayer = dbPlayers.find(p => p.player_id === selectedStrikerId);
    const activeNonStrikerPlayer = dbPlayers.find(p => p.player_id === selectedNonStrikerId);
    const activeBowlerPlayer = dbPlayers.find(p => p.player_id === selectedBowlerId);

    const sName = activeStrikerPlayer?.full_name || 'Batter';
    const bName = activeBowlerPlayer?.full_name || 'Bowler';

    let comm = `${bName} deliveries to ${sName}. Ball played away cleanly.`;
    if (isWicket) {
      comm = `OUT! Absolute peach of a delivery from ${bName}! ${sName} goes for a big village swipe but only finds the stumps! Deep shock in stands!`;
    } else if (isWide) {
      comm = `WIDE DELIVERY! ${bName} misses the line completely. The ball swings wide down the leg side. +1 Extra.`;
    } else if (isNoBall) {
      comm = `NO BALL! High full toss above waist from ${bName}. ${sName} plays it away. FREE HIT coming up!`;
    } else if (runs === 4) {
      comm = `FOUR MORE! Elegant shot by ${sName}, cracking it down the pitch past the lunging mid-off fielder!`;
    } else if (runs === 6) {
      comm = `MASSIVE BLOW! ${sName} hammers it right out of the center and sends it sailing over the neem trees!`;
    }

    const overNumber = match.team1.score.overs;
    const ballInOver = match.team1.score.balls + 1;

    const context = {
      matchId: selectedDbMatch,
      inningsId: selectedDbInningsId,
      battingTeamId: selectedBattingTeamId || 'T1',
      bowlingTeamId: selectedBowlingTeamId || 'T2',
      strikerId: selectedStrikerId || 'P1',
      nonStrikerId: selectedNonStrikerId || 'P2',
      bowlerId: selectedBowlerId || 'B1',
      oversLimit: match.oversLimit
    };

    setSyncLogs(prev => [`Syncing over ${overNumber}.${ballInOver} runs with Supabase...`, ...prev.slice(0, 5)]);

    const result = await supabaseService.submitBallEvent({
      matchContext: context,
      overNumber,
      ballInOver,
      runsOffBat: runs,
      isWicket,
      dismissalType: isWicket ? 'Bowled' : undefined,
      dismissedPlayerId: isWicket ? selectedStrikerId : undefined,
      extraType,
      extraRuns,
      commentary: comm,
      isLegal
    });

    setIsSyncing(false);
    if (result.success) {
      setSyncLogs(prev => [
        `✅ DB Transact OK! Synced: ${runs} Runs, Wicket: ${isWicket ? 'Yes' : 'No'}, Extra: ${extraType}`,
        ...prev.slice(0, 5)
      ]);
    } else {
      setSyncLogs(prev => [
        `❌ DB Sync Fail: ${(result.error as any)?.message || 'Entity constraints violation'}`,
        ...prev.slice(0, 5)
      ]);
    }
  };

  // Main custom score updater logic
  const recordBallValue = (
    runs: number,
    options: { isWide?: boolean; isNoBall?: boolean; isWicket?: boolean } = {}
  ) => {
    if (match.status === 'Completed') return;

    // Trigger Supabase sync in background
    syncBallToSupabase(runs, options);

    setMatch(prev => {
      const matchState = JSON.parse(JSON.stringify(prev)) as Match;
      const score = matchState.team1.score;
      const mini = matchState.miniScore;
      
      const { isWide = false, isNoBall = false, isWicket = false } = options;

      // Identify active batsmen
      const striker = matchState.onStrikeIndex === 0 ? mini.batsman1 : mini.batsman2;
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
            if (isSupabaseConfigured) {
              const matchedDbPlayer = dbPlayers.find(p => p.full_name?.toLowerCase() === newPlayer.name.toLowerCase());
              if (matchedDbPlayer) setSelectedStrikerId(matchedDbPlayer.player_id);
            }
          } else {
            mini.batsman2 = {
              name: `${newPlayer.name}`,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              strikeRate: 0
            };
            if (isSupabaseConfigured) {
              const matchedDbPlayer = dbPlayers.find(p => p.full_name?.toLowerCase() === newPlayer.name.toLowerCase());
              if (matchedDbPlayer) setSelectedNonStrikerId(matchedDbPlayer.player_id);
            }
          }
          
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
        baseComm = `Dot ball! ${activeBowler.name} throws a gorgeous glass deliver, ${striker.name} is bottled down with no run possible.`;
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
      recordBallValue(0, { isWicket: true });
    } else if (randomVal < 0.16) {
      recordBallValue(0, { isWide: true });
    } else if (randomVal < 0.22) {
      recordBallValue(1, { isNoBall: true });
    } else if (randomVal < 0.45) {
      recordBallValue(0);
    } else if (randomVal < 0.7) {
      recordBallValue(1);
    } else if (randomVal < 0.82) {
      recordBallValue(2);
    } else if (randomVal < 0.92) {
      recordBallValue(4);
    } else {
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
            <h4 className="font-display text-lg font-black text-white uppercase tracking-tight">💻 APNA SCORER CONTROL CABINET</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Live-Score controller. Fully synced with Supabase 31-table ecosystem.</p>
        </div>

        <div className="flex items-center gap-2">
          {match.status === 'Completed' ? (
            <span className="rounded-none bg-white/5 border border-white/15 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#ccff00]">
              🏁 MATCH FINISHED
            </span>
          ) : (
            <>
              {/* Speed Controller selector */}
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

      {/* Database Connection Dashboard HUD */}
      <div className="mb-6 p-4 rounded-xl border border-white/10 bg-black/50 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-[#ccff00]" />
            <span className="text-xs font-black uppercase tracking-wider text-white">SUPABASE DB SYNC</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-black">
                <Wifi className="h-3 w-3" />
                <span>SYNC LIVE</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/20 text-[10px] uppercase font-black animate-pulse">
                <WifiOff className="h-3 w-3" />
                <span>OFFLINE PLAYGROUND</span>
              </span>
            )}
          </div>
        </div>

        {isSupabaseConfigured ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Target Match Session</label>
              <select
                value={selectedDbMatch}
                onChange={e => setSelectedDbMatch(e.target.value)}
                className="w-full bg-black/80 border border-white/10 rounded-lg p-2 text-xs font-sans text-white focus:outline-none focus:border-[#ccff00]"
                id="sb-select-match"
              >
                {dbMatches.map(m => (
                  <option key={m.match_id} value={m.match_id}>
                    {m.match_title || `Match ID: ${m.match_id.substring(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Innings ID</label>
              <input
                type="text"
                value={selectedDbInningsId}
                disabled
                className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs font-mono text-[#ccff00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">ACTIVE INNINGS</label>
              <div className="bg-black/40 border border-[#ccff00]/10 rounded-lg p-2 text-xs text-white font-black uppercase tracking-wider text-center">
                 💥 INNINGS {selectedInningsNum} ({selectedInningsNum === 1 ? 'Batting 1st' : 'Chase Target'})
              </div>
            </div>

            {/* Crease Mapping dropdowns */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2.5 border-t border-white/5">
              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">🏏 Striker Batter</label>
                <select
                  value={selectedStrikerId}
                  onChange={e => setSelectedStrikerId(e.target.value)}
                  className="w-full bg-black/80 border border-white/10 rounded-lg p-2 text-xs font-sans text-slate-100 focus:outline-none"
                  id="sb-select-striker"
                >
                  <option value="">-- Pick Striker ID --</option>
                  {dbPlayers.map(p => (
                    <option key={p.player_id} value={p.player_id}>{p.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">🏏 Non-Striker Batter</label>
                <select
                  value={selectedNonStrikerId}
                  onChange={e => setSelectedNonStrikerId(e.target.value)}
                  className="w-full bg-black/80 border border-white/10 rounded-lg p-2 text-xs font-sans text-slate-100 focus:outline-none"
                  id="sb-select-nonstriker"
                >
                  <option value="">-- Pick Non-Striker ID --</option>
                  {dbPlayers.map(p => (
                    <option key={p.player_id} value={p.player_id}>{p.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">🥎 Overs Bowler</label>
                <select
                  value={selectedBowlerId}
                  onChange={e => setSelectedBowlerId(e.target.value)}
                  className="w-full bg-black/80 border border-white/10 rounded-lg p-2 text-xs font-sans text-slate-100 focus:outline-none"
                  id="sb-select-bowler"
                >
                  <option value="">-- Pick Bowler ID --</option>
                  {dbPlayers.map(p => (
                    <option key={p.player_id} value={p.player_id}>{p.full_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-slate-400 leading-normal mb-2 font-medium">
              Want to connect live score keys with Postgres? Add <strong className="text-[#ccff00]">VITE_SUPABASE_URL</strong> and <strong className="text-[#ccff00]">VITE_SUPABASE_ANON_KEY</strong> in your AI Studio secrets control. We will gracefully map and commit your changes instantly!
            </p>
          </div>
        )}

        {/* Sync telemetry diagnostic stream logs */}
        <div className="mt-3 p-2 bg-black/85 rounded-lg border border-white/5 max-h-[100px] overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1">
          {syncLogs.map((log, lIdx) => (
            <div key={lIdx} className="flex gap-1">
              <span className="text-slate-500">▶</span>
              <span className={log.includes('✅') ? 'text-emerald-400 font-bold' : log.includes('❌') ? 'text-red-400 font-bold' : log.includes('🟢') ? 'text-[#ccff05] font-black' : 'text-slate-350'}>{log}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Ball triggers */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block text-left">
            🏏 KEY IN LIVE BALL RESULTS (TAP TO ACTION)
          </span>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <button
              onClick={() => recordBallValue(0)}
              disabled={match.status === 'Completed' || isSyncing}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-white/10 bg-black/40 hover:bg-[#ccff00]/10 hover:border-[#ccff00] text-slate-200 transition-all font-mono font-black disabled:opacity-40"
              id="umpire-btn-dot"
            >
              <span className="text-2xl">0</span>
              <span className="text-[9px] text-slate-400 font-sans uppercase font-bold mt-1">Dot Ball</span>
            </button>

            <button
              onClick={() => recordBallValue(1)}
              disabled={match.status === 'Completed' || isSyncing}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-white/10 bg-black/40 hover:bg-[#ccff00]/10 hover:border-[#ccff00] text-[#ccff00] transition-all font-mono font-black disabled:opacity-40"
              id="umpire-btn-1"
            >
              <span className="text-2xl">1</span>
              <span className="text-[9px] text-slate-400 font-sans uppercase font-bold mt-1">Single</span>
            </button>

            <button
              onClick={() => recordBallValue(2)}
              disabled={match.status === 'Completed' || isSyncing}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-white/10 bg-black/40 hover:bg-[#ccff00]/10 hover:border-[#ccff00] text-slate-200 transition-all font-mono font-black disabled:opacity-40"
              id="umpire-btn-2"
            >
              <span className="text-2xl">2</span>
              <span className="text-[9px] text-slate-400 font-sans uppercase font-bold mt-1">Double</span>
            </button>

            <button
              onClick={() => recordBallValue(3)}
              disabled={match.status === 'Completed' || isSyncing}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-white/10 bg-black/40 hover:bg-[#ccff00]/10 hover:border-[#ccff00] text-slate-200 transition-all font-mono font-black disabled:opacity-40"
              id="umpire-btn-3"
            >
              <span className="text-2xl">3</span>
              <span className="text-[9px] text-slate-400 font-sans uppercase font-bold mt-1">Three Runs</span>
            </button>

            <button
              onClick={() => recordBallValue(4)}
              disabled={match.status === 'Completed' || isSyncing}
              className="flex flex-col items-center justify-center p-3.5 rounded-none border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 text-emerald-400 transition-all font-mono font-black disabled:opacity-40"
              id="umpire-btn-4"
            >
              <span className="text-2xl font-black">4</span>
              <span className="text-[9px] font-sans uppercase font-black tracking-wider mt-1">FOUR</span>
            </button>

            <button
              onClick={() => recordBallValue(6)}
              disabled={match.status === 'Completed' || isSyncing}
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
              disabled={match.status === 'Completed' || isSyncing}
              className="py-3 px-3 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 text-blue-400 text-xs font-black tracking-wider font-mono uppercase transition-all disabled:opacity-40"
              id="umpire-btn-wide"
            >
              +1 Wide
            </button>
            <button
              onClick={() => recordBallValue(0, { isNoBall: true })}
              disabled={match.status === 'Completed' || isSyncing}
              className="py-3 px-3 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 text-indigo-400 text-xs font-black tracking-wider font-mono uppercase transition-all disabled:opacity-40"
              id="umpire-btn-noball"
            >
              +1 No Ball
            </button>
            <button
              onClick={rotateStrike}
              disabled={match.status === 'Completed' || isSyncing}
              className="py-3 px-3 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 text-slate-300 text-xs font-black tracking-wider font-sans uppercase tracking-wide transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
              id="umpire-btn-rotate"
            >
              🔄 Strike Switch
            </button>
            <button
              onClick={() => recordBallValue(0, { isWicket: true })}
              disabled={match.status === 'Completed' || isSyncing}
              className="py-3 px-3 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-600 hover:text-white hover:border-red-600 text-red-400 text-xs font-black tracking-wider font-mono uppercase transition-all disabled:opacity-40"
              id="umpire-btn-wicket"
            >
              🔴 OUT (Wicket)
            </button>
          </div>
        </div>

        {/* Scoring Helper Pitch info box */}
        <div className="bg-black/50 rounded-xl p-4 border border-white/10 flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase tracking-wider text-[10px] border-b border-white/10 pb-2 mb-2">
              <Volume2 className="h-4 w-4 text-[#ccff00]" />
              <span>Commentary Stream</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every score inputted triggers dynamic commentary templates. If Supabase is connected, the scoreboard increments update the database state in real-time.
            </p>
          </div>
          
          <div className="mt-4 pt-3.5 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-405">
              <span className="uppercase font-bold text-[10px]">On Crease:</span>
              <span className="font-extrabold text-white text-xs uppercase">
                {match.onStrikeIndex === 0 ? match.miniScore.batsman1.name : match.miniScore.batsman2.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-450 mt-1.5">
              <span className="uppercase font-bold text-[10px]">Database Status:</span>
              <span className={isSupabaseConfigured ? 'text-emerald-400 font-black text-[9px] tracking-wide' : 'text-slate-400 font-black text-[9px] tracking-wide'}>
                {isSupabaseConfigured ? 'ONLINE SYNC ACTIVE' : 'LOCAL CACHE ONLY'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
