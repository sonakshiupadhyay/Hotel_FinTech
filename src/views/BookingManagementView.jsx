import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  Search,
  Filter,
  UserCheck,
  LogOut,
  RotateCcw,
  FileText,
  Key,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const BookingManagementView = () => {
  const {
    bookings,
    formatCurrency,
    checkInBooking,
    checkOutBooking,
    requestRefund,
    setSelectedReceipt,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of travel schedule');

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesGuest = b.guestName?.toLowerCase().includes(q);
        const matchesId = b.id?.toLowerCase().includes(q);
        const matchesRoom = b.roomName?.toLowerCase().includes(q);
        if (!matchesGuest && !matchesId && !matchesRoom) return false;
      }
      if (statusFilter !== 'All') {
        if (statusFilter === 'Active' && b.bookingStatus !== 'Confirmed' && b.bookingStatus !== 'Checked-In') return false;
        if (statusFilter === 'Checked-In' && b.bookingStatus !== 'Checked-In') return false;
        if (statusFilter === 'Completed' && b.bookingStatus !== 'Checked-Out') return false;
        if (statusFilter === 'Cancelled' && b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Refund Requested') return false;
      }
      return true;
    });
  }, [bookings, searchQuery, statusFilter]);

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    if (!selectedBookingForCancel) return;
    requestRefund(selectedBookingForCancel.id, cancelReason);
    setSelectedBookingForCancel(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Checked-In':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Checked-Out':
        return 'bg-slate-700/50 text-slate-300 border-slate-600/40';
      case 'Refund Requested':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Cancelled':
      case 'Refunded':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Operational Control</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Booking Management
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Monitor front-desk reservations, issue digital smart keys, process check-ins/check-outs, and review instant refund eligibility.
        </p>
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
              placeholder="Search by guest name, reservation reference, or suite..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['All', 'Active', 'Checked-In', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all ${
                  statusFilter === tab
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Guest Information</th>
                <th className="py-3.5 px-4">Reserved Suite</th>
                <th className="py-3.5 px-4">Stay Dates</th>
                <th className="py-3.5 px-4 text-right">Settled Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Ref */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white">{b.id}</div>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Guest */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-200">{b.guestName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{b.guestEmail}</div>
                      <div className="text-[10px] text-slate-500">{b.guestPhone}</div>
                    </td>

                    {/* Suite */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{b.roomName}</div>
                      <div className="text-[10px] text-slate-400">
                        {b.guestsCount} Guests • {formatCurrency(b.pricePerNight)} / night
                      </div>
                    </td>

                    {/* Stay Dates */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-200">{b.checkIn} → {b.checkOut}</div>
                      <div className="text-[10px] text-emerald-400">{b.nights} Nights</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="font-mono font-bold text-white text-sm">
                        {formatCurrency(b.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[130px] ml-auto">
                        {b.paymentMethod}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(b.bookingStatus)}`}>
                        {b.bookingStatus}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Check-In Action */}
                        {b.bookingStatus === 'Confirmed' && (
                          <button
                            onClick={() => checkInBooking(b.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-[11px] font-bold transition-colors flex items-center gap-1"
                            title="Check-in guest and grant digital key"
                          >
                            <Key className="w-3 h-3" />
                            Check-In
                          </button>
                        )}

                        {/* Check-Out Action */}
                        {b.bookingStatus === 'Checked-In' && (
                          <button
                            onClick={() => checkOutBooking(b.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-slate-950 text-[11px] font-bold transition-colors flex items-center gap-1"
                            title="Check-out guest and finalize ledger"
                          >
                            <LogOut className="w-3 h-3" />
                            Check-Out
                          </button>
                        )}

                        {/* Request Refund Action */}
                        {b.bookingStatus === 'Confirmed' && (
                          <button
                            onClick={() => setSelectedBookingForCancel(b)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-colors"
                            title="Cancel booking and request refund"
                          >
                            Cancel / Refund
                          </button>
                        )}

                        {/* View Receipt */}
                        <button
                          onClick={() => setSelectedReceipt(b)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Print official voucher"
                        >
                          <FileText className="w-4 h-4 text-emerald-400" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancellation / Refund Request Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              Cancel Booking & Request Refund
            </h3>
            
            <p className="text-xs text-slate-300">
              You are requesting a refund for reservation <strong className="text-white font-mono">{selectedBookingForCancel.id}</strong> ({selectedBookingForCancel.roomName}) in the amount of <strong className="text-emerald-400">{formatCurrency(selectedBookingForCancel.totalAmount)}</strong>.
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Change of travel schedule">Change of travel schedule</option>
                  <option value="Flight delay / cancellation">Flight delay / airline cancellation</option>
                  <option value="Medical / emergency situation">Medical / family emergency</option>
                  <option value="Found alternative accommodation">Found alternative accommodation</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                ✅ Eligible for 100% full refund credited immediately to your FinTech Wallet upon approval.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForCancel(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Keep Reservation
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold shadow-md"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

