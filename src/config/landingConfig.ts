// Apna Cricket Landing Page - Customizable Assets & Copy configuration
// Clean industry approach: Developer can change copy or image assets here without editing React components.

export const LANDING_CONFIG = {
  // Global configuration
  branding: {
    logoIcon: '🏏',
    titleMain: 'APNA',
    titleSub: 'CRICKET',
    slogan: 'LIVE CRICKET. LOCAL HEROES.',
    description: "India's most loved grassroots cricket platform. Building the future of cricket from the ground up."
  },

  // Hero Section
  hero: {
    backgroundUrl: 'https://images.unsplash.com/photo-1540747737956-378724044432?auto=format&fit=crop&q=80&w=2000', // Beautiful cricket stadium at night
    badgeText: 'Live',
    badgeLabel: 'SPL 2024 - Match 23',
    headingLine1: "INDIA'S",
    headingRed: 'GRASSROOTS',
    headingLine2: 'CRICKET PLATFORM',
    subheading: 'Connecting players, teams and tournaments from every corner of India.',
    btnTeamText: 'Create Team',
    btnTournamentText: 'Explore Tournaments',
    
    // Live match overlay inside Hero
    liveMatch: {
      team1Name: 'CHENNAI SUPER KINGS',
      team1Short: 'CSK',
      team1Logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=csk&backgroundColor=eab308',
      team1Score: '154/5',
      team1Overs: '18.3 Overs',
      team2Name: 'MUMBAI INDIANS',
      team2Short: 'MI',
      team2Logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=mi&backgroundColor=3b82f6',
      team2Score: '145/8',
      team2Overs: '20.0 Overs',
      statusMessage: 'CSK need 9 runs in 9 balls',
      crr: '8.32',
      rrr: '6.00',
      target: '163',
      venue: 'Wankhede Stadium, Mumbai',
      batsmen: [
        { name: 'Ruturaj Gaikwad*', runs: 45, balls: 32 },
        { name: 'Shivam Dube', runs: 21, balls: 12 }
      ],
      bowler: { name: 'Jasprit Bumrah', oversRate: '3-0-24-2' },
      recentBalls: ['1', '4', '0', 'W', '2', '6'] // Color maps perfectly to scorecard icons
    }
  },

  // 100% Free / Highlights bar
  highlights: [
    { id: 'livescores', label: 'LIVE SCORES', desc: 'Ball by ball updates', iconType: 'tv', colorClass: 'bg-rose-50 text-rose-500' },
    { id: 'tournaments', label: 'TOURNAMENTS', desc: 'Local to national level', iconType: 'trophy', colorClass: 'bg-blue-50 text-blue-500' },
    { id: 'playerstats', label: 'PLAYER STATS', desc: 'Detailed performance', iconType: 'award', colorClass: 'bg-emerald-50 text-emerald-500' },
    { id: 'teammgmt', label: 'TEAM MANAGEMENT', desc: 'Easy team operations', iconType: 'users', colorClass: 'bg-purple-50 text-purple-500' },
    { id: 'free', label: '100% FREE', desc: 'For everyone forever', iconType: 'star', colorClass: 'bg-amber-50 text-amber-500' }
  ],

  // Upcoming Tournaments promo box
  tournamentPromo: {
    badge: 'NEW',
    title: 'SHIVAJI PREMIER LEAGUE 2024',
    subtitle: 'SHIVAJI PREMIER',
    year: 'LEAGUE 2024',
    teamsCount: 32,
    matchesCount: 45,
    groundsCount: 15,
    dates: '20 May - 30 June 2024',
    bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600' // Cricket pitch close-up
  },

  // Leaders / Top Players List
  topPlayers: [
    { id: 1, name: 'Ruturaj Gaikwad', team: 'CSK', score: '645', metricType: 'Runs', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ruturaj' },
    { id: 2, name: 'Jasprit Bumrah', team: 'MI', score: '18', metricType: 'Wickets', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasprit' },
    { id: 3, name: 'Virat Kohli', team: 'RCB', score: '612', metricType: 'Runs', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Virat' },
    { id: 4, name: 'Yuzvendra Chahal', team: 'RR', score: '16', metricType: 'Wickets', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuzvendra' }
  ],

  // mini Points table SPL 2024 columns
  pointsTable: [
    { rank: 1, team: 'CSK', icon: '🦁', played: 6, won: 5, lost: 1, pts: 10, nrr: '+1.45' },
    { rank: 2, team: 'MI', icon: '🌀', played: 6, won: 4, lost: 2, pts: 8, nrr: '+0.89' },
    { rank: 3, team: 'RCB', icon: '🦁', played: 6, won: 3, lost: 3, pts: 6, nrr: '+0.10' },
    { rank: 4, team: 'KKR', icon: '🛡️', played: 6, won: 2, lost: 4, pts: 4, nrr: '-0.33' }
  ],

  // Upcoming matches carousel slider cards list
  upcomingMatches: [
    { matchNo: 'Match 24', team1Short: 'RCB', team1Icon: '🦁', team2Short: 'KKR', team2Icon: '🛡️', dateLabel: 'Today, 07:30 PM', venue: 'Wankhede Stadium, Mumbai' },
    { matchNo: 'Match 25', team1Short: 'GT', team1Icon: '⚡', team2Short: 'PBKS', team2Icon: '🦁', dateLabel: 'Tomorrow, 07:30 PM', venue: 'Narendra Modi Stadium, Ahmedabad' },
    { matchNo: 'Match 26', team1Short: 'RR', team1Icon: '👑', team2Short: 'SRH', team2Icon: '🦅', dateLabel: '22 May, 07:30 PM', venue: 'Sawai Mansingh Stadium, Jaipur' },
    { matchNo: 'Match 27', team1Short: 'DC', team1Icon: '🐯', team2Short: 'LSG', team2Icon: '🦅', dateLabel: '23 May, 07:30 PM', venue: 'Arun Jaitley Stadium, Delhi' },
    { matchNo: 'Match 28', team1Short: 'MI', team1Icon: '🌀', team2Short: 'CSK', team2Icon: '🦁', dateLabel: '24 May, 07:30 PM', venue: 'Wankhede Stadium, Mumbai' }
  ],

  // Footer Sitemap & Legal Resources
  footer: {
    quickLinks: [
      { name: 'Home' },
      { name: 'Matches' },
      { name: 'Tournaments' },
      { name: 'Teams' },
      { name: 'Players' }
    ],
    information: [
      { name: 'About Us' },
      { name: 'How It Works' },
      { name: 'Pricing' },
      { name: 'FAQs' },
      { name: 'Contact Us' }
    ],
    support: [
      { name: 'Help Center' },
      { name: 'Terms & Conditions' },
      { name: 'Privacy Policy' },
      { name: 'Refund Policy' }
    ],
    socials: {
      facebook: '#',
      instagram: '#',
      youtube: '#',
      twitter: '#'
    },
    appLinks: {
      googlePlay: 'https://play.google.com/store',
      appStore: 'https://www.apple.com/app-store'
    }
  }
};
