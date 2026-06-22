export interface PlayerStats {
  matches: number;
  runs: number;
  highestScore: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  wickets: number;
  bestBowling: string;
  economy: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  team?: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';
  battingStyle: 'Right-hand bat' | 'Left-hand bat';
  bowlingStyle?: 'Right-arm fast' | 'Right-arm spin' | 'Left-arm fast' | 'Left-arm spin';
  stats: PlayerStats;
}

export interface BallRecord {
  overNumber: number;
  ballOfOver: number;
  run: number;
  isWide: boolean;
  isNoBall: boolean;
  isWicket: boolean;
  wicketType?: 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped';
  batsmanName: string;
  bowlerName: string;
  commentary: string;
}

export interface MiniScorecard {
  batsman1: { name: string; runs: number; balls: number; fours: number; sixes: number; strikeRate: number };
  batsman2: { name: string; runs: number; balls: number; fours: number; sixes: number; strikeRate: number };
  bowler: { name: string; overs: number; maidens: number; runs: number; wickets: number; economy: number };
}

export interface TeamScore {
  runs: number;
  wickets: number;
  overs: number;
  balls: number; // current balls in active over (0-5)
}

export interface Match {
  id: string;
  title: string;
  venue: string;
  date: string;
  status: 'Live' | 'Upcoming' | 'Completed';
  tossResult?: string;
  oversLimit: number;
  battingTeamId: string;
  bowlingTeamId: string;
  team1: {
    id: string;
    name: string;
    shortName: string;
    logoColor: string;
    score: TeamScore;
    battingCard: Array<{
      playerName: string;
      status: string; // 'not out', 'out', 'yet style'
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
    }>;
    bowlingCard: Array<{
      playerName: string;
      overs: number;
      maidens: number;
      runs: number;
      wickets: number;
    }>;
  };
  team2: {
    id: string;
    name: string;
    shortName: string;
    logoColor: string;
    score: TeamScore;
    battingCard: Array<{
      playerName: string;
      status: string; // 'not out', 'out', etc.
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
    }>;
    bowlingCard: Array<{
      playerName: string;
      overs: number;
      maidens: number;
      runs: number;
      wickets: number;
    }>;
  };
  isFirstInningsComplete: boolean;
  targetRuns?: number;
  onStrikeIndex: number; // Index indicating which batsman in mini score is on strike
  miniScore: MiniScorecard;
  recentBalls: string[]; // e.g. ["1", "4", "W", "Wd", "6", "0"]
  ballByBallHistory: BallRecord[];
}

export interface Fixture {
  id: string;
  team1Name: string;
  team2Name: string;
  team1Short: string;
  team2Short: string;
  team1Color: string;
  team2Color: string;
  date: string;
  time: string;
  venue: string;
  tournamentName: string;
}
