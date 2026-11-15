import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  Activity,
  AlertTriangle,
  Sliders,
  DollarSign,
  Lock,
  FileText,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const AdminPanelView = () => {
  const { PLATFORM_ADMIN_DATA, formatCurrency, addToast } = useApp();

  const [commissionRate, setCommissionRate] = useState(PLATFORM_ADMIN_DATA.platformCommissionRate || 4.5);
  const [cashbackBudget, setCashbackBudget] = useState(350000);
  const [systemUptime] = useState(PLATFORM_ADMIN_DATA.systemUptime || '99.995%');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('Platform Settings Saved', `Platform fee updated to ${commissionRate}% and Cashback budget to ₹${cashbackBudget.toLocaleString('en-IN')}`, 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Platform Infrastructure & Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Platform Admin Control Panel
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Super-admin monitoring: ecosystem gross booking volume, automated AML compliance screening, fee schedules, and multi-tenant hotel ledger health.
        </p>
      </div>

      {/* Global Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Total Ecosystem GMV</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {PLATFORM_ADMIN_DATA.totalPlatformGMV}
          </div>
          <span className="text-xs text-emerald-400 mt-1 block">+22% YoY</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Partner Hotels Onboarded</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {PLATFORM_ADMIN_DATA.totalHotelsCount} <span className="text-sm font-normal text-slate-400">properties</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Worldwide luxury network</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Active Guest Accounts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {PLATFORM_ADMIN_DATA.totalActiveGuests.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-400 mt-1 block">94% KYC Verified</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-bold tracking-wider">Total Wallet Circulation</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">
            {PLATFORM_ADMIN_DATA.totalWalletCirculation}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Zero-interchange float</span>
        </div>

      </div>

      {/* Main Grid: Controls & AML Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Platform Fee & Cashback Parameters (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            Platform Fee & Smart Contract Incentive Rules
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Platform Commission Take Rate:</span>
                <span className="font-bold text-purple-400">{commissionRate}%</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.5"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Standard OTA fee is 15-25%. Hotel FinTech operates at a super-lean {commissionRate}%.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Monthly Loyalty Cashback Reserve:</span>
                <span className="font-bold text-emerald-400">₹{cashbackBudget.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="25000"
                value={cashbackBudget}
                onChange={(e) => setCashbackBudget(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Budget allocated for instant 3%-6% guest wallet cashbacks on completed stays.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-md shadow-purple-600/20"
            >
              Update Global Parameters
            </button>
          </form>
        </div>

        {/* Security, AML & Fraud Monitor (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Automated AML & Risk Screening
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {PLATFORM_ADMIN_DATA.fraudRiskScore}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-200 block">Smart Contract Core Uptime</span>
                <span className="text-slate-400">Consensus nodes across 3 cloud regions</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">{systemUptime}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-200 block">3D Secure 2.2 Biometric Pass Rate</span>
                <span className="text-slate-400">Card payment friction-free tokenization</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">99.8%</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-200 block">Instant Escrow Resolution Rate</span>
                <span className="text-slate-400">Zero disputes escalated to human arbiters</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">100%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Audit Logs */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Real-Time Platform Audit & Event Stream
        </h3>

        <div className="space-y-2.5">
          {PLATFORM_ADMIN_DATA.auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">{log.event}</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap ml-4">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

