import React from 'react';
import { Match, Fixture, Player } from '../types';

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
  onSelectView: (view: 'home' | 'matches' | 'fixtures' | 'teams' | 'tournaments' | 'stats' | 'dashboard' | 'auth') => void;
  onSelectFixtureToSimulate: (fixture: Fixture) => void;
}

export default function HomeView({
  liveMatch,
  fixtures,
  players,
  onSelectView,
  onSelectFixtureToSimulate
}: HomeViewProps) {

  return (
    <div className="space-y-6" id="home-view-root">
      
      {/* 🚀 SEGMENT 1: HERO SECTION */}
      <HeroSection onSelectView={onSelectView} />

      {/* 🌟 SEGMENT 2: FEATURES HIGHLIGHTS FLOAT BAR */}
      <FeaturesRow />

      {/* 🌫️ LIGHT DUAL-TONE CONTENT WRAPPER */}
      <div className="bg-[#f8fafc] text-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8" id="home-view-light-container">
        
        {/* 📊 SEGMENT 3: FOUR-COLUMN BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Column A: Live Matches dashboard */}
          <LiveMatchesBento onSelectView={onSelectView} />

          {/* Column B: Promotional Cups and Tournaments */}
          <UpcomingTournamentsBento onSelectView={onSelectView} />

          {/* Column C: Highest Score / Top Performers leaders listing */}
          <TopPlayersBento onSelectView={onSelectView} />

          {/* Column D: Mini standouts SPL leader standings league table */}
          <PointsTableBento onSelectView={onSelectView} />
        </div>

        {/* 📅 SEGMENT 4: UPCOMING SCHEDULE CAROUSEL SLIDER */}
        <UpcomingSlider onSelectView={onSelectView} />

      </div>

    </div>
  );
}
