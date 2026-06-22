import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Award, Calendar, RefreshCw, Trophy, Tv, Users, Home, Shield, User, LogIn, Search, Star, MessageSquare, Menu, X, KeyRound } from 'lucide-react';
import { Match } from '../types';

interface NavbarProps {
  currentView: 'home' | 'matches' | 'fixtures' | 'teams' | 'tournaments' | 'stats' | 'dashboard' | 'auth';
  setCurrentView: (view: 'home' | 'matches' | 'fixtures' | 'teams' | 'tournaments' | 'stats' | 'dashboard' | 'auth') => void;
  liveMatch: Match;
  onReset: () => void;
  username: string | null;
  onLogout: () => void;
}

export default function Navbar({ currentView, setCurrentView, liveMatch, onReset, username, onLogout }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Lock background body scroll when drawer is active
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  const handleNavClick = (view: 'home' | 'matches' | 'fixtures' | 'teams' | 'tournaments' | 'stats' | 'dashboard' | 'auth') => {
    setCurrentView(view);
    setIsMobileDrawerOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm text-slate-900" id="app-navbar-header">
      {/* Ticker bar for active scores / upcoming news */}
      <div className="flex h-9 w-full overflow-hidden bg-blue-50 text-xs border-b border-blue-100 text-[#1d4ed8] font-medium">
        <div className="flex items-center px-4 bg-blue-600 text-white shrink-0 font-display uppercase tracking-widest text-[10px] font-black gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          LIVE SCORES
        </div>
        <div className="flex items-center grow px-4 overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-slate-700">
            <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider">
              <span>🏟️</span>
              <span className="text-blue-700 font-extrabold">{liveMatch.title}:</span>
              <span className="font-extrabold">{liveMatch.team1.shortName} {liveMatch.team1.score.runs}/{liveMatch.team1.score.wickets} ({liveMatch.team1.score.overs}.{liveMatch.team1.score.balls} Ov)</span>
              <span className="text-blue-600 font-black">vs</span>
              <span>{liveMatch.team2.shortName} (Yet to Bat)</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-blue-700 font-extrabold uppercase tracking-wider">📍 ground: {liveMatch.venue}</span>
            <span className="text-slate-300">|</span>
            <span className="text-amber-700 font-extrabold uppercase tracking-wider">🔥 TOP BATSMAN: {liveMatch.miniScore.batsman1.name} {liveMatch.miniScore.batsman1.runs}* ({liveMatch.miniScore.batsman1.balls}b)</span>
          </div>
        </div>
        {username ? (
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-1.5 px-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-l border-slate-200 transition-colors text-[10px] uppercase font-black tracking-widest cursor-pointer font-sans"
            title={`Check dashboard as ${username}`}
            id="btn-navbar-account"
          >
            <User className="h-3 w-3 text-emerald-700 animate-pulse" />
            <span className="hidden sm:inline">User Profile:</span>
            <span className="font-extrabold max-w-[100px] truncate">{username}</span>
          </button>
        ) : (
          <button
            onClick={() => handleNavClick('auth')}
            className="flex items-center gap-1.5 px-4 bg-[#ccff00]/10 hover:bg-[#ccff00]/25 text-[#1d4ed8] border-l border-slate-200 transition-colors text-[10px] uppercase font-black tracking-widest cursor-pointer font-sans font-bold"
            title="Authenticate Profile / Register Player"
            id="btn-navbar-auth-entry"
          >
            <KeyRound className="h-3 w-3 text-blue-600" />
            <span>Login / Join Now</span>
          </button>
        )}
      </div>

      {/* Main navigation header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Mobile Hamburg Trigger on Left side, followed closely by the Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-600 mr-2 cursor-pointer"
              aria-label="Toggle navigation drawer menu"
              id="btn-navbar-mobile-hamburger"
            >
              {isMobileDrawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo & Slogan */}
            <div className="flex items-center gap-3 cursor-pointer select-none shrink-0" onClick={() => handleNavClick('home')}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-700 shadow-md shadow-blue-500/20">
                <span className="text-2xl font-black text-white font-display">🏏</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tighter text-slate-900 font-display leading-none">
                    APNA<span className="text-blue-600">CRICKET</span>
                  </span>
                </div>
                <p className="text-[9px] text-blue-700 uppercase font-black tracking-widest leading-none mt-1">
                  LIVE CRICKET. LOCAL HEROES.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links - Hidden on Mobile, styled beautifully in Light Blue/Slate */}
          <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('matches')}
              className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'matches'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Matches
            </button>

            <button
              onClick={() => handleNavClick('tournaments')}
              className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'tournaments'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Tournaments
            </button>

            <button
              onClick={() => handleNavClick('teams')}
              className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'teams'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Teams
            </button>

            <button
              onClick={() => handleNavClick('stats')}
              className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'stats'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Stats
            </button>

            <button
              onClick={() => handleNavClick('fixtures')}
              className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'fixtures'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              News
            </button>

            <button
              onClick={() => handleNavClick('home')}
              className="px-3 py-2 text-xs font-black text-slate-600 hover:text-blue-600 uppercase tracking-wider cursor-pointer"
            >
              About Us
            </button>
          </nav>

          {/* Right Actions Container: Search bar on desktop or simple status / triggers on mobile */}
          <div className="flex items-center gap-3 font-sans">
            {/* Round Pill Search bar */}
            <div className="relative hidden lg:block w-40 xl:w-56">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-xs text-slate-800 placeholder-slate-400 rounded-full pl-3.5 pr-8 py-2 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Desktop and mobile right action CTA button logic */}
            {username ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors animate-fade-in"
                >
                  <User className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-2 text-[10px] font-bold text-slate-500 hover:text-red-500 uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('auth')}
                  className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs text-blue-600 border border-blue-200 hover:bg-blue-50 font-black uppercase rounded-lg tracking-wider transition-colors cursor-pointer"
                  id="navbar-btn-login-trigger"
                >
                  LOGIN
                </button>
                <button
                  onClick={() => handleNavClick('auth')}
                  className="hidden sm:block px-4 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 font-black uppercase rounded-lg tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  REGISTER
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Sliding Mobile Drawer Container overlay portal */}
      {isMobileDrawerOpen && createPortal(
        <>
          {/* Backdrop blur */}
          <div 
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity" 
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          
          {/* Menu Drawer - Modern White Board with Royal Blue Links */}
          <div className="fixed inset-y-0 left-0 z-[101] w-72 max-w-[85vw] bg-white border-r border-slate-200 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto md:hidden transition-transform duration-350 ease-out transform translate-x-0 text-left">
            <div className="space-y-6">
              {/* Header drawer controls */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black">🏏</span>
                  <span className="text-xs font-black text-slate-950 uppercase tracking-widest leading-none mt-1">
                    APNA<span className="text-blue-600">CRICKET</span>
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Search placeholder */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search local game..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 text-xs text-slate-800 placeholder-slate-400 rounded-xl pl-3 pr-8 py-2.5 border border-slate-200 focus:outline-none focus:border-blue-400"
                />
                <Search className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400" />
              </div>

              {/* Navigation Segment buttons list */}
              <nav className="flex flex-col gap-1 pt-2">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${
                    currentView === 'home'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => handleNavClick('matches')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${
                    currentView === 'matches'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Tv className="h-4 w-4" />
                  <span>Matches</span>
                </button>

                <button
                  onClick={() => handleNavClick('tournaments')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${
                    currentView === 'tournaments'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  <span>Tournaments</span>
                </button>

                <button
                  onClick={() => handleNavClick('teams')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${
                    currentView === 'teams'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Teams</span>
                </button>

                <button
                  onClick={() => handleNavClick('stats')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${
                    currentView === 'stats'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>Stats</span>
                </button>

                <button
                  onClick={() => handleNavClick('fixtures')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${
                    currentView === 'fixtures'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>News & Fixtures</span>
                </button>

                <button
                  onClick={() => handleNavClick('home')}
                  className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Shield className="h-4 w-4" />
                  <span>About Us</span>
                </button>
              </nav>
            </div>

            {/* Mobile Footer drawer auth controls block */}
            <div className="border-t border-slate-100 pt-4 mt-6 space-y-3">
              {username ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>Logged as <span className="text-slate-900 font-bold">{username}</span></span>
                  </div>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider"
                  >
                    Dashboard View
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full bg-red-100 hover:bg-red-200 text-red-600 border border-red-100 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    Logout Account
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('auth')}
                    className="w-full py-2.5 text-xs text-blue-600 border border-blue-200 hover:bg-blue-50 font-black uppercase rounded-xl tracking-wider text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavClick('auth')}
                    className="w-full py-2.5 text-xs text-white bg-blue-600 hover:bg-blue-700 font-black uppercase rounded-xl tracking-wider text-center"
                  >
                    Register
                  </button>
                </div>
              )}

              <p className="text-[9.5px] text-slate-400 text-center font-mono">
                APNA CRICKET © v1.0.1
              </p>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}
