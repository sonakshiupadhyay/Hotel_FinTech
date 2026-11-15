import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ROOMS,
  INITIAL_USER,
  INITIAL_BOOKINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_REFUND_REQUESTS,
  HOTEL_FINANCIALS,
  OWNER_PROPERTY_INFO,
  PLATFORM_ADMIN_DATA
} from '../data/mockData';

const AppContext = createContext();

export const CURRENCIES = {
  INR: { symbol: '₹', rate: 1.0, code: 'INR', locale: 'en-IN', name: 'Indian Rupee (INR)' },
  USD: { symbol: '$', rate: 0.012, code: 'USD', locale: 'en-US', name: 'US Dollar (USD)' },
  EUR: { symbol: '€', rate: 0.011, code: 'EUR', locale: 'de-DE', name: 'Euro (EUR)' },
  GBP: { symbol: '£', rate: 0.0095, code: 'GBP', locale: 'en-GB', name: 'British Pound (GBP)' },
};

export const AppProvider = ({ children }) => {
  // Global Navigation & Role
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('customer'); // 'customer' | 'owner' | 'admin'
  const [currency, setCurrency] = useState('INR'); // Default to Indian Rupee

  // Core Data States (Using hft_inr_ keys for clean state initialization in Indian Money)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hft_inr_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('hft_inr_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('hft_inr_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('hft_inr_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [refundRequests, setRefundRequests] = useState(() => {
    const saved = localStorage.getItem('hft_inr_refunds');
    return saved ? JSON.parse(saved) : INITIAL_REFUND_REQUESTS;
  });

  const [ownerInfo, setOwnerInfo] = useState(() => {
    const saved = localStorage.getItem('hft_inr_owner');
    return saved ? JSON.parse(saved) : OWNER_PROPERTY_INFO;
  });

  // UI Modals & Notifications
  const [toasts, setToasts] = useState([]);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Booking Flow Draft State
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [bookingDraft, setBookingDraft] = useState({
    checkIn: '2026-11-20',
    checkOut: '2026-11-23',
    guests: 2,
    nights: 3,
    promoCode: '',
    promoDiscount: 0,
    specialRequests: ''
  });
  const [recentCompletedBooking, setRecentCompletedBooking] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('hft_inr_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('hft_inr_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('hft_inr_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('hft_inr_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('hft_inr_refunds', JSON.stringify(refundRequests));
  }, [refundRequests]);

  useEffect(() => {
    localStorage.setItem('hft_inr_owner', JSON.stringify(ownerInfo));
  }, [ownerInfo]);

  // Toast System
  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, title, message, type };
    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Indian Rupee & Multi-Currency Formatter with en-IN formatting
  const formatCurrency = (amountInINR) => {
    const cur = CURRENCIES[currency] || CURRENCIES.INR;
    const converted = amountInINR * cur.rate;
    return `${cur.symbol}${converted.toLocaleString(cur.locale || 'en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Role Switching Helper
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'customer') {
      setUser((prev) => ({
        ...prev,
        name: 'Alice Vance',
        email: 'alice.vance@fintech-ventures.in',
        role: 'customer'
      }));
      setActiveTab('dashboard');
      addToast('Role Switched', 'Viewing platform as Guest / Customer (Alice Vance)', 'info');
    } else if (newRole === 'owner') {
      setUser((prev) => ({
        ...prev,
        name: 'Marcus Sterling',
        email: 'owner@hotelfintech.com',
        role: 'owner'
      }));
      setActiveTab('owner');
      addToast('Role Switched', 'Switched to Hotel Owner Dashboard (Marcus Sterling)', 'info');
    } else if (newRole === 'admin') {
      setUser((prev) => ({
        ...prev,
        name: 'Devin Vance (Super Admin)',
        email: 'admin@hotelfintech.internal',
        role: 'admin'
      }));
      setActiveTab('admin');
      addToast('Role Switched', 'Switched to Platform Admin Control Panel', 'info');
    }
  };

  // Start Booking Flow
  const startBooking = (room, draftParams = {}) => {
    setSelectedRoomForBooking(room);
    if (draftParams.checkIn && draftParams.checkOut) {
      const d1 = new Date(draftParams.checkIn);
      const d2 = new Date(draftParams.checkOut);
      const diffDays = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
      setBookingDraft((prev) => ({
        ...prev,
        ...draftParams,
        nights: diffDays
      }));
    }
    setActiveTab('payment');
  };

  // Complete Booking (Payment Processed)
  const completeBooking = ({ paymentMethod, specialRequests = '', promoDiscount = 0 }) => {
    if (!selectedRoomForBooking) return null;

    const nights = bookingDraft.nights || 3;
    const subtotal = selectedRoomForBooking.pricePerNight * nights;
    const taxes = Math.round(subtotal * 0.10);
    const finalTotal = Math.max(0, subtotal + taxes - promoDiscount);

    // If paying by FinTech Wallet, check balance
    if (paymentMethod.includes('Wallet') && user.wallet.balance < finalTotal) {
      addToast('Insufficient Wallet Balance', `Your wallet balance is ₹${user.wallet.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}, but total is ₹${finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}. Please Top-Up first.`, 'error');
      setIsTopUpModalOpen(true);
      return false;
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `HFT-${randomSuffix}`;
    const cashbackAmount = Number(((finalTotal * (selectedRoomForBooking.cashbackPercentage || 5)) / 100).toFixed(2));

    const newBooking = {
      id: bookingId,
      roomId: selectedRoomForBooking.id,
      roomName: selectedRoomForBooking.name,
      guestName: user.name,
      guestEmail: user.email,
      guestPhone: user.phone || '+91 98201 44890',
      checkIn: bookingDraft.checkIn,
      checkOut: bookingDraft.checkOut,
      nights,
      guestsCount: bookingDraft.guests,
      pricePerNight: selectedRoomForBooking.pricePerNight,
      totalAmount: finalTotal,
      taxesAndFees: taxes,
      discountApplied: promoDiscount,
      paymentMethod,
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
      specialRequests: specialRequests || bookingDraft.specialRequests || 'Standard guest check-in preferences.',
      createdAt: new Date().toISOString(),
      cashbackAwarded: cashbackAmount,
      roomImage: selectedRoomForBooking.images[0]
    };

    // Update Bookings
    setBookings((prev) => [newBooking, ...prev]);

    // Update Wallet Balance & Cashback if FinTech Wallet used or any method qualifies for rewards
    setUser((prevUser) => {
      let newBalance = prevUser.wallet.balance;
      if (paymentMethod.includes('Wallet')) {
        newBalance -= finalTotal;
      }
      // Add cashback directly to wallet
      newBalance += cashbackAmount;

      return {
        ...prevUser,
        wallet: {
          ...prevUser.wallet,
          balance: Number(newBalance.toFixed(2)),
          cashbackEarnedTotal: Number((prevUser.wallet.cashbackEarnedTotal + cashbackAmount).toFixed(2)),
          pointsBalance: prevUser.wallet.pointsBalance + Math.round(finalTotal / 10)
        }
      };
    });

    // Create Payment Transaction Record
    const paymentTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'Booking Payment',
      description: `Hotel FinTech - ${selectedRoomForBooking.name} (${bookingId})`,
      amount: -finalTotal,
      category: 'Hospitality',
      status: 'Completed',
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      timestamp: Date.now(),
      method: paymentMethod,
      reference: bookingId,
      receiptAvailable: true,
      fee: 0.00
    };

    // Create Cashback Transaction Record
    const cashbackTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'Cashback Credit',
      description: `${selectedRoomForBooking.cashbackPercentage}% Instant FinTech Cashback for Booking ${bookingId}`,
      amount: cashbackAmount,
      category: 'Rewards',
      status: 'Completed',
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      timestamp: Date.now() + 1000,
      method: 'Automated Smart Contract',
      reference: `CB-${randomSuffix}`,
      receiptAvailable: false,
      fee: 0.00
    };

    setTransactions((prev) => [cashbackTxn, paymentTxn, ...prev]);

    // Also credit owner settlement ready balance
    setOwnerInfo((prev) => ({
      ...prev,
      settlementReadyBalance: prev.settlementReadyBalance + (finalTotal * 0.95), // 95% after platform fee
      occupiedRooms: Math.min(prev.totalRooms, prev.occupiedRooms + 1),
      availableRooms: Math.max(0, prev.availableRooms - 1)
    }));

    setRecentCompletedBooking(newBooking);
    addToast('Booking Confirmed!', `Booking ${bookingId} has been confirmed. ${formatCurrency(cashbackAmount)} FinTech Cashback instantly credited!`, 'success');
    return newBooking;
  };

  // Top Up Wallet
  const topUpWallet = (amount, paymentSource = 'Instant UPI / Bank Rail') => {
    const parsed = Number(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: Number((prev.wallet.balance + parsed).toFixed(2))
      }
    }));

    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn = {
      id: txnId,
      type: 'Wallet Top-up',
      description: `FinTech Digital Wallet Deposit via ${paymentSource}`,
      amount: parsed,
      category: 'Deposit',
      status: 'Completed',
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      timestamp: Date.now(),
      method: paymentSource,
      reference: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
      receiptAvailable: true,
      fee: 0.00
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setIsTopUpModalOpen(false);
    addToast('Funds Added Successfully', `${formatCurrency(parsed)} has been added to your FinTech Digital Wallet.`, 'success');
  };

  // Transfer Funds
  const transferWalletFunds = (amount, recipient) => {
    const parsed = Number(amount);
    if (isNaN(parsed) || parsed <= 0) return false;
    if (user.wallet.balance < parsed) {
      addToast('Transfer Failed', 'Insufficient funds in your digital wallet.', 'error');
      return false;
    }

    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: Number((prev.wallet.balance - parsed).toFixed(2))
      }
    }));

    const newTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'Wallet Transfer',
      description: `Peer-to-Peer UPI/FinTech Transfer to ${recipient}`,
      amount: -parsed,
      category: 'Transfer',
      status: 'Completed',
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      timestamp: Date.now(),
      method: 'FinTech Instant Rail',
      reference: `TRF-${Math.floor(100000 + Math.random() * 900000)}`,
      receiptAvailable: true,
      fee: 0.00
    };

    setTransactions((prev) => [newTxn, ...prev]);
    addToast('Transfer Completed', `Successfully sent ${formatCurrency(parsed)} to ${recipient}.`, 'success');
    return true;
  };

  // Toggle Virtual Card Freeze
  const toggleCardFreeze = () => {
    setUser((prev) => {
      const willFreeze = !prev.wallet.virtualCard.isFrozen;
      addToast(
        willFreeze ? 'Card Frozen' : 'Card Unfrozen',
        willFreeze
          ? 'Your virtual FinTech RuPay card has been temporarily locked for security.'
          : 'Your virtual FinTech RuPay card is now active for worldwide transactions.',
        willFreeze ? 'warning' : 'success'
      );
      return {
        ...prev,
        wallet: {
          ...prev.wallet,
          virtualCard: {
            ...prev.wallet.virtualCard,
            isFrozen: willFreeze
          }
        }
      };
    });
  };

  // Check In Booking
  const checkInBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'Checked-In' } : b))
    );
    addToast('Guest Checked-In', `Reservation ${bookingId} marked as Checked-In. Digital room key issued.`, 'success');
  };

  // Check Out Booking
  const checkOutBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'Checked-Out' } : b))
    );
    addToast('Guest Checked-Out', `Reservation ${bookingId} has been successfully settled and checked out.`, 'info');
  };

  // Request Refund
  const requestRefund = (bookingId, reason = 'Travel plan changes') => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const refundId = `REF-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRequest = {
      id: refundId,
      bookingId: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      roomName: booking.roomName,
      amount: booking.totalAmount,
      requestedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      reason,
      preferredRefundMethod: 'FinTech Wallet (Instant, Zero Fee)',
      policyCompliance: 'Eligible for 100% Full Refund (>24h notice)',
      status: 'Pending',
      auditTrail: [
        { step: 'Refund Requested by Guest', time: new Date().toLocaleString() },
        { step: 'Smart Policy Verification Passed', time: new Date().toLocaleString() }
      ]
    };

    setRefundRequests((prev) => [newRequest, ...prev]);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, bookingStatus: 'Refund Requested', paymentStatus: 'Refund Pending' }
          : b
      )
    );
    addToast('Refund Request Submitted', `Refund request ${refundId} for ${formatCurrency(booking.totalAmount)} logged in FinTech Refund Center.`, 'info');
  };

  // Approve Refund (Instant Wallet Settlement)
  const approveRefund = (refundId) => {
    const refund = refundRequests.find((r) => r.id === refundId);
    if (!refund) return;

    // Credit back to user wallet
    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: Number((prev.wallet.balance + refund.amount).toFixed(2))
      }
    }));

    // Add refund transaction
    const newTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'Refund',
      description: `Instant FinTech Wallet Refund for Booking #${refund.bookingId}`,
      amount: refund.amount,
      category: 'Refund',
      status: 'Completed',
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      timestamp: Date.now(),
      method: 'FinTech Instant Escrow Release',
      reference: refund.id,
      receiptAvailable: true,
      fee: 0.00
    };

    setTransactions((prev) => [newTxn, ...prev]);

    // Update refund status
    setRefundRequests((prev) =>
      prev.map((r) =>
        r.id === refundId
          ? {
              ...r,
              status: 'Approved',
              auditTrail: [
                ...r.auditTrail,
                { step: 'Hospitality Finance Approved', time: new Date().toLocaleString() },
                { step: 'Instant Wallet Refund Dispatched', time: new Date().toLocaleString() }
              ]
            }
          : r
      )
    );

    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === refund.bookingId
          ? { ...b, bookingStatus: 'Cancelled', paymentStatus: 'Refunded' }
          : b
      )
    );

    // Update owner settlement ready balance
    setOwnerInfo((prev) => ({
      ...prev,
      settlementReadyBalance: Math.max(0, prev.settlementReadyBalance - refund.amount)
    }));

    addToast('Refund Approved & Credited!', `${formatCurrency(refund.amount)} instantly credited back to guest FinTech Wallet.`, 'success');
  };

  // Reject Refund
  const rejectRefund = (refundId, rejectReason = 'Does not meet cancellation policy criteria') => {
    setRefundRequests((prev) =>
      prev.map((r) =>
        r.id === refundId
          ? {
              ...r,
              status: 'Rejected',
              auditTrail: [
                ...r.auditTrail,
                { step: `Rejected by Finance Officer: ${rejectReason}`, time: new Date().toLocaleString() }
              ]
            }
          : r
      )
    );
    addToast('Refund Request Rejected', `Refund ${refundId} marked as rejected.`, 'warning');
  };

  // Hotel Owner Payout Settlement Request
  const ownerSettlePayout = (payoutAmount) => {
    const amount = Number(payoutAmount);
    if (isNaN(amount) || amount <= 0 || amount > ownerInfo.settlementReadyBalance) {
      addToast('Invalid Amount', 'Requested payout exceeds current settlement balance.', 'error');
      return;
    }

    setOwnerInfo((prev) => ({
      ...prev,
      settlementReadyBalance: Number((prev.settlementReadyBalance - amount).toFixed(2))
    }));

    addToast('Payout Dispatched', `${formatCurrency(amount)} initiated via RTGS/IMPS to ${ownerInfo.payoutBank}. Delivery: Instant clearing.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentRole,
        setCurrentRole,
        switchRole,
        currency,
        setCurrency,
        formatCurrency,
        user,
        setUser,
        rooms,
        setRooms,
        bookings,
        setBookings,
        transactions,
        setTransactions,
        refundRequests,
        setRefundRequests,
        ownerInfo,
        setOwnerInfo,
        toasts,
        addToast,
        removeToast,
        isTopUpModalOpen,
        setIsTopUpModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        selectedReceipt,
        setSelectedReceipt,
        selectedRoomForBooking,
        setSelectedRoomForBooking,
        bookingDraft,
        setBookingDraft,
        recentCompletedBooking,
        setRecentCompletedBooking,
        startBooking,
        completeBooking,
        topUpWallet,
        transferWalletFunds,
        toggleCardFreeze,
        checkInBooking,
        checkOutBooking,
        requestRefund,
        approveRefund,
        rejectRefund,
        ownerSettlePayout,
        HOTEL_FINANCIALS,
        PLATFORM_ADMIN_DATA
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
