import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Wallet, ShieldCheck, ArrowRight, CreditCard, Building, Sparkles, Smartphone } from 'lucide-react';

export const TopUpModal = () => {
  const { isTopUpModalOpen, setIsTopUpModalOpen, topUpWallet, user, formatCurrency } = useApp();
  const [amount, setAmount] = useState('5000');
  const [paymentRail, setPaymentRail] = useState('UPI (Google Pay / PhonePe / Paytm)');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isTopUpModalOpen) return null;

  const presetAmounts = ['1000', '2500', '5000', '10000', '25000'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      topUpWallet(val, paymentRail);
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Deposit to FinTech Wallet</h3>
              <p className="text-xs text-slate-400">Zero transaction fees • Instant credit via UPI / IMPS</p>
            </div>
          </div>
          <button
            onClick={() => setIsTopUpModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current balance reminder */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs">
            <span className="text-slate-400">Current Wallet Balance:</span>
            <span className="font-bold text-emerald-400 text-sm">
              {formatCurrency(user.wallet.balance)}
            </span>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select or Enter Amount (INR - ₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-emerald-400">
                ₹
              </span>
              <input
                type="number"
                min="100"
                step="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xl font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="5000"
                required
              />
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {presetAmounts.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    amount === p
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  +₹{parseInt(p).toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Funding Rail */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Indian Payment Rail
            </label>
            <div className="space-y-2">
              {[
                { name: 'UPI (Google Pay / PhonePe / Paytm)', time: 'Instant zero-fee settlement', icon: Smartphone },
                { name: 'RuPay / Visa / Mastercard Debit', time: 'Instant credit', icon: CreditCard },
                { name: 'Net Banking (HDFC / ICICI / SBI)', time: 'Direct IMPS / NEFT', icon: Building }
              ].map((item) => (
                <label
                  key={item.name}
                  onClick={() => setPaymentRail(item.name)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentRail === item.name
                      ? 'bg-emerald-500/10 border-emerald-500/80 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.time}</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="rail"
                    checked={paymentRail === item.name}
                    onChange={() => setPaymentRail(item.name)}
                    className="accent-emerald-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>RBI-Regulated Partner Banks • 256-Bit Encrypted Ledger Rail</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Authorizing Bank Rail...
              </span>
            ) : (
              <>
                Confirm Deposit {formatCurrency(parseFloat(amount) || 0)}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
