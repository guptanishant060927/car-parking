import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  LocateFixed, 
  Filter, 
  Zap, 
  Accessibility, 
  SlidersHorizontal, 
  Compass, 
  TrendingUp,
  Sparkles,
  Ticket,
  Bell,
  User as UserIcon,
  Car
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { LiveParkingMap } from './LiveParkingMap';
import { ParkingCardList } from './ParkingCardList';
import { ParkingDetailModal } from './ParkingDetailModal';
import { ReservationModal } from './ReservationModal';
import { DigitalPassModal } from './DigitalPassModal';
import { NavigationSimulationModal } from './NavigationSimulationModal';
import { MyReservations } from './MyReservations';
import { DriverNotifications } from './DriverNotifications';
import { DriverProfile } from './DriverProfile';

export const DriverDashboard: React.FC = () => {
  const { 
    driverTab, 
    setDriverTab, 
    currentUser, 
    filters, 
    setFilters, 
    filteredZones, 
    selectedZone, 
    setSelectedZoneId, 
    setIsDetailOpen,
    showToast,
    unreadNotificationsCount,
    reservations
  } = useParking();

  const userUpcomingCount = reservations.filter(
    r => (!r.user_id || r.user_id === currentUser.id) && (r.status === 'Upcoming' || r.status === 'Active')
  ).length;

  const [activeFilterPill, setActiveFilterPill] = useState<'all' | 'available' | 'cheapest' | 'closest' | 'most_available' | 'ev' | 'accessible'>('all');

  const handleUseMyLocation = () => {
    showToast('GPS Synced: Current position Connaught Central, Delhi-NCR');
  };

  const handleQuickFilter = (type: typeof activeFilterPill) => {
    setActiveFilterPill(type);
    if (type === 'all') {
      setFilters(prev => ({ ...prev, availableOnly: false, evOnly: false, accessibleOnly: false, sortBy: 'distance' }));
    } else if (type === 'available') {
      setFilters(prev => ({ ...prev, availableOnly: true, evOnly: false, accessibleOnly: false }));
    } else if (type === 'cheapest') {
      setFilters(prev => ({ ...prev, sortBy: 'price' }));
    } else if (type === 'closest') {
      setFilters(prev => ({ ...prev, sortBy: 'distance' }));
    } else if (type === 'most_available') {
      setFilters(prev => ({ ...prev, sortBy: 'availability' }));
    } else if (type === 'ev') {
      setFilters(prev => ({ ...prev, evOnly: true }));
    } else if (type === 'accessible') {
      setFilters(prev => ({ ...prev, accessibleOnly: true }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Driver Sub-Navigation Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-14">
          {/* Driver Sub Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setDriverTab('find')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                driverTab === 'find'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              id="driver-tab-find"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Find Parking</span>
            </button>

            <button
              onClick={() => setDriverTab('reservations')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                driverTab === 'reservations'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              id="driver-tab-reservations"
            >
              <Ticket className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reservations</span>
              {userUpcomingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {userUpcomingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setDriverTab('notifications')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 relative ${
                driverTab === 'notifications'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              id="driver-tab-notifications"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>

            <button
              onClick={() => setDriverTab('profile')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                driverTab === 'profile'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              id="driver-tab-profile"
            >
              <UserIcon className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>

          {/* Quick Vehicle Plate Pill */}
          <button
            type="button"
            onClick={() => setDriverTab('profile')}
            title="Edit Profile & Vehicle Details"
            className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-cyan-300 bg-slate-950/80 hover:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
            id="driver-quick-plate-btn"
          >
            <Car className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-semibold font-mono tracking-wide">{currentUser.vehicle_number}</span>
          </button>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {driverTab === 'reservations' && <MyReservations />}
        {driverTab === 'notifications' && <DriverNotifications />}
        {driverTab === 'profile' && <DriverProfile />}

        {driverTab === 'find' && (
          <div className="space-y-6">
            {/* Greeting & Search Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                  <span>Good morning, {currentUser.name.split(' ')[0]}</span>
                  <span className="text-2xl animate-pulse">👋</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Real-time parking spots, vacancy predictions, and one-tap reservations across Delhi-NCR.
                </p>
              </div>

              {/* Destination Search Bar + Use My Location */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Where do you want to park?"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-all shadow-inner"
                    id="search-parking-input"
                  />
                </div>

                <button
                  onClick={handleUseMyLocation}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 shadow-sm"
                  id="btn-use-my-location"
                >
                  <LocateFixed className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Use my location</span>
                </button>
              </div>
            </div>

            {/* Smart Filter Pills Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px] shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter:
              </span>

              <button
                onClick={() => handleQuickFilter('all')}
                className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeFilterPill === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                All Zones
              </button>

              <button
                onClick={() => handleQuickFilter('available')}
                className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilterPill === 'available'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Available Now
              </button>

              <button
                onClick={() => handleQuickFilter('cheapest')}
                className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeFilterPill === 'cheapest'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                Cheapest First
              </button>

              <button
                onClick={() => handleQuickFilter('closest')}
                className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeFilterPill === 'closest'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                Closest (ETA)
              </button>

              <button
                onClick={() => handleQuickFilter('most_available')}
                className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeFilterPill === 'most_available'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                Most Available Spots
              </button>

              <button
                onClick={() => handleQuickFilter('ev')}
                className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeFilterPill === 'ev'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                EV Fast Charging
              </button>

              <button
                onClick={() => handleQuickFilter('accessible')}
                className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeFilterPill === 'accessible'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Accessibility className="w-3 h-3 text-indigo-400" />
                Accessible
              </button>
            </div>

            {/* Split Screen Layout: Left Cards (35-40%), Right Map (60-65%) */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Results List */}
              <div className="lg:col-span-5 space-y-3 order-2 lg:order-1">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Showing <strong className="text-white font-mono">{filteredZones.length}</strong> parking zones</span>
                  <span className="font-mono text-cyan-400">Live sensor synced</span>
                </div>

                <ParkingCardList 
                  zones={filteredZones}
                  onSelectZone={(zone) => {
                    setSelectedZoneId(zone.id);
                    setIsDetailOpen(true);
                  }}
                  selectedZoneId={selectedZone?.id || null}
                />
              </div>

              {/* Right Column: Interactive Map */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <LiveParkingMap 
                  onSelectZone={(zone) => {
                    setSelectedZoneId(zone.id);
                    setIsDetailOpen(true);
                  }}
                  selectedZone={selectedZone}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals & Dialogs */}
      <ParkingDetailModal />
      <ReservationModal />
      <DigitalPassModal />
      <NavigationSimulationModal />
    </div>
  );
};
