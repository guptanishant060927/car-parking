import React from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Footprints, 
  Zap, 
  Accessibility, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  CalendarCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ParkingZone } from '../../types';
import { useParking } from '../../context/ParkingContext';
import { formatDistance, formatCoordinates, openGoogleMapsNavigation } from '../../utils/geo';

interface ParkingCardListProps {
  zones: ParkingZone[];
  onSelectZone: (zone: ParkingZone) => void;
  selectedZoneId: string | null;
}

export const ParkingCardList: React.FC<ParkingCardListProps> = ({ 
  zones, 
  onSelectZone, 
  selectedZoneId 
}) => {
  const { setSelectedZoneId, setIsDetailOpen, setIsReservationOpen, gpsState } = useParking();

  const handleCardClick = (zone: ParkingZone) => {
    setSelectedZoneId(zone.id);
    setIsDetailOpen(true);
  };

  const handleDirectReserve = (e: React.MouseEvent, zone: ParkingZone) => {
    e.stopPropagation();
    setSelectedZoneId(zone.id);
    setIsReservationOpen(true);
  };

  const handleDirectNavigate = (e: React.MouseEvent, zone: ParkingZone) => {
    e.stopPropagation();
    // Directly launch Google Maps navigation with exact coordinates
    openGoogleMapsNavigation(zone.latitude, zone.longitude, gpsState.coords);
  };

  if (zones.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
        <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-300">No parking zones match your search criteria</p>
        <p className="text-xs text-slate-500 mt-1">Try clearing filters or searching for "Main Street" or "Mall".</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto max-h-[620px] pr-1">
      {zones.map((zone) => {
        const isSelected = selectedZoneId === zone.id;
        const isAvailable = zone.status === 'Available';
        const isFilling = zone.status === 'Filling Soon';
        const isFull = zone.status === 'Full';

        return (
          <div
            key={zone.id}
            onClick={() => handleCardClick(zone)}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
              isSelected 
                ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30' 
                : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
            }`}
            id={`parking-card-${zone.id}`}
          >
            {/* Top row: Name, Block, Status Pill */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {zone.name}
                  </h3>
                  <span className="text-xs font-mono text-slate-400 font-medium">
                    {zone.block}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate max-w-xs">{zone.address}</p>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{formatCoordinates(zone.latitude, zone.longitude)}</span>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 ${
                isAvailable 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : isFilling 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isAvailable ? 'bg-emerald-400 animate-pulse' : isFilling ? 'bg-amber-400' : 'bg-rose-400'
                }`} />
                <span>{zone.status}</span>
              </span>
            </div>

            {/* Middle Stats Bar: Available Spaces, Occupancy, Price */}
            <div className="grid grid-cols-3 gap-2 py-2 my-2 border-y border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Available</span>
                <span className={`font-bold text-sm ${
                  zone.available_spaces === 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {zone.available_spaces} <span className="text-slate-500 text-[10px] font-normal">/ {zone.capacity}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Occupancy</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        zone.occupancy >= 90 ? 'bg-rose-500' : zone.occupancy >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${zone.occupancy}%` }}
                    />
                  </div>
                  <span className="font-semibold text-slate-200">{zone.occupancy}%</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Price</span>
                <span className="font-bold text-sm text-cyan-300">
                  ₹{zone.price_per_hour}<span className="text-slate-500 text-[10px] font-normal">/hr</span>
                </span>
              </div>
            </div>

            {/* Travel metrics: Distance, Walking, Probability */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-y-1 mb-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono text-cyan-300 font-semibold">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{formatDistance(zone.distance_m)}</span>
                  <span className="text-slate-400 font-normal font-sans">({zone.eta_min} min drive)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{zone.walking_time_min} min walk</span>
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>{zone.opening_probability}% open chance</span>
              </div>
            </div>

            {/* Amenities pills & Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                {zone.has_ev && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> EV Fast
                  </span>
                )}
                {zone.has_accessible && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <Accessibility className="w-3 h-3" /> Accessible
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDirectNavigate(e, zone)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  id={`btn-nav-${zone.id}`}
                  title="Open Google Maps Navigation with exact coordinates"
                >
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Navigate</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400 opacity-70" />
                </button>

                <button
                  onClick={(e) => handleDirectReserve(e, zone)}
                  disabled={zone.status === 'Full'}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm transition-all ${
                    zone.status === 'Full'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 hover:brightness-110'
                  }`}
                  id={`btn-reserve-${zone.id}`}
                >
                  <CalendarCheck className="w-3 h-3" />
                  <span>Reserve</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
