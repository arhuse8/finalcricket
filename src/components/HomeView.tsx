import React, { useState, useEffect } from 'react';
import { Match, Fixture, Player } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';
import { supabaseService } from '../lib/supabaseService';

// Importing the modular components - beautiful industry approach!
import HeroSection from './landing/HeroSection';
import FeaturesRow from './landing/FeaturesRow';
import LiveMatchesBento from './landing/LiveMatchesBento';
import UpcomingTournamentsBento from './landing/UpcomingTournamentsBento';
import TopPlayersBento from './landing/TopPlayersBento';
import PointsTableBento from './landing/PointsTableBento';
import UpcomingSlider from './landing/UpcomingSlider';

interface HomeViewProps {
  liveMatch: Match;
  fixtures: Fixture[];
  players: Player[];
  onSelectView: (view: 'home' | 'LiveMatches' | 'fixtures' | 'teams' | 'tournaments' | 'stats' | 'dashboard' | 'auth') => void;
  onSelectFixtureToSimulate: (fixture: Fixture) => void;
}

export default function HomeView({
  liveMatch,
  fixtures,
  players: localPlayers,
  onSelectView,
  onSelectFixtureToSimulate
}: HomeViewProps) {

  const [dbData, setDbData] = useState<{
    players: Player[];
    teams: any[];
    matches: any[];
    loading: boolean;
  }>({
    players: [],
    teams: [],
    matches: [],
    loading: true
  });

  useEffect(() => {
    async function fetchAllRealtimeData() {
      if (!isSupabaseConfigured) {
        setDbData({
          players: localPlayers,
          teams: [],
          matches: [],
          loading: false
        });
        return;
      }
      try {
        const teams = await supabaseService.getTeams();
        const playersRaw = await supabaseService.getPlayers();
        const matches = await supabaseService.getMatches();

        // Let's load innings for active and live matches
        const parsedMatches: any[] = [];
        for (const m of matches) {
          // Only load innings for live or completed matches to minimize calls
          let innings: any[] = [];
          if (m.match_status !== 'upcoming') {
            innings = await supabaseService.getMatchInnings(m.match_id);
          }
          
          const t1 = teams.find((t: any) => t.team_id === m.team_a_id) || teams.find((t: any) => t.team_id === m.team_1_id);
          const t2 = teams.find((t: any) => t.team_id === m.team_b_id) || teams.find((t: any) => t.team_id === m.team_2_id);

          const team1Name = t1?.team_name || m.team_a_name || 'Team A';
          const team2Name = t2?.team_name || m.team_b_name || 'Team B';
          const team1Short = t1?.short_name || team1Name.substring(0, 3).toUpperCase();
          const team2Short = t2?.short_name || team2Name.substring(0, 3).toUpperCase();
          const team1Color = t1?.logo_color || 'from-orange-500 to-amber-600';
          const team2Color = t2?.logo_color || 'from-blue-500 to-indigo-600';

          const innings1 = innings.find((inn: any) => inn.innings_number === 1);
          const innings2 = innings.find((inn: any) => inn.innings_number === 2);

          const r1 = innings1?.total_runs || 0;
          const w1 = innings1?.total_wickets || 0;
          const o1 = innings1?.total_overs || 0;
          const b1 = innings1?.total_balls || 0;

          const r2 = innings2?.total_runs || 0;
          const w2 = innings2?.total_wickets || 0;
          const o2 = innings2?.total_overs || 0;
          const b2 = innings2?.total_balls || 0;

          const status = m.match_status === 'completed' ? 'Completed' : m.match_status === 'upcoming' ? 'Upcoming' : 'Live';

          parsedMatches.push({
            id: m.match_id,
            league: m.match_title || 'Local Cup',
            status,
            team1: { name: team1Short, fullName: team1Name, runs: r1, wickets: w1, overs: o1, balls: b1, logoColor: team1Color },
            team2: { name: team2Short, fullName: team2Name, runs: r2, wickets: w2, overs: o2, balls: b2, logoColor: team2Color },
            statusMessage: m.notes || (status === 'Completed' ? 'Match Finished' : m.elected_to ? `${team1Short} elected to ${m.elected_to}` : 'Live score tracking ready'),
            venue: m.venue || m.ground_name || 'Local Arena',
            oversLimit: m.overs_limit || 12,
            matchDate: m.match_date || 'TBD',
            winnerId: m.winner_team_id,
            dbMatchRaw: m
          });
        }

        const mappedPlayers: Player[] = playersRaw.map((p: any) => {
          const t = teams.find((team: any) => team.team_id === p.team_id);
          return {
            id: p.player_id,
            name: p.full_name,
            team: t?.short_name || 'IND',
            teamId: p.team_id,
            role: p.playing_role || 'All-Rounder',
            battingStyle: p.batting_style || 'Right-hand bat',
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
          };
        });

        setDbData({
          players: mappedPlayers,
          teams: teams,
          matches: parsedMatches,
          loading: false
        });
      } catch (err) {
        console.error('Error loading real-time landing page dataset:', err);
        setDbData({
          players: localPlayers,
          teams: [],
          matches: [],
          loading: false
        });
      }
    }

    fetchAllRealtimeData();
  }, [localPlayers]);

  if (dbData.loading) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center space-y-4" id="home-view-loading">
        <div className="relative flex justify-center items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <span className="absolute text-sm">🏏</span>
        </div>
        <p className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase animate-pulse">
          Synchronising Realtime Database...
        </p>
      </div>
    );
  }

  // Find priority match to showcase in Hero Section
  const liveMatchDb = dbData.matches.find(m => m.status === 'Live');
  const completedMatchDb = dbData.matches.find(m => m.status === 'Completed');
  const upcomingMatchDb = dbData.matches.find(m => m.status === 'Upcoming');

  let activeMatchToDisplay = null;
  let badgeText = 'No Play';
  let badgeColor = 'bg-slate-500/10 text-slate-500';

  if (liveMatchDb) {
    activeMatchToDisplay = liveMatchDb;
    badgeText = 'LIVE SCORECARE';
    badgeColor = 'bg-red-500/10 text-[#ff3b30]';
  } else if (completedMatchDb) {
    activeMatchToDisplay = completedMatchDb;
    badgeText = 'RECENT RESULT';
    badgeColor = 'bg-emerald-500/10 text-emerald-600';
  } else if (upcomingMatchDb) {
    activeMatchToDisplay = upcomingMatchDb;
    badgeText = 'UPCOMING';
    badgeColor = 'bg-blue-50/10 text-blue-500';
  }

  // Calculate unique grounds/venues used
  const uniqueGrounds = Array.from(new Set(dbData.matches.map(m => m.venue).filter(Boolean)));
  const upcomingMatchesList = dbData.matches.filter(m => m.status === 'Upcoming');

  return (
    <div className="space-y-6 animate-fade-in" id="home-view-root">
      
      {/* 🚀 SEGMENT 1: HERO SECTION */}
      <HeroSection 
        onSelectView={onSelectView} 
        activeMatch={activeMatchToDisplay}
        badgeText={badgeText}
        badgeColor={badgeColor}
      />

      {/* 🌟 SEGMENT 2: FEATURES HIGHLIGHTS FLOAT BAR */}
      <FeaturesRow />

      {/* 🌫️ LIGHT DUAL-TONE CONTENT WRAPPER */}
      <div className="bg-[#f8fafc] text-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8" id="home-view-light-container">
        
        {/* 📊 SEGMENT 3: FOUR-COLUMN BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Column A: Live Match Dashboard */}
          <LiveMatchesBento 
            onSelectView={onSelectView} 
            activeMatch={activeMatchToDisplay} 
          />

          {/* Column B: Promotional Cups and Tournament stats */}
          <UpcomingTournamentsBento 
            onSelectView={onSelectView}
            teamsCount={dbData.teams.length}
            matchesCount={dbData.matches.length}
            groundsCount={uniqueGrounds.length}
          />

          {/* Column C: Highest Score / Top Performers leaders listing */}
          <TopPlayersBento 
            onSelectView={onSelectView} 
            players={dbData.players}
          />

          {/* Column D: Mini Standings board */}
          <PointsTableBento 
            onSelectView={onSelectView} 
            teams={dbData.teams}
            matches={dbData.matches}
          />
        </div>

        {/* 📅 SEGMENT 4: UPCOMING SCHEDULE CAROUSEL SLIDER */}
        <UpcomingSlider 
          onSelectView={onSelectView} 
          upcomingMatches={upcomingMatchesList}
        />

      </div>

    </div>
  );
}
