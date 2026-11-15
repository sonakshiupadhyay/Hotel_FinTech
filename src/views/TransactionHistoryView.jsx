import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Search,
  Filter,
  Download,
  Printer,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';

export const TransactionHistoryView = () => {
  const { transactions, formatCurrency, setSelectedReceipt, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = txn.description?.toLowerCase().includes(q);
        const matchesRef = txn.reference?.toLowerCase().includes(q);
        const matchesId = txn.id?.toLowerCase().includes(q);
        if (!matchesDesc && !matchesRef && !matchesId) return false;
      }
      if (typeFilter !== 'All') {
        if (typeFilter === 'Bookings' && !txn.type.includes('Booking')) return false;
        if (typeFilter === 'Top-ups' && !txn.type.includes('Top-up')) return false;
        if (typeFilter === 'Cashback' && !txn.type.includes('Cashback')) return false;
        if (typeFilter === 'Refunds' && !txn.type.includes('Refund')) return false;
      }
      if (statusFilter !== 'All' && txn.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter]);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Type', 'Description', 'Amount', 'Date', 'Method', 'Status', 'Reference'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.type,
      `"${t.description}"`,
      t.amount,
      `"${t.date}"`,
      `"${t.method}"`,
      t.status,
      t.reference
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hotel_fintech_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('CSV Exported', 'Transaction history exported to CSV file successfully.', 'success');
  };

  // Stats calculation
  const totalDebits = transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const totalCredits = transactions.filter((t) => t.amount > 0 && t.type !== 'Cashback Credit').reduce((acc, t) => acc + t.amount, 0);
  const totalCashback = transactions.filter((t) => t.type === 'Cashback Credit').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <History className="w-3.5 h-3.5" />
            <span>Immutable Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time auditable ledger of all room bookings, wallet top-ups, instant cashback payouts, and refunds.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          Export CSV Ledger
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <span className="text-xs uppercase font-bold text-slate-400">Total Hospitality Spend</span>
          <div className="text-2xl font-black text-white mt-1">
            {formatCurrency(totalDebits)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Settled via FinTech rails</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <span className="text-xs uppercase font-bold text-slate-400">Total Wallet Deposits</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(totalCredits)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">ACH & card funding</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <span className="text-xs uppercase font-bold text-slate-400">Total Cashback Earned</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatCurrency(totalCashback)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Automated loyalty rewards</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by transaction reference, room description, or ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['All', 'Bookings', 'Top-ups', 'Cashback', 'Refunds'].map((category) => (
              <button
                key={category}
                onClick={() => setTypeFilter(category)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  typeFilter === category
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Transaction / Ref</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Category & Rail</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No transactions match your current search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const isPositive = txn.amount > 0;
                  return (
                    <tr
                      key={txn.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => txn.receiptAvailable && setSelectedReceipt(txn)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {txn.id}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Ref: {txn.reference}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-200 max-w-xs truncate">
                        {txn.description}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-300 block">{txn.type}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{txn.method}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {txn.date}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-mono font-black text-sm ${
                            isPositive ? 'text-emerald-400' : 'text-slate-100'
                          }`}
                        >
                          {isPositive ? '+' : ''}{formatCurrency(txn.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {txn.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {txn.receiptAvailable ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReceipt(txn);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View receipt"
                          >
                            <FileText className="w-4 h-4 text-emerald-400" />
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

