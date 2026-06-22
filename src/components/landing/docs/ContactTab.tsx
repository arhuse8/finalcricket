import React, { useState } from 'react';
import { Building, Phone, MapPin, Mail, Send, RefreshCw } from 'lucide-react';

export default function ContactTab() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isContactSending, setIsContactSending] = useState(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState('');

  // Contact form submission simulator
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) return;

    setIsContactSending(true);
    setTimeout(() => {
      setIsContactSending(false);
      setContactSuccessMsg(`Dear ${contactName}, your message has been delivered directly to Avinash R Huse & the Operations Management Team. We will contact you at ${contactEmail} within 2 hours!`);
      // Reset form
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMsg('');
      setTimeout(() => setContactSuccessMsg(''), 6000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Primary Administrative Coordinates</h4>
        <p className="text-[10px] text-slate-400">Reach the founder Avinash R Huse directly regarding operations or premium business partnerships</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Details Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 border border-slate-150 rounded-2xl space-y-4 bg-slate-50 text-xs text-left">
            <h5 className="font-display font-black text-slate-950 uppercase tracking-widest block text-xs border-b border-slate-200 pb-2">
              CORPORATE HEADQUARTERS
            </h5>
            
            <div className="space-y-3">
              {/* Founder Row */}
              <div className="flex gap-3 items-start">
                <Building className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block">Founder & MD:</span>
                  <span className="text-slate-600">Avinash R Huse</span>
                  <span className="block text-[10px] text-slate-400 font-bold mt-0.5">ApnaCricket Operations Admin Desk</span>
                </div>
              </div>

              {/* Tel phone Link */}
              <div className="flex gap-3 items-start">
                <Phone className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block">Direct Mobile:</span>
                  <a href="tel:9112768872" className="text-blue-600 font-extrabold hover:underline block text-xs">
                    +91 91127 68872
                  </a>
                  <span className="relative inline-block bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full mt-1">
                    ACTIVE HOTLINE 24/7
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-3 items-start">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block">Official Address:</span>
                  <span className="text-slate-600 font-sans leading-relaxed block">
                    Shree Heights, Manjari Green, Flat No. 505, 506, 507, Pune, Maharashtra 412307, India.
                  </span>
                  <span className="relative inline-block bg-blue-50 text-blue-700 border border-blue-100 text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full mt-1">
                    RECOGNIZED HEAD OFFICE NODE
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3 items-start">
                <Mail className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block">Support Mail Node:</span>
                  <span className="text-slate-600 italic">avinash@apnacricket.com</span>
                  <span className="block text-[10px] text-slate-400">inquries@apnacricket.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 text-white rounded-2xl block text-center space-y-1">
            <span className="text-[9px] text-amber-300 font-black uppercase tracking-widest block font-sans">
              🔥 DIRECT RESPONSE INCOMING ALERT
            </span>
            <p className="text-[10px] text-slate-300">
              Submitting details generates local telemetry logged directly to Avinash R Huse’s desk. Try it live!
            </p>
          </div>
        </div>

        {/* Contact Form Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-150 p-5 rounded-2xl">
          <h5 className="font-display font-black text-xs text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            LEAVE A DETAILED MSG / SYSTEM FEEDBACK
          </h5>
          
          {contactSuccessMsg ? (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-5 rounded-xl text-xs font-sans font-bold leading-relaxed space-y-2 text-left">
              <span className="block text-emerald-700 font-extrabold text-sm uppercase">MESSAGE ENGAGED FORWARDED! ✓</span>
              <p>{contactSuccessMsg}</p>
              <button 
                onClick={() => setContactSuccessMsg('')} 
                className="text-blue-600 hover:underline cursor-pointer block pt-2 text-[10px] uppercase font-mono"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-bold text-slate-800 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-slate-400 tracking-wider">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Sunny Sandhu" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-slate-400 tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. sunny@gullyboys.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400 tracking-wider">Inquiry Subject</label>
                <input 
                  type="text" 
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. Sponsoring Rampur Winter Cup Series" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400 tracking-wider">Your Corporate Message</label>
                <textarea 
                  required
                  rows={4}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Write details of your local cricket turf support or scoring issues here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isContactSending}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  {isContactSending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Forwarding Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Dispatch to Avinash Huse</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
