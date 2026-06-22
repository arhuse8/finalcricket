import { Match, Player, Fixture } from './types';

export const INITIAL_TEAMS = {
  RAMPUR: { id: 'RAMPUR', name: 'Rampur Warriors', shortName: 'RMP', logoColor: 'from-orange-500 to-amber-600' },
  MALGUDI: { id: 'MALGUDI', name: 'Malgudi Stars', shortName: 'MGD', logoColor: 'from-blue-500 to-indigo-600' },
  DANGAL: { id: 'DANGAL', name: 'Dangal Kings', shortName: 'DGL', logoColor: 'from-red-500 to-rose-600' },
  GULLY: { id: 'GULLY', name: 'Gully Raiders', shortName: 'GLY', logoColor: 'from-emerald-500 to-teal-600' }
};

// All dummy players are deleted initially
export const INITIAL_PLAYERS: Player[] = [];

// All dummy fixtures are deleted initially
export const INITIAL_FIXTURES: Fixture[] = [];

// Clean fallback local playground live match
export const MOCK_LIVE_MATCH: Match = {
  id: 'm-live-01',
  title: 'Local Arena - Practice Session',
  venue: 'Panchayat Ground',
  date: 'Today, Live Now',
  status: 'Live',
  tossResult: 'Rampur Warriors won the toss & elected to bat first',
  oversLimit: 12,
  battingTeamId: 'RAMPUR',
  bowlingTeamId: 'GULLY',
  team1: {
    id: 'RAMPUR',
    name: 'Rampur Warriors',
    shortName: 'RMP',
    logoColor: 'from-orange-500 to-amber-600',
    score: { runs: 0, wickets: 0, overs: 0, balls: 0 },
    battingCard: [
      { playerName: "Local Batsman 1", status: 'not out', runs: 0, balls: 0, fours: 0, sixes: 0 },
      { playerName: 'Local Batsman 2', status: 'not out', runs: 0, balls: 0, fours: 0, sixes: 0 }
    ],
    bowlingCard: [
      { playerName: 'Local Bowler', overs: 0, maidens: 0, runs: 0, wickets: 0 }
    ]
  },
  team2: {
    id: 'GULLY',
    name: 'Gully Raiders',
    shortName: 'GLY',
    logoColor: 'from-emerald-500 to-teal-600',
    score: { runs: 0, wickets: 0, overs: 0, balls: 0 },
    battingCard: [
      { playerName: 'Local Batsman 3', status: 'yet to bat', runs: 0, balls: 0, fours: 0, sixes: 0 }
    ],
    bowlingCard: [
      { playerName: 'Local Bowler', overs: 0, maidens: 0, runs: 0, wickets: 0 }
    ]
  },
  isFirstInningsComplete: false,
  targetRuns: undefined,
  onStrikeIndex: 0,
  miniScore: {
    batsman1: { name: "Local Batsman 1", runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
    batsman2: { name: 'Local Batsman 2', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
    bowler: { name: 'Local Bowler', overs: 0, maidens: 0, runs: 0, wickets: 0, economy: 0 }
  },
  recentBalls: [],
  ballByBallHistory: []
};

// All dummy completed matches deleted initially
export const MOCK_COMPLETED_MATCHES: Match[] = [];

export const COMMENTARY_PRESETS = [
  'A classic leather cover-drive that sends grass flying. The crowd whistles!',
  'OH MY WORD! He sent that ball straight into Ramu Chachas tea stall! 6 runs!',
  'Excellent Yorker length. The batsman digs it out in nick of time.',
  'WIDE BALL! Way outside off, the umpire stretches of both arms in deep contemplation.',
  'OUT! Inside edge straight into the pads, and then rolls onto the stumps. Shattered timber!',
  'WICKET! Fantastic diving catch by the fielder at mid-on. That kid can jump!',
  'A solid defense back to the bowler. "Pitch look solid!" yells the village head from the stands.',
  'Misfield at boundary! The ball slips right through the fingers and trickles into the mud-lined boundary. FOUR!',
  'Dangerous run, fielder shoots the throw... direct hit! But wait, is he safe? Yes, slid the stick in time!',
  'NO BALL! High full toss above the shoulder line. Free hit is signaled! The batsman grins widely.',
  'Massive swing and a miss! He wanted to deposit that in the neighboring village, but only air was hit.'
];
