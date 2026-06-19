import React from 'react';
import { Tv, Trophy, Award, Users, Star } from 'lucide-react';
import { LANDING_CONFIG } from '../../config/landingConfig';

export default function FeaturesRow() {
  const { highlights } = LANDING_CONFIG;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'tv':
        return <Tv className="h-5 w-5" />;
      case 'trophy':
        return <Trophy className="h-5 w-5" />;
      case 'award':
        return <Award className="h-5 w-5" />;
      case 'users':
        return <Users className="h-5 w-5" />;
      case 'star':
        return <Star className="h-5 w-5 fill-current" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-lg p-5 relative -mt-3 z-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-between text-center md:text-left">
        {highlights.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row items-center gap-3">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${item.colorClass}`}>
              {renderIcon(item.iconType)}
            </div>
            <div className="text-center md:text-left">
              <span className="block font-black text-xs uppercase tracking-wider text-slate-900 leading-none mb-0.5">
                {item.label}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
