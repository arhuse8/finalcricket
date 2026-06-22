import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function PricingTab() {
  const [pricingTeams, setPricingTeams] = useState<number>(12);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Pricing calculator formula
  const calculatedCost = Math.max(0, (pricingTeams - 4) * 80);
  const finalDiscountFactor = billingPeriod === 'yearly' ? 0.8 : 1.0;
  const baseRate = billingPeriod === 'yearly' ? 399 : 499;
  const finalCalculatedProPrice = Math.round((baseRate + calculatedCost) * finalDiscountFactor);

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] uppercase font-black tracking-widest inline-block border border-blue-100">
          Flexible Grassroots Tiers
        </span>
        <h4 className="text-sm font-black text-slate-950 uppercase">Simple, Fair, Local Pricing Plan</h4>
        <p className="text-xs text-slate-500">Run tournaments at any scale. Unlock live voice commentary, customized badges, and full stats export.</p>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Plan 1 */}
        <div className="border border-slate-150 p-5 rounded-2xl bg-white space-y-4 text-left">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">GULLY BASIC</span>
          <div className="space-y-1">
            <span className="text-xl font-mono font-black text-slate-900">₹0</span>
            <span className="text-slate-400 text-[11px] block">For small friendly village sets</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-1.5 font-bold"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Up to 4 custom teams</li>
            <li className="flex items-center gap-1.5 font-bold"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Basic point tables</li>
            <li className="flex items-center gap-1.5 font-bold"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Standard Match Scorecard</li>
          </ul>
        </div>

        {/* Plan 2 */}
        <div className="border-2 border-blue-500 p-5 rounded-2xl bg-slate-50 relative space-y-4 text-left">
          <span className="absolute -top-3 right-4 bg-blue-600 text-white font-mono font-bold text-[8px] uppercase px-2.5 py-1 rounded-full shadow">BEST VALUE</span>
          <span className="text-[9px] font-black uppercase tracking-wider text-blue-600">PANCHAYAT PRO</span>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-black text-slate-950">₹{finalCalculatedProPrice}</span>
              <span className="text-slate-500 text-[10px] font-bold">/Month</span>
            </div>
            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-wider block">Currently Billed: {billingPeriod.toUpperCase()}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-1.5 font-bold"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Unlimited tournament registry</li>
            <li className="flex items-center gap-1.5 font-bold"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> AI voice insights reporting</li>
            <li className="flex items-center gap-1.5 font-bold"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Track unlimited players</li>
            <li className="flex items-center gap-1.5 font-bold"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Premium sponsor banners info</li>
          </ul>
        </div>

        {/* Plan 3 */}
        <div className="border border-slate-150 p-5 rounded-2xl bg-white space-y-4 text-left">
          <span className="text-[9px] font-black uppercase tracking-wider text-purple-600">PREMIER LEAGUE</span>
          <div className="space-y-1">
            <span className="text-xl font-mono font-black text-slate-900">₹1,999</span>
            <span className="text-slate-400 text-[11px] block">For mega regional festivals & cups</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-1.5 font-bold"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Bespoke branding configurations</li>
            <li className="flex items-center gap-1.5 font-bold"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> dedicated support manager</li>
            <li className="flex items-center gap-1.5 font-bold"><Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> WhatsApp updates automated alerts</li>
          </ul>
        </div>
      </div>

      {/* Interactive Estimator Component */}
      <div className="border border-slate-150 p-6 rounded-2xl bg-white text-left space-y-4">
        <h5 className="font-display font-black text-xs uppercase text-slate-950 flex items-center gap-1.5">
          <span className="text-blue-500">📊</span>
          INTERACTIVE TEAMS PLAN CALCULATOR & ADVANCED ESTIMATOR
        </h5>
        <p className="text-xs text-slate-500 leading-relaxed">
          Adjust the interactive sliding bar below based on the anticipated count of competition teams inside your village league series. Watch the system compute cost live!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 items-center">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span>Competition Teams Count:</span>
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs leading-none font-mono font-extrabold">{pricingTeams} Teams</span>
            </div>
            <input 
              type="range" 
              min="4" 
              max="48" 
              value={pricingTeams} 
              onChange={(e) => setPricingTeams(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Min: 4 Teams</span>
              <span>Max: 48 Teams</span>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all border ${
                  billingPeriod === 'monthly' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Monthly Billing
              </button>
              <button 
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all border relative ${
                  billingPeriod === 'yearly' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Yearly (Save 20%)
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[7px] px-1 rounded-full font-black">20%</span>
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center space-y-1">
              <span className="text-slate-400 uppercase text-[9px] block font-bold">ESTIMATED INVESTMENT:</span>
              <span className="text-xl font-mono text-slate-900 font-black">₹{finalCalculatedProPrice}<span className="text-xs text-slate-500">/mo</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
