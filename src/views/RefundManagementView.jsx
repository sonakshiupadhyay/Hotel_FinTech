import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  Wallet,
  Sparkles,
  FileCheck
} from 'lucide-react';

export const RefundManagementView = () => {
  const {
    refundRequests,
    approveRefund,
    rejectRefund,
    formatCurrency,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'resolved'
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Cancellation submitted within non-refundable window (<24 hours)');

  const pendingRefunds = refundRequests.filter((r) => r.status === 'Pending');
  const resolvedRefunds = refundRequests.filter((r) => r.status === 'Approved' || r.status === 'Rejected');

  const handleRejectConfirm = (e) => {
    e.preventDefault();
    if (!rejectingId) return;
    rejectRefund(rejectingId, rejectReason);
    setRejectingId(null);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Automated FinTech Escrow Clearing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Refund Management Center
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Review cancellation requests, enforce automated smart contract refund policies, and execute instant zero-fee credits to guest FinTech wallets.
        </p>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Pending Refund Queue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {pendingRefunds.length} <span className="text-xs font-normal text-slate-400">requests</span>
          </div>
          <div className="text-xs text-amber-400 mt-1">
            Total volume: {formatCurrency(pendingRefunds.reduce((a, b) => a + b.amount, 0))}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Avg Resolution Time</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            1.2 Hours
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Industry standard: 7-14 business days
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Wallet Retention Rate</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            88.4%
          </div>
          <div className="text-xs text-blue-400 mt-1">
            Guests retain balance in FinTech wallet
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Chargeback Dispute Rate</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-400 mt-2">
            0.00%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Eliminated via transparent escrow ledger
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pending'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending Actions ({pendingRefunds.length})
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'resolved'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Resolved Archive ({resolvedRefunds.length})
        </button>
      </div>

      {/* Request Cards / Tables */}
      <div className="space-y-4">
        {activeTab === 'pending' ? (
          pendingRefunds.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">All Refund Requests Cleared</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No outstanding refund applications. Smart contract escrow settlements are up to date.
              </p>
            </div>
          ) : (
            pendingRefunds.map((req) => (
              <div
                key={req.id}
                className="glass-panel rounded-2xl border border-slate-700/80 p-6 space-y-5 hover:border-emerald-500/40 transition-all shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                        Request Ref: <strong className="text-white">{req.id}</strong> • Booking: {req.bookingId}
                      </span>
                      <h3 className="text-base font-bold text-white">{req.guestName} ({req.guestEmail})</h3>
                      <p className="text-xs text-slate-400">{req.roomName}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Requested Amount</span>
                    <span className="text-2xl font-black text-white">{formatCurrency(req.amount)}</span>
                  </div>
                </div>

                {/* Reason & Policy Compliance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Guest Reason</span>
                    <p className="text-slate-200 italic leading-relaxed">"{req.reason}"</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Smart Contract Policy Check</span>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>{req.policyCompliance}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Target Payout Rail: <strong className="text-slate-300">{req.preferredRefundMethod}</strong>
                    </span>
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Audit Log</span>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {req.auditTrail.map((trail, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {trail.step} <span className="text-slate-500">({trail.time})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5 border-t border-slate-800">
                  <button
                    onClick={() => setRejectingId(req.id)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                  >
                    Reject with Reason
                  </button>

                  <button
                    onClick={() => approveRefund(req.id)}
                    className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Instant Wallet Credit ({formatCurrency(req.amount)})
                  </button>
                </div>

              </div>
            ))
          )
        ) : (
          /* Resolved Archive */
          <div className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden">
            <div className="divide-y divide-slate-800">
              {resolvedRefunds.map((req) => (
                <div key={req.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{req.guestName}</span>
                      <span className="text-slate-500 font-mono">({req.id})</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-slate-400">{req.roomName} • Booking: {req.bookingId}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-white block">{formatCurrency(req.amount)}</span>
                    <span className="text-[10px] text-slate-500">{req.preferredRefundMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal Dialog */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Reject Refund Application
            </h3>
            <p className="text-xs text-slate-300">
              Provide policy justification for rejecting refund <strong className="text-white font-mono">{rejectingId}</strong>.
            </p>

            <form onSubmit={handleRejectConfirm} className="space-y-3">
              <textarea
                rows="3"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                required
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

