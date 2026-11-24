import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Ticket, 
  Navigation, 
  CheckCircle2, 
  AlertCircle,
  QrCode, 
  ArrowRight, 
  Receipt, 
  RotateCcw, 
  Star, 
  Search, 
  CreditCard, 
  History, 
  ShieldCheck, 
  ExternalLink,
  Play,
  User as UserIcon,
  Sparkles,
  CalendarCheck2,
  CalendarX,
  Filter
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { ReservationStatus, Reservation } from '../../types';
import { ReceiptModal } from './ReceiptModal';
import { formatCoordinates, openGoogleMapsNavigation } from '../../utils/geo';

type BookingCategory = 'all' | 'upcoming' | 'past';
type StatusFilter = 'all' | ReservationStatus;

export const MyReservations: React.FC = () => {
  const { 
    reservations, 
    cancelReservation, 
    rateReservation,
    rebookReservation,
    setActivePass, 
    setIsPassOpen, 
    setIsNavigatingOpen,
    setSelectedZoneId,
    setDriverTab,
    showToast,
    zones,
    gpsState,
    currentUser
  } = useParking();

  const [activeCategory, setActiveCategory] = useState<BookingCategory>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceiptRes, setSelectedReceiptRes] = useState<Reservation | null>(null);
  const [ratingHover, setRatingHover] = useState<{ id: string; val: number } | null>(null);

  // Filter reservations strictly for the current logged-in driver
  const userReservations = useMemo(() => {
    return reservations.filter(r => !r.user_id || r.user_id === currentUser.id);
  }, [reservations, currentUser.id]);

  // Split into upcoming (including active) and past (completed/cancelled)
  const upcomingBookings = useMemo(() => {
    return userReservations.filter(r => r.status === 'Upcoming' || r.status === 'Active');
  }, [userReservations]);

  const pastBookings = useMemo(() => {
    return userReservations.filter(r => r.status === 'Completed' || r.status === 'Cancelled');
  }, [userReservations]);

  // Compute metrics for current user
  const metrics = useMemo(() => {
    const totalBookings = userReservations.length;
    const upcomingCount = upcomingBookings.length;
    const completedCount = userReservations.filter(r => r.status === 'Completed').length;
    const totalSpent = userReservations.reduce((sum, r) => sum + r.amount, 0);
    const totalHours = userReservations.reduce((sum, r) => sum + r.duration_hours, 0);
    const ratedReservations = userReservations.filter(r => r.rating);
    const avgRating = ratedReservations.length > 0 
      ? (ratedReservations.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedReservations.length).toFixed(1)
      : '5.0';

    return {
      totalBookings,
      upcomingCount,
      completedCount,
      totalSpent,
      totalHours,
      avgRating
    };
  }, [userReservations, upcomingBookings]);

  // Search filter helper
  const matchesSearch = (r: Reservation, query: string) => {
    if (!query) return true;
    const q = query.toLowerCase().trim();
    return (
      r.zone_name.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.vehicle_number.toLowerCase().includes(q) ||
      (r.slot_number && r.slot_number.toLowerCase().includes(q)) ||
      (r.zone_address && r.zone_address.toLowerCase().includes(q))
    );
  };

  // Filtered upcoming bookings based on search & status filter
  const filteredUpcoming = useMemo(() => {
    return upcomingBookings.filter(r => {
      const matchStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      return matchStatus && matchesSearch(r, searchQuery);
    });
  }, [upcomingBookings, statusFilter, searchQuery]);

  // Filtered past bookings based on search & status filter
  const filteredPast = useMemo(() => {
    return pastBookings.filter(r => {
      const matchStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      return matchStatus && matchesSearch(r, searchQuery);
    });
  }, [pastBookings, statusFilter, searchQuery]);

  const handleOpenPass = (res: Reservation) => {
    setActivePass(res);
    setIsPassOpen(true);
  };

  const handleStartNav = (res: Reservation) => {
    setSelectedZoneId(res.zone_id);
    setIsNavigatingOpen(true);
  };

  const handleOpenGoogleMaps = (res: Reservation) => {
    const matchedZone = zones.find(z => z.id === res.zone_id);
    const lat = res.latitude ?? matchedZone?.latitude ?? 28.6304;
    const lng = res.longitude ?? matchedZone?.longitude ?? 77.2177;
    openGoogleMapsNavigation(lat, lng, gpsState.coords);
  };

  const handleRebook = (res: Reservation) => {
    rebookReservation(res);
    showToast(`Pre-filling booking for ${res.zone_name}`);
  };

  const handleCancel = (res: Reservation) => {
    cancelReservation(res.id);
    showToast(`Cancelled reservation #${res.id} for ${res.zone_name}`);
  };

  // Render individual reservation card
  const renderReservationCard = (res: Reservation, isPastCard: boolean = false) => {
    const isUpcoming = res.status === 'Upcoming';
    const isActive = res.status === 'Active';
    const isCompleted = res.status === 'Completed';
    const isCancelled = res.status === 'Cancelled';

    const matchedZone = zones.find(z => z.id === res.zone_id);
    const lat = res.latitude ?? matchedZone?.latitude ?? 28.6304;
    const lng = res.longitude ?? matchedZone?.longitude ?? 77.2177;

    return (
      <div
        key={res.id}
        className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg flex flex-col justify-between"
      >
        <div className="space-y-3">
          {/* Card Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                  {res.id}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {res.slot_number || 'Allocated Bay'}
                </span>
                {isActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Parked in Bay
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-white text-base">
                {res.zone_name}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{res.zone_address}</span>
              </p>
              {/* Exact GPS Coordinates */}
              <div className="text-[11px] font-mono text-cyan-300 mt-1">
                GPS: {formatCoordinates(lat, lng)}
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold shrink-0 ${
              isUpcoming 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' 
                : isActive 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse' 
                : isCompleted 
                ? 'bg-slate-800 text-slate-300 border border-slate-700' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              {res.status}
            </span>
          </div>

          {/* Operational Ledger Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                {isUpcoming ? 'Scheduled Arrival' : 'Check-In'}
              </span>
              <span className="text-white font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{res.date_str} @ {res.arrival_time}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                {isCompleted ? 'Exit Time' : 'Duration'}
              </span>
              <span className="text-white font-semibold">
                {res.exit_time || `${res.duration_hours} hour duration`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Vehicle Plate</span>
              <span className="text-cyan-300 font-semibold flex items-center gap-1">
                <Car className="w-3 h-3 text-cyan-400" />
                <span>{res.vehicle_number}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Amount & FASTag</span>
              <span className="text-emerald-400 font-semibold">
                ₹{res.amount} ({res.payment_method || 'FASTag Auto-Debit'})
              </span>
            </div>
          </div>

          {/* Rating / Review Section for Completed Sessions */}
          {isCompleted && (
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <span className="text-slate-400 block text-[11px]">
                  {res.rating ? 'Your Facility Rating' : 'How was your parking experience?'}
                </span>
                {res.rating_review ? (
                  <p className="text-[11px] text-slate-300 italic mt-0.5 truncate">"{res.rating_review}"</p>
                ) : (
                  <span className="text-[10px] text-amber-400/80">Tap stars to submit feedback</span>
                )}
              </div>

              {/* Interactive 5-Star Selector */}
              <div className="flex items-center gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => {
                  const currentHover = ratingHover?.id === res.id ? ratingHover.val : null;
                  const isFilled = currentHover !== null ? star <= currentHover : star <= (res.rating || 0);

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => rateReservation(res.id, star, res.rating_review || 'Smooth barrier entry with FASTag')}
                      onMouseEnter={() => setRatingHover({ id: res.id, val: star })}
                      onMouseLeave={() => setRatingHover(null)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                      title={`Rate ${star} Stars`}
                    >
                      <Star className={`w-4 h-4 ${isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Card Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 mt-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* View Digital Gate Pass */}
            <button
              onClick={() => handleOpenPass(res)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="View Digital Pass & Gate QR Code"
              id={`btn-pass-${res.id}`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{isActive || isUpcoming ? 'View Pass' : 'Pass Info'}</span>
            </button>

            {/* Tax Invoice & E-Receipt Button */}
            <button
              onClick={() => setSelectedReceiptRes(res)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="View E-Receipt & GST Tax Invoice"
              id={`btn-receipt-${res.id}`}
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              <span>Invoice</span>
            </button>

            {/* Re-book spot button for completed / past sessions */}
            {isPastCard && (
              <button
                onClick={() => handleRebook(res)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Book this zone again"
                id={`btn-rebook-${res.id}`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-book</span>
              </button>
            )}

            {/* Google Maps & Turn-by-turn Navigation for Upcoming/Active */}
            {(isUpcoming || isActive) && (
              <>
                <button
                  onClick={() => handleOpenGoogleMaps(res)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-cyan-500/20"
                  title="Open turn-by-turn navigation in Google Maps"
                  id={`res-gmaps-nav-${res.id}`}
                >
                  <Navigation className="w-3.5 h-3.5 fill-current" />
                  <span>Navigate</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </button>

                <button
                  onClick={() => handleStartNav(res)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                  title="Simulate route in app"
                >
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>Simulate</span>
                </button>
              </>
            )}
          </div>

          {/* Cancel Upcoming Button */}
          {isUpcoming && (
            <button
              onClick={() => handleCancel(res)}
              className="px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors font-medium border border-rose-500/20"
              id={`btn-cancel-${res.id}`}
            >
              Cancel Spot
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Current Driver Identity & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
              Driver Parking Ledger
            </span>
          </div>
          <h2 className="font-display text-2xl font-black text-white flex items-center gap-2">
            <span>My Reservations</span>
            <span className="text-xs font-normal text-slate-400 font-mono bg-slate-800 px-2.5 py-0.5 rounded-full">
              {currentUser.name}
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              <strong className="text-white font-mono">{currentUser.vehicle_number}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              FASTag Auto-Debit Active
            </span>
          </div>
        </div>

        <button
          onClick={() => setDriverTab('find')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all self-start sm:self-auto shrink-0"
          id="reservations-book-new-btn"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Find & Reserve Spot</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Analytics Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Upcoming / Active</span>
            <CalendarCheck2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-display text-2xl font-black text-white">{metrics.upcomingCount}</div>
          <span className="text-[10px] text-cyan-400 font-mono">Guaranteed parking bays</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Past Sessions</span>
            <History className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display text-2xl font-black text-white">{metrics.completedCount}</div>
          <span className="text-[10px] text-emerald-400 font-mono">{metrics.totalBookings} lifetime records</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Total Paid</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-display text-2xl font-black text-white">₹{metrics.totalSpent}</div>
          <span className="text-[10px] text-slate-400 font-mono">100% FASTag automated</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Hours Parked</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display text-2xl font-black text-white">
            {metrics.totalHours} <span className="text-sm font-normal text-slate-400">hrs</span>
          </div>
          <span className="text-[10px] text-amber-400 font-mono">~20 mins search time saved</span>
        </div>
      </div>

      {/* Primary Category Selector: All vs Upcoming vs Past */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Main Segmented Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => {
              setActiveCategory('all');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            id="tab-category-all"
          >
            <span>All Bookings</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeCategory === 'all' ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
            }`}>
              {userReservations.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('upcoming');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeCategory === 'upcoming'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            id="tab-category-upcoming"
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>Upcoming</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeCategory === 'upcoming' ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-800 text-cyan-400'
            }`}>
              {upcomingBookings.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('past');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeCategory === 'past'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            id="tab-category-past"
          >
            <History className="w-3.5 h-3.5" />
            <span>Past History</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeCategory === 'past' ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
            }`}>
              {pastBookings.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search facility, Bay #, or ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            id="reservations-search-input"
          >
          </input>
        </div>
      </div>

      {/* Secondary Status Filter Chips (for granular refinement) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px] shrink-0 mr-1">
          <Filter className="w-3 h-3 text-cyan-400" /> Filter Status:
        </span>
        {(['all', 'Upcoming', 'Active', 'Completed', 'Cancelled'] as StatusFilter[]).map((st) => {
          const count = st === 'all'
            ? userReservations.length
            : userReservations.filter(r => r.status === st).length;

          const isSelected = statusFilter === st;

          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap text-xs flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <span>{st === 'all' ? 'All Statuses' : st}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* LIST SECTIONS: UPCOMING AND PAST */}
      <div className="space-y-8">
        {/* UPCOMING BOOKINGS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'upcoming') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="font-display font-bold text-white text-lg">Upcoming & Active Bookings</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {filteredUpcoming.length}
                </span>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">Turn-by-turn navigation & gate passes ready</span>
            </div>

            {filteredUpcoming.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 text-slate-400 space-y-3">
                <CalendarX className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">No upcoming bookings scheduled</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Reserve a guaranteed parking bay in advance to avoid waiting and ensure smooth barrier entry.
                </p>
                <button
                  onClick={() => setDriverTab('find')}
                  className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all inline-flex items-center gap-1.5"
                  id="empty-upcoming-find-btn"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Find Parking Nearby</span>
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredUpcoming.map(res => renderReservationCard(res, false))}
              </div>
            )}
          </div>
        )}

        {/* PAST BOOKINGS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'past') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-lg">Past Parking History</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {filteredPast.length}
                </span>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">FASTag tax invoices, ratings & 1-tap re-booking</span>
            </div>

            {filteredPast.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 text-slate-400 space-y-2">
                <History className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">No past sessions found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Completed and archived parking bookings will appear here with e-receipts and payment summaries.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredPast.map(res => renderReservationCard(res, true))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tax Invoice / Receipt Modal */}
      {selectedReceiptRes && (
        <ReceiptModal
          reservation={selectedReceiptRes}
          onClose={() => setSelectedReceiptRes(null)}
        />
      )}
    </div>
  );
};
