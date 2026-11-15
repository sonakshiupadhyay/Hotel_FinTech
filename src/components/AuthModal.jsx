import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, Shield, KeyRound, Check, Sparkles, Building2, UserCheck } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, switchRole, user, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleDemoLogin = (role) => {
    switchRole(role);
    setIsAuthModalOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'signup') {
      addToast('Account Created!', `Welcome to Hotel FinTech, ${fullName || 'Guest'}! Initial wallet created with ₹5,000 welcome credit.`, 'success');
    } else {
      addToast('Signed In', `Welcome back, ${email || 'Guest'}!`, 'success');
    }
    setIsAuthModalOpen(false);
  };

  const handleBiometricSimulation = () => {
    setIsBiometricLoading(true);
    setTimeout(() => {
      setIsBiometricLoading(false);
      switchRole('customer');
      setIsAuthModalOpen(false);
      addToast('Biometric 2FA Verified', 'FaceID / TouchID authenticated successfully.', 'success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {authMode === 'signin' ? 'Sign In to Hotel FinTech' : 'Create FinTech Hospitality Account'}
              </h3>
              <p className="text-xs text-slate-400">Encrypted single sign-on & wallet access</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Logins Banner */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Demo Profiles (Instant Access)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('customer')}
              className="flex flex-col items-start p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-all text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Guest / Traveler
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5">Alice Vance</span>
              <span className="text-[10px] text-emerald-400/80 font-mono mt-0.5">₹1,45,000 Wallet</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('owner')}
              className="flex flex-col items-start p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-blue-500/10 hover:border-blue-500/60 transition-all text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Hotel Owner
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5">Marcus Sterling</span>
              <span className="text-[10px] text-blue-400/80 font-mono mt-0.5">₹34.8L Payout Desk</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="flex flex-col items-start p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-purple-500/10 hover:border-purple-500/60 transition-all text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                Platform Admin
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5">Super Admin</span>
              <span className="text-[10px] text-purple-400/80 font-mono mt-0.5">Gov & AML</span>
            </button>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors ${
              authMode === 'signin'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Sign In with Email
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors ${
              authMode === 'signup'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Alice Vance"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Password</label>
              {authMode === 'signin' && (
                <a href="#forgot" onClick={(e) => { e.preventDefault(); addToast('Password Reset', 'Password reset instructions sent to your email.', 'info'); }} className="text-[11px] text-emerald-400 hover:underline">
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          {/* Biometric 2FA Shortcut button */}
          <button
            type="button"
            onClick={handleBiometricSimulation}
            disabled={isBiometricLoading}
            className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            {isBiometricLoading ? 'Verifying Biometrics...' : 'Sign in with Passkey / Face ID'}
          </button>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all mt-2"
          >
            {authMode === 'signin' ? 'Sign In' : 'Complete Registration & Open Wallet'}
          </button>
        </form>

      </div>
    </div>
  );
};

