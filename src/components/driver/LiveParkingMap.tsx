import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  LocateFixed, 
  Zap, 
  Accessibility, 
  Compass, 
  MapPin, 
  Sparkles,
  ChevronRight,
  Maximize2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Play
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ParkingZone } from '../../types';
import { useParking } from '../../context/ParkingContext';
import { formatDistance, formatCoordinates, openGoogleMapsNavigation } from '../../utils/geo';

interface LiveParkingMapProps {
  onSelectZone: (zone: ParkingZone) => void;
  selectedZone: ParkingZone | null;
}

// User current driver coordinates (Delhi-NCR Connaught Hub)
const DRIVER_COORDS: [number, number] = [28.6304, 77.2177];

// Tile provider configurations
const TILE_LAYERS = {
  dark: {
    name: 'Cyber Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  },
  streets: {
    name: 'Street View',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    subdomains: 'abc',
    maxZoom: 18
  }
};

/**
 * Creates custom colored Leaflet divIcon markers based on parking zone status:
 * - 'Available' -> Green (#10b981)
 * - 'Filling Soon' -> Yellow / Amber (#f59e0b)
 * - 'Full' -> Red (#ef4444)
 */
const createZoneMarkerIcon = (zone: ParkingZone, isSelected: boolean) => {
  const isAvailable = zone.status === 'Available';
  const isFilling = zone.status === 'Filling Soon';
  const isFull = zone.status === 'Full';

  // Strict Green, Yellow, Red color coding
  const markerColor = isAvailable 
    ? '#10b981' // Green
    : isFilling 
    ? '#f59e0b' // Yellow
    : '#ef4444'; // Red

  const glowRgba = isAvailable 
    ? 'rgba(16, 185, 129, 0.45)' 
    : isFilling 
    ? 'rgba(245, 158, 11, 0.45)' 
    : 'rgba(239, 68, 68, 0.45)';

  const spotsText = isFull ? 'FULL' : `${zone.available_spaces} spots`;
  const zoneShort = zone.name.replace(' Parking', '');

  const evIcon = zone.has_ev 
    ? `<span style="display:inline-flex;align-items:center;color:#38bdf8;margin-left:3px;" title="EV Fast Charging">
         <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
       </span>`
    : '';

  const pulseEffect = isAvailable
    ? `<span style="position:absolute;top:-4px;right:-4px;width:10px;height:10px;border-radius:50%;background-color:#10b981;box-shadow:0 0 8px #10b981;opacity:0.85;"></span>`
    : '';

  const selectionStyle = isSelected
    ? `box-shadow: 0 0 0 3px ${markerColor}, 0 0 22px ${glowRgba}; transform: scale(1.18); z-index: 1000;`
    : `box-shadow: 0 6px 16px rgba(0,0,0,0.65), 0 0 10px ${glowRgba};`;

  const html = `
    <div class="custom-marker-pin" style="position:relative; cursor:pointer;">
      <div style="
        display:flex;
        align-items:center;
        gap:6px;
        padding:4px 10px;
        background:#090d16;
        border:2px solid ${markerColor};
        border-radius:12px;
        color:#f8fafc;
        font-family:'Space Grotesk', system-ui, -apple-system, sans-serif;
        white-space:nowrap;
        ${selectionStyle}
        transition:transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <!-- Status Indicator Dot -->
        <span style="
          width:8px;
          height:8px;
          border-radius:50%;
          background-color:${markerColor};
          display:inline-block;
          flex-shrink:0;
          box-shadow:0 0 8px ${markerColor};
        "></span>

        <!-- Zone Info -->
        <div style="display:flex;flex-direction:column;line-height:1.15;text-align:left;">
          <span style="font-size:11px;font-weight:700;color:#ffffff;max-width:96px;overflow:hidden;text-overflow:ellipsis;">
            ${zoneShort}
          </span>
          <span style="font-size:9.5px;font-family:monospace;font-weight:700;color:${markerColor};display:flex;align-items:center;">
            ${spotsText} ${evIcon}
          </span>
        </div>

        ${pulseEffect}
      </div>

      <!-- Arrow Pointer Tip -->
      <div style="
        width:0;
        height:0;
        border-left:6px solid transparent;
        border-right:6px solid transparent;
        border-top:7px solid ${markerColor};
        margin-top:-1px;
        margin-left:auto;
        margin-right:auto;
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-parking-marker',
    html: html,
    iconSize: [116, 46],
    iconAnchor: [58, 44],
    popupAnchor: [0, -46]
  });
};

// Driver GPS location pulse marker (changes indicator based on real GPS vs stationary pin)
const createDriverLocationIcon = (isRealGps: boolean, isStationary: boolean) => {
  const haloColor = isRealGps ? 'rgba(6, 182, 212, 0.4)' : 'rgba(99, 102, 241, 0.4)';
  const coreColor = isRealGps ? '#06b6d4' : '#6366f1';
  const pulseClass = isStationary ? '' : 'animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;';

  const html = `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;width:42px;height:42px;">
      <div style="position:absolute;width:42px;height:42px;border-radius:50%;background:${haloColor};box-shadow:0 0 16px ${coreColor};${pulseClass}"></div>
      <div style="position:relative;width:22px;height:22px;border-radius:50%;background:${coreColor};border:3px solid #ffffff;box-shadow:0 0 14px ${coreColor};display:flex;align-items:center;justify-content:center;">
        <div style="width:6px;height:6px;border-radius:50%;background:#ffffff;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-driver-marker',
    html: html,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22]
  });
};

/**
 * MapController component handles reactive map panning, zooming, and sizing
 */
interface MapControllerProps {
  selectedZone: ParkingZone | null;
  userCoords: [number, number];
  fitTrigger: number;
  recenterTrigger: number;
  zones: ParkingZone[];
}

const MapController: React.FC<MapControllerProps> = ({ 
  selectedZone, 
  userCoords, 
  fitTrigger, 
  recenterTrigger,
  zones 
}) => {
  const map = useMap();

  // Invalidate map layout size after mount to prevent grey tiles
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  // Smoothly pan & fly to selected zone
  useEffect(() => {
    if (selectedZone) {
      map.flyTo([selectedZone.latitude, selectedZone.longitude], 16, {
        animate: true,
        duration: 1.1
      });
    }
  }, [selectedZone, map]);

  // Pan to driver location
  useEffect(() => {
    if (recenterTrigger > 0) {
      map.flyTo(userCoords, 15, {
        animate: true,
        duration: 1.0
      });
    }
  }, [recenterTrigger, userCoords, map]);

  // Fit all active zones within viewport
  useEffect(() => {
    if (fitTrigger > 0 && zones.length > 0) {
      const bounds = L.latLngBounds(zones.map(z => [z.latitude, z.longitude]));
      bounds.extend(userCoords);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [fitTrigger, zones, userCoords, map]);

  return null;
};

export const LiveParkingMap: React.FC<LiveParkingMapProps> = ({ onSelectZone, selectedZone }) => {
  const { 
    zones, 
    showToast, 
    setIsNavigatingOpen, 
    setIsReservationOpen, 
    setSelectedZoneId,
    setIsDetailOpen,
    gpsState,
    requestRealGps,
    setCustomLocation
  } = useParking();

  const [activeLayer, setActiveLayer] = useState<'dark' | 'streets' | 'satellite'>('dark');
  const [showEVOnly, setShowEVOnly] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [recenterCount, setRecenterCount] = useState(0);
  const [fitCount, setFitCount] = useState(0);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Filtered zones displayed on the map
  const displayZones = useMemo(() => {
    return zones.filter(zone => {
      if (showEVOnly && !zone.has_ev) return false;
      if (showAvailableOnly && zone.status !== 'Available') return false;
      return true;
    });
  }, [zones, showEVOnly, showAvailableOnly]);

  const handleUseMyLocation = () => {
    requestRealGps();
    setRecenterCount(prev => prev + 1);
  };

  const handleFitAll = () => {
    setFitCount(prev => prev + 1);
  };

  // Route points from driver location to selected zone
  const routePolyline = useMemo(() => {
    if (!selectedZone) return null;
    return [
      gpsState.coords,
      [
        (gpsState.coords[0] + selectedZone.latitude) / 2 + 0.001,
        (gpsState.coords[1] + selectedZone.longitude) / 2 - 0.0015
      ] as [number, number],
      [selectedZone.latitude, selectedZone.longitude] as [number, number]
    ];
  }, [selectedZone, gpsState.coords]);

  return (
    <div className="relative w-full h-[480px] lg:h-[640px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl select-none flex flex-col">
      {/* Top Floating Map Controls HUD */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Status Color Legend (Green, Yellow, Red) */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-800 backdrop-blur-md shadow-xl text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="font-semibold">Available</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="font-semibold">Filling Soon</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="font-semibold">Full</span>
          </span>
        </div>

        {/* Action Toggles: Layer Switcher & Filters */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Tile Layer Selector */}
          <div className="flex items-center rounded-xl bg-slate-900/95 border border-slate-800 p-0.5 shadow-lg backdrop-blur-md">
            {(['dark', 'streets', 'satellite'] as const).map((layerKey) => (
              <button
                key={layerKey}
                onClick={() => setActiveLayer(layerKey)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeLayer === layerKey
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Switch to ${TILE_LAYERS[layerKey].name}`}
              >
                {TILE_LAYERS[layerKey].name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* EV Only Filter Button */}
          <button
            onClick={() => setShowEVOnly(!showEVOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 shadow-lg ${
              showEVOnly 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20' 
                : 'bg-slate-900/95 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Show only zones with EV Fast Charging"
            id="map-filter-ev-btn"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">EV Only</span>
          </button>

          {/* Fit All Zones Button */}
          <button
            onClick={handleFitAll}
            className="p-2 rounded-xl bg-slate-900/95 text-slate-300 border border-slate-800 hover:bg-slate-800 transition-colors shadow-lg"
            title="Fit All Parking Zones into View"
            id="map-fit-all-btn"
          >
            <Maximize2 className="w-4 h-4 text-cyan-400" />
          </button>

          {/* GPS Recenter to Driver Button */}
          <button
            onClick={handleUseMyLocation}
            className="px-3 py-2 rounded-xl bg-slate-900/95 text-slate-200 border border-slate-800 hover:bg-slate-800 hover:border-cyan-500/50 transition-all shadow-lg flex items-center gap-1.5"
            title="Recenter Map on Current GPS Location"
            id="map-recenter-gps-btn"
          >
            <LocateFixed className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold hidden md:inline">Recenter on Me</span>
          </button>
        </div>
      </div>

      {/* React-Leaflet Map Container */}
      <div className="w-full h-full relative z-10">
        <MapContainer
          center={gpsState.coords}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          {/* Tile Layer with Dynamic Switcher */}
          <TileLayer
            key={activeLayer}
            url={TILE_LAYERS[activeLayer].url}
            attribution={TILE_LAYERS[activeLayer].attribution}
            subdomains={TILE_LAYERS[activeLayer].subdomains}
            maxZoom={TILE_LAYERS[activeLayer].maxZoom}
          />

          {/* Map Event Controller */}
          <MapController
            selectedZone={selectedZone}
            userCoords={gpsState.coords}
            fitTrigger={fitCount}
            recenterTrigger={recenterCount}
            zones={displayZones}
          />

          {/* Driver Location Marker - stays completely stationary until real physical movement */}
          <Marker
            position={gpsState.coords}
            icon={createDriverLocationIcon(gpsState.isRealGps, gpsState.isStationary)}
          >
            <Popup className="dark-leaflet-popup">
              <div className="p-3 text-slate-100 min-w-[210px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${gpsState.isRealGps ? 'bg-cyan-400' : 'bg-indigo-400'} ${gpsState.isStationary ? '' : 'animate-pulse'}`} />
                  <span className="font-bold text-xs uppercase tracking-wide text-cyan-300 font-mono">
                    {gpsState.isRealGps ? 'Satellite GPS Locked' : 'Calibrated Driver Pin'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{gpsState.locationName}</p>
                <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Coordinates:</span>
                    <span className="font-mono text-slate-200">{gpsState.coords[0].toFixed(4)}, {gpsState.coords[1].toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Accuracy:</span>
                    <span className="font-mono text-slate-200">±{gpsState.accuracy} meters</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Motion Status:</span>
                    <span className={`font-semibold font-mono ${gpsState.isStationary ? 'text-emerald-400' : 'text-cyan-400'}`}>
                      {gpsState.isStationary ? 'Stationary (0 km/h)' : `${gpsState.speed} km/h`}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Active Navigation Path Polyline when zone is selected */}
          {routePolyline && (
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: '#06b6d4',
                weight: 4,
                opacity: 0.85,
                dashArray: '8, 8'
              }}
            />
          )}

          {/* Custom Colored Parking Zone Markers (Green, Yellow, Red) */}
          {displayZones.map((zone) => {
            const isSelected = selectedZone?.id === zone.id;
            const markerIcon = createZoneMarkerIcon(zone, isSelected);

            return (
              <Marker
                key={zone.id}
                position={[zone.latitude, zone.longitude]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => {
                    onSelectZone(zone);
                  }
                }}
              >
                <Popup className="dark-leaflet-popup">
                  <div className="p-4 text-slate-100 min-w-[240px] max-w-[280px]">
                    {/* Popup Header with Status Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight font-display">{zone.name}</h4>
                        <span className="text-[11px] font-mono text-slate-400">{zone.block}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                        zone.status === 'Available'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : zone.status === 'Filling Soon'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {zone.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3 line-clamp-1">{zone.address}</p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs mb-2 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Available</span>
                        <span className={`font-bold text-sm ${
                          zone.status === 'Available' ? 'text-emerald-400' : zone.status === 'Filling Soon' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {zone.available_spaces} / {zone.capacity}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Hourly Rate</span>
                        <span className="font-bold text-sm text-cyan-400">
                          ₹{zone.price_per_hour}/hr
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Drive ETA</span>
                        <span className="text-slate-200">
                          {zone.eta_min} min ({formatDistance(zone.distance_m)})
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Spot Chance</span>
                        <span className="text-emerald-400 font-semibold">
                          {zone.opening_probability}%
                        </span>
                      </div>
                    </div>

                    {/* Coordinates & Features Badges */}
                    <div className="flex flex-col gap-1.5 mb-3">
                      <div className="text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                        <span>{formatCoordinates(zone.latitude, zone.longitude)}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {zone.has_ev && (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-[10px] flex items-center gap-1 font-mono">
                            <Zap className="w-2.5 h-2.5 text-cyan-400" />
                            <span>EV Fast</span>
                          </span>
                        )}
                        {zone.has_accessible && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-[10px] flex items-center gap-1 font-mono">
                            <Accessibility className="w-2.5 h-2.5 text-indigo-400" />
                            <span>Accessible</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openGoogleMapsNavigation(zone.latitude, zone.longitude, gpsState.coords)}
                        className="py-1.5 px-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-sm"
                        title="Open Google Maps Navigation with exact coordinates"
                      >
                        <Navigation className="w-3 h-3 fill-current" />
                        <span>Navigate</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedZoneId(zone.id);
                          setIsReservationOpen(true);
                        }}
                        disabled={zone.status === 'Full'}
                        className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                          zone.status === 'Full'
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:brightness-110 shadow-md'
                        }`}
                      >
                        <span>Reserve</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Live GPS Telemetry Badge & Stationarity Status */}
      <div className={`absolute ${selectedZone ? 'bottom-24' : 'bottom-4'} left-4 z-[1000] pointer-events-auto flex flex-col gap-2 max-w-[380px]`}>
        {gpsState.errorMessage && (
          <div className="px-3 py-2 rounded-xl bg-rose-950/90 border border-rose-800/80 text-rose-200 text-xs backdrop-blur-md shadow-2xl flex items-center justify-between gap-2">
            <span className="text-[11px] leading-tight">{gpsState.errorMessage}</span>
            <button
              onClick={handleUseMyLocation}
              className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 text-[11px] font-bold shrink-0 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/95 border border-slate-800 backdrop-blur-md shadow-2xl text-xs">
          <div className={`w-2.5 h-2.5 rounded-full ${gpsState.isRealGps ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-indigo-400 shadow-sm shadow-indigo-400'} ${gpsState.isStationary ? '' : 'animate-ping'}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-100 truncate">
                {gpsState.isRealGps ? 'Hardware GPS' : gpsState.locationName}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                gpsState.isStationary ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              }`}>
                {gpsState.isStationary ? 'Stationary' : `${gpsState.speed} km/h`}
              </span>
            </div>
            <p className="text-[11px] text-cyan-300 font-mono truncate">
              {formatCoordinates(gpsState.coords[0], gpsState.coords[1])} (±{gpsState.accuracy}m)
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="px-2 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Select preset coordinates"
            >
              Presets
            </button>
            <button
              onClick={handleUseMyLocation}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                gpsState.isRealGps
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-sm'
              }`}
              title="Refresh high-accuracy device GPS position"
            >
              <LocateFixed className="w-3 h-3" />
              <span>{gpsState.isRealGps ? 'Refresh' : 'Use GPS'}</span>
            </button>
          </div>
        </div>

        {/* Location presets popover */}
        {showLocationPicker && (
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              Calibrated GPS Hotspots
            </div>
            {[
              { name: 'Connaught Central Hub', coords: [28.6304, 77.2177] as [number, number], desc: 'Central Delhi' },
              { name: 'South Extension Plaza', coords: [28.5700, 77.2220] as [number, number], desc: 'South Delhi' },
              { name: 'Cyber City Hub', coords: [28.4900, 77.0900] as [number, number], desc: 'Gurugram' },
              { name: 'Terminal 3 Airport Zone', coords: [28.5562, 77.1000] as [number, number], desc: 'IGI Airport' }
            ].map(loc => (
              <button
                key={loc.name}
                onClick={() => {
                  setCustomLocation(loc.name, loc.coords);
                  setShowLocationPicker(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  gpsState.locationName === loc.name && !gpsState.isRealGps
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{loc.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">{loc.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Quick-Action Banner for Selected Zone */}
      {selectedZone && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-auto">
          <div className="p-3.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white font-display">{selectedZone.name}</h4>
                  <span className="text-xs font-mono text-slate-400">({selectedZone.block})</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-0.5">
                  <span className={`font-semibold font-mono ${
                    selectedZone.status === 'Available' ? 'text-emerald-400' : selectedZone.status === 'Filling Soon' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {selectedZone.available_spaces} spots available
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-cyan-300">₹{selectedZone.price_per_hour}/hr</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-300 font-semibold">{formatDistance(selectedZone.distance_m)}</span>
                  <span className="text-slate-400">({selectedZone.eta_min} min drive)</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 font-mono text-[11px]">{formatCoordinates(selectedZone.latitude, selectedZone.longitude)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Google Maps Navigation Button */}
              <button
                onClick={() => openGoogleMapsNavigation(selectedZone.latitude, selectedZone.longitude, gpsState.coords)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                id="map-floating-google-nav-btn"
                title="Launch Google Maps turn-by-turn navigation"
              >
                <Navigation className="w-3.5 h-3.5 fill-current" />
                <span>Navigate (Google Maps)</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </button>

              {/* In-App Simulation */}
              <button
                onClick={() => setIsNavigatingOpen(true)}
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-xs flex items-center gap-1 transition-colors"
                id="map-floating-simulate-btn"
                title="In-App route drive simulation"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulate</span>
              </button>

              {/* Reserve Bay */}
              <button
                onClick={() => {
                  setSelectedZoneId(selectedZone.id);
                  setIsReservationOpen(true);
                }}
                disabled={selectedZone.status === 'Full'}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md transition-all ${
                  selectedZone.status === 'Full'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:brightness-110'
                }`}
                id="map-floating-reserve-btn"
              >
                <span>Reserve Bay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedZoneId('')}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Deselect Zone"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
