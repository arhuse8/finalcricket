import React, { useState } from 'react';
import { Fixture } from '../types';
import { Calendar, Search, MapPin, Award, PlayCircle, Trophy, Compass, BookOpen, Clock, FileText, ArrowRight, X } from 'lucide-react';

interface FixturesListProps {
  fixtures: Fixture[];
  onSelectFixtureToSimulate: (fixture: Fixture) => void;
  activeMatchTitle: string;
}

// Hand-crafted village cricket news articles to provide high-fidelity content
const VILLAGE_NEWS = [
  {
    id: 'n1',
    title: "Rampur Clinch Heart-Stopping Derby in 12th-over Thriller!",
    summary: "Raju 'Sixer' Yadav hammered consecutive maximums into the local orchard to seal a tense qualifying chase against Malgudi.",
    content: "Rampur school ground lay witness to absolute bedlam as the opening derby of the Apna Village Cup concluded under amber skies. Chasing a formidable target of 118 set by Malgudi Stars, the Rampur Warriors found themselves sliding at 86/4 in the 10th over. Under extreme dot-ball tension, Raju 'Sixer' Yadav struck twenty-four runs in the final over—punishing loose deliveries and sending the final ball deep into the neighboring mango orchard to trigger explosive crowd invasions! Local pundits have declared this the legendary derby of the decade.",
    date: "Jun 19, 2026",
    author: "Bablu (VPL Correspondent)",
    category: "Match Report",
    readTime: "3 min read",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-100",
    imageEmoji: "🏏"
  },
  {
    id: 'n2',
    title: "Panchayat Council Unveils Brand-New Grass Pitch Roller",
    summary: "A cooperative community funding pool helps upgrade local grounds with premium grass flattening and pitch layout equipment.",
    content: "The local Panchayat Ground is set for an elite face-lift! To eradicate erratic ball bounces and provide a modern batsman paradise, the Village Council successfully pooled resources to construct a new clay wicket and source a heavy-duty community grass roller. Grassroot pitches like the School Ground and Meadows Arena will be rolling according to strict pre-match calendar regimes, which will highly enhance delivery paces and encourage athletic boundaries.",
    date: "Jun 18, 2026",
    author: "Panchayat Secretary",
    category: "Community News",
    readTime: "2 min read",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-100",
    imageEmoji: "🚜"
  },
  {
    id: 'n3',
    title: "VPL 2026 Cash Pool Boosted by Sweet-Shop Sponsor",
    summary: "Local businesses rally behind Apna Cricket squads with premium English willow bat awards and delicious treated caterings.",
    content: "Apna Village Committee officially announced a grand incentive update for the VPL summer finals. In a heartwarming show of support, the Rampur Sweet-Shop Union has pledged high-value gift hampers, and local sponsors have added raw english-willow bats for season leaders. This is expected to push the derby rivalry to unprecedented heights!",
    date: "Jun 17, 2026",
    author: "VPL Committee",
    category: "League Updates",
    readTime: "2 min read",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-100",
    imageEmoji: "🏆"
  },
  {
    id: 'n4',
    title: "How Gully Raiders Reclaimed Their Signature Tape-ball Swing",
    summary: "Bowler Irfan Jr explains the art of double-layer electrical tape application to achieve swing sweeps.",
    content: "Gully Raiders bowlers have long held a legendary reputation for late swing bowling. This week, we sat down with Irfan Junior as he demonstrated the exact mechanics of taping a high-grade tennis ball. By applying exactly two layers of heavy-tension electrical tape on one half of the ball, bowlers utilize the aerodynamic differences to produce sharp inward movement even under scorching village noon winds.",
    date: "Jun 16, 2026",
    author: "Wicket Analysis Desk",
    category: "Tips & Style",
    readTime: "4 min read",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-100",
    imageEmoji: "💡"
  }
];

export default function FixturesList({ fixtures, onSelectFixtureToSimulate, activeMatchTitle }: FixturesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'fixtures'>('news');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  // Filtering fixtures
  const filteredFixtures = fixtures.filter(fix => {
    const term = searchTerm.toLowerCase();
    return (
      fix.team1Name.toLowerCase().includes(term) ||
      fix.team2Name.toLowerCase().includes(term) ||
      fix.venue.toLowerCase().includes(term) ||
      fix.tournamentName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 text-slate-800" id="fixtures-view-root">
      
      {/* 📅 Active Tournament Header banner formatted in high-fidelity light theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-6 md:p-8 text-white text-left shadow-sm">
        <div className="absolute right-0 bottom-0 h-48 w-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative space-y-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white shadow-inner">
            <Trophy className="h-6 w-6 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 border border-white/10 uppercase tracking-widest rounded-lg">
              Official Tournament League Area
            </span>
            <h2 className="font-display text-3xl font-black text-white uppercase mt-2.5 tracking-tight">Apna Village Khalsa Cup • 2026</h2>
            <p className="text-xs text-blue-100 max-w-xl leading-relaxed mt-2.5 font-medium">
              8 local neighborhood hamlets competing in standard 12-overs high-speed sports tape-ball cricket. Top 4 squads qualify for the Grand Meadows Finals!
            </p>
          </div>
        </div>
      </div>

      {/* DUAL-TAB CONTROL BAR */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-left gap-4 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
              activeTab === 'news'
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
            }`}
          >
            📰 Latest Cricket News
          </button>
          
          <button
            onClick={() => setActiveTab('fixtures')}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
              activeTab === 'fixtures'
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
            }`}
          >
            📅 Fixtures Calendar ({fixtures.length})
          </button>
        </div>

        {activeTab === 'fixtures' && (
          /* Search Input bar */
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search teams or arenas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-250 text-slate-805 placeholder-slate-400 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium"
              id="fixtures-search-input"
            />
          </div>
        )}
      </div>

      {/* RENDER TAB CONTROLS */}
      {activeTab === 'news' ? (
        /* NEWS CATEGORIES LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left" id="news-section-panel">
          {VILLAGE_NEWS.map(news => (
            <div
              key={news.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-left"
            >
              <div className="space-y-3">
                {/* Meta details header */}
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className={`px-2.5 py-1 uppercase rounded-md border tracking-wider font-sans font-black ${news.badgeColor}`}>
                    {news.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-405 font-medium">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{news.readTime}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 bg-blue-50/50 rounded-lg border border-slate-150 flex items-center justify-center text-xl shadow-inner">
                    {news.imageEmoji}
                  </div>
                  <div>
                    <h3 className="font-display font-black text-slate-900 text-sm hover:text-blue-600 transition-colors uppercase tracking-tight leading-snug">
                      {news.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-450 uppercase mt-1 tracking-wider">
                      BY {news.author} • {news.date}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-semibold leading-relaxed pt-1">
                  {news.summary}
                </p>
              </div>

              <button
                onClick={() => setSelectedArticle(news)}
                className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-blue-600 hover:text-blue-750 self-start transition-colors pt-2 cursor-pointer"
              >
                <span>Read Full Match Report</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* FIXTURES SECTION PANEL */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left" id="fixtures-section-panel">
          {filteredFixtures.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-250 text-slate-450">
              <p className="text-xs font-bold uppercase tracking-wider">No scheduled match models match your search query</p>
            </div>
          ) : (
            filteredFixtures.map(fix => {
              const isCurrentlySimulated = activeMatchTitle.includes(fix.team1Short) && activeMatchTitle.includes(fix.team2Short);
              
              return (
                <div
                  key={fix.id}
                  className={`group rounded-2xl border bg-white p-5 transition-all hover:shadow-md relative overflow-hidden flex flex-col justify-between text-left ${
                    isCurrentlySimulated ? 'border-blue-600 shadow-md shadow-blue-500/5' : 'border-slate-200'
                  }`}
                  id={`fixture-card-${fix.id}`}
                >
                  <div className="space-y-4">
                    {/* Tournament Cup name badge */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100 pb-2.5">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Award className="h-4 w-4 text-blue-600 shrink-0" />
                        {fix.tournamentName}
                      </span>
                      <span className="text-slate-500 font-mono text-[9px] font-black">{fix.time}</span>
                    </div>

                    {/* Matchup row */}
                    <div className="flex items-center justify-between gap-3 font-sans">
                      {/* Team 1 */}
                      <div className="flex items-center gap-2.5 flex-1 select-none overflow-hidden text-left">
                        <div className={`h-8 w-8 shrink-0 rounded bg-gradient-to-tr ${fix.team1Color} flex items-center justify-center font-display font-black text-xs text-white shadow-sm`}>
                          {fix.team1Short}
                        </div>
                        <span className="font-black text-slate-900 text-xs uppercase tracking-wider truncate">
                          {fix.team1Name}
                        </span>
                      </div>

                      {/* VS divider */}
                      <div className="shrink-0 flex items-center justify-center text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded select-none font-display uppercase tracking-widest leading-none">
                        VS
                      </div>

                      {/* Team 2 */}
                      <div className="flex items-center gap-2.5 flex-1 justify-end select-none overflow-hidden text-right">
                        <span className="font-black text-slate-900 text-xs uppercase tracking-wider truncate">
                          {fix.team2Name}
                        </span>
                        <div className={`h-8 w-8 shrink-0 rounded bg-gradient-to-tr ${fix.team2Color} flex items-center justify-center font-display font-black text-xs text-white shadow-sm`}>
                          {fix.team2Short}
                        </div>
                      </div>
                    </div>

                    {/* Ground metadata */}
                    <div className="space-y-1.5 pt-3.5 border-t border-slate-100 text-[11px] text-slate-600 font-semibold uppercase tracking-wide">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="truncate">{fix.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{fix.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated action trigger */}
                  <div className="mt-5 pt-3.5 border-t border-slate-150 flex items-center justify-between gap-4">
                    {isCurrentlySimulated ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-white bg-blue-600 px-3 py-1.5 rounded-lg border border-blue-600 shadow-sm animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-red-400"></span>
                        Currently Live
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectFixtureToSimulate(fix)}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-750 uppercase tracking-wider transition-colors cursor-pointer"
                        id={`btn-simulate-fix-${fix.id}`}
                      >
                        <PlayCircle className="h-4.5 w-4.5 text-blue-650" />
                        <span>Simulate Live Score</span>
                      </button>
                    )}

                    <div className="text-[9px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono font-black uppercase tracking-wider rounded-md">
                      12 OVERS
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pitch Guide details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 mt-6 text-left">
        <h4 className="font-display font-black text-slate-900 mb-3.5 uppercase tracking-wider text-xs flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Compass className="h-4.5 w-4.5 text-blue-600" />
          <span>Village Arena Ground Pitch Reports</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
            <span className="font-black text-slate-950 uppercase tracking-widest text-[10px] block text-blue-700">Rampur High School Ground</span>
            <p className="text-slate-600 mt-2 pb-0.5 leading-relaxed font-semibold">Flat and dusty clay turf. Massive legside boundaries. Heavy wild grass slows down infield sweeps.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
            <span className="font-black text-slate-950 uppercase tracking-widest text-[10px] block text-blue-700">Lake View Ground Arena</span>
            <p className="text-slate-600 mt-2 pb-0.5 leading-relaxed font-semibold">Wet lake breezes trigger steep swing-sweeps for pace pacers. Sticky mud wickets assist raw spinners.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
            <span className="font-black text-slate-950 uppercase tracking-widest text-[10px] block text-blue-700">Panchayat Meadows Flat Turf</span>
            <p className="text-slate-600 mt-2 pb-0.5 leading-relaxed font-semibold">Tarmac-like center mat offers rapid pitch bounce. A certified batsman paradise under golden sunsets.</p>
          </div>
        </div>
      </div>

      {/* DECENT ARTICLE MODAL VIEW DRAWER */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-250 w-full max-w-xl rounded-3xl p-6 relative shadow-2xl text-left animate-scale-up space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-105 hover:text-slate-900 text-slate-400 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <span className={`px-2 py-0.5 text-[9px] uppercase font-black tracking-widest rounded-md border ${selectedArticle.badgeColor}`}>
              {selectedArticle.category}
            </span>

            <div className="space-y-1">
              <h2 className="font-display font-black text-slate-950 text-xl uppercase tracking-tight leading-snug">
                {selectedArticle.title}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Contributed by {selectedArticle.author} • {selectedArticle.date}
              </p>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-semibold border-l-4 border-blue-500 pl-3">
              {selectedArticle.summary}
            </p>

            <div className="text-xs text-slate-650 leading-relaxed space-y-3 font-semibold pt-2">
              <p>{selectedArticle.content}</p>
              <p>Village teams have received matching guidelines to prepare for subsequent fixtures, setting up high-octane fixtures. Spectators are encouraged to arrive early for premium spots on the grass sidelines!</p>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
