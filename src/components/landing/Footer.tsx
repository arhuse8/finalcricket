import React, { useState } from 'react';
import { 
  Youtube, 
  Twitter, 
  Facebook, 
  Instagram, 
  HelpCircle, 
  X, 
  Phone, 
  Building, 
  ShieldCheck, 
  Trophy, 
  Layers, 
  DollarSign, 
  MessageSquare,
  Tv,
  BarChart2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LANDING_CONFIG } from '../../config/landingConfig';

// Import newly modular components
import AboutTab from './docs/AboutTab';
import HowItWorksTab from './docs/HowItWorksTab';
import PricingTab from './docs/PricingTab';
import FaqsTab from './docs/FaqsTab';
import ContactTab from './docs/ContactTab';
import HelpCenterTab from './docs/HelpCenterTab';
import TermsTab from './docs/TermsTab';
import PrivacyTab from './docs/PrivacyTab';
import RefundTab from './docs/RefundTab';

import LiveScoreTab from './docs/LiveScoreTab';
import TournamentTab from './docs/TournamentTab';
import StatsTab from './docs/StatsTab';
import FixtureTab from './docs/FixtureTab';

interface FooterProps {
  setCurrentView?: (view: 'home' | 'matches' | 'fixtures' | 'teams' | 'tournaments' | 'stats' | 'dashboard' | 'auth') => void;
}

export default function Footer({ setCurrentView }: FooterProps) {
  const { footer } = LANDING_CONFIG;

  // Active documentation tab modal controller
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Map footer interaction trigger
  const openModal = (tabName: string) => {
    setActiveTab(tabName);
    setMobileMenuOpen(false); // Close mobile drawer when selection changes
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto" id="main-landing-footer">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-12">
        
        {/* Upper Sitemaps / Info blocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Col 1: Platform Branding */}
          <div className="text-left font-sans space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold font-display text-white select-none shadow-sm">
                🏏
              </div>
              <div>
                <span className="text-md font-black tracking-tight text-slate-900 font-display block leading-none">
                  APNA<span className="text-blue-600">CRICKET</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase block mt-1">
                  GRASSROOTS LEAGUE
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              The premier grassroots cricket tournament live companion, and scorer calculator app. Supporting tape-ball, leather ball, tournament brackets, and village leagues, 100% free.
            </p>
          </div>

          {/* Col 2: Navigation views */}
          <div className="text-left font-sans space-y-6">
            <div>
              <h5 className="font-display font-black uppercase text-xs text-slate-900 tracking-widest mb-4">
                QUICK MODULES
              </h5>
              <ul className="space-y-2 text-slate-600 font-bold text-xs">
                {['home', 'tournaments', 'fixtures', 'teams', 'stats', 'dashboard'].map((view) => (
                  <li key={view}>
                    <button 
                      onClick={() => setCurrentView?.(view as any)} 
                      className="hover:text-blue-600 transition-colors uppercase tracking-wider text-[10px] font-black cursor-pointer text-left focus:outline-none"
                      id={`foot-lnk-${view}`}
                    >
                      {view} View
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-display font-black uppercase text-xs text-slate-950 tracking-widest mb-3">
                FEATURES PREVIEWS
              </h5>
              <ul className="space-y-2 text-slate-600 font-bold text-xs list-none p-0">
                <li>
                  <button 
                    onClick={() => openModal('live_score')}
                    className="hover:text-blue-600 transition-colors text-left focus:outline-none font-semibold cursor-pointer text-xs"
                    id="foot-feat-score"
                  >
                    ⚡ Live Scoring
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('tournament')}
                    className="hover:text-blue-600 transition-colors text-left focus:outline-none font-semibold cursor-pointer text-xs"
                    id="foot-feat-tourney"
                  >
                    🏆 Tournaments
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('stats')}
                    className="hover:text-blue-600 transition-colors text-left focus:outline-none font-semibold cursor-pointer text-xs"
                    id="foot-feat-stats"
                  >
                    📊 Player Stats
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('fixtures')}
                    className="hover:text-blue-600 transition-colors text-left focus:outline-none font-semibold cursor-pointer text-xs"
                    id="foot-feat-fixtures"
                  >
                    📅 Match Fixtures
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 3: Information */}
          <div className="text-left font-sans">
            <h5 className="font-display font-black uppercase text-xs text-slate-900 tracking-widest mb-4">
              INFORMATION
            </h5>
            <ul className="space-y-2 text-slate-600 font-bold text-xs">
              <li>
                <button 
                  onClick={() => openModal('about')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left focus:outline-none"
                  id="foot-info-about"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('how_it_works')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left focus:outline-none"
                  id="foot-info-how"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('pricing')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left focus:outline-none"
                  id="foot-info-pricing"
                >
                  Pricing & Sponsorship
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('faqs')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left focus:outline-none"
                  id="foot-info-faqs"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('contact')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left focus:outline-none relative"
                  id="foot-info-contact"
                >
                  Contact Us <span className="absolute -top-1 -right-4 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="text-left font-sans">
            <h5 className="font-display font-black uppercase text-xs text-slate-900 tracking-widest mb-4">
              SUPPORT
            </h5>
            <ul className="space-y-2 text-slate-600 font-bold text-xs">
              <li>
                <button 
                  onClick={() => openModal('help_center')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left focus:outline-none"
                  id="foot-support-help"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('terms')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left focus:outline-none"
                  id="foot-support-terms"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('privacy')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left focus:outline-none"
                  id="foot-support-privacy"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('refund')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left focus:outline-none"
                  id="foot-support-refund"
                >
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Social Links + App Downloads row container */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Social Icons row */}
          <div className="flex items-center gap-4">
            <span className="font-display font-black text-xs text-slate-900 tracking-widest uppercase block mr-2 font-sans">
              FOLLOW US:
            </span>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert("Follow ApnaCricket on Facebook for matches snippets, live reels and player profiles!") }}
              className="h-9 w-9 bg-slate-200/50 hover:bg-blue-600 hover:text-white text-slate-700 rounded-full flex items-center justify-center transition-colors border border-slate-250 cursor-pointer"
              aria-label="Facebook Profile link"
            >
              <Facebook className="h-4.5 w-4.5" />
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert("Our Instagram features 'Gully Ball of the Week' clips. Follow ApnaCricket feed!") }}
              className="h-9 w-9 bg-slate-200/50 hover:bg-blue-600 hover:text-white text-slate-700 rounded-full flex items-center justify-center transition-colors border border-slate-250 cursor-pointer"
              aria-label="Instagram Profile link"
            >
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert("YouTube channel hosts compilations, player score breakdown, and streaming advice. Subscribe soon!") }}
              className="h-9 w-9 bg-slate-200/50 hover:bg-blue-600 hover:text-white text-slate-700 rounded-full flex items-center justify-center transition-colors border border-slate-250 cursor-pointer"
              aria-label="YouTube Channel link"
            >
              <Youtube className="h-4.5 w-4.5" />
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert("Follow ApnaCricket on Twitter for fast ball-by-ball announcements!") }}
              className="h-9 w-9 bg-slate-200/50 hover:bg-blue-600 hover:text-white text-slate-700 rounded-full flex items-center justify-center transition-colors border border-slate-250 cursor-pointer"
              aria-label="Twitter handler link"
            >
              <Twitter className="h-4.5 w-4.5" />
            </a>
          </div>

          {/* App download graphics buttons */}
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-xs text-slate-900 tracking-widest uppercase block mr-1 leading-none font-sans">
              DOWNLOAD APP:
            </span>
            <a 
              href="https://play.google.com/store" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-90 transition-opacity select-none"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Get it on Google Play" 
                className="h-10 border border-slate-200 rounded-md"
                referrerPolicy="no-referrer"
              />
            </a>
            <a 
              href="https://www.apple.com/app-store" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-90 transition-opacity select-none"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                alt="Download on the App Store" 
                className="h-10 border border-slate-200 rounded-md"
                referrerPolicy="no-referrer"
              />
            </a>
          </div>

        </div>

        {/* Full Copyright Legal disclaimer */}
        <div className="text-center text-[11px] text-slate-500 pt-3 border-t border-slate-200 font-mono">
          <p>© 2026 ApnaCricket. Grassroots cricket at its absolute apex. Proudly founded by Avinash R Huse & Team.</p>
        </div>

      </div>

      {/* DYNAMIC INFORMATION & SUPPORT DOCUMENTATION MODAL HUB */}
      <AnimatePresence>
        {activeTab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="documentation-modal-overlay">
            {/* Dark glass backdrop with fade entrance */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setActiveTab(null);
                setMobileMenuOpen(false);
              }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
            />

            {/* Main Modal structure with scale and slide animation */}
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-6xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-100 z-10 text-slate-700"
            >
              
              {/* Sidebar Tabs Switcher */}
              <div className={`w-full md:w-64 bg-slate-50 border-r border-slate-150 p-6 flex flex-col justify-between shrink-0 text-left ${mobileMenuOpen ? 'flex font-sans' : 'hidden md:flex font-sans'}`}>
                <div className="space-y-6">
                  {/* Brand signature */}
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-base font-bold font-display text-white select-none">
                        🏏
                      </div>
                      <div>
                        <span className="text-normal font-black tracking-tight text-slate-950 font-display block leading-none">
                          APNA<span className="text-blue-600">CRICKET</span>
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono font-bold tracking-widest uppercase block mt-0.5">
                          CORPORATE DESK
                        </span>
                      </div>
                    </div>
                    {/* Close Mobile Menu Button */}
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="md:hidden h-8 w-8 text-slate-400 hover:text-slate-950 hover:bg-slate-200/60 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Close sections menu"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans mb-1.5 px-2">
                      Corporate Hub
                    </span>
                    <button
                      onClick={() => openModal('about')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'about' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <Building className="h-4 w-4" />
                      <span>About Us</span>
                    </button>

                    <button
                      onClick={() => openModal('how_it_works')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'how_it_works' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <Layers className="h-4 w-4" />
                      <span>How It Works</span>
                    </button>

                    <button
                      onClick={() => openModal('pricing')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'pricing' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <DollarSign className="h-4 w-4" />
                      <span>Pricing Tiers</span>
                    </button>

                    <button
                      onClick={() => openModal('faqs')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'faqs' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>FAQs</span>
                    </button>

                    <button
                      onClick={() => openModal('contact')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'contact' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <Phone className="h-4 w-4" />
                      <span>Contact Us</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans mb-1.5 px-2">
                      Capabilities Previews
                    </span>
                    <button
                      onClick={() => openModal('live_score')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'live_score' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <Tv className="h-4 w-4" />
                      <span>Live Scoring</span>
                    </button>

                    <button
                      onClick={() => openModal('tournament')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'tournament' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <Trophy className="h-4 w-4" />
                      <span>Tournaments Specs</span>
                    </button>

                    <button
                      onClick={() => openModal('stats')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'stats' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <BarChart2 className="h-4 w-4" />
                      <span>Player Statistics</span>
                    </button>

                    <button
                      onClick={() => openModal('fixtures')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'fixtures' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Match Fixtures</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans mb-1.5 px-2">
                      Legal & Support
                    </span>
                    <button
                      onClick={() => openModal('help_center')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'help_center' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Help Center</span>
                    </button>

                    <button
                      onClick={() => openModal('terms')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'terms' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Terms & Conditions</span>
                    </button>

                    <button
                      onClick={() => openModal('privacy')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'privacy' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Privacy Policy</span>
                    </button>

                    <button
                      onClick={() => openModal('refund')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        activeTab === 'refund' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <Trophy className="h-4 w-4" />
                      <span>Refund Policy</span>
                    </button>
                  </div>
                </div>

                {/* Footer block direct support */}
                <div className="border-t border-slate-200 pt-4 text-[10px] space-y-1 block">
                  <span className="text-slate-400 uppercase font-black tracking-wider block">SUPPORT HELPLINE:</span>
                  <a href="tel:9112768872" className="text-blue-600 font-extrabold block hover:underline">
                    +91 91127 68872
                  </a>
                  <span className="text-slate-400 block font-mono">Pune, MH, India</span>
                </div>
              </div>

              {/* Main Document Content Area */}
              <div className={`flex-1 flex flex-col bg-white overflow-hidden text-left ${mobileMenuOpen ? 'hidden md:flex' : 'flex'}`}>
                {/* Header Row */}
                <header className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-white">
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider font-display truncate">
                      {activeTab.replace('_', ' ').toUpperCase()} DOCUMENTS
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest mt-0.5 font-bold font-mono truncate">
                      Official verified by ApnaCricket Management
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Mobile Section Drawer Indicator */}
                    <button
                      onClick={() => setMobileMenuOpen(true)}
                      className="md:hidden flex h-9 px-3 gap-1 items-center justify-center bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-[10px] font-black uppercase transition-all select-none cursor-pointer duration-200"
                    >
                      <span>📂 Sections</span>
                    </button>
                    <button 
                      onClick={() => {
                        setActiveTab(null);
                        setMobileMenuOpen(false);
                      }}
                      className="h-9 w-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition-all cursor-pointer border border-slate-200"
                      title="Close modal Document hub"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </header>

                {/* Inner Content Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {/* TAB 1: About Us Section */}
                  {activeTab === 'about' && <AboutTab />}

                  {/* TAB 2: How It Works Section */}
                  {activeTab === 'how_it_works' && <HowItWorksTab />}

                  {/* TAB 3: Pricing Page & Custom Calculator */}
                  {activeTab === 'pricing' && <PricingTab />}

                  {/* TAB 4: FAQs Grid with filter search */}
                  {activeTab === 'faqs' && <FaqsTab />}

                  {/* TAB 5: Contact Us High Fidelity Form */}
                  {activeTab === 'contact' && <ContactTab />}

                  {/* TAB 6: Help Center Ticketing Panel */}
                  {activeTab === 'help_center' && <HelpCenterTab />}

                  {/* TAB 7: Terms & Conditions legal structure */}
                  {activeTab === 'terms' && <TermsTab />}

                  {/* TAB 8: Privacy Policy with Dynamic cache actions */}
                  {activeTab === 'privacy' && <PrivacyTab />}

                  {/* TAB 9: Refund policy lookup tool */}
                  {activeTab === 'refund' && <RefundTab />}

                  {/* TAB 10: Live scoring capabilities preview */}
                  {activeTab === 'live_score' && <LiveScoreTab />}

                  {/* TAB 11: Tournaments capabilities preview */}
                  {activeTab === 'tournament' && <TournamentTab />}

                  {/* TAB 12: Player stats capabilities preview */}
                  {activeTab === 'stats' && <StatsTab />}

                  {/* TAB 13: Calendar fixtures preview */}
                  {activeTab === 'fixtures' && <FixtureTab />}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
