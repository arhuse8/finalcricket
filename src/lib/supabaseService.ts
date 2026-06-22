import { supabase, isSupabaseConfigured } from './supabase';

export interface SupabaseMatchContext {
  matchId: string;
  inningsId: string;
  battingTeamId: string;
  bowlingTeamId: string;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  oversLimit: number;
}

/**
 * Service to manage Supabase read/write operations for ApnaCricket Live Scoring
 */
export const supabaseService = {
  /**
   * Fetch all teams in the system
   */
  async getTeams() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('team_name');
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching teams from Supabase:', err);
      return [];
    }
  },

  /**
   * Fetch all players in the system
   */
  async getPlayers() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('full_name');
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching players from Supabase:', err);
      return [];
    }
  },

  /**
   * Register a new player in Supabase
   */
  async registerPlayer(player: {
    player_id?: string;
    full_name: string;
    team_id: string;
    playing_role?: string;
    batting_style?: string;
    bowling_style?: string;
    matches_played?: number;
    total_runs?: number;
    highest_score?: number;
    batting_average?: number;
    strike_rate?: number;
    fifties?: number;
    hundreds?: number;
    wickets_taken?: number;
    best_bowling?: string;
    bowling_economy?: number;
  }) {
    if (!isSupabaseConfigured) return null;
    
    // Construct the mutable registration payload
    let payload: Record<string, any> = {
      full_name: player.full_name,
      team_id: player.team_id,
      playing_role: player.playing_role || 'All-Rounder',
      batting_style: player.batting_style || 'Right-hand bat',
      bowling_style: player.bowling_style || 'Right-arm fast',
      matches_played: player.matches_played || 0,
      total_runs: player.total_runs || 0,
      highest_score: player.highest_score || 0,
      batting_average: player.batting_average || 0,
      strike_rate: player.strike_rate || 0,
      fifties: player.fifties || 0,
      hundreds: player.hundreds || 0,
      wickets_taken: player.wickets_taken || 0,
      best_bowling: player.best_bowling || '0/0',
      bowling_economy: player.bowling_economy || 6.0,
      ...(player.player_id ? { player_id: player.player_id } : {})
    };

    const maxRetries = 12;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const { data, error } = await supabase
          .from('players')
          .insert(payload)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (err: any) {
        const errMsg = err.message || '';
        console.warn(`[Supabase Register Attempt ${attempt + 1}] Error flagged:`, errMsg);
        
        // Match column name inside error messages like:
        // "Could not find the 'batting_average' column..." or "column 'batting_average' does not exist"
        const columnMatch = errMsg.match(/column ['"](.*?)['"]/i) || errMsg.match(/field ['"](.*?)['"]/i);
        
        if (columnMatch && columnMatch[1]) {
          const missingColumn = columnMatch[1];
          if (missingColumn in payload) {
            console.warn(`[Self-Healing Schema Cache] Table 'players' lacks '${missingColumn}'. Silently stripping it from request and retrying...`);
            delete payload[missingColumn];
            continue; // Proceed to write with the reduced payload
          }
        }
        
        // If not a column-not-found error, or we couldn't parse the column, propagate up
        console.error('Terminal database registration error:', err);
        throw err;
      }
    }
    return null;
  },

  /**
   * Fetch list of matches
   */
  async getMatches() {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching matches from Supabase:', err);
      return [];
    }
  },

  /**
   * Fetch details of a single match including team names
   */
  async getMatchDetail(matchId: string) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('match_id', matchId)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Error loading match ${matchId}:`, err);
      return null;
    }
  },

  /**
   * Get active innings for a match
   */
  async getMatchInnings(matchId: string) {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('match_innings')
        .select('*')
        .eq('match_id', matchId)
        .order('innings_number', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`Error loading match innings for ${matchId}:`, err);
      return [];
    }
  },

  /**
   * Begin/Create a new innings in Supabase
   */
  async createInnings(matchId: string, inningsNumber: number, battingTeamId: string, bowlingTeamId: string) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('match_innings')
        .insert({
          match_id: matchId,
          innings_number: inningsNumber,
          batting_team_id: battingTeamId,
          bowling_team_id: bowlingTeamId,
          total_runs: 0,
          total_wickets: 0,
          total_overs: 0,
          total_extras: 0,
          total_balls: 0,
          innings_status: 'started'
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating innings in Supabase:', err);
      return null;
    }
  },

  /**
   * Core Live Score Sync Action: Registers a single ball delivery event in match_balls, 
   * and subsequently recalculates/commits state across match_innings, player_match_stats, 
   * bowler_match_stats, and partnerships in parallel!
   */
  async submitBallEvent(params: {
    matchContext: SupabaseMatchContext;
    overNumber: number;
    ballInOver: number;
    runsOffBat: number;
    isWicket: boolean;
    dismissalType?: string;
    dismissedPlayerId?: string;
    extraType: 'none' | 'wide' | 'noball' | 'bye' | 'legbye';
    extraRuns: number;
    commentary: string;
    isLegal: boolean;
  }) {
    if (!isSupabaseConfigured) {
      console.log('Supabase offline: Simulating ball event submit locally');
      return { success: true, offline: true };
    }

    const {
      matchContext,
      overNumber,
      ballInOver,
      runsOffBat,
      isWicket,
      dismissalType,
      dismissedPlayerId,
      extraType,
      extraRuns,
      commentary,
      isLegal
    } = params;

    const {
      matchId,
      inningsId,
      battingTeamId,
      bowlingTeamId,
      strikerId,
      nonStrikerId,
      bowlerId,
      oversLimit
    } = matchContext;

    try {
      const totalRunsBall = runsOffBat + extraRuns;

      // 1. Insert into match_balls
      const { error: ballError } = await supabase.from('match_balls').insert({
        innings_id: inningsId,
        over_number: overNumber,
        ball_in_over: ballInOver,
        is_legal_delivery: isLegal,
        striker_player_id: strikerId,
        non_striker_player_id: nonStrikerId,
        bowler_player_id: bowlerId,
        runs_off_bat: runsOffBat,
        extra_type: extraType,
        extra_runs: extraRuns,
        is_wicket: isWicket,
        dismissal_type: isWicket ? (dismissalType || 'Bowled') : null,
        dismissed_player_id: isWicket ? (dismissedPlayerId || strikerId) : null,
        total_runs: totalRunsBall,
        ball_commentary: commentary,
        event_timestamp: new Date().toISOString()
      });

      if (ballError) throw ballError;

      // 2. Load and Fetch current innings sums to perform precise increments
      const { data: inningsData, error: inningsFetchError } = await supabase
        .from('match_innings')
        .select('*')
        .eq('innings_id', inningsId)
        .single();

      if (inningsFetchError) throw inningsFetchError;

      const updatedRuns = (inningsData.total_runs || 0) + totalRunsBall;
      const updatedWickets = (inningsData.total_wickets || 0) + (isWicket ? 1 : 0);
      const updatedExtras = (inningsData.total_extras || 0) + extraRuns;
      const updatedBallsTotal = (inningsData.total_balls || 0) + (isLegal ? 1 : 0);

      // Convert balls count to fractional overs e.g. 14.2 overs is 86 balls: Math.floor(86 / 6) + (86 % 6)/10
      const oversVal = Math.floor(updatedBallsTotal / 6) + (updatedBallsTotal % 6) / 10;

      // Update match_innings
      const isCompleted = updatedWickets >= 10 || oversVal >= oversLimit;
      const { error: inningsUpdateError } = await supabase
        .from('match_innings')
        .update({
          total_runs: updatedRuns,
          total_wickets: updatedWickets,
          total_extras: updatedExtras,
          total_balls: updatedBallsTotal,
          total_overs: oversVal,
          striker_player_id: strikerId,
          non_striker_player_id: nonStrikerId,
          current_bowler_id: bowlerId,
          innings_status: isCompleted ? 'completed' : 'started',
          updated_at: new Date().toISOString()
        })
        .eq('innings_id', inningsId);

      if (inningsUpdateError) throw inningsUpdateError;

      // Update general Match status if innings is finished
      if (isCompleted) {
        await supabase
          .from('matches')
          .update({
            match_status: 'live', // could stay live if 2nd innings is pending, or completed
            updated_at: new Date().toISOString()
          })
          .eq('match_id', matchId);
      }

      // 3. Batting match statistics - player_match_stats
      // Check if statistic entry already exists for player inside this match + innings
      const { data: batsmanStats, error: batsFetchError } = await supabase
        .from('player_match_stats')
        .select('*')
        .eq('innings_id', inningsId)
        .eq('player_id', strikerId)
        .maybeSingle();

      if (batsFetchError) throw batsFetchError;

      const facedInc = isLegal ? 1 : 0; // Wides do not count as balls faced
      const runsInc = runsOffBat;
      const foursInc = runsOffBat === 4 ? 1 : 0;
      const sixesInc = runsOffBat === 6 ? 1 : 0;

      if (batsmanStats) {
        // Upgrade batsman stats
        const newRuns = (batsmanStats.runs_scored || 0) + runsInc;
        const newFaced = (batsmanStats.balls_faced || 0) + facedInc;
        const newFours = (batsmanStats.fours || 0) + foursInc;
        const newSixes = (batsmanStats.sixes || 0) + sixesInc;
        const newSR = newFaced > 0 ? parseFloat(((newRuns / newFaced) * 100).toFixed(2)) : 0;

        await supabase
          .from('player_match_stats')
          .update({
            runs_scored: newRuns,
            balls_faced: newFaced,
            fours: newFours,
            sixes: newSixes,
            strike_rate: newSR,
            is_out: isWicket && dismissedPlayerId === strikerId ? true : batsmanStats.is_out,
            dismissal_type: isWicket && dismissedPlayerId === strikerId ? (dismissalType || 'Bowled') : batsmanStats.dismissal_type
          })
          .eq('stat_id', batsmanStats.stat_id);
      } else {
        // Insert new batsman stats
        const newSR = facedInc > 0 ? parseFloat(((runsInc / facedInc) * 100).toFixed(2)) : 0;
        await supabase.from('player_match_stats').insert({
          match_id: matchId,
          innings_id: inningsId,
          player_id: strikerId,
          team_id: battingTeamId,
          runs_scored: runsInc,
          balls_faced: facedInc,
          fours: foursInc,
          sixes: sixesInc,
          strike_rate: newSR,
          is_out: isWicket && dismissedPlayerId === strikerId,
          dismissal_type: isWicket && dismissedPlayerId === strikerId ? (dismissalType || 'Bowled') : null
        });
      }

      // If a wicket went down, update the dismissed player's state
      if (isWicket && dismissedPlayerId && dismissedPlayerId !== strikerId) {
        const { data: otherBatsmanStats } = await supabase
          .from('player_match_stats')
          .select('*')
          .eq('innings_id', inningsId)
          .eq('player_id', dismissedPlayerId)
          .maybeSingle();

        if (otherBatsmanStats) {
          await supabase
            .from('player_match_stats')
            .update({
              is_out: true,
              dismissal_type: dismissalType || 'Run Out'
            })
            .eq('stat_id', otherBatsmanStats.stat_id);
        }
      }

      // 4. Bowling statistics - bowler_match_stats
      const { data: bowlerStats, error: bowlFetchError } = await supabase
        .from('bowler_match_stats')
        .select('*')
        .eq('innings_id', inningsId)
        .eq('player_id', bowlerId)
        .maybeSingle();

      if (bowlFetchError) throw bowlFetchError;

      const bowlBallsInc = isLegal ? 1 : 0;
      const bowlRunsInc = totalRunsBall; // Wides/no-balls count to bowler
      const bowlWicketsInc = isWicket && dismissalType !== 'Run Out' ? 1 : 0; // Run outs do not count to bowler

      if (bowlerStats) {
        const newBalls = (bowlerStats.balls_bowled || 0) + bowlBallsInc;
        const newConceded = (bowlerStats.runs_conceded || 0) + bowlRunsInc;
        const newWick = (bowlerStats.wickets || 0) + bowlWicketsInc;
        const oversFloat = Math.floor(newBalls / 6) + (newBalls % 6) / 6;
        const newEcon = oversFloat > 0 ? parseFloat((newConceded / oversFloat).toFixed(2)) : 0;

        await supabase
          .from('bowler_match_stats')
          .update({
            balls_bowled: newBalls,
            runs_conceded: newConceded,
            wickets: newWick,
            economy: newEcon
          })
          .eq('stat_id', bowlerStats.stat_id);
      } else {
        const oversFloat = bowlBallsInc / 6;
        const newEcon = oversFloat > 0 ? parseFloat((bowlRunsInc / oversFloat).toFixed(2)) : 0;
        await supabase.from('bowler_match_stats').insert({
          match_id: matchId,
          innings_id: inningsId,
          player_id: bowlerId,
          team_id: bowlingTeamId,
          balls_bowled: bowlBallsInc,
          runs_conceded: bowlRunsInc,
          wickets: bowlWicketsInc,
          economy: newEcon
        });
      }

      // 5. Partnership statistics - partnerships
      // In cricket, partnerships are between striker & non-striker
      const b1 = strikerId;
      const b2 = nonStrikerId;
      const { data: activePartnership, error: partFetchError } = await supabase
        .from('partnerships')
        .select('*')
        .eq('innings_id', inningsId)
        .is('dismissal_type', null)
        .maybeSingle(); // Load active partnership (one that is not dismissed yet)

      if (partFetchError) throw partFetchError;

      const partRunsInc = totalRunsBall;
      const partBallsInc = isLegal ? 1 : 0;

      if (activePartnership) {
        const newRuns = (activePartnership.runs || 0) + partRunsInc;
        const newBalls = (activePartnership.balls || 0) + partBallsInc;

        await supabase
          .from('partnerships')
          .update({
            runs: newRuns,
            balls: newBalls,
            dismissal_type: isWicket ? (dismissalType || 'Wicket fell') : null
          })
          .eq('partnership_id', activePartnership.partnership_id);
      } else {
        // Create new active partnership
        await supabase.from('partnerships').insert({
          match_id: matchId,
          innings_id: inningsId,
          batsman1_id: b1,
          batsman2_id: b2,
          runs: partRunsInc,
          balls: partBallsInc,
          dismissal_type: isWicket ? (dismissalType || 'Wicket fell') : null
        });
      }

      return { success: true, offline: false };
    } catch (err) {
      console.error('Error executing Supabase Live Score submit:', err);
      return { success: false, error: err };
    }
  },

  /**
   * 1. Get Fall of Wickets (FOW) for a specific innings
   */
  async getFallOfWickets(inningsId: string) {
    if (!isSupabaseConfigured) return [];
    try {
      // Find all balls in innings that resulted in a wicket, ordered chronologically
      const { data, error } = await supabase
        .from('match_balls')
        .select(`
          over_number,
          ball_in_over,
          runs_off_bat,
          extra_runs,
          total_runs,
          striker_player_id,
          dismissed_player_id,
          dismissal_type,
          players!match_balls_dismissed_player_id_fkey(full_name)
        `)
        .eq('innings_id', inningsId)
        .eq('is_wicket', true)
        .order('over_number', { ascending: true })
        .order('ball_in_over', { ascending: true });

      if (error) throw error;

      // Map back to a structured list: "Wicket #1: 45 runs (Kiran Kumar) - Over 5.2"
      // Wait, we need the total score of the team at the moment of that wicket!
      // We can accumulate runs indexed by timing
      const { data: allBalls, error: ballsErr } = await supabase
        .from('match_balls')
        .select('over_number, ball_in_over, total_runs, is_wicket')
        .eq('innings_id', inningsId)
        .order('over_number', { ascending: true })
        .order('ball_in_over', { ascending: true });

      if (ballsErr) throw ballsErr;

      let scoreAccum = 0;
      let wicketIndex = 0;
      const fowList: Array<{
        wicketNumber: number;
        runs: number;
        overs: string;
        batsmanName: string;
        dismissal: string;
      }> = [];

      allBalls.forEach(ball => {
        scoreAccum += (ball.total_runs || 0);
        if (ball.is_wicket) {
          wicketIndex += 1;
          
          // Match with the factual details
          const detail = data?.find(w => w.over_number === ball.over_number && w.ball_in_over === ball.ball_in_over);
          const name = (detail?.players as any)?.full_name || 'Batsman';
          const type = detail?.dismissal_type || 'Bowled';

          fowList.push({
            wicketNumber: wicketIndex,
            runs: scoreAccum,
            overs: `${ball.over_number}.${ball.ball_in_over}`,
            batsmanName: name,
            dismissal: type
          });
        }
      });

      return fowList;
    } catch (err) {
      console.error('Error fetching Falldown wickets statistics:', err);
      return [];
    }
  },

  /**
   * 2. Get active partnership lists for this innings
   */
  async getPartnershipData(inningsId: string) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('partnerships')
        .select(`
          runs,
          balls,
          dismissal_type,
          batsman1:players!partnerships_batsman1_id_fkey(full_name),
          batsman2:players!partnerships_batsman2_id_fkey(full_name)
        `)
        .eq('innings_id', inningsId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error loading partnerships:', err);
      return [];
    }
  },

  /**
   * 3. Full Scorecard generation: aggregates batting, bowling and innings logs into a complete React-ready display!
   */
  async getFullScorecard(matchId: string) {
    if (!isSupabaseConfigured) return null;
    try {
      const innings = await this.getMatchInnings(matchId);
      const scorecardData: Record<string, any> = {};

      for (const inn of innings) {
        const innKey = `innings_${inn.innings_number}`;
        
        // Fetch Batting stats
        const { data: battingList } = await supabase
          .from('player_match_stats')
          .select('*, player:players(full_name)')
          .eq('innings_id', inn.innings_id);

        // Fetch Bowling stats
        const { data: bowlingList } = await supabase
          .from('bowler_match_stats')
          .select('*, bowler:players(full_name)')
          .eq('innings_id', inn.innings_id);

        // Fetch Fall of wickets
        const wicketsFell = await this.getFallOfWickets(inn.innings_id);

        scorecardData[innKey] = {
          inningsId: inn.innings_id,
          inningsNumber: inn.innings_number,
          totalRuns: inn.total_runs,
          totalWickets: inn.total_wickets,
          totalOvers: inn.total_overs,
          extras: inn.total_extras,
          batting: battingList?.map(b => ({
            playerName: b.player?.full_name || 'Batsman',
            runs: b.runs_scored,
            balls: b.balls_faced,
            fours: b.fours,
            sixes: b.sixes,
            strikeRate: b.strike_rate,
            isOut: b.is_out,
            dismissal: b.dismissal_type || 'not out'
          })) || [],
          bowling: bowlingList?.map(bo => {
            const overs = Math.floor(bo.balls_bowled / 6) + (bo.balls_bowled % 6) / 10;
            return {
              playerName: bo.bowler?.full_name || 'Bowler',
              overs,
              runs: bo.runs_conceded,
              wickets: bo.wickets,
              economy: bo.economy,
              maidens: bo.maidens || 0
            };
          }) || [],
          fallOfWickets: wicketsFell
        };
      }

      return scorecardData;
    } catch (err) {
      console.error('Error loading full scorecard dataset:', err);
      return null;
    }
  },

  /**
   * 4. Match summary data calculation
   */
  async getMatchSummary(matchId: string) {
    if (!isSupabaseConfigured) return null;
    try {
      const detail = await this.getMatchDetail(matchId);
      if (!detail) return null;

      const innings = await this.getMatchInnings(matchId);
      
      return {
        matchId: detail.match_id,
        title: detail.match_title,
        venue: detail.ground_name || detail.venue,
        date: detail.match_date,
        status: detail.match_status,
        winnerId: detail.winner_team_id,
        resultMessage: detail.notes || 'No notes loaded for end results.',
        tossText: detail.elected_to ? `Won by Team, decided to ${detail.elected_to}` : '',
        innings: innings.map(inn => ({
          inningsNumber: inn.innings_number,
          totalRuns: inn.total_runs,
          totalWickets: inn.total_wickets,
          totalOvers: inn.total_overs,
          battingTeamId: inn.batting_team_id,
          bowlingTeamId: inn.bowling_team_id
        }))
      };
    } catch (err) {
      console.error('Error generating summary:', err);
      return null;
    }
  },

  /**
   * Delete a match and its cascading subparts from Supabase
   */
  async deleteMatch(matchId: string) {
    if (!isSupabaseConfigured) return false;
    try {
      // Clean up related sub-tables to prevent foreign key errors
      const { data: innings } = await supabase
        .from('match_innings')
        .select('innings_id')
        .eq('match_id', matchId);

      if (innings && innings.length > 0) {
        const innIds = innings.map((i: any) => i.innings_id);
        
        await supabase.from('match_balls').delete().in('innings_id', innIds);
        await supabase.from('player_match_stats').delete().in('innings_id', innIds);
        await supabase.from('bowler_match_stats').delete().in('innings_id', innIds);
        await supabase.from('partnerships').delete().in('innings_id', innIds);
        await supabase.from('match_innings').delete().eq('match_id', matchId);
      }

      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('match_id', matchId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting match from Supabase:', err);
      return false;
    }
  },

  /**
   * Delete a player from Supabase
   */
  async deletePlayer(playerId: string) {
    if (!isSupabaseConfigured) return false;
    try {
      // First delete individual player stats to satisfy foreign key constraints
      await supabase.from('player_match_stats').delete().eq('player_id', playerId);
      await supabase.from('bowler_match_stats').delete().eq('player_id', playerId);

      const { error } = await supabase
        .from('players')
        .delete()
        .eq('player_id', playerId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting player from Supabase:', err);
      return false;
    }
  },

  /**
   * 5. Setup Live Subscription Channel for instant dashboard updates
   */
  subscribeToInningsUpdates(inningsId: string, onUpdate: (payload: any) => void) {
    if (!isSupabaseConfigured) return null;
    return supabase
      .channel(`live-innings-${inningsId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'match_innings',
          filter: `innings_id=eq.${inningsId}`
        },
        payload => {
          onUpdate(payload.new);
        }
      )
      .subscribe();
  }
};
