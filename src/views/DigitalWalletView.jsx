import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  CreditCard,
  Plus,
  Send,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Sliders,
  CheckCircle2,
  Percent,
  Coins,
  Copy
} from 'lucide-react';

export const DigitalWalletView = () => {
  const {
    user,
    formatCurrency,
    setIsTopUpModalOpen,
    toggleCardFreeze,
    transferWalletFunds,
    transactions,
    setSelectedReceipt,
    addToast
  } = useApp();

  const [showFullCard, setShowFullCard] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [dailyLimit, setDailyLimit] = useState(user.wallet.virtualCard.dailyLimit || 5000);
  const [isSending, setIsSending] = useState(false);

  const virtualCard = user.wallet.virtualCard;

  const handleCopyCard = () => {
    navigator.clipboard?.writeText(virtualCard.fullNumber.replace(/\s+/g, ''));
    addToast('Card Copied', 'Virtual card number copied to clipboard.', 'info');
  };

  const handleSendFunds = (e) => {
    e.preventDefault();
    if (!sendAmount || !recipient) return;

    setIsSending(true);
    setTimeout(() => {
      const ok = transferWalletFunds(sendAmount, recipient);
      setIsSending(false);
      if (ok) {
        setSendAmount('');
        setRecipient('');
      }
    }, 600);
  };

  // Filter wallet-specific transactions
  const walletTransactions = transactions.filter(
    (t) => t.type === 'Wallet Top-up' || t.type === 'Cashback Credit' || t.type === 'Refund' || t.type === 'Wallet Transfer'
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Integrated Digital Banking & Rewards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          FinTech Digital Wallet
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Zero-interchange spending, automated instant hospitality cashbacks, and instant peer-to-peer settlement powered by our next-gen ledger.
        </p>
      </div>

      {/* Top Section: Virtual Card + Balance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Luxury Virtual Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              FinTech Virtual Debit Card
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFullCard(!showFullCard)}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                title="Toggle number visibility"
              >
                {showFullCard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showFullCard ? 'Hide' : 'Reveal'}</span>
              </button>
              <button
                onClick={handleCopyCard}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                title="Copy number"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card Surface */}
          <div
            className={`w-full aspect-[1.58/1] rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300 ${
              virtualCard.isFrozen
                ? 'bg-slate-900 border-2 border-slate-700 opacity-75'
                : 'bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/40 shadow-emerald-500/10'
            }`}
          >
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-teal-500/10 blur-xl pointer-events-none" />

            {/* Top row */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                  Hotel FinTech
                </span>
                <span className="text-[9px] text-slate-400 block tracking-wider">PLATINUM REWARDS</span>
              </div>
              <div className="flex items-center gap-2">
                {virtualCard.isFrozen && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    FROZEN
                  </span>
                )}
                <div className="w-9 h-7 rounded-md bg-gradient-to-r from-amber-400 to-amber-200 shadow-inner flex items-center justify-center">
                  <div className="w-6 h-4 border border-amber-800/40 rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Card Number */}
            <div className="relative z-10 my-auto">
              <div className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-white drop-shadow">
                {showFullCard ? virtualCard.fullNumber : virtualCard.cardNumber}
              </div>
            </div>

            {/* Bottom info */}
            <div className="relative z-10 flex items-end justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Cardholder</span>
                <span className="font-mono font-bold text-white tracking-wider text-sm">
                  {virtualCard.cardHolder}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Expires</span>
                <span className="font-mono font-bold text-white text-sm">
                  {virtualCard.expiry}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">CVV</span>
                <button
                  onClick={() => setShowCvv(!showCvv)}
                  className="font-mono font-bold text-emerald-400 text-sm hover:underline"
                >
                  {showCvv ? virtualCard.cvv : '•••'}
                </button>
              </div>
              <div className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                RuPay Platinum
              </div>
            </div>
          </div>

          {/* Quick Card Controls */}
          <div className="flex gap-2">
            <button
              onClick={toggleCardFreeze}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                virtualCard.isFrozen
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              {virtualCard.isFrozen ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-rose-400" /> Unfreeze Card
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> Freeze Card
                </>
              )}
            </button>
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Balance
            </button>
          </div>

        </div>

        {/* Balance & Financial Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Core Balance Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Available Spending Balance
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  {formatCurrency(user.wallet.balance)}
                </div>
                <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Real-Time Settlement Rail Active
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTopUpModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Top Up
                </button>
              </div>
            </div>

            {/* Metrics Trio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Lifetime Cashback
                </span>
                <span className="text-base font-extrabold text-emerald-400 mt-0.5 block">
                  {formatCurrency(user.wallet.cashbackEarnedTotal)}
                </span>
                <span className="text-[10px] text-slate-500">Auto-credited</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  FinTech Cash Points
                </span>
                <span className="text-base font-extrabold text-amber-400 mt-0.5 block">
                  {user.wallet.pointsBalance.toLocaleString('en-IN')} pts
                </span>
                <span className="text-[10px] text-slate-500">100 pts = ₹10 stay credit</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  VIP Membership
                </span>
                <span className="text-base font-extrabold text-white mt-0.5 block">
                  {user.membershipTier}
                </span>
                <span className="text-[10px] text-emerald-400">5% stay cashback</span>
              </div>
            </div>

            {/* Daily Limit Slider */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Daily Online Spending Limit:</span>
                <span className="font-bold text-white">₹{dailyLimit.toLocaleString('en-IN')} / day</span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          {/* Send / Transfer Money Quick Desk */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              Instant Transfer to Another Guest or UPI ID
            </h3>

            <form onSubmit={handleSendFunds} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Recipient UPI ID or Email
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g. colleague@okhdfcbank or email"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Amount (INR - ₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400">₹</span>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="5000"
                      className="w-full pl-6 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                {isSending ? 'Routing Transfer...' : 'Send Instant Funds (0% fee)'}
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Wallet Activity Ledger */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Wallet Deposits & Rewards Ledger</h3>
        <div className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden">
          <div className="divide-y divide-slate-800">
            {walletTransactions.map((txn) => {
              const isPositive = txn.amount > 0;
              return (
                <div
                  key={txn.id}
                  onClick={() => setSelectedReceipt(txn)}
                  className="p-4 hover:bg-slate-800/40 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{txn.description}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {txn.date} • Rail: {txn.method} • Ref: {txn.reference}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-extrabold ${isPositive ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {isPositive ? '+' : ''}{formatCurrency(txn.amount)}
                    </span>
                    <span className="block text-[10px] text-emerald-400/80 font-medium">{txn.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

