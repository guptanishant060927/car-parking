import React, { useState, useEffect } from 'react';
import { 
  X, 
  Navigation, 
  ArrowUpRight, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Compass, 
  Radio, 
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  LocateFixed,
  ExternalLink
} from 'lucide-react';
import { useParking, calculateDistanceMeters } from '../../context/ParkingContext';
import { formatCoordinates, openGoogleMapsNavigation } from '../../utils/geo';

export const NavigationSimulationModal: React.FC = () => {
  const { 
    isNavigatingOpen, 
    setIsNavigatingOpen, 
    selectedZone, 
    showToast,
    zones,
    gpsState,
    requestRealGps
  } = useParking();

  const target = selectedZone || zones[0];
  const initialDistance = target ? target.distance_m : 450;

  // By default, driving simulation is paused so distance does NOT reduce on its own
  const [isDrivingActive, setIsDrivingActive] = useState(false);
  const [distanceRemaining, setDistanceRemaining] = useState(initialDistance);
  const [stepIndex, setStepIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  const navigationSteps = [
    { instruction: 'Head toward entry circle route', distance: '150 m', icon: 'straight' },
    { instruction: 'Turn right onto designated access avenue', distance: '200 m', icon: 'right' },
    { instruction: 'Slight left into Multi-Level Parking Entry Gate', distance: '100 m', icon: 'left' },
    { instruction: 'Boom barrier opening via FASTag. Proceed to assigned Bay', distance: 'Arrived', icon: 'arrive' }
  ];

  // Reset when opening modal or selecting new target
  useEffect(() => {
    if (isNavigatingOpen && target) {
      setDistanceRemaining(target.distance_m);
      setStepIndex(0);
      setIsDrivingActive(false); // Do NOT auto-run; wait for user action
    }
  }, [isNavigatingOpen, target]);

  // Real physical GPS updates: only update if device actually moved in real life
  useEffect(() => {
    if (gpsState.isRealGps && !gpsState.isStationary && target) {
      const realDist = calculateDistanceMeters(
        gpsState.coords[0],
        gpsState.coords[1],
        target.latitude,
        target.longitude
      );
      setDistanceRemaining(realDist);
      if (realDist <= 30) setStepIndex(3);
      else if (realDist <= 120) setStepIndex(2);
      else if (realDist <= 280) setStepIndex(1);
    }
  }, [gpsState.isRealGps, gpsState.isStationary, gpsState.coords, target]);

  // Only reduce distance when user explicitly starts the driving simulation
  useEffect(() => {
    if (!isNavigatingOpen || !isDrivingActive) return;

    const interval = setInterval(() => {
      setDistanceRemaining(prev => {
        if (prev <= 25) {
          setStepIndex(3);
          setIsDrivingActive(false);
          return 0;
        }
        const nextDist = prev - 25;
        if (nextDist <= 100) setStepIndex(3);
        else if (nextDist <= 200) setStepIndex(2);
        else if (nextDist <= 350) setStepIndex(1);
        return nextDist;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isNavigatingOpen, isDrivingActive]);

  if (!isNavigatingOpen || !target) return null;

  const hasArrived = distanceRemaining === 0;

  const handleReset = () => {
    setDistanceRemaining(target.distance_m);
    setStepIndex(0);
    setIsDrivingActive(false);
    showToast('Navigation distance reset to origin');
  };

  const handleStepForward = () => {
    if (hasArrived) return;
    setDistanceRemaining(prev => {
      const next = Math.max(0, prev - 100);
      if (next === 0) setStepIndex(3);
      else if (next <= 150) setStepIndex(2);
      else if (next <= 300) setStepIndex(1);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        id="navigation-simulation-modal"
      >
        {/* In-Car GPS Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isDrivingActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              PARKSMART LIVE GPS NAVIGATION
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              title={soundOn ? 'Mute Voice Guidance' : 'Unmute Voice Guidance'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsNavigatingOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              title="Close Navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Navigation Direction Banner */}
        <div className="p-6 bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border-b border-slate-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
            {hasArrived ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : stepIndex === 1 ? (
              <ArrowRight className="w-8 h-8" />
            ) : (
              <ArrowUpRight className="w-8 h-8" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs font-mono text-cyan-300 font-semibold mb-0.5">
              {hasArrived ? 'YOU HAVE ARRIVED' : `NEXT TURN IN ${navigationSteps[stepIndex].distance}`}
            </div>
            <h3 className="font-display font-bold text-lg text-white leading-snug">
              {navigationSteps[stepIndex].instruction}
            </h3>
          </div>
        </div>

        {/* Live HUD Telemetry Dashboard */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">DISTANCE</span>
              <span className="text-xl font-mono font-bold text-white">
                {distanceRemaining}m
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">EST. SPEED</span>
              <span className="text-xl font-mono font-bold text-cyan-400">
                {isDrivingActive && !hasArrived ? '32' : '0'} <span className="text-xs font-normal text-slate-400">km/h</span>
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">REMAINING ETA</span>
              <span className="text-xl font-mono font-bold text-emerald-400">
                {hasArrived ? '0 min' : `${Math.max(1, Math.ceil(distanceRemaining / 100))} min`}
              </span>
            </div>
          </div>

          {/* GPS Hardware Telemetry Status */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full ${gpsState.isRealGps ? 'bg-cyan-400' : 'bg-indigo-400'} ${gpsState.isStationary ? '' : 'animate-ping'}`} />
              <div className="truncate">
                <span className="font-semibold text-slate-200 block truncate">
                  {gpsState.isRealGps ? 'Device Satellite GPS' : gpsState.locationName}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {gpsState.coords[0].toFixed(4)}, {gpsState.coords[1].toFixed(4)} (±{gpsState.accuracy}m)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                gpsState.isStationary ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              }`}>
                {gpsState.isStationary ? 'Stationary (0 km/h)' : `${gpsState.speed} km/h`}
              </span>
              {!gpsState.isRealGps && (
                <button
                  onClick={requestRealGps}
                  className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition-colors"
                >
                  Enable Real GPS
                </button>
              )}
            </div>
          </div>

          {/* Simulation Control Bar */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isDrivingActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-xs font-mono text-slate-300">
                Drive Simulation: <strong className={isDrivingActive ? 'text-emerald-400' : 'text-slate-400'}>{isDrivingActive ? 'Active' : 'Paused (Static)'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (hasArrived) {
                    handleReset();
                    setIsDrivingActive(true);
                  } else {
                    setIsDrivingActive(!isDrivingActive);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                  isDrivingActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
                id="toggle-drive-simulation-btn"
              >
                {isDrivingActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>{hasArrived ? 'Replay' : 'Simulate Drive'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleStepForward}
                disabled={hasArrived}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 text-xs font-medium flex items-center gap-1 transition-colors border border-slate-700"
                title="Step forward 100m"
              >
                <span>+100m</span>
                <ChevronRight className="w-3 h-3" />
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
                title="Reset to Full Distance"
                id="reset-distance-btn"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Destination Card Preview */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="font-semibold text-white block">{target.name}</span>
                <span className="text-slate-400 block">{target.address}</span>
                <span className="text-[11px] font-mono text-cyan-300 mt-0.5 block">
                  {formatCoordinates(target.latitude, target.longitude)}
                </span>
              </div>
            </div>
            <span className="font-mono text-emerald-400 font-semibold shrink-0">{target.available_spaces} spots open</span>
          </div>

          {/* Direct Google Maps Live Navigation */}
          <button
            onClick={() => openGoogleMapsNavigation(target.latitude, target.longitude, gpsState.coords)}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
            id="nav-modal-launch-google-maps-btn"
            title="Launch turn-by-turn navigation in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>Navigate in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Action button */}
          <button
            onClick={() => {
              setIsNavigatingOpen(false);
              showToast(`Navigation complete! Arrived at ${target.name}`);
            }}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            id="finish-nav-btn"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{hasArrived ? 'Finish & Check In' : 'Close Simulation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
