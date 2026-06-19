import { Match, Player, Fixture } from './types';

export const INITIAL_TEAMS = {
  RAMPUR: { id: 'RAMPUR', name: 'Rampur Warriors', shortName: 'RMP', logoColor: 'from-orange-500 to-amber-600' },
  MALGUDI: { id: 'MALGUDI', name: 'Malgudi Stars', shortName: 'MGD', logoColor: 'from-blue-500 to-indigo-600' },
  DANGAL: { id: 'DANGAL', name: 'Dangal Kings', shortName: 'DGL', logoColor: 'from-red-500 to-rose-600' },
  GULLY: { id: 'GULLY', name: 'Gully Raiders', shortName: 'GLY', logoColor: 'from-emerald-500 to-teal-600' }
};

export const INITIAL_PLAYERS: Player[] = [
  // Rampur Warriors
  {
    id: 'R1',
    name: "Raju 'Sixer' Yadav",
    teamId: 'RAMPUR',
    role: 'Batsman',
    battingStyle: 'Right-hand bat',
    stats: { matches: 24, runs: 942, highestScore: 114, average: 42.8, strikeRate: 168.5, fifties: 6, hundreds: 2, wickets: 3, bestBowling: '2/15', economy: 8.2 }
  },
  {
    id: 'R2',
    name: 'Amit "Spin-King" Sharma',
    teamId: 'RAMPUR',
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm spin',
    stats: { matches: 25, runs: 124, highestScore: 32, average: 12.4, strikeRate: 110.2, fifties: 0, hundreds: 0, wickets: 42, bestBowling: '5/18', economy: 5.4 }
  },
  {
    id: 'R3',
    name: 'Vijay Verma',
    teamId: 'RAMPUR',
    role: 'All-Rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    stats: { matches: 20, runs: 450, highestScore: 68, average: 28.1, strikeRate: 145.2, fifties: 3, hundreds: 0, wickets: 22, bestBowling: '3/22', economy: 7.1 }
  },
  {
    id: 'R4',
    name: 'Sanju Samson (Local)',
    teamId: 'RAMPUR',
    role: 'Wicket-Keeper',
    battingStyle: 'Right-hand bat',
    stats: { matches: 22, runs: 610, highestScore: 84, average: 33.8, strikeRate: 152.0, fifties: 4, hundreds: 0, wickets: 0, bestBowling: '0/0', economy: 0 }
  },
  {
    id: 'R5',
    name: 'Kapil Dev (Junior)',
    teamId: 'RAMPUR',
    role: 'All-Rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    stats: { matches: 18, runs: 320, highestScore: 52, average: 22.8, strikeRate: 160.4, fifties: 1, hundreds: 0, wickets: 19, bestBowling: '4/11', economy: 6.8 }
  },

  // Malgudi Stars
  {
    id: 'M1',
    name: 'Kiran Kumar',
    teamId: 'MALGUDI',
    role: 'Batsman',
    battingStyle: 'Left-hand bat',
    stats: { matches: 26, runs: 1085, highestScore: 125, average: 49.3, strikeRate: 142.6, fifties: 8, hundreds: 3, wickets: 1, bestBowling: '1/8', economy: 9.0 }
  },
  {
    id: 'M2',
    name: 'Suresh "Yadav" Raina',
    teamId: 'MALGUDI',
    role: 'All-Rounder',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Right-arm spin',
    stats: { matches: 25, runs: 720, highestScore: 78, average: 36.0, strikeRate: 155.8, fifties: 5, hundreds: 0, wickets: 18, bestBowling: '3/14', economy: 6.4 }
  },
  {
    id: 'M3',
    name: 'Anil Kumble (Local)',
    teamId: 'MALGUDI',
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm spin',
    stats: { matches: 28, runs: 95, highestScore: 18, average: 9.5, strikeRate: 85.0, fifties: 0, hundreds: 0, wickets: 51, bestBowling: '6/12', economy: 4.8 }
  },
  {
    id: 'M4',
    name: 'Mohit "Yoker" Patel',
    teamId: 'MALGUDI',
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Left-arm fast',
    stats: { matches: 22, runs: 45, highestScore: 12, average: 5.0, strikeRate: 72.5, fifties: 0, hundreds: 0, wickets: 33, bestBowling: '4/20', economy: 6.9 }
  },

  // Dangal Kings
  {
    id: 'D1',
    name: 'Sunny "Gabru" Singh',
    teamId: 'DANGAL',
    role: 'Batsman',
    battingStyle: 'Right-hand bat',
    stats: { matches: 19, runs: 712, highestScore: 92, average: 44.5, strikeRate: 158.4, fifties: 5, hundreds: 0, wickets: 4, bestBowling: '2/10', economy: 7.8 }
  },
  {
    id: 'D2',
    name: 'Deepak Chahar (Local)',
    teamId: 'DANGAL',
    role: 'All-Rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    stats: { matches: 21, runs: 280, highestScore: 45, average: 20.0, strikeRate: 135.2, fifties: 0, hundreds: 0, wickets: 28, bestBowling: '4/18', economy: 6.2 }
  },
  {
    id: 'D3',
    name: 'Jaspreet Bumrah (Junior)',
    teamId: 'DANGAL',
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    stats: { matches: 20, runs: 30, highestScore: 10, average: 4.2, strikeRate: 90.0, fifties: 0, hundreds: 0, wickets: 38, bestBowling: '5/8', economy: 5.1 }
  },

  // Gully Raiders
  {
    id: 'G1',
    name: 'Bablu "Helicopter" Dhoni',
    teamId: 'GULLY',
    role: 'Wicket-Keeper',
    battingStyle: 'Right-hand bat',
    stats: { matches: 30, runs: 1120, highestScore: 102, average: 56.0, strikeRate: 164.8, fifties: 9, hundreds: 2, wickets: 0, bestBowling: '0/0', economy: 0 }
  },
  {
    id: 'G2',
    name: 'Zaheer Khan (Local)',
    teamId: 'GULLY',
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Left-arm fast',
    stats: { matches: 28, runs: 68, highestScore: 15, average: 8.5, strikeRate: 99.1, fifties: 0, hundreds: 0, wickets: 45, bestBowling: '5/16', economy: 5.8 }
  },
  {
    id: 'G3',
    name: 'Irfan Pathan (Junior)',
    teamId: 'GULLY',
    role: 'All-Rounder',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Left-arm fast',
    stats: { matches: 25, runs: 580, highestScore: 65, average: 29.0, strikeRate: 141.2, fifties: 4, hundreds: 0, wickets: 25, bestBowling: '3/15', economy: 6.6 }
  }
];

export const INITIAL_FIXTURES: Fixture[] = [
  {
    id: 'f1',
    team1Name: 'Rampur Warriors',
    team2Name: 'Malgudi Stars',
    team1Short: 'RMP',
    team2Short: 'MGD',
    team1Color: 'from-orange-500 to-amber-600',
    team2Color: 'from-blue-500 to-indigo-600',
    date: 'Jun 19, 2026',
    time: '4:30 PM IST',
    venue: 'Rampur Local High School Ground',
    tournamentName: 'Apna Village Khalsa Cup'
  },
  {
    id: 'f2',
    team1Name: 'Dangal Kings',
    team2Name: 'Gully Raiders',
    team1Short: 'DGL',
    team2Short: 'GLY',
    team1Color: 'from-red-500 to-rose-600',
    team2Color: 'from-emerald-500 to-teal-600',
    date: 'Jun 21, 2026',
    time: '2:00 PM IST',
    venue: 'Panchayat Ground, Rampur',
    tournamentName: 'Apna Village Khalsa Cup'
  },
  {
    id: 'f3',
    team1Name: 'Malgudi Stars',
    team2Name: 'Gully Raiders',
    team1Short: 'MGD',
    team2Short: 'GLY',
    team1Color: 'from-blue-500 to-indigo-600',
    team2Color: 'from-emerald-500 to-teal-600',
    date: 'Jun 24, 2026',
    time: '4:30 PM IST',
    venue: 'Malgudi Lake View Ground',
    tournamentName: 'Village Premier League (VPL)'
  },
  {
    id: 'f4',
    team1Name: 'Rampur Warriors',
    team2Name: 'Dangal Kings',
    team1Short: 'RMP',
    team2Short: 'DGL',
    team1Color: 'from-orange-500 to-amber-600',
    team2Color: 'from-red-500 to-rose-600',
    date: 'Jun 28, 2026',
    time: '5:00 PM IST',
    venue: 'Rampur Cow Dung Stadium arena',
    tournamentName: 'Village Premier League (VPL)'
  }
];

export const MOCK_LIVE_MATCH: Match = {
  id: 'm-live-01',
  title: 'Panchayat Trophy - Village Derby Match 12',
  venue: 'Rampur Panchayat Meadow Arena',
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
    score: { runs: 86, wickets: 3, overs: 7, balls: 2 },
    battingCard: [
      { playerName: "Raju 'Sixer' Yadav", status: 'not out', runs: 46, balls: 21, fours: 3, sixes: 4 },
      { playerName: 'Vijay Verma', status: 'not out', runs: 18, balls: 11, fours: 2, sixes: 0 },
      { playerName: 'Sanju Samson (Local)', status: 'c Zaheer b Irfan', runs: 12, balls: 8, fours: 1, sixes: 1 },
      { playerName: 'Kapil Dev (Junior)', status: 'b Zaheer Khan', runs: 8, balls: 4, fours: 0, sixes: 1 }
    ],
    bowlingCard: [
      { playerName: 'Zaheer Khan (Local)', overs: 2, maidens: 0, runs: 21, wickets: 1 },
      { playerName: 'Irfan Pathan (Junior)', overs: 3, maidens: 0, runs: 34, wickets: 1 }
    ]
  },
  team2: {
    id: 'GULLY',
    name: 'Gully Raiders',
    shortName: 'GLY',
    logoColor: 'from-emerald-500 to-teal-600',
    score: { runs: 0, wickets: 0, overs: 0, balls: 0 },
    battingCard: [
      { playerName: 'Bablu "Helicopter" Dhoni', status: 'yet to bat', runs: 0, balls: 0, fours: 0, sixes: 0 }
    ],
    bowlingCard: [
      { playerName: 'Zaheer Khan (Local)', overs: 2, maidens: 0, runs: 24, wickets: 2 },
      { playerName: 'Irfan Pathan (Junior)', overs: 3, maidens: 0, runs: 30, wickets: 1 }
    ]
  },
  isFirstInningsComplete: false,
  targetRuns: undefined,
  onStrikeIndex: 0, // Raju Yadav is on strike
  miniScore: {
    batsman1: { name: "Raju 'Sixer' Yadav", runs: 46, balls: 21, fours: 3, sixes: 4, strikeRate: 219.05 },
    batsman2: { name: 'Vijay Verma', runs: 18, balls: 11, fours: 2, sixes: 0, strikeRate: 163.64 },
    bowler: { name: 'Zaheer Khan (Local)', overs: 2.2, maidens: 0, runs: 21, wickets: 1, economy: 9.0 }
  },
  recentBalls: ['1', '4', '6', '1', '0', '4'],
  ballByBallHistory: [
    { overNumber: 7, ballOfOver: 2, run: 4, isWide: false, isNoBall: false, isWicket: false, batsmanName: "Raju 'Sixer' Yadav", bowlerName: 'Zaheer Khan (Local)', commentary: 'CRACK! Zaheer throws a full delivery, Raju takes a step forward and hammers it straight down the carpet for a magnificent four!' },
    { overNumber: 7, ballOfOver: 1, run: 0, isWide: false, isNoBall: false, isWicket: false, batsmanName: "Raju 'Sixer' Yadav", bowlerName: 'Zaheer Khan (Local)', commentary: 'Good length delivery outside off, Raju swings hard but gets no wood on it. Keeper gathers neatly.' },
    { overNumber: 6, ballOfOver: 6, run: 1, isWide: false, isNoBall: false, isWicket: false, batsmanName: 'Vijay Verma', bowlerName: 'Irfan Pathan (Junior)', commentary: 'A gentle tap to cover point for a quick single to retain the strike.' },
    { overNumber: 6, ballOfOver: 5, run: 6, isWide: false, isNoBall: false, isWicket: false, batsmanName: 'Vijay Verma', bowlerName: 'Irfan Pathan (Junior)', commentary: 'BOOM! Slower delivery completely misjudged, Vijay punches it high over deep square leg for a fantastic six! The crowd of village elders erupts in cheers!' },
    { overNumber: 6, ballOfOver: 4, run: 1, isWide: false, isNoBall: false, isWicket: false, batsmanName: "Raju 'Sixer' Yadav", bowlerName: 'Irfan Pathan (Junior)', commentary: 'Raju drives beautifully to deep offside for a comfortable single.' },
    { overNumber: 6, ballOfOver: 3, run: 4, isWide: false, isNoBall: false, isWicket: false, batsmanName: "Raju 'Sixer' Yadav", bowlerName: 'Irfan Pathan (Junior)', commentary: 'Slicing away! Full and wide, Raju uses the pace of the ball and guides it past third-man boundary. Four run-away runs!' }
  ]
};

export const MOCK_COMPLETED_MATCHES: Match[] = [
  {
    id: 'm-comp-01',
    title: 'Village Charity Cup Final',
    venue: 'Malgudi Lake View Ground',
    date: 'Yesterday, Completed',
    status: 'Completed',
    tossResult: 'Dangal Kings won the toss & elected to bowl first',
    oversLimit: 10,
    battingTeamId: 'MALGUDI',
    bowlingTeamId: 'DANGAL',
    team1: {
      id: 'MALGUDI',
      name: 'Malgudi Stars',
      shortName: 'MGD',
      logoColor: 'from-blue-500 to-indigo-600',
      score: { runs: 114, wickets: 4, overs: 10, balls: 0 },
      battingCard: [
        { playerName: 'Kiran Kumar', status: 'b Sunny', runs: 53, balls: 28, fours: 5, sixes: 3 },
        { playerName: 'Suresh "Yadav" Raina', status: 'not out', runs: 38, balls: 18, fours: 2, sixes: 2 }
      ],
      bowlingCard: [
        { playerName: 'Anil Kumble (Local)', overs: 2, maidens: 0, runs: 14, wickets: 3 },
        { playerName: 'Mohit "Yoker" Patel', overs: 2, maidens: 0, runs: 18, wickets: 2 }
      ]
    },
    team2: {
      id: 'DANGAL',
      name: 'Dangal Kings',
      shortName: 'DGL',
      logoColor: 'from-red-500 to-rose-600',
      score: { runs: 108, wickets: 6, overs: 10, balls: 0 },
      battingCard: [
        { playerName: 'Sunny "Gabru" Singh', status: 'c Kiran b Anil', runs: 44, balls: 24, fours: 3, sixes: 2 },
        { playerName: 'Deepak Chahar (Local)', status: 'run out', runs: 15, balls: 12, fours: 1, sixes: 0 }
      ],
      bowlingCard: [
        { playerName: 'Sunny "Gabru" Singh', overs: 2, maidens: 0, runs: 28, wickets: 1 }
      ]
    },
    isFirstInningsComplete: true,
    targetRuns: 115,
    onStrikeIndex: 0,
    miniScore: {
      batsman1: { name: 'Kiran Kumar', runs: 53, balls: 28, fours: 5, sixes: 3, strikeRate: 189.28 },
      batsman2: { name: 'Suresh Yadav Raina', runs: 38, balls: 18, fours: 2, sixes: 2, strikeRate: 211.11 },
      bowler: { name: 'Anil Kumble (Local)', overs: 2.0, maidens: 0, runs: 14, wickets: 3, economy: 7.0 }
    },
    recentBalls: [],
    ballByBallHistory: []
  }
];

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
