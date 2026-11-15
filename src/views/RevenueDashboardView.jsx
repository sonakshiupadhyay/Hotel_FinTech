import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Percent,
  Building,
  ShieldCheck,
  CreditCard,
  Wallet,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';

export const RevenueDashboardView = () => {
  const { formatCurrency, HOTEL_FINANCIALS, ownerInfo } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('Nov (Current)');

  const series = HOTEL_FINANCIALS.monthlyRevenueSeries;
  const currentMonthData = series.find((s) => s.month === selectedMonth) || series[series.length - 1];

  const maxRevenue = Math.max(...series.map((s) => s.revenue));

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Hospitality FinTech Analytics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Revenue & Earnings Dashboard
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Comprehensive financial performance tracking: RevPAR, ADR, settlement velocities, and fee optimization through the FinTech ecosystem.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Gross Booking Volume (GMV)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {formatCurrency(HOTEL_FINANCIALS.monthlyGrossRevenue)}
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.8% vs last month</span>
          </div>
        </div>

        {/* RevPAR */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">RevPAR (Rev / Available Room)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {formatCurrency(HOTEL_FINANCIALS.revPar)}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Avg Daily Rate (ADR): <strong className="text-white">{formatCurrency(HOTEL_FINANCIALS.adr)}</strong>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Occupancy Performance</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {HOTEL_FINANCIALS.occupancyRate}%
          </div>
          <div className="mt-2 text-xs text-amber-400">
            {ownerInfo.occupiedRooms} / {ownerInfo.totalRooms} Rooms Booked
          </div>
        </div>

        {/* Fees Saved via FinTech */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/40 group transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Interchange Fees Saved</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
            {formatCurrency(HOTEL_FINANCIALS.platformFeesSavedViaWallet)}
          </div>
          <div className="mt-2 text-xs text-slate-300">
            Saved by routing 56% volume via FinTech Wallet
          </div>
        </div>

      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Monthly Revenue Bar & Trend Chart (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                Monthly Revenue & Profit Progression
              </h3>
              <p className="text-xs text-slate-400">Hover over bars to inspect detailed net operating profit and occupancy</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-emerald-500"></span> Gross Revenue
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-teal-400"></span> Net Profit
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-4">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-800 pb-2">
              {series.map((item) => {
                const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
                const profitHeightPercent = Math.round((item.profit / maxRevenue) * 100);
                const isSelected = selectedMonth === item.month;

                return (
                  <div
                    key={item.month}
                    onClick={() => setSelectedMonth(item.month)}
                    className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-[10px] p-2 rounded-lg text-slate-200 pointer-events-none mb-1 whitespace-nowrap z-20 shadow-xl">
                      <div>Rev: {formatCurrency(item.revenue)}</div>
                      <div className="text-emerald-400 font-bold">Profit: {formatCurrency(item.profit)}</div>
                      <div className="text-slate-400">Occupancy: {item.occupancy}%</div>
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 h-48">
                      {/* Gross Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-1/2 rounded-t-lg transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-700 group-hover:bg-emerald-500/70'
                        }`}
                      />
                      {/* Profit Bar */}
                      <div
                        style={{ height: `${profitHeightPercent}%` }}
                        className={`w-1/2 rounded-t-lg transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-t from-teal-500 to-teal-300'
                            : 'bg-slate-800 group-hover:bg-teal-400/60'
                        }`}
                      />
                    </div>

                    <span
                      className={`text-[10px] sm:text-xs font-semibold mt-2 transition-colors ${
                        isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400 group-hover:text-white'
                      }`}
                    >
                      {item.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected month detailed inspection card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Selected Period:</span>
              <span className="text-sm font-bold text-white">{selectedMonth}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Gross Bookings:</span>
              <span className="text-sm font-bold text-emerald-400">{formatCurrency(currentMonthData.revenue)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Operating Costs:</span>
              <span className="text-sm font-bold text-rose-400">{formatCurrency(currentMonthData.expenses)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Net Payout Profit:</span>
              <span className="text-sm font-bold text-white">{formatCurrency(currentMonthData.profit)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Occupancy Rate:</span>
              <span className="text-sm font-bold text-amber-400">{currentMonthData.occupancy}%</span>
            </div>
          </div>

        </div>

        {/* Room Category Distribution (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              Revenue by Room Tier
            </h3>
            <p className="text-xs text-slate-400">High-tier suites generate 64% of total GMV</p>
          </div>

          <div className="space-y-4">
            {HOTEL_FINANCIALS.revenueByRoomCategory.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.name}</span>
                  <span className="text-slate-400">{item.percentage}% ({formatCurrency(item.value)})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* FinTech Direct Settlement Schedule */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Direct Clearing Desk
            </span>
            <div className="text-xs space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Settlement Frequency:</span>
                <span className="text-white font-medium">Daily RBI NEFT / RTGS / IMPS</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow Hold Period:</span>
                <span className="text-white font-medium">Instant upon Keyless Check-In</span>
              </div>
              <div className="flex justify-between">
                <span>Clearing Bank:</span>
                <span className="text-emerald-400 font-medium">HDFC Bank Commercial Clearing</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Payment Rail Distribution Breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          Volume by Payment Rail & Interchange Optimization
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOTEL_FINANCIALS.paymentMethodDistribution.map((item) => (
            <div key={item.method} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.method}</span>
                <span className="text-xs font-black text-emerald-400">{item.share}</span>
              </div>
              <div className="text-lg font-bold text-slate-200">{item.volume}</div>
              <div className="text-[11px] text-slate-400">
                Savings: <strong className="text-emerald-400">{item.savings}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

