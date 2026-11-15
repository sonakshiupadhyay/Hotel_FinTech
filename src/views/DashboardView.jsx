import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  CalendarCheck,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Clock,
  ArrowRight,
  Percent,
  CheckCircle2,
  Plus
} from 'lucide-react';

export const DashboardView = () => {
  const {
    user,
    bookings,
    transactions,
    rooms,
    formatCurrency,
    setActiveTab,
    setIsTopUpModalOpen,
    setSelectedReceipt,
    startBooking,
    HOTEL_FINANCIALS
  } = useApp();

  const activeBooking = bookings.find((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In');
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Hospitality & Integrated Banking</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Manage your stays, unlock 5% instant cashback with your FinTech Digital Wallet, and track real-time blockchain-verified receipts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('booking')}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all transform active:scale-98"
            >
              <CalendarCheck className="w-4 h-4" />
              Book a Suite
            </button>
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              Add Funds
            </button>
          </div>
        </div>
      </div>

      {/* FinTech Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Wallet Balance Card */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Digital Wallet Balance</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {formatCurrency(user.wallet.balance)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> FDIC Insured
            </span>
            <button
              onClick={() => setActiveTab('wallet')}
              className="text-slate-400 hover:text-white flex items-center gap-0.5 group-hover:text-emerald-400 transition-colors"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Reservations */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Reservations</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In').length}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Next check-in: Nov 20</span>
            <button
              onClick={() => setActiveTab('bookings-mgmt')}
              className="text-slate-400 hover:text-white flex items-center gap-0.5 group-hover:text-blue-400 transition-colors"
            >
              All Stays <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* FinTech Cashback Earned */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cashback Rewards</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {formatCurrency(user.wallet.cashbackEarnedTotal)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-semibold">{user.membershipTier} (5% Tier)</span>
            <span className="text-slate-400">{user.wallet.pointsBalance.toLocaleString()} pts</span>
          </div>
        </div>

        {/* Live Hotel Occupancy & RevPAR */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hotel Occupancy & ADR</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {HOTEL_FINANCIALS.occupancyRate}%
            </span>
            <span className="text-xs text-emerald-400 font-medium">ADR {formatCurrency(HOTEL_FINANCIALS.adr)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">RevPAR: {formatCurrency(HOTEL_FINANCIALS.revPar)}</span>
            <button
              onClick={() => setActiveTab('revenue')}
              className="text-slate-400 hover:text-white flex items-center gap-0.5 group-hover:text-teal-400 transition-colors"
            >
              Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid: Active Stay + Virtual Card / Ledger preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Upcoming / Current Stay Highlight */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Current Stay & Keyless Access
            </h2>
            <button
              onClick={() => setActiveTab('booking')}
              className="text-xs text-emerald-400 hover:underline font-medium"
            >
              Browse All Suites →
            </button>
          </div>

          {activeBooking ? (
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700/80 p-6 flex flex-col md:flex-row gap-6 items-center">
              <img
                src={activeBooking.roomImage}
                alt={activeBooking.roomName}
                className="w-full md:w-56 h-48 rounded-xl object-cover ring-1 ring-white/10"
              />
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {activeBooking.bookingStatus}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Ref: {activeBooking.id}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{activeBooking.roomName}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {activeBooking.nights} Nights • {activeBooking.guestsCount} Guests • Check-in: {activeBooking.checkIn}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Total Settled:</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(activeBooking.totalAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">FinTech Cashback:</span>
                    <span className="font-bold text-emerald-400">+{formatCurrency(activeBooking.cashbackAwarded)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => setSelectedReceipt(activeBooking)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    View Voucher & QR
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings-mgmt')}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                  >
                    Digital Key Access
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-8 text-center space-y-3">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Active Reservation</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Explore Hotel FinTech's luxury penthouses, smart executive suites, and secure payment rails with 5% instant cashback.
              </p>
              <button
                onClick={() => setActiveTab('booking')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
              >
                Find a Room Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Featured Room Quick Preview Banner */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Featured Luxury FinTech Hub</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rooms.slice(0, 2).map((room) => (
                <div
                  key={room.id}
                  className="glass-panel rounded-2xl overflow-hidden group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      {room.badge}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/90 text-xs font-extrabold text-white">
                      {formatCurrency(room.pricePerNight)} <span className="text-[10px] font-normal text-slate-400">/ night</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{room.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{room.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-[11px] text-emerald-400 font-semibold">
                        +{room.cashbackPercentage}% Wallet Cashback
                      </span>
                      <button
                        onClick={() => startBooking(room)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-xs transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Virtual Card & Recent Transactions Preview */}
        <div className="space-y-6">
          
          {/* Virtual Card Widget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Virtual FinTech Card
              </h3>
              <button
                onClick={() => setActiveTab('wallet')}
                className="text-xs text-slate-400 hover:text-emerald-400"
              >
                Card Settings
              </button>
            </div>

            {/* Virtual Card Front */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/30 shadow-xl relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
                    Hotel FinTech Platinum
                  </span>
                  <div className="text-lg font-black text-white tracking-wider font-mono mt-2">
                    {user.wallet.virtualCard.cardNumber}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-6 flex justify-between items-end">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Cardholder</span>
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono">
                    {user.wallet.virtualCard.cardHolder}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Expires</span>
                  <span className="text-xs font-bold text-slate-200 font-mono">
                    {user.wallet.virtualCard.expiry}
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  RuPay FinTech
                </div>
              </div>
            </div>
          </div>

          {/* Recent FinTech Activity Feed */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Recent Financial Ledger
              </h3>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs text-emerald-400 hover:underline font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((txn) => {
                const isPositive = txn.amount > 0;
                return (
                  <div
                    key={txn.id}
                    onClick={() => setSelectedReceipt(txn)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-semibold text-slate-200 truncate">{txn.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{txn.date} • {txn.method}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {isPositive ? '+' : ''}{formatCurrency(txn.amount)}
                      </span>
                      <span className="block text-[9px] text-slate-500 uppercase">{txn.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FinTech Loyalty Ecosystem Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              FinTech Zero-Interchange Advantage
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Paying via your native FinTech Wallet circumvents legacy card interchange fees, directly rewarding you with up to 6% instant cashback.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

