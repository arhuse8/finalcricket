import React from 'react';
import { Youtube, Twitter, Facebook, Instagram } from 'lucide-react';
import { LANDING_CONFIG } from '../../config/landingConfig';

export default function Footer() {
  const { footer, branding } = LANDING_CONFIG;

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-100 py-10 text-slate-500 text-xs" id="custom-app-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Columns Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Logo, Slogan, description */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-xl font-bold font-display text-white select-none">
                🏏
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 font-display">
                  APNA<span className="text-blue-600">CRICKET</span>
                </span>
                <p className="text-[9px] text-blue-700 uppercase font-black tracking-widest leading-none mt-0.5">
                  LIVE CRICKET. LOCAL HEROES.
                </p>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-md">
              {branding.description} All live scores are updated dynamically by stadium officials.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="text-left font-sans">
            <h5 className="font-display font-black uppercase text-xs text-slate-900 tracking-widest mb-4">
              QUICK LINKS
            </h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              {footer.quickLinks.map((link) => (
                <li key={link.name}>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Information */}
          <div className="text-left font-sans">
            <h5 className="font-display font-black uppercase text-xs text-slate-900 tracking-widest mb-4">
              INFORMATION
            </h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              {footer.information.map((link) => (
                <li key={link.name}>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="text-left font-sans">
            <h5 className="font-display font-black uppercase text-xs text-slate-900 tracking-widest mb-4">
              SUPPORT
            </h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              {footer.support.map((link) => (
                <li key={link.name}>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Social Links + App Downloads row container */}
        <div className="border-t border-slate-250 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Social Icons row */}
          <div className="flex items-center gap-4">
            <span className="font-display font-black text-xs text-slate-900 tracking-widest uppercase block mr-2">
              FOLLOW US:
            </span>
            <a 
              href={footer.socials.facebook} 
              className="h-9 w-9 bg-slate-200/50 hover:bg-blue-600 hover:text-white text-slate-700 rounded-full flex items-center justify-center transition-colors border border-slate-200"
              aria-label="Facebook Profile link"
            >
              <Facebook className="h-4.5 w-4.5" />
            </a>
            <a 
              href={footer.socials.instagram} 
              className="h-9 w-9 bg-slate-200/50 hover:bg-blue-600 hover:text-white text-slate-700 rounded-full flex items-center justify-center transition-colors border border-slate-200"
              aria-label="Instagram Profile link"
            >
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a 
              href={footer.socials.youtube} 
              className="h-9 w-9 bg-slate-200/50 hover:bg-blue-600 hover:text-white text-slate-700 rounded-full flex items-center justify-center transition-colors border border-slate-200"
              aria-label="YouTube Channel link"
            >
              <Youtube className="h-4.5 w-4.5" />
            </a>
            <a 
              href={footer.socials.twitter} 
              className="h-9 w-9 bg-slate-200/50 hover:bg-blue-600 hover:text-white text-slate-700 rounded-full flex items-center justify-center transition-colors border border-slate-200"
              aria-label="Twitter handler link"
            >
              <Twitter className="h-4.5 w-4.5" />
            </a>
          </div>

          {/* App download graphics buttons */}
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-xs text-slate-900 tracking-widest uppercase block mr-1 leading-none">
              DOWNLOAD APP:
            </span>
            {/* Google Play Badges styling */}
            <a 
              href={footer.appLinks.googlePlay} 
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
            {/* App Store Badge */}
            <a 
              href={footer.appLinks.appStore} 
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
          <p>© 2026 ApnaCricket. All rights reserved. Grassroots cricket at its absolute apex.</p>
        </div>

      </div>
    </footer>
  );
}
