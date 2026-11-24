import React from 'react';
import { 
  Building2, 
  Car, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const AdminOverview: React.FC = () => {
  const { 
    cityKpi, 
    zones, 
    alerts, 
    activityFeed, 
    setAdminTab, 
    triggerLivePulse, 
    lastUpdatedSeconds 
  } = useParking();

  const activeAlerts = alerts.filter(a => a.status !== 'Resolved');

  return (
    <div className="space-y-6">
      {/* Header with Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              City Parking Operations
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All systems operational</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Municipal IoT Telemetry • Delhi-NCR Central Smart Mobility Grid • Code Warrior's Cloud Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs font-mono text-slate-400 hidden md:block">
            <span>Last sensor packet: </span>
            <strong className="text-cyan-400">{lastUpdatedSeconds === 0 ? 'Just now' : `${lastUpdatedSeconds}s ago`}</strong>
          </div>

          <button
            onClick={triggerLivePulse}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            id="admin-overview-sync-btn"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Force Telemetry Sync</span>
          </button>
        </div>
      </div>

      {/* 6 Key KPI Cards from prompt Section 8 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* KPI 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Total Spaces</span>
            <Building2 className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-white">
            {cityKpi.totalParkingSpaces.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span>8 smart zones</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Occupied</span>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-300">
            {cityKpi.occupiedSpaces.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" /> +2.4% vs morning
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Available</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">
            {cityKpi.availableSpaces.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Real-time buffer
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Overall Occupancy</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-indigo-300">
            {cityKpi.overallOccupancyPercent}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all" 
              style={{ width: `${cityKpi.overallOccupancyPercent}%` }} 
            />
          </div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Predicted Shortage</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-mono font-extrabold text-amber-300">
            {cityKpi.predictedShortageRange}
          </div>
          <div className="text-[10px] text-amber-400/80 mt-1 font-medium">
            Peak 12:30–2:30 PM
          </div>
        </div>

        {/* KPI 6 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Active Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-rose-400">
            {activeAlerts.length}
          </div>
          <div className="text-[10px] text-rose-400/80 mt-1 font-medium">
            2 require dispatch
          </div>
        </div>
      </div>

      {/* Middle Row: Live Zones Grid Preview + Live Activity Feed */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Quick Zones Status Table */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="font-display font-bold text-white text-base">
                Live Zone Capacity Status
              </h3>
            </div>
            <button
              onClick={() => setAdminTab('live')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View full operations map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="pb-2.5 font-medium">Zone Name</th>
                  <th className="pb-2.5 font-medium">Available</th>
                  <th className="pb-2.5 font-medium">Capacity</th>
                  <th className="pb-2.5 font-medium">Occupancy</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium">Sensor Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {zones.slice(0, 5).map(z => {
                  return (
                    <tr key={z.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-semibold text-white">
                        {z.name} <span className="text-slate-500 font-normal">({z.block})</span>
                      </td>
                      <td className="py-3 text-emerald-400 font-bold">{z.available_spaces}</td>
                      <td className="py-3 text-slate-400">{z.capacity}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                z.occupancy >= 90 ? 'bg-rose-500' : z.occupancy >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} 
                              style={{ width: `${z.occupancy}%` }} 
                            />
                          </div>
                          <span>{z.occupancy}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          z.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' :
                          z.status === 'Filling Soon' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-rose-500/10 text-rose-400'
                        }`}>
                          {z.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-[11px] ${
                          z.sensor_health === 'Healthy' ? 'text-emerald-400' :
                          z.sensor_health === 'Degraded' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          ● {z.sensor_health}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Real-Time Activity Feed */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Live Activity Stream</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              STREAMING
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[300px] flex-1 pr-1 font-mono text-xs">
            {activityFeed.map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 hover:border-slate-700 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                  item.type === 'spaces_opened' ? 'bg-emerald-400' :
                  item.type === 'reservation' ? 'bg-cyan-400' :
                  item.type === 'occupancy_up' ? 'bg-amber-400' :
                  item.type === 'sensor_issue' ? 'bg-rose-400' : 'bg-indigo-400'
                }`} />
                <div className="flex-1">
                  <p className="text-slate-300 leading-snug">{item.text}</p>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Broker: <strong className="text-cyan-400">AWS IoT Core MQTT</strong></span>
            <span>Latency: <strong className="text-emerald-400">42ms</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
