import React from 'react';
import { Users, Trophy, Search, ChevronRight, MapPin, Play } from 'lucide-react';
import { LANDING_CONFIG } from '../../config/landingConfig';

interface HeroSectionProps {
  onSelectView: (view: any) => void;
  activeMatch?: any;
  badgeText?: string;
  badgeColor?: string;
}

export default function HeroSection({ onSelectView, activeMatch, badgeText = 'No Active Play', badgeColor = 'bg-slate-500/20 text-slate-400' }: HeroSectionProps) {
  const { hero } = LANDING_CONFIG;

  return (
    <div 
      className="relative overflow-hidden rounded-3xl border border-blue-100 p-6 md:p-10 shadow-lg bg-cover bg-center min-h-[500px]"
      style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(29, 78, 216, 0.85) 100%), url(${hero.backgroundUrl})` }}
      id="landing-hero-container"
    >
      {/* Floodlights focus effect overlay */}
      <div className="absolute top-0 right-0 h-[450px] w-[450px] bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 h-full">
        
        {/* Left Column: Heading, description & CTAs */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-[13px] font-black uppercase tracking-widest text-[#93c5fd]">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span>🚨 INDIA'S LOCAL DERBY SEASON LIVE</span>
          </div>
          
          <h1 className="font-display font-black text-white leading-[1.05] uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
            {hero.headingLine1} <br />
            <span className="text-blue-400">{hero.headingRed}</span> <br />
            {hero.headingLine2}
          </h1>
          
          <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
            Direct live scoring, custom local league standings, bowler analysis, and neighborhood team building tools. Real-time entries managed on Supabase.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onSelectView('teams')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs px-6 py-4 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border border-blue-500"
              id="hero-btn-c-team"
            >
              <Users className="h-4.5 w-4.5 text-white" />
              <span>{hero.btnTeamText}</span>
            </button>
            <button
              onClick={() => onSelectView('tournaments')}
              className="bg-white/10 backdrop-blur hover:bg-white/20 text-white font-black uppercase tracking-widest text-xs px-6 py-4 rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              id="hero-btn-e-tournaments"
            >
              <Trophy className="h-4.5 w-4.5 text-amber-400" />
              <span>{hero.btnTournamentText}</span>
            </button>
          </div>
        </div>
        
        {/* Right Column: Perfect mockup Live Ticker/Scorecard card - Crisp Pure White Theme */}
        <div className="lg:col-span-6">
          {activeMatch ? (
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden p-5 space-y-4 shadow-xl relative text-slate-800">
              
              {/* Ticker header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full bg-red-600 ${activeMatch.status === 'Live' ? 'animate-pulse' : ''}`} />
                  <span className={`text-[11px] font-black uppercase tracking-widest font-mono text-red-600`}>{badgeText}</span>
                  <span className="text-slate-200">|</span>
                  <span className="text-[11px] text-slate-500 font-bold font-mono">{activeMatch.league}</span>
                </div>
                <Search className="h-4 w-4 text-slate-400 cursor-pointer hover:text-blue-600" />
              </div>

              {/* Scores with custom beautiful graphic layout */}
              <div className="space-y-3.5">
                {/* Team 1: Home Team / First Inning */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow font-black text-lg select-none">
                      🦁
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black text-slate-900 uppercase tracking-wider block">{activeMatch.team1.fullName}</span>
                      <span className="text-[9px] text-amber-600 font-mono tracking-widest uppercase font-black">Main Squad</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xl font-black text-slate-900">
                      {activeMatch.team1.runs}/{activeMatch.team1.wickets}
                    </span>
                    <span className="block font-mono text-[10px] text-slate-500">
                      ({activeMatch.team1.overs}.{activeMatch.team1.balls || 0} Overs)
                    </span>
                  </div>
                </div>

                {/* Team 2: Challenger / Second Inning */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow font-black text-white text-lg select-none">
                      🌀
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black text-[#64748b] uppercase tracking-wider block">{activeMatch.team2.fullName}</span>
                      <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Opposition Squad</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {activeMatch.status === 'Upcoming' ? (
                      <span className="font-mono text-sm font-bold text-slate-400 italic">
                        Yet to Bat
                      </span>
                    ) : (
                      <>
                        <span className="font-mono text-xl font-black text-slate-900">
                          {activeMatch.team2.runs}/{activeMatch.team2.wickets}
                        </span>
                        <span className="block font-mono text-[10px] text-slate-500">
                          ({activeMatch.team2.overs}.{activeMatch.team2.balls || 0} Overs)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Crucial live narrative marquee alerts banner */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
                  ⚡ {activeMatch.statusMessage}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono flex items-center justify-center gap-1.5">
                  <MapPin className="h-3 w-3 text-red-500" />
                  <span>Venue: {activeMatch.venue}</span>
                </p>
              </div>

              {/* Performance status widgets (Overs limit, Date, Target) */}
              <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 font-mono text-center text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">OVERS LIMIT</span>
                  <span className="font-black text-slate-900 text-sm">{activeMatch.oversLimit} Overs</span>
                </div>
                <div className="border-x border-slate-100">
                  <span className="block text-[10px] text-slate-400 uppercase">MATCH DATE</span>
                  <span className="font-black text-blue-600 text-sm truncate block px-1">{activeMatch.matchDate}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">STATUS</span>
                  <span className="font-black text-slate-900 text-xs uppercase px-1 py-0.5 rounded bg-slate-100 inline-block mt-0.5">{activeMatch.status}</span>
                </div>
              </div>

              {/* Link wrapper to jump to full scorecard */}
              <div 
                onClick={() => onSelectView('LiveMatches')}
                className="pt-2 border-t border-slate-100 text-center mt-2 cursor-pointer"
              >
                <button className="text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-750 inline-flex items-center gap-1 cursor-pointer">
                  <span>GO TO CRICKET LIVE DASHBOARD</span>
                  <span className="tracking-tight text-blue-400">⚡</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ) : (
            // Empty State Card when there are no matches in Supabase
            <div className="bg-white border border-slate-200/50 rounded-2xl p-8 space-y-6 shadow-xl relative text-slate-800 text-center flex flex-col items-center justify-center min-h-[360px]">
              <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl animate-bounce">
                🏏
              </div>
              
              <div className="space-y-2">
                <h4 className="text-md font-black uppercase tracking-wider text-slate-900">
                  Ready for Real-time Cricket Scoring
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  No active matches have been added or scheduled in the Supabase database yet. Create teams and plan live games now!
                </p>
              </div>

              <button
                onClick={() => onSelectView('LiveMatches')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] px-5 py-3.5 rounded-xl transition-all hover:shadow cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 text-white" />
                <span>Create & Score Live Matches</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
