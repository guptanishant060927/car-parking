import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  CheckCircle, 
  Download, 
  Navigation, 
  Share2, 
  ShieldCheck,
  Sparkles,
  Ticket,
  ExternalLink,
  Play
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { formatCoordinates, openGoogleMapsNavigation } from '../../utils/geo';

export const DigitalPassModal: React.FC = () => {
  const { activePass, isPassOpen, setIsPassOpen, setIsNavigatingOpen, showToast, zones, gpsState } = useParking();

  // Simulated countdown timer (starts around 1 hr 24 mins)
  const [secondsRemaining, setSecondsRemaining] = useState(5040);

  useEffect(() => {
    if (!isPassOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPassOpen]);

  if (!isPassOpen || !activePass) return null;

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const handleDownload = () => {
    showToast(`Digital Parking Pass #${activePass.id} saved to device`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative"
        id="digital-pass-modal"
      >
        {/* Glow behind pass */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cyan-500/20 via-blue-500/10 to-transparent pointer-events-none" />

        {/* Top bar with close */}
        <div className="relative p-5 pb-3 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-cyan-400" />
            <span className="font-display font-bold text-white text-base tracking-tight">ParkSmart Digital Pass</span>
          </div>
          <button
            onClick={() => setIsPassOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Ticket Body */}
        <div className="p-6 space-y-5">
          {/* Reservation Header */}
          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Confirmed & Active
            </span>
            <h3 className="font-display text-2xl font-extrabold text-white mt-2">
              {activePass.zone_name}
            </h3>
            <p className="text-xs text-slate-400">{activePass.zone_address}</p>
            {/* Exact GPS Coordinates */}
            <div className="text-[11px] font-mono text-cyan-300 mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>
                {formatCoordinates(
                  activePass.latitude ?? (zones.find(z => z.id === activePass.zone_id)?.latitude ?? 28.6304),
                  activePass.longitude ?? (zones.find(z => z.id === activePass.zone_id)?.longitude ?? 77.2177)
                )}
              </span>
            </div>
          </div>

          {/* Bay Assignment Pill */}
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">RESERVED BAY</span>
              <span className="text-lg font-bold text-cyan-300">{activePass.slot_number || 'Bay B-14'}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">PASS ID</span>
              <span className="font-bold text-white">{activePass.id}</span>
            </div>
          </div>

          {/* SVG High-Contrast QR Code */}
          <div className="p-4 bg-white rounded-2xl shadow-inner flex flex-col items-center justify-center">
            {/* Real SVG QR Pattern */}
            <svg className="w-48 h-48" viewBox="0 0 100 100" fill="black">
              {/* Corner 1 */}
              <rect x="5" y="5" width="25" height="25" fill="black" />
              <rect x="9" y="9" width="17" height="17" fill="white" />
              <rect x="13" y="13" width="9" height="9" fill="black" />
              
              {/* Corner 2 */}
              <rect x="70" y="5" width="25" height="25" fill="black" />
              <rect x="74" y="9" width="17" height="17" fill="white" />
              <rect x="78" y="13" width="9" height="9" fill="black" />

              {/* Corner 3 */}
              <rect x="5" y="70" width="25" height="25" fill="black" />
              <rect x="9" y="74" width="17" height="17" fill="white" />
              <rect x="13" y="78" width="9" height="9" fill="black" />

              {/* Random QR data squares for realistic matrix look */}
              <rect x="35" y="10" width="5" height="5" />
              <rect x="45" y="10" width="5" height="5" />
              <rect x="55" y="10" width="5" height="5" />
              <rect x="35" y="20" width="5" height="5" />
              <rect x="50" y="20" width="10" height="5" />
              <rect x="40" y="30" width="20" height="5" />
              <rect x="10" y="40" width="15" height="5" />
              <rect x="35" y="40" width="5" height="15" />
              <rect x="45" y="45" width="15" height="5" />
              <rect x="70" y="40" width="20" height="5" />
              <rect x="80" y="50" width="10" height="10" />
              <rect x="15" y="55" width="10" height="5" />
              <rect x="40" y="60" width="5" height="15" />
              <rect x="55" y="60" width="10" height="5" />
              <rect x="70" y="65" width="15" height="15" />
              <rect x="45" y="80" width="15" height="10" />
            </svg>
            <span className="text-[10px] font-mono text-slate-800 font-bold mt-2 tracking-widest">
              SCAN AT BOOM BARRIER
            </span>
          </div>

          {/* Details Row: Vehicle plate, Date, Arrival, Amount */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 block">Vehicle Number:</span>
              <span className="font-mono font-bold text-white">{activePass.vehicle_number}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Date & Time:</span>
              <span className="font-semibold text-white">{activePass.date_str} @ {activePass.arrival_time}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Duration:</span>
              <span className="font-semibold text-white">{activePass.duration_hours} hours</span>
            </div>
            <div>
              <span className="text-slate-500 block">Amount Paid:</span>
              <span className="font-mono font-bold text-cyan-300">₹{activePass.amount} (Paid)</span>
            </div>
          </div>

          {/* Live Countdown Timer */}
          <div className="text-center p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
              Countdown until Arrival Window
            </span>
            <div className="text-2xl font-mono font-extrabold text-cyan-400 tracking-wider">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          {/* Action Buttons: Navigate with Google Maps, Simulate & Save Pass */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => {
                const zone = zones.find(z => z.id === activePass.zone_id);
                const lat = activePass.latitude ?? zone?.latitude ?? 28.6304;
                const lng = activePass.longitude ?? zone?.longitude ?? 77.2177;
                openGoogleMapsNavigation(lat, lng, gpsState.coords);
              }}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
              id="digital-pass-google-nav-btn"
              title="Open Google Maps turn-by-turn navigation"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Navigate with Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDownload}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Save Pass</span>
              </button>

              <button
                onClick={() => {
                  setIsPassOpen(false);
                  setIsNavigatingOpen(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="In-app simulation"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulate Route</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
