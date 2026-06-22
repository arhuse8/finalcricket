import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Bell, Info, ShieldCheck } from 'lucide-react';

export default function FixtureTab() {
  const [notifSuccess, setNotifSuccess] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('Saturday');

  const handleRequestNotif = (matchName: string) => {
    setNotifSuccess(`Notification configured! We will alert you 10 minutes prior to ${matchName} toss! 🔔`);
    setTimeout(() => setNotifSuccess(''), 4500);
  };

  const dayFixtures = {
    'Saturday': [
      { id: 'fx-01', team1: 'Rampur Warriors', team2: 'Malgudi Stars', time: '1:30 PM IST', venue: 'Rampur School Ground', cup: 'Khalsa Cup Series' },
      { id: 'fx-02', team1: 'Gully Raiders', team2: 'Dangal Kings', time: '4:30 PM IST', venue: 'Panchayat Area Arena', cup: 'Village Premier League' }
    ],
    'Sunday': [
      { id: 'fx-03', team1: 'Rampur Warriors', team2: 'Dangal Kings', time: '12:00 PM IST', venue: 'Rampur Meadows Ground', cup: 'Khalsa Cup Series' },
      { id: 'fx-04', team1: 'Malgudi Stars', team2: 'Gully Raiders', time: '3:30 PM IST', venue: 'Malgudi Lake View Stadium', cup: 'Village Premier League' }
    ],
    'Midweek': [
      { id: 'fx-05', team1: 'Malgudi Stars', team2: 'Dangal Kings', time: '4:00 PM', venue: 'Malgudi Grasslands Ground', cup: 'Panchayat Friendly Derby' }
    ]
  };

  const currentFixturesList = dayFixtures[selectedDay as keyof typeof dayFixtures] || [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-650 to-blue-700 text-white p-6 rounded-2xl text-left">
        <Calendar className="h-7 w-7 text-yellow-300 mb-3 animate-pulse" />
        <h4 className="font-display font-black tracking-wide text-md uppercase">Village Derby Scheduling & Calendar</h4>
        <p className="text-blue-50 text-xs mt-2 max-w-2xl leading-relaxed">
          Monitor upcoming regional fixture timelines, pitch locations, and schedule parameters. Track start times and request immediate reminders directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Interactive Calendar day switcher */}
        <div className="lg:col-span-7 bg-white border border-slate-150 p-5 rounded-2xl text-left space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-2.5 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h5 className="font-display font-black text-slate-905 text-xs uppercase tracking-wide">
                📅 STAGING TIMELINE CALENDAR
              </h5>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Toggle days to explore planned schedules</p>
            </div>

            {/* Selector buttons */}
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
              {['Saturday', 'Sunday', 'Midweek'].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedDay === day 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {notifSuccess && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 rounded-xl text-xs font-sans font-bold leading-normal">
              {notifSuccess}
            </div>
          )}

          {/* Render List of scheduled Items */}
          <div className="space-y-3">
            {currentFixturesList.map((f) => (
              <div key={f.id} className="p-4 border border-slate-150 rounded-2xl bg-slate-50/60 hover:bg-slate-50 relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-left">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-black text-blue-600 uppercase tracking-widest block">{f.cup}</span>
                  <h6 className="font-extrabold text-slate-950 uppercase tracking-wide">{f.team1} vs {f.team2}</h6>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 font-bold"><Clock className="h-3 w-3 inline text-slate-400" /> {f.time}</span>
                    <span className="flex items-center gap-1 font-bold"><MapPin className="h-3 w-3 inline text-slate-400" /> {f.venue}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRequestNotif(`${f.team1} vs ${f.team2}`)}
                  className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-[9px] font-black uppercase px-3 py-2 rounded-lg cursor-pointer shrink-0 transition-opacity"
                >
                  🔔 REMIND ME
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Scheduling specs */}
        <div className="lg:col-span-5 bg-white border border-slate-150 p-5 rounded-2xl text-left space-y-4 shadow-sm">
          <h5 className="font-display font-black text-slate-950 text-xs uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
            <span>CALENDAR QUALITY PROTOCOLS</span>
          </h5>

          <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans">
            Our schedules and tournament calendars are designed under standard regional guidelines to protect fair competition metrics.
          </p>

          <div className="space-y-3 font-semibold text-xs leading-relaxed text-slate-650 pt-1">
            <div className="flex gap-2 items-start">
              <span className="text-blue-600 text-[10px] font-black mt-0.5">✓</span>
              <span><strong>VENUE CHECKS:</strong> Every grounds layout is pre-vetted by our marshals to confirm accurate pitch dimensions prior to scheduling list updates.</span>
            </div>

            <div className="flex gap-2 items-start">
              <span className="text-blue-600 text-[10px] font-black mt-0.5">✓</span>
              <span><strong>TAPE OVER QUOTAS:</strong> Standard tape ball matches carry rules limiting overs duration to maximum 12 overs with a strict 4-bowler layout format.</span>
            </div>

            <div className="flex gap-2 items-start">
              <span className="text-blue-600 text-[10px] font-black mt-0.5">✓</span>
              <span><strong>RAIN DELAY RESCHEDULING:</strong> Inclement weather or pitch issues trigger auto-re-routing calculations, notifying scorers and captains directly via dynamic SMS updates.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
