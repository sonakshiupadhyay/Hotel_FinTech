import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Lock,
  Wallet,
  CreditCard,
  QrCode,
  Coins,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Printer,
  ChevronRight,
  Tag
} from 'lucide-react';

export const PaymentInterfaceView = () => {
  const {
    selectedRoomForBooking,
    setSelectedRoomForBooking,
    rooms,
    bookingDraft,
    setBookingDraft,
    user,
    formatCurrency,
    completeBooking,
    recentCompletedBooking,
    setRecentCompletedBooking,
    setSelectedReceipt,
    setActiveTab,
    setIsTopUpModalOpen,
    addToast
  } = useApp();

  // If no room is active, default to the first room
  const room = selectedRoomForBooking || rooms[0];

  const [paymentMethod, setPaymentMethod] = useState('FinTech Digital Wallet');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Credit Card Form fields
  const [cardData, setCardData] = useState({
    name: user.wallet.virtualCard.cardHolder,
    number: user.wallet.virtualCard.fullNumber,
    expiry: user.wallet.virtualCard.expiry,
    cvv: user.wallet.virtualCard.cvv
  });

  // Calculate pricing
  const nights = bookingDraft.nights || 3;
  const subtotal = room.pricePerNight * nights;
  const taxes = Math.round(subtotal * 0.10);
  const finalTotal = Math.max(0, subtotal + taxes - promoDiscount);
  const cashbackEarned = Number(((finalTotal * room.cashbackPercentage) / 100).toFixed(2));
  const hasEnoughWalletBalance = user.wallet.balance >= finalTotal;

  // Apply promo code
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'FINTECHVIP') {
      setPromoDiscount(5000);
      addToast('VIP Promo Applied', '₹5,000 deducted from your stay total.', 'success');
    } else if (code === 'WELCOME10') {
      const discount = Math.round(subtotal * 0.10);
      setPromoDiscount(discount);
      addToast('Welcome 10% Applied', `${formatCurrency(discount)} deducted from total!`, 'success');
    } else {
      addToast('Invalid Promo Code', 'Try "FINTECHVIP" or "WELCOME10"', 'warning');
    }
  };

  // Trigger booking execution
  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const result = completeBooking({
        paymentMethod,
        specialRequests,
        promoDiscount
      });

      setIsProcessing(false);

      if (result) {
        // Fire confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas-confetti is not loaded
        }
      }
    }, 1200);
  };

  // If a booking was just completed, show the success confirmation state
  if (recentCompletedBooking) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Payment & Settlement Successful
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Reservation Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Booking Ref: <strong className="text-white font-mono">{recentCompletedBooking.id}</strong> • Sent to {recentCompletedBooking.guestEmail}
            </p>
          </div>

          {/* Cashback banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-left">
            <div>
              <span className="text-xs text-slate-300 block">Instant FinTech Cashback Credited</span>
              <span className="text-lg font-bold text-emerald-400">
                +{formatCurrency(recentCompletedBooking.cashbackAwarded)}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              In Your Wallet Now
            </span>
          </div>

          {/* Summary Details */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Reserved Residence:</span>
              <span className="font-bold text-white">{recentCompletedBooking.roomName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Check-In / Out:</span>
              <span className="text-slate-200">{recentCompletedBooking.checkIn} to {recentCompletedBooking.checkOut} ({recentCompletedBooking.nights} nights)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Paid With:</span>
              <span className="text-emerald-400 font-semibold">{recentCompletedBooking.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
              <span className="text-slate-300">Total Settled:</span>
              <span className="text-white text-sm">{formatCurrency(recentCompletedBooking.totalAmount)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setSelectedReceipt(recentCompletedBooking)}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              View & Print Invoice
            </button>
            <button
              onClick={() => {
                setRecentCompletedBooking(null);
                setActiveTab('bookings-mgmt');
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              Manage Booking
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit Encrypted FinTech Gateway</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Online Payment Interface
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Complete your checkout via native FinTech Digital Wallet for instant rewards, zero-fee debit/credit rails, or decentralized USDC escrow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Payment Rail Selector & Form (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Payment Method Selector Tabs */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option A: Digital Wallet */}
              <button
                type="button"
                onClick={() => setPaymentMethod('FinTech Digital Wallet')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  paymentMethod === 'FinTech Digital Wallet'
                    ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-300">
                    5% Cashback
                  </span>
                </div>
                <div className="text-xs font-bold text-white">FinTech Digital Wallet</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Bal: <strong className="text-emerald-400">{formatCurrency(user.wallet.balance)}</strong>
                </div>
              </button>

              {/* Option B: Credit / Debit Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('RuPay / Credit / Debit Card')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === 'RuPay / Credit / Debit Card'
                    ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-400">Zero Fee</span>
                </div>
                <div className="text-xs font-bold text-white">RuPay / Debit / Cards</div>
                <div className="text-[11px] text-slate-400 mt-0.5">RuPay, Visa, Mastercard</div>
              </button>

              {/* Option C: Dynamic QR / UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Dynamic QR / UPI')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === 'Dynamic QR / UPI'
                    ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-400">Scan & Pay</span>
                </div>
                <div className="text-xs font-bold text-white">UPI QR (GPay/PhonePe)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Paytm, BHIM, CRED UPI</div>
              </button>

              {/* Option D: Crypto Escrow */}
              <button
                type="button"
                onClick={() => setPaymentMethod('USDC Crypto Escrow')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === 'USDC Crypto Escrow'
                    ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Coins className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-400">Smart Escrow</span>
                </div>
                <div className="text-xs font-bold text-white">USDC / Crypto Escrow</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Solana / Base / Ethereum</div>
              </button>

            </div>

            {/* Sub-form based on selection */}
            <div className="pt-4 border-t border-slate-800">
              
              {/* If Wallet Selected */}
              {paymentMethod === 'FinTech Digital Wallet' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Available Wallet Balance</span>
                      <span className="text-xl font-black text-white">{formatCurrency(user.wallet.balance)}</span>
                    </div>
                    {!hasEnoughWalletBalance && (
                      <button
                        onClick={() => setIsTopUpModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                      >
                        + Top Up Now
                      </button>
                    )}
                  </div>

                  {!hasEnoughWalletBalance ? (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>
                        Your balance is short by {formatCurrency(finalTotal - user.wallet.balance)}. Please top up to proceed with 1-click checkout.
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>
                        Sufficient funds verified. 1-Click biometric settlement ready.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* If Card Selected */}
              {paymentMethod === 'Credit / Debit Card' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white uppercase focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength="4"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* If QR Code Selected */}
              {paymentMethod === 'Dynamic QR / UPI' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white">Scan with any FinTech UPI or Banking App</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Dynamic invoice: HFT-{Math.floor(1000 + Math.random() * 9000)} • Expires in 09:42</p>
                  </div>
                </div>
              )}

              {/* If Crypto Escrow Selected */}
              {paymentMethod === 'USDC Crypto Escrow' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Smart Contract:</span>
                    <span className="font-mono text-emerald-400">0x742d...44e8 (HotelFinTechEscrow.sol)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Network:</span>
                    <span className="font-semibold text-white">Base / Arbitrum / Solana USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Escrow Release Condition:</span>
                    <span className="text-slate-300">Front Desk Check-in / Smart Key Generated</span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Guest Preferences / Special Requests */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-3">
            <h4 className="text-sm font-bold text-white">Special Requests & Airport Transfers</h4>
            <textarea
              rows="2"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Quiet high floor, complimentary airport Tesla pickup at 2:30 PM, late check-out..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

        </div>

        {/* Right Column: Order Summary & Pay Action (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-5 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Reservation Summary
            </h3>

            {/* Room snapshot */}
            <div className="flex gap-3">
              <img
                src={room.images[0]}
                alt={room.name}
                className="w-20 h-20 rounded-xl object-cover ring-1 ring-white/10"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400">{room.category}</span>
                <h4 className="text-sm font-bold text-white truncate">{room.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {nights} Nights • {bookingDraft.guests} Guests
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {bookingDraft.checkIn} to {bookingDraft.checkOut}
                </p>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo (try FINTECHVIP)"
                  className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white uppercase focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                Apply
              </button>
            </form>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between text-slate-400">
                <span>{formatCurrency(room.pricePerNight)} x {nights} nights:</span>
                <span className="text-slate-200 font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>State & Tourism Taxes (10%):</span>
                <span className="text-slate-200 font-medium">{formatCurrency(taxes)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Promo Code Discount:</span>
                  <span>-{formatCurrency(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-500/10 p-2 rounded-lg">
                <span>FinTech Wallet Cashback (Earned):</span>
                <span>+{formatCurrency(cashbackEarned)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total Settled:</span>
                <span className="text-emerald-400">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Pay Now Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing || (paymentMethod === 'FinTech Digital Wallet' && !hasEnoughWalletBalance)}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Processing Escrow Settlement...
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Authorize & Settle {formatCurrency(finalTotal)}
                </>
              )}
            </button>

            {/* Security Guarantee */}
            <div className="text-center text-[10px] text-slate-400 space-y-1">
              <p>🔒 256-bit TLS Encryption • Automated Escrow Refund Guarantee</p>
              <p>Free cancellation up to {room.freeCancellationHours} hours before check-in.</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

