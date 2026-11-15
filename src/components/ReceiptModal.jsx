import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode, Building2 } from 'lucide-react';

export const ReceiptModal = () => {
  const { selectedReceipt, setSelectedReceipt, formatCurrency } = useApp();

  if (!selectedReceipt) return null;

  const isBooking = !!selectedReceipt.roomId || !!selectedReceipt.nights;
  const receiptTitle = isBooking ? 'Official Booking Voucher & Tax Invoice' : 'FinTech Transaction Receipt';
  const referenceId = selectedReceipt.id || selectedReceipt.reference;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 print:m-0 print:border-none print:shadow-none">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-300">
              Verified FinTech Settlement Ledger
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              Print / Save PDF
            </button>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-8 text-slate-200 bg-slate-900 print:bg-white print:text-black">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800 print:border-gray-300 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
                <Building2 className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white print:text-black">
                  Hotel FinTech
                </h2>
                <p className="text-xs text-emerald-400 font-medium">Grand Luxury & Next-Gen Banking</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Settled & Verified
              </span>
              <p className="text-xs font-mono text-slate-400 print:text-gray-600 mt-1.5">
                Ref: <span className="font-semibold text-slate-200 print:text-black">{referenceId}</span>
              </p>
            </div>
          </div>

          {/* Subheader info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-800 print:border-gray-200 text-xs">
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Issue Date</span>
              <span className="font-semibold text-slate-200 print:text-black mt-0.5 block">
                {selectedReceipt.createdAt
                  ? new Date(selectedReceipt.createdAt).toLocaleDateString()
                  : selectedReceipt.date || 'Today'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Guest / Billed To</span>
              <span className="font-semibold text-slate-200 print:text-black mt-0.5 block truncate">
                {selectedReceipt.guestName || 'Alice Vance'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Payment Rail</span>
              <span className="font-semibold text-emerald-400 print:text-black mt-0.5 block truncate">
                {selectedReceipt.paymentMethod || selectedReceipt.method || 'FinTech Digital Wallet'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Settlement Status</span>
              <span className="font-semibold text-emerald-400 print:text-black mt-0.5 block">
                {selectedReceipt.paymentStatus || selectedReceipt.status || 'Paid'}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="py-6 border-b border-slate-800 print:border-gray-200">
            <h3 className="text-sm font-semibold text-white print:text-black mb-3">
              {isBooking ? 'Reservation Details' : 'Transaction Summary'}
            </h3>
            <div className="bg-slate-800/40 print:bg-gray-50 rounded-xl p-4 border border-slate-700/50 print:border-gray-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300 print:text-gray-700 font-medium">
                  {selectedReceipt.roomName || selectedReceipt.description || 'Hotel Accommodation'}
                </span>
                <span className="font-bold text-white print:text-black">
                  {formatCurrency(Math.abs(selectedReceipt.totalAmount || selectedReceipt.amount))}
                </span>
              </div>
              {isBooking && (
                <>
                  <div className="flex justify-between text-xs text-slate-400 print:text-gray-600">
                    <span>Stay Duration:</span>
                    <span>{selectedReceipt.checkIn} to {selectedReceipt.checkOut} ({selectedReceipt.nights} Nights)</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 print:text-gray-600">
                    <span>Occupancy / Guests:</span>
                    <span>{selectedReceipt.guestsCount || 2} Guests</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 print:text-gray-600">
                    <span>Nightly Rate:</span>
                    <span>{formatCurrency(selectedReceipt.pricePerNight)} / night</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 print:text-gray-600">
                    <span>State & Tourism Taxes (10%):</span>
                    <span>{formatCurrency(selectedReceipt.taxesAndFees || 0)}</span>
                  </div>
                  {selectedReceipt.cashbackAwarded > 0 && (
                    <div className="flex justify-between text-xs text-emerald-400 font-medium pt-1 border-t border-slate-700/40">
                      <span>FinTech Instant Cashback Credited:</span>
                      <span>+{formatCurrency(selectedReceipt.cashbackAwarded)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* QR Code and Verification footer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-slate-950 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div className="text-xs">
                <p className="font-medium text-slate-300 print:text-gray-800">Fast Front-Desk Keypass</p>
                <p className="text-slate-500 print:text-gray-500">Scan at hotel kiosk for instant key card</p>
                <p className="font-mono text-[10px] text-slate-500">HASH: 0x89b...3fa7</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 print:text-gray-600 block">Total Settled Amount</span>
              <span className="text-2xl font-extrabold text-emerald-400 print:text-black">
                {formatCurrency(Math.abs(selectedReceipt.totalAmount || selectedReceipt.amount))}
              </span>
            </div>
          </div>

          {/* Legal / Policy note */}
          <div className="mt-8 pt-4 border-t border-slate-800 print:border-gray-200 text-center text-[11px] text-slate-500 print:text-gray-500">
            Hotel FinTech Grand Resort • 88 BKC Financial Hub, Bandra Kurla Complex, Mumbai, Maharashtra 400051 • GSTIN: 27AABCH2026M1Z8 • Inquiries: support@hotelfintech.in
          </div>
        </div>

      </div>
    </div>
  );
};

