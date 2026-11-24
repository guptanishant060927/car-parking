import React, { useState } from 'react';
import { 
  Radio, 
  MapPin, 
  Car, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  Clock,
  AlertTriangle,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { ParkingZone } from '../../types';

export const LiveParkingOperations: React.FC = () => {
  const { zones, activityFeed, triggerLivePulse, lastUpdatedSeconds, showToast } = useParking();
  const [selectedZone, setSelectedZone] = useState<ParkingZone>(zones[0]);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Available' | 'Filling Soon' | 'Full'>('All');

  const filtered = zones.filter(z => filterStatus === 'All' ? true : z.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span>Live Parking Operations Map</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time zone occupancy, sensor health telemetrics, and live activity feed
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span>Last updated: </span>
            <strong className="text-cyan-400">{lastUpdatedSeconds === 0 ? 'Just now' : `${lastUpdatedSeconds}s ago`}</strong>
          </div>

          <button
            onClick={triggerLivePulse}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
            title="Force sensor polling"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Zone Inspection Drawer */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Zone Operations Grid */}
        <div className="lg:col-span-8 space-y-4">
          {/* Status Filter Bar */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter Zones:</span>
            {(['All', 'Available', 'Filling Soon', 'Full'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-slate-800 text-white font-semibold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Zones Interactive Grid Cards */}
          <div className="grid sm:grid-cols-2 gap-3.5">
            {filtered.map(zone => {
              const isSelected = selectedZone.id === zone.id;
              const isAvailable = zone.status === 'Available';
              const isFilling = zone.status === 'Filling Soon';

              const statusColor = isAvailable 
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' 
                : isFilling 
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' 
                : 'border-rose-500/50 bg-rose-500/10 text-rose-400';

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected 
                      ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/40 shadow-xl' 
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-display font-bold text-white text-base">
                        {zone.name}
                      </h4>
                      <span className="text-xs font-mono text-slate-400">{zone.block}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${statusColor}`}>
                      {zone.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-2 py-2 border-y border-slate-800/80 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">AVAILABLE</span>
                      <span className={`text-base font-bold ${zone.available_spaces === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {zone.available_spaces}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">OCCUPANCY</span>
                      <span className="text-base font-bold text-cyan-300">{zone.occupancy}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">CAPACITY</span>
                      <span className="text-base font-bold text-white">{zone.capacity}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{zone.last_updated}</span>
                    </span>
                    <span className="font-mono text-cyan-400">Demand: {zone.current_demand}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Zone Inspection Detail Card (Section 9) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 sticky top-24 shadow-2xl">
          <div className="pb-3 border-b border-slate-800 flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold">Zone Inspector</span>
              <h3 className="font-display font-bold text-xl text-white mt-0.5">
                {selectedZone.name}
              </h3>
              <p className="text-xs text-slate-400">{selectedZone.address}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
              selectedZone.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
              selectedZone.status === 'Filling Soon' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              {selectedZone.status}
            </span>
          </div>

          {/* Granular Inspection Fields requested in Section 9 */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Total Capacity:</span>
              <span className="font-bold text-white">{selectedZone.capacity} Spaces</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Occupied Spaces:</span>
              <span className="font-bold text-cyan-300">{selectedZone.capacity - selectedZone.available_spaces}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Available Spaces:</span>
              <span className="font-bold text-emerald-400">{selectedZone.available_spaces}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Occupancy Percentage:</span>
              <span className="font-bold text-indigo-300">{selectedZone.occupancy}%</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Average Turnover:</span>
              <span className="font-bold text-white">{selectedZone.turnover_rate} cars/hr</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Sensor Health:</span>
              <span className={`font-bold flex items-center gap-1 ${
                selectedZone.sensor_health === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                {selectedZone.sensor_health}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Current Demand:</span>
              <span className="font-bold text-amber-300">{selectedZone.current_demand}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Last Updated:</span>
              <span className="font-bold text-slate-300">{selectedZone.last_updated}</span>
            </div>
          </div>

          {/* Quick Action Button for Operator */}
          <div className="pt-2">
            <button
              onClick={() => showToast(`Dispatched sensor calibration diagnostic to ${selectedZone.name}`)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Run Remote Sensor Diagnostic</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
