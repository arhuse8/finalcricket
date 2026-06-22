import React, { useState } from 'react';

export default function RefundTab() {
  const [refundTxnId, setRefundTxnId] = useState('');
  const [refundStatusResult, setRefundStatusResult] = useState<string | null>(null);

  // Refund inquiry simulator
  const handleRefundInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTxnId.trim()) return;
    
    // Simulate lookup
    if (refundTxnId.toUpperCase().includes('TXN') || refundTxnId.length > 5) {
      setRefundStatusResult('APPROVED ✓ - Your refund was processed on June 20, 2026. Billed directly back to your original source node / UPI address inside 3-5 business days.');
    } else {
      setRefundStatusResult('PENDING ⏳ - Refund request registered under ID: APC-R-' + refundTxnId + '. Our lead finance officer is auditing the tournament log.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="font-bold text-slate-950 uppercase text-xs">Tournament Registration & Refund Guidelines</h4>
        <span className="text-[9px] text-slate-400 block font-mono">LAST UPDATED: June 20, 2026 | FINANCE REGULATED</span>
      </div>

      <div className="text-xs text-slate-600 leading-relaxed space-y-3">
        <p><strong>1. TOURNAMENT CANCELLATION PERIOD:</strong> If a scheduled Panchayat Cup or Village Premier League series is abandoned prior to the toss limit, all organizer registration fees will be refunded 100% inside 7 days.</p>
        <p><strong>2. PREMIUM LICENSE CANCELLATION:</strong> Pro and Enterprise monthly subscriptions can be canceled with zero fees anytime from the accounts tab with no penalty fees whatsoever.</p>
      </div>

      {/* Refund Tracker component */}
      <div className="border border-slate-150 bg-slate-50 p-5 rounded-2xl">
        <h5 className="font-display font-black text-xs text-slate-950 uppercase tracking-widest block mb-1">
          REFUND STATUS TRACKING CONSOLE
        </h5>
        <p className="text-[10px] text-slate-400 mb-4 uppercase font-bold">Trace mock or real payments status below</p>
        
        <form onSubmit={handleRefundInquiry} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text"
            required
            value={refundTxnId}
            onChange={(e) => setRefundTxnId(e.target.value)}
            placeholder="Enter Transaction ID (e.g. TXN-9481)"
            className="w-full sm:flex-1 bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800"
          />
          <button 
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs px-6 py-2.5 rounded-xl cursor-pointer shrink-0"
          >
            Lookup Status
          </button>
        </form>

        {refundStatusResult && (
          <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 leading-relaxed font-sans">
            <span className="text-slate-400 uppercase text-[9px] block mb-1">Telemetry Status Report:</span>
            {refundStatusResult}
          </div>
        )}
      </div>
    </div>
  );
}
