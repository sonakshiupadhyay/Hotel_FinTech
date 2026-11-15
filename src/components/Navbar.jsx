import React, { useState } from 'react';
import { useApp, CURRENCIES } from '../context/AppContext';
import {
  Building2,
  Wallet,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  History,
  TrendingUp,
  ShieldCheck,
  User,
  Plus,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Coins
} from 'lucide-react';

export const Navbar = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    switchRole,
    currency,
    setCurrency,
    formatCurrency,
    user,
    setIsTopUpModalOpen,
    setIsAuthModalOpen
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'booking', label: 'Book Room', icon: CalendarCheck },
    { id: 'wallet', label: 'Digital Wallet', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'revenue', label: 'Revenue & Earnings', icon: TrendingUp },
    { id: 'bookings-mgmt', label: 'Booking Mgmt', icon: Building2 },
    { id: 'refunds-mgmt', label: 'Refunds', icon: RotateCcw },
    { id: 'owner', label: 'Hotel Owner', icon: Building2 },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
                <Building2 className="w-5 h-5 text-slate-950 font-black stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  hotel <span className="text-emerald-400">FinTech</span>
                </span>
                <span className="hidden md:inline-flex px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Ecosystem
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-slate-400 font-medium">Hospitality & Financial Infrastructure</p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-emerald-400 transition-colors"
              >
                <span>{CURRENCIES[currency]?.symbol} {currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {currencyMenuOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-28 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setCurrencyMenuOpen(false)}
                >
                  {Object.keys(CURRENCIES).map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        setCurrency(cur);
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-slate-800 ${
                        currency === cur ? 'text-emerald-400 font-bold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <span>{cur}</span>
                      <span className="text-slate-500">{CURRENCIES[cur].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FinTech Digital Wallet Balance Pill */}
            <div className="flex items-center bg-slate-900/90 border border-emerald-500/30 rounded-xl p-1 shadow-sm hover:border-emerald-500/60 transition-all">
              <button
                onClick={() => setActiveTab('wallet')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-left"
                title="View Digital Wallet"
              >
                <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium leading-none">Wallet</div>
                  <div className="font-bold text-white text-xs leading-tight">
                    {formatCurrency(user.wallet.balance)}
                  </div>
                </div>
              </button>
              <button
                onClick={() => setIsTopUpModalOpen(true)}
                className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 transition-colors"
                title="Top-Up Wallet"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Persona / Role Quick Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="capitalize">{currentRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Switch Active Persona
                  </div>
                  <button
                    onClick={() => {
                      switchRole('customer');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      currentRole === 'customer' ? 'text-emerald-400 font-bold bg-slate-800/40' : 'text-slate-300'
                    }`}
                  >
                    <span>Guest / Customer</span>
                    <span className="text-[10px] font-normal text-slate-500">Alice Vance</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('owner');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      currentRole === 'owner' ? 'text-blue-400 font-bold bg-slate-800/40' : 'text-slate-300'
                    }`}
                  >
                    <span>Hotel Owner</span>
                    <span className="text-[10px] font-normal text-slate-500">Marcus Sterling</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      currentRole === 'admin' ? 'text-purple-400 font-bold bg-slate-800/40' : 'text-slate-300'
                    }`}
                  >
                    <span>Platform Admin</span>
                    <span className="text-[10px] font-normal text-slate-500">Super Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile / Auth Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-lg object-cover ring-1 ring-emerald-500/50"
              />
              <span className="hidden sm:inline-block max-w-[90px] truncate">{user.name}</span>
            </button>

          </div>
        </div>

        {/* Sub-Navigation Bar (Horizontal Tabs for all requested features) */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

