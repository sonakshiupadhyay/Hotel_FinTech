import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Users,
  Search,
  Filter,
  Star,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Maximize2,
  X,
  CreditCard,
  Wifi,
  Coffee,
  Coins
} from 'lucide-react';

export const BookingSystemView = () => {
  const { rooms, formatCurrency, startBooking, bookingDraft, setBookingDraft } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(60000);
  const [selectedAmenity, setSelectedAmenity] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [detailedRoom, setDetailedRoom] = useState(null);

  // Filtered & Sorted rooms
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        if (categoryFilter !== 'All' && !room.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
          return false;
        }
        if (room.pricePerNight > maxPrice) {
          return false;
        }
        if (selectedAmenity !== 'All' && !room.amenities.some((a) => a.toLowerCase().includes(selectedAmenity.toLowerCase()))) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
        if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // recommended
      });
  }, [rooms, categoryFilter, maxPrice, selectedAmenity, sortBy]);

  const categories = ['All', 'Penthouse', 'Executive', 'Deluxe', 'Studio', 'Villa'];

  const handleDateChange = (field, val) => {
    const updated = { ...bookingDraft, [field]: val };
    const d1 = new Date(updated.checkIn);
    const d2 = new Date(updated.checkOut);
    const diff = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
    setBookingDraft({ ...updated, nights: diff });
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Tagline */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Hospitality Inventory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Hotel Booking System
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Reserve modern tech-enabled residences with smart lock access, verified crypto/fiat payment rails, and up to 6% instant wallet cashback.
        </p>
      </div>

      {/* Interactive Search & Date Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Check-In */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Check-In Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={bookingDraft.checkIn}
                onChange={(e) => handleDateChange('checkIn', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Check-Out */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Check-Out Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={bookingDraft.checkOut}
                onChange={(e) => handleDateChange('checkOut', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Guests
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={bookingDraft.guests}
                onChange={(e) => setBookingDraft({ ...bookingDraft, guests: Number(e.target.value) })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={1}>1 Adult (Single)</option>
                <option value={2}>2 Adults (Couple / Business)</option>
                <option value={3}>3 Adults (Family)</option>
                <option value={4}>4+ Adults (VIP Group)</option>
              </select>
            </div>
          </div>

          {/* Stay summary & Duration */}
          <div className="flex flex-col justify-end">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Stay Duration:</span>
                <span className="font-bold text-white">{bookingDraft.nights} Nights</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-semibold block">5% FinTech Cashback</span>
                <span className="text-[10px] text-slate-400">Credited automatically</span>
              </div>
            </div>
          </div>

        </div>

        {/* Filter Controls Row */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Room Type:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  categoryFilter === cat
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Max Nightly:</span>
              <span className="font-bold text-emerald-400">{formatCurrency(maxPrice)}</span>
              <input
                type="range"
                min="4000"
                max="60000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              >
                <option value="recommended">Featured / High Cashback</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Guest Rating</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Room Results List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredRooms.length}</strong> available residences</span>
          <span>All rooms include free cancellation & smart check-in</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredRooms.map((room) => {
            const totalPrice = (room.pricePerNight * bookingDraft.nights) + Math.round(room.pricePerNight * bookingDraft.nights * 0.10);
            const cashbackEst = (totalPrice * room.cashbackPercentage) / 100;

            return (
              <div
                key={room.id}
                className="glass-panel rounded-2xl overflow-hidden border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col lg:flex-row group"
              >
                {/* Room Image with Badge */}
                <div className="lg:w-80 h-64 lg:h-auto relative overflow-hidden shrink-0">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                      {room.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                      +{room.cashbackPercentage}% Wallet Cashback
                    </span>
                  </div>
                  <button
                    onClick={() => setDetailedRoom(room)}
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-slate-950/80 text-white hover:text-emerald-400 backdrop-blur-md border border-slate-700/60 transition-colors"
                    title="View gallery & floorplan"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                          {room.category} • {room.floor}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{room.rating}</span>
                        <span className="text-slate-500">({room.reviewsCount} reviews)</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => setDetailedRoom(room)}>
                      {room.name}
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {room.description}
                    </p>

                    {/* Room Specs */}
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
                      <span>📐 {room.size}</span>
                      <span>🛏️ {room.beds}</span>
                      <span>👥 {room.capacity}</span>
                      <span className="text-emerald-400">⚡ {room.availableUnits} units left</span>
                    </div>

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {room.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="px-2 py-1 rounded-md bg-slate-800 text-[10px] text-slate-400">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-white">{formatCurrency(room.pricePerNight)}</span>
                        <span className="text-xs text-slate-400">/ night</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Total {bookingDraft.nights} nights: <strong className="text-slate-200">{formatCurrency(totalPrice)}</strong> (incl. taxes)
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium">
                        Instant Wallet Cashback: +{formatCurrency(cashbackEst)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setDetailedRoom(room)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs transition-colors"
                      >
                        Room Details
                      </button>
                      <button
                        onClick={() => startBooking(room)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all transform active:scale-98"
                      >
                        Reserve Suite
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room Details Modal */}
      {detailedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
            
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/60">
              <h3 className="text-base font-bold text-white">{detailedRoom.name}</h3>
              <button
                onClick={() => setDetailedRoom(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Photo Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <img
                  src={detailedRoom.images[0]}
                  alt={detailedRoom.name}
                  className="w-full h-56 object-cover rounded-xl"
                />
                {detailedRoom.images[1] && (
                  <img
                    src={detailedRoom.images[1]}
                    alt="Suite interior"
                    className="w-full h-56 object-cover rounded-xl"
                  />
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5">Overview</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{detailedRoom.description}</p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">Space Dimension</span>
                  <span className="font-bold text-slate-200">{detailedRoom.size}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bed Layout</span>
                  <span className="font-bold text-slate-200">{detailedRoom.beds}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Max Guests</span>
                  <span className="font-bold text-slate-200">{detailedRoom.capacity}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Free Cancellation</span>
                  <span className="font-bold text-emerald-400">{detailedRoom.freeCancellationHours} Hours Prior</span>
                </div>
              </div>

              {/* Full Amenities */}
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
                  Exclusive Room Features & Technology
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {detailedRoom.amenities.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FinTech Escrow Guarantee */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-white">Smart Contract Escrow Guarantee</p>
                  <p className="text-slate-300 mt-0.5">
                    Funds are safely held in decentralized escrow and released only upon successful keyless check-in. Instant 100% refund available prior to cancellation deadline.
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer with booking action */}
            <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xl font-black text-white">{formatCurrency(detailedRoom.pricePerNight)}</span>
                <span className="text-xs text-slate-400"> / night</span>
              </div>
              <button
                onClick={() => {
                  setDetailedRoom(null);
                  startBooking(detailedRoom);
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                Continue to Payment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

