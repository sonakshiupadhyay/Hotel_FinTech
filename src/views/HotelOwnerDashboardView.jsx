import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sliders,
  BedDouble,
  RefreshCw,
  Zap,
  Building,
  Award
} from 'lucide-react';

export const HotelOwnerDashboardView = () => {
  const {
    ownerInfo,
    setOwnerInfo,
    ownerSettlePayout,
    formatCurrency,
    rooms,
    setRooms,
    addToast
  } = useApp();

  const [payoutInput, setPayoutInput] = useState('250000');
  const [isSettling, setIsSettling] = useState(false);
  const [surgeActive, setSurgeActive] = useState(ownerInfo.surgePricingActive || false);

  const handlePayoutSubmit = (e) => {
    e.preventDefault();
    setIsSettling(true);
    setTimeout(() => {
      ownerSettlePayout(payoutInput);
      setIsSettling(false);
      setPayoutInput('');
    }, 800);
  };

  const handleToggleSurge = () => {
    const nextVal = !surgeActive;
    setSurgeActive(nextVal);
    setOwnerInfo((prev) => ({ ...prev, surgePricingActive: nextVal }));

    // Adjust room prices slightly
    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        pricePerNight: nextVal ? Math.round(r.pricePerNight * 1.15) : Math.round(r.pricePerNight / 1.15)
      }))
    );

    addToast(
      nextVal ? 'Surge Dynamic Pricing Enabled' : 'Surge Pricing Deactivated',
      nextVal ? 'Automated +15% dynamic rate applied across all available suites.' : 'Rates reset to base seasonal pricing.',
      nextVal ? 'success' : 'info'
    );
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Property Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Host & Asset Partner Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hotel Owner Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {ownerInfo.propertyName} • {ownerInfo.location}
          </p>
        </div>

        {/* Dynamic Surge Pricing Switch */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-right">
            <span className="text-xs font-bold text-white block">Surge / High-Demand Pricing</span>
            <span className="text-[10px] text-slate-400">+15% automated RevPAR booster</span>
          </div>
          <button
            onClick={handleToggleSurge}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              surgeActive ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                surgeActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Financial Health & Liquidity Settlement Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settlement Balance & Instant Payout Card */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 relative overflow-hidden space-y-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                Settlement Liquidity (Ready for Payout)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                {formatCurrency(ownerInfo.settlementReadyBalance)}
              </div>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cleared from checked-in stays & smart contract releases
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block">In Escrow (Upcoming Stays)</span>
              <span className="text-xl font-bold text-slate-300">
                {formatCurrency(ownerInfo.escrowPendingBalance)}
              </span>
            </div>
          </div>

          {/* Clearing Bank Info */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Clearing Rail:</span>
              <span className="text-white font-semibold">RBI RTGS / NEFT / IMPS Instant Rail</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Designated Bank:</span>
              <span className="text-emerald-400 font-semibold">{ownerInfo.payoutBank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Auto-Sweep Schedule:</span>
              <span className="text-slate-300">{ownerInfo.nextAutoPayoutDate}</span>
            </div>
          </div>

          {/* Instant Payout Form */}
          <form onSubmit={handlePayoutSubmit} className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-400">₹</span>
              <input
                type="number"
                min="1000"
                max={ownerInfo.settlementReadyBalance}
                value={payoutInput}
                onChange={(e) => setPayoutInput(e.target.value)}
                placeholder="Enter payout amount"
                className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSettling || !payoutInput || parseFloat(payoutInput) <= 0}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {isSettling ? 'Clearing RTGS / IMPS...' : 'Request Instant Payout'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Room Inventory & Capacity Status */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-emerald-400" />
            Live Inventory Status
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total Property Keys</span>
                <span className="text-lg font-bold text-white">{ownerInfo.totalRooms} Rooms</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                100% Active
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Currently Occupied</span>
                <span className="text-lg font-bold text-emerald-400">{ownerInfo.occupiedRooms} Suites</span>
              </div>
              <span className="text-xs font-bold text-slate-300">
                {Math.round((ownerInfo.occupiedRooms / ownerInfo.totalRooms) * 100)}% Occupancy
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Vacant & Ready to Book</span>
                <span className="text-lg font-bold text-amber-400">{ownerInfo.availableRooms} Units</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Instant Keyless
              </span>
            </div>
          </div>

          {/* Guest Review Score */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">FinTech Certified SuperHost</span>
              <p className="text-slate-400">4.98 / 5.0 Rating based on 940+ blockchain-verified guest reviews</p>
            </div>
          </div>

        </div>

      </div>

      {/* Room Category Pricing & Units Management Desk */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Dynamic Pricing & Inventory Rate Editor</h3>
          <span className="text-xs text-slate-400">Rates auto-sync with guest booking interface</span>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Suite Category</th>
                  <th className="py-3.5 px-4">Base Nightly Rate</th>
                  <th className="py-3.5 px-4">Available / Total Units</th>
                  <th className="py-3.5 px-4">Guest Cashback %</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Rate Modifier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{room.name}</div>
                      <div className="text-[10px] text-slate-400">{room.category} • {room.capacity}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(room.pricePerNight)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-semibold">{room.availableUnits}</span>
                      <span className="text-slate-500"> / {room.totalUnits} units</span>
                    </td>

                    <td className="py-3.5 px-4 text-amber-400 font-semibold">
                      +{room.cashbackPercentage}% Wallet
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Live on Channel
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setRooms((prev) =>
                              prev.map((r) =>
                                r.id === room.id ? { ...r, pricePerNight: Math.round(r.pricePerNight * 0.95) } : r
                              )
                            );
                            addToast('Rate Updated', `${room.name} reduced by 5%`, 'info');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px]"
                        >
                          -5%
                        </button>
                        <button
                          onClick={() => {
                            setRooms((prev) =>
                              prev.map((r) =>
                                r.id === room.id ? { ...r, pricePerNight: Math.round(r.pricePerNight * 1.05) } : r
                              )
                            );
                            addToast('Rate Updated', `${room.name} increased by 5%`, 'info');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-semibold text-[11px]"
                        >
                          +5%
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

