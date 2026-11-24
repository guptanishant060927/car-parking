import React from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  CalendarCheck, 
  Clock, 
  Footprints, 
  Zap, 
  Accessibility, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  AlertCircle,
  Car,
  Hourglass,
  Layers,
  ChevronRight,
  ExternalLink,
  Play
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { formatDistance, formatCoordinates, openGoogleMapsNavigation } from '../../utils/geo';

export const ParkingDetailModal: React.FC = () => {
  const { 
    selectedZone, 
    isDetailOpen, 
    setIsDetailOpen, 
    setIsReservationOpen, 
    setIsNavigatingOpen,
    gpsState
  } = useParking();

  if (!isDetailOpen || !selectedZone) return null;

  const isAvailable = selectedZone.status === 'Available';
  const isFilling = selectedZone.status === 'Filling Soon';

  const handleOpenGoogleMaps = () => {
    openGoogleMapsNavigation(selectedZone.latitude, selectedZone.longitude, gpsState.coords);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="parking-detail-modal"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 ${
                isAvailable 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : isFilling 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>{selectedZone.status}</span>
              </span>
              <span className="text-xs font-mono text-slate-400">{selectedZone.parking_type}</span>
            </div>

            <h2 className="font-display text-2xl font-bold text-white">
              {selectedZone.name} — <span className="text-cyan-400">{selectedZone.block}</span>
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedZone.address}</span>
            </p>
            {/* Exact GPS Coordinates */}
            <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300">
              <Navigation className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>Exact GPS: <strong>{formatCoordinates(selectedZone.latitude, selectedZone.longitude)}</strong></span>
            </div>
          </div>

          <button
            onClick={() => setIsDetailOpen(false)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            id="close-detail-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Available Spots</div>
              <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                {selectedZone.available_spaces}
                <span className="text-xs font-normal text-slate-500 ml-1">/ {selectedZone.capacity}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Real-time sensor count</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Occupancy</div>
              <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                {selectedZone.occupancy}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Current fill factor</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Distance & ETA</div>
              <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                {formatDistance(selectedZone.distance_m)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{selectedZone.eta_min} min drive • {selectedZone.walking_time_min} min walk</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Tariff Rate</div>
              <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
                ₹{selectedZone.price_per_hour}
                <span className="text-xs font-normal text-slate-500">/hr</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">FASTag & UPI auto-pay</div>
            </div>
          </div>

          {/* AI Predictive Insight Callout Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-cyan-950/40 border border-cyan-500/30 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wide">
                  AI Parking Availability Prediction
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-200 font-semibold">
                  {selectedZone.opening_probability}% Probability
                </span>
              </div>
              <p className="text-sm text-slate-200 font-medium">
                "{selectedZone.opening_probability}% probability that a spot will be available when you arrive."
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-slate-300">
                  <Hourglass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Est. Waiting Time: <strong>{selectedZone.expected_wait_min} mins</strong></span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Car className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Turnover: <strong>{selectedZone.turnover_rate} cars/hr</strong></span>
                </span>
              </div>
            </div>
          </div>

          {/* 24-Hour Occupancy Trend Graph */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Today's Occupancy Trend (Hourly)</span>
              </span>
              <span className="text-slate-400 font-mono">Current: {selectedZone.occupancy}%</span>
            </div>

            {/* SVG Bar Chart for 24 Hours */}
            <div className="h-28 w-full bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-end justify-between gap-1">
              {selectedZone.trend_hourly.map((val, idx) => {
                const hour = idx;
                const isCurrentHour = hour === 11; // around 11:30 AM in demo
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-7 hidden group-hover:flex px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-cyan-300 border border-slate-700 whitespace-nowrap z-20">
                      {hour}:00 - {val}%
                    </div>

                    <div 
                      className={`w-full rounded-t transition-all ${
                        isCurrentHour 
                          ? 'bg-cyan-400 shadow-md shadow-cyan-500/40' 
                          : val >= 90 ? 'bg-rose-500/70' : val >= 75 ? 'bg-amber-500/70' : 'bg-emerald-500/60'
                      }`}
                      style={{ height: `${Math.max(8, val)}%` }}
                    />
                    <span className="text-[8px] text-slate-600 mt-1 font-mono hidden sm:block">
                      {hour % 4 === 0 ? `${hour}h` : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zone Facilities & Amenities */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">Amenities & Specifications</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>{selectedZone.has_ev ? 'EV Fast Charger' : 'No EV Charging'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                <Accessibility className="w-4 h-4 text-indigo-400" />
                <span>Accessible Bays</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>24/7 ANPR Camera</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="truncate">{selectedZone.operating_hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons: Navigate with Google Maps, Simulation & Reserve Spot */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            <span>Destination: <strong className="text-white">{selectedZone.name}</strong></span>
            <div className="text-[11px] font-mono text-cyan-300">
              {formatCoordinates(selectedZone.latitude, selectedZone.longitude)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Direct Google Maps Navigation Button */}
            <button
              onClick={handleOpenGoogleMaps}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
              id="detail-modal-google-maps-btn"
              title="Launch Google Maps turn-by-turn navigation"
            >
              <Navigation className="w-4 h-4 text-slate-950 fill-current" />
              <span>Navigate with Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* In-App Simulation */}
            <button
              onClick={() => {
                setIsDetailOpen(false);
                setIsNavigatingOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              id="detail-modal-simulate-btn"
              title="Simulate turn-by-turn route inside the app"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulate</span>
            </button>

            {/* Reserve Spot */}
            <button
              onClick={() => {
                setIsDetailOpen(false);
                setIsReservationOpen(true);
              }}
              disabled={selectedZone.status === 'Full'}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all ${
                selectedZone.status === 'Full'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20 transform hover:scale-102'
              }`}
              id="detail-modal-reserve-btn"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Reserve Spot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
