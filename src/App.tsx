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
      
      setLiveMatch(MOCK_LIVE_MATCH);
      setPlayers(INITIAL_PLAYERS);
      setFixtures(INITIAL_FIXTURES);
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
            />
          )}

          {currentView === 'tournaments' && (
            <TournamentsView
              fixtures={fixtures}
              onAddFixture={handleAddFixture}
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
            />
          )}

        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
