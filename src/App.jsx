import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastNotification } from './components/ToastNotification';
import { ReceiptModal } from './components/ReceiptModal';
import { TopUpModal } from './components/TopUpModal';
import { AuthModal } from './components/AuthModal';

import { DashboardView } from './views/DashboardView';
import { BookingSystemView } from './views/BookingSystemView';
import { PaymentInterfaceView } from './views/PaymentInterfaceView';
import { DigitalWalletView } from './views/DigitalWalletView';
import { TransactionHistoryView } from './views/TransactionHistoryView';
import { RevenueDashboardView } from './views/RevenueDashboardView';
import { BookingManagementView } from './views/BookingManagementView';
import { RefundManagementView } from './views/RefundManagementView';
import { HotelOwnerDashboardView } from './views/HotelOwnerDashboardView';
import { AdminPanelView } from './views/AdminPanelView';

import { Building2, ShieldCheck, Heart, Github } from 'lucide-react';

const MainContent = () => {
  const { activeTab, setActiveTab, currentRole, switchRole, setIsAuthModalOpen } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'booking':
        return <BookingSystemView />;
      case 'payment':
        return <PaymentInterfaceView />;
      case 'wallet':
        return <DigitalWalletView />;
      case 'transactions':
        return <TransactionHistoryView />;
      case 'revenue':
        return <RevenueDashboardView />;
      case 'bookings-mgmt':
        return <BookingManagementView />;
      case 'refunds-mgmt':
        return <RefundManagementView />;
      case 'owner':
        return <HotelOwnerDashboardView />;
      case 'admin':
        return <AdminPanelView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveView()}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
                  <Building2 className="w-4 h-4 text-slate-950" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">
                  hotel <span className="text-emerald-400">FinTech</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The next-generation convergence of luxury hospitality accommodation, decentralized escrow, digital wallets, and zero-fee financial clearing.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Guest Experience</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400 transition-colors">Modern Dashboard</button></li>
                <li><button onClick={() => setActiveTab('booking')} className="hover:text-emerald-400 transition-colors">Hotel Booking System</button></li>
                <li><button onClick={() => setActiveTab('payment')} className="hover:text-emerald-400 transition-colors">Online Payment Interface</button></li>
                <li><button onClick={() => setActiveTab('wallet')} className="hover:text-emerald-400 transition-colors">Digital Wallet & Card</button></li>
                <li><button onClick={() => setActiveTab('transactions')} className="hover:text-emerald-400 transition-colors">Transaction History</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Host & Operations</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => { switchRole('owner'); setActiveTab('owner'); }} className="hover:text-emerald-400 transition-colors">Hotel Owner Dashboard</button></li>
                <li><button onClick={() => setActiveTab('bookings-mgmt')} className="hover:text-emerald-400 transition-colors">Booking Management</button></li>
                <li><button onClick={() => setActiveTab('refunds-mgmt')} className="hover:text-emerald-400 transition-colors">Refund Management</button></li>
                <li><button onClick={() => setActiveTab('revenue')} className="hover:text-emerald-400 transition-colors">Revenue & Earnings Dashboard</button></li>
                <li><button onClick={() => { switchRole('admin'); setActiveTab('admin'); }} className="hover:text-emerald-400 transition-colors">Admin Governance Panel</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Security & Rails</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>256-Bit Encrypted Ledger Rail</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Compliant with PCI-DSS Level 1, ISO/IEC 27001 standards, and instant FedNow clearing.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
                >
                  Customer Login / Signup
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div>© {new Date().getFullYear()} hotel FinTech • All Rights Reserved.</div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Escrow</span>
              <span>•</span>
              <span>AML Compliance</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals & Toasts */}
      <ToastNotification />
      <ReceiptModal />
      <TopUpModal />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;

