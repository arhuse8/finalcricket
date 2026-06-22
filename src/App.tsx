import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScorecardView from './components/ScorecardView';
import MatchSimulator from './components/MatchSimulator';
import PlayerStatsView from './components/PlayerStats';
import FixturesList from './components/FixturesList';
import SplashView from './components/SplashView';
import HomeView from './components/HomeView';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import TeamsView from './components/TeamsView';
import TournamentsView from './components/TournamentsView';
import WagonWheel from './components/WagonWheel';
import Footer from './components/landing/Footer';
import MatchesListView from './components/MatchesListView';
import { isSupabaseConfigured } from './lib/supabase';
import { supabaseService } from './lib/supabaseService';

import { Match, Player, Fixture } from './types';
import { INITIAL_FIXTURES, INITIAL_PLAYERS, MOCK_LIVE_MATCH } from './mockData';
import { Star, ShieldAlert, Award, ChevronRight, HelpCircle } from 'lucide-react';

const LOCAL_STORAGE_MATCH_KEY = 'apna_cricket_live_match';
const LOCAL_STORAGE_PLAYERS_KEY = 'apna_cricket_players_db';
const LOCAL_STORAGE_FIXTURES_KEY = 'apna_cricket_fixtures';
const LOCAL_STORAGE_USER_KEY = 'apna_cricket_auth_user';

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'matches' | 'fixtures' | 'teams' | 'tournaments' | 'stats' | 'dashboard' | 'auth'>('home');
  const [currentSimulatedView, setCurrentSimulatedView] = useState<'list' | 'detail'>('list');

  // Authenticated User State
  const [username, setUsername] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_USER_KEY) || null;
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('apna_cricket_user_obj');
      return stored ? JSON.parse(stored) : {
        name: 'Guest Player',
        email: 'guest@apnacricket.com',
        teamId: 'RAMPUR',
        role: 'All-Rounder',
        joinedDate: 'Jun 18, 2026'
      };
    } catch {
      return {
        name: 'Guest Player',
        email: 'guest@apnacricket.com',
        teamId: 'RAMPUR',
        role: 'All-Rounder',
        joinedDate: 'Jun 18, 2026'
      };
    }
  });

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem('apna_cricket_user_obj');
    setUsername(null);
    setCurrentUser({
      name: 'Guest Player',
      email: 'guest@apnacricket.com',
      teamId: 'RAMPUR',
      role: 'All-Rounder',
      joinedDate: 'Jun 18, 2026'
    });
    setCurrentView('home');
  };

  const INITIAL_TEAMS_LIST = [
    { id: 'RAMPUR', name: 'Rampur Warriors', short: 'RMP', color: 'from-orange-500 to-amber-600', captain: "Raju 'Sixer' Yadav", venue: "Rampur Local School Ground", rank: 1, trophies: 3 },
    { id: 'MALGUDI', name: 'Malgudi Stars', short: 'MGD', color: 'from-blue-500 to-indigo-600', captain: 'Kiran Kumar', venue: 'Malgudi Lake View Ground', rank: 2, trophies: 2 },
    { id: 'DANGAL', name: 'Dangal Kings', short: 'DGL', color: 'from-red-500 to-rose-600', captain: 'Sunny "Gabru" Singh', venue: 'Panchayat Ground', rank: 3, trophies: 1 },
    { id: 'GULLY', name: 'Gully Raiders', short: 'GLY', color: 'from-emerald-500 to-teal-600', captain: 'Bablu "Helicopter" Dhoni', venue: 'Rampur Meadows Ground', rank: 4, trophies: 4 }
  ];

  const INITIAL_TOURNAMENTS_LIST = [
    { id: 'KHALSA', name: 'Apna Village Khalsa Cup', organizer: 'Panchayat Council', balls: 'Heavy Tape Ball', duration: '12 Overs', count: 4, prize: 'Cow Dairy Calf & Trophy' },
    { id: 'VPL', name: 'Village Premier League (VPL)', organizer: 'Malgudi Meadows Committee', balls: 'Leather Ball', duration: '12 Overs', count: 4, prize: 'English Willow Kit' }
  ];

  // Initialize States elegantly from LocalStorage to keep things persistent
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PLAYERS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_PLAYERS;
    } catch {
      return INITIAL_PLAYERS;
    }
  });

  const [liveMatch, setLiveMatch] = useState<Match>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_MATCH_KEY);
      return stored ? JSON.parse(stored) : MOCK_LIVE_MATCH;
    } catch {
      return MOCK_LIVE_MATCH;
    }
  });

  const [fixtures, setFixtures] = useState<Fixture[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_FIXTURES_KEY);
      return stored ? JSON.parse(stored) : INITIAL_FIXTURES;
    } catch {
      return INITIAL_FIXTURES;
    }
  });

  const [teams, setTeams] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('apna_cricket_teams_db');
      return stored ? JSON.parse(stored) : INITIAL_TEAMS_LIST;
    } catch {
      return INITIAL_TEAMS_LIST;
    }
  });

  const [tournaments, setTournaments] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('apna_cricket_tournaments_db');
      return stored ? JSON.parse(stored) : INITIAL_TOURNAMENTS_LIST;
    } catch {
      return INITIAL_TOURNAMENTS_LIST;
    }
  });

  // Sync back to local storage whenever states modify
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PLAYERS_KEY, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MATCH_KEY, JSON.stringify(liveMatch));
  }, [liveMatch]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FIXTURES_KEY, JSON.stringify(fixtures));
  }, [fixtures]);

  useEffect(() => {
    localStorage.setItem('apna_cricket_teams_db', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('apna_cricket_tournaments_db', JSON.stringify(tournaments));
  }, [tournaments]);

  // Synchronise state with real Supabase Database entries on startup / boot
  useEffect(() => {
    async function syncSupabaseData() {
      if (!isSupabaseConfigured) return;
      try {
        const dbTeamsObj = await supabaseService.getTeams();
        if (dbTeamsObj && dbTeamsObj.length > 0) {
          const mappedTeams = dbTeamsObj.map((t: any) => ({
            id: t.team_id,
            name: t.team_name,
            short: t.short_name || t.team_name.substring(0, 3).toUpperCase(),
            color: t.logo_color || 'from-blue-500 to-indigo-600',
            captain: t.captain_name || 'Team Captain',
            venue: t.home_venue || 'Local Panchayat Ground',
            rank: t.rank || 1,
            trophies: t.trophies || 0
          }));
          setTeams(mappedTeams);
        }

        const dbPlayersObj = await supabaseService.getPlayers();
        if (dbPlayersObj) {
          const mappedPlayers = dbPlayersObj.map((p: any) => ({
            id: p.player_id,
            name: p.full_name,
            teamId: p.team_id || 'RAMPUR',
            role: p.playing_role || 'All-Rounder',
            battingStyle: p.batting_style || 'Right-hand bat',
            bowlingStyle: p.bowling_style || 'Right-arm fast',
            stats: {
              matches: p.matches_played || 0,
              runs: p.total_runs || 0,
              highestScore: p.highest_score || 0,
              average: p.batting_average || 0,
              strikeRate: p.strike_rate || 0,
              fifties: p.fifties || 0,
              hundreds: p.hundreds || 0,
              wickets: p.wickets_taken || 0,
              bestBowling: p.best_bowling || '0/0',
              economy: p.bowling_economy || 6.0
            }
          }));
          setPlayers(mappedPlayers);
        }

        const dbMatchesObj = await supabaseService.getMatches();
        if (dbMatchesObj) {
          const upcomingFixtures = dbMatchesObj
            .filter((m: any) => m.match_status === 'upcoming')
            .map((m: any) => ({
              id: m.match_id,
              team1Name: m.team_a_name || 'Team A',
              team2Name: m.team_b_name || 'Team B',
              team1Short: m.team_a_short || 'T1',
              team2Short: m.team_b_short || 'T2',
              team1Color: 'from-orange-500 to-amber-600',
              team2Color: 'from-blue-500 to-indigo-600',
              date: m.match_date || 'TBD',
              time: 'TBD',
              venue: m.venue || m.ground_name || 'Local Arena',
              tournamentName: m.match_title || 'Local Championship'
            }));
          setFixtures(upcomingFixtures);
        }
      } catch (e) {
        console.error('Error synchronising with Supabase on boot:', e);
      }
    }
    if (isBooted) {
      syncSupabaseData();
    }
  }, [isBooted]);

  // Real-time statistics updater callback
  const handlePlayerStatUpdate = (
    playerName: string,
    runs: number,
    balls: number,
    fours: number,
    sixes: number,
    wicket: boolean,
    bowlerName: string
  ) => {
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        // Find player in list matching current batsman or bowler
        if (player.name === playerName) {
          const stats = { ...player.stats };
          
          // Add 1 match to totals if they faced their first ball
          if (balls === 1 && runs === 0) {
            stats.matches += 1;
          }

          // Add runs, calculate new averages and strike rates
          stats.runs += runs;
          if (stats.runs > stats.highestScore) {
            stats.highestScore = stats.runs;
          }

          // Simple dynamic incremental average calculation
          const totalAtBats = stats.matches > 0 ? stats.matches : 1;
          stats.average = parseFloat((stats.runs / totalAtBats).toFixed(1));
          
          const totalBallsFaced = (player.stats.runs + runs) > 0 ? (player.stats.runs + runs) : 1;
          stats.strikeRate = parseFloat((((stats.runs + runs) / totalBallsFaced) * 100).toFixed(1));

          return { ...player, stats };
        }

        // Add wickets & adjust economy for active bowler
        if (player.name === bowlerName && wicket) {
          const stats = { ...player.stats };
          stats.wickets += 1;
          return { ...player, stats };
        }

        return player;
      });
    });
  };

  // Recruit new player callback
  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers(prev => [newPlayer, ...prev]);
  };

  // Delete recruited player callback
  const handleDeletePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  // Callback to add dynamic scheduled fixtures
  const handleAddFixture = (newFixture: Fixture) => {
    setFixtures(prev => [newFixture, ...prev]);
  };

  // Switch Live Simulation to a scheduled fixture matchup
  const handleSelectFixtureToSimulate = (fixture: Fixture) => {
    // Generate fresh match state
    const newLiveState: Match = {
      id: `m-live-${Date.now()}`,
      title: `${fixture.tournamentName} - Derby`,
      venue: fixture.venue,
      date: 'Live Now',
      status: 'Live',
      tossResult: `${fixture.team1Name} won the toss & elected to bat first`,
      oversLimit: 12,
      battingTeamId: fixture.team1Name.toUpperCase().includes('RAMPUR') ? 'RAMPUR' : 'MALGUDI',
      bowlingTeamId: fixture.team2Name.toUpperCase().includes('GULLY') ? 'GULLY' : 'DANGAL',
      team1: {
        id: 'T1',
        name: fixture.team1Name,
        shortName: fixture.team1Short,
        logoColor: fixture.team1Color,
        score: { runs: 0, wickets: 0, overs: 0, balls: 0 },
        battingCard: [
          { playerName: "Kiran Kumar", status: 'not out', runs: 0, balls: 0, fours: 0, sixes: 0 },
          { playerName: "Raju 'Sixer' Yadav", status: 'not out', runs: 0, balls: 0, fours: 0, sixes: 0 }
        ],
        bowlingCard: [
          { playerName: 'Zaheer Khan (Local)', overs: 0, maidens: 0, runs: 0, wickets: 0 },
          { playerName: 'Irfan Pathan (Junior)', overs: 0, maidens: 0, runs: 0, wickets: 0 }
        ]
      },
      team2: {
        id: 'T2',
        name: fixture.team2Name,
        shortName: fixture.team2Short,
        logoColor: fixture.team2Color,
        score: { runs: 0, wickets: 0, overs: 0, balls: 0 },
        battingCard: [
          { playerName: 'Bablu "Helicopter" Dhoni', status: 'yet to bat', runs: 0, balls: 0, fours: 0, sixes: 0 }
        ],
        bowlingCard: [
          { playerName: 'Zaheer Khan (Local)', overs: 0, maidens: 0, runs: 0, wickets: 0 }
        ]
      },
      isFirstInningsComplete: false,
      targetRuns: undefined,
      onStrikeIndex: 0,
      miniScore: {
        batsman1: { name: 'Kiran Kumar', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
        batsman2: { name: "Raju 'Sixer' Yadav", runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
        bowler: { name: 'Zaheer Khan (Local)', overs: 0, maidens: 0, runs: 0, wickets: 0, economy: 0 }
      },
      recentBalls: [],
      ballByBallHistory: []
    };

    setLiveMatch(newLiveState);
    setCurrentView('matches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset local storage back to seeded defaults
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all cricket scores, custom players and statistics to default seeds?')) {
      localStorage.removeItem(LOCAL_STORAGE_MATCH_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PLAYERS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_FIXTURES_KEY);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem('apna_cricket_teams_db');
      localStorage.removeItem('apna_cricket_tournaments_db');
      localStorage.removeItem('apna_cricket_drafted_teams');
      
      setLiveMatch(MOCK_LIVE_MATCH);
      setPlayers(INITIAL_PLAYERS);
      setFixtures(INITIAL_FIXTURES);
      setTeams(INITIAL_TEAMS_LIST);
      setTournaments(INITIAL_TOURNAMENTS_LIST);
      setUsername(null);
      
      setCurrentView('home');
    }
  };

  // Render Splash screen on first boot
  if (!isBooted) {
    return <SplashView onDismiss={() => setIsBooted(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white leading-normal" id="app-viewport-wrapper">
      {/* Navbar Branding & Tickers */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        liveMatch={liveMatch}
        onReset={handleResetData}
        username={username}
        onLogout={handleLogout}
      />

      <main className="grow mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          {/* Main conditional layouts mapping current views */}
          {currentView === 'home' && (
            <HomeView
              liveMatch={liveMatch}
              fixtures={fixtures}
              players={players}
              onSelectView={setCurrentView}
              onSelectFixtureToSimulate={handleSelectFixtureToSimulate}
            />
          )}

          {currentView === 'auth' && (
            <AuthView
              onLoginSuccess={(usr) => {
                localStorage.setItem('apna_cricket_user_obj', JSON.stringify(usr));
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, usr.name);
                setCurrentUser(usr);
                setUsername(usr.name);
                setCurrentView('dashboard');
              }}
              onBypass={() => setCurrentView('home')}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              user={currentUser}
              fixtures={fixtures}
              onSelectView={setCurrentView}
            />
          )}

          {currentView === 'teams' && (
            <TeamsView
              players={players}
              onAddPlayer={handleAddPlayer}
              onDeletePlayer={handleDeletePlayer}
              teams={teams}
              setTeams={setTeams}
            />
          )}

          {currentView === 'tournaments' && (
            <TournamentsView
              fixtures={fixtures}
              onAddFixture={handleAddFixture}
              tournaments={tournaments}
              setTournaments={setTournaments}
              teams={teams}
            />
          )}

          {currentView === 'matches' && (
            <MatchesListView
              liveMatch={liveMatch}
              setLiveMatch={setLiveMatch}
              onSelectFixtureToSimulate={handleSelectFixtureToSimulate}
              onPlayerStatUpdate={handlePlayerStatUpdate}
              currentSimulatedView={currentSimulatedView}
              setCurrentSimulatedView={setCurrentSimulatedView}
              onReset={() => {
                setLiveMatch(MOCK_LIVE_MATCH);
                alert('Dynamic match databases reset successfully!');
              }}
            />
          )}

          {currentView === 'fixtures' && (
            <FixturesList
              fixtures={fixtures}
              activeMatchTitle={liveMatch.title}
              onSelectFixtureToSimulate={handleSelectFixtureToSimulate}
            />
          )}

          {currentView === 'stats' && (
            <PlayerStatsView
              players={players}
              onAddPlayer={handleAddPlayer}
              teams={teams}
            />
          )}

        </div>
      </main>

      {/* FOOTER */}
      <Footer setCurrentView={setCurrentView} />
    </div>
  );
}
