import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Clock, 
  Calendar, 
  ArrowDownRight, 
  ArrowUpRight, 
  PieChart as PieIcon,
  Download,
  Filter
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const AnalyticsDashboard: React.FC = () => {
  const { zones, showToast } = useParking();
  const [timeRange, setTimeRange] = useState<'Today' | '7 Days' | '30 Days' | 'Custom'>('Today');

  // Realistic analytics data arrays
  const hourlyOccupancy = [
    { time: '06:00', value: 28 },
    { time: '08:00', value: 54 },
    { time: '10:00', value: 76 },
    { time: '12:00', value: 89 },
    { time: '14:00', value: 84 },
    { time: '16:00', value: 92 },
    { time: '18:00', value: 88 },
    { time: '20:00', value: 68 },
    { time: '22:00', value: 42 }
  ];

  const demandByPeriod = [
    { period: 'Morning (6-11 AM)', demand: '74%', color: 'bg-cyan-500' },
    { period: 'Afternoon (11 AM-4 PM)', demand: '89%', color: 'bg-rose-500' },
    { period: 'Evening (4-9 PM)', demand: '82%', color: 'bg-amber-500' },
    { period: 'Night (9 PM-6 AM)', demand: '35%', color: 'bg-indigo-500' }
  ];

  const searchTimeReduction = [
    { label: 'Q1 (Traditional)', time: 14.2 },
    { label: 'Q2 (ParkSmart Pilot)', time: 8.5 },
    { label: 'Q3 (Live Sensors)', time: 5.1 },
    { label: 'Now (AI Prediction)', time: 3.8 }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Parking Telemetry Analytics</span>
          </h2>
          <p className="text-xs text-slate-400">
            Historical occupancy metrics, revenue generation, and congestion mitigation impact
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['Today', '7 Days', '30 Days', 'Custom'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => showToast('Exporting analytics snapshot CSV...')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 1: High Level Revenue & Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Daily Revenue</span>
          <div className="text-2xl font-mono font-bold text-white">₹3,42,800</div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% with Dynamic Pricing
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Average Search Time</span>
          <div className="text-2xl font-mono font-bold text-cyan-300">3.8 mins</div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> -73% reduction (was 14.2m)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Average Turnaround Rate</span>
          <div className="text-2xl font-mono font-bold text-indigo-300">18.4 cars/hr</div>
          <div className="text-[11px] text-slate-400">Peak at Connaught Hub</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">CO₂ Emissions Saved</span>
          <div className="text-2xl font-mono font-bold text-emerald-400">4,120 kg</div>
          <div className="text-[11px] text-slate-400">Fewer idling cruise miles</div>
        </div>
      </div>

      {/* Row 2: Occupancy Over Time Chart & Demand By Period */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Occupancy Line Chart (SVG SVG Path) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-white text-base">
                Occupancy Over Time (Hourly)
              </h3>
              <p className="text-xs text-slate-400">Aggregated real-time sensor metrics across all districts</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Peak: 92% @ 16:00
            </span>
          </div>

          {/* Clean SVG Area Chart */}
          <div className="h-64 w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 relative flex flex-col justify-end">
            <svg className="w-full h-44 overflow-visible" viewBox="0 0 900 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid guide lines */}
              <line x1="0" y1="50" x2="900" y2="50" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="900" y2="100" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="900" y2="150" stroke="#1e293b" strokeDasharray="4 4" />

              {/* Fill Area */}
              <path
                d="M 0 144 L 112 92 L 225 48 L 337 22 L 450 32 L 562 16 L 675 24 L 787 64 L 900 116 L 900 200 L 0 200 Z"
                fill="url(#occupancyGradient)"
              />

              {/* Stroke line */}
              <path
                d="M 0 144 L 112 92 L 225 48 L 337 22 L 450 32 L 562 16 L 675 24 L 787 64 L 900 116"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {[
                { x: 0, y: 144, val: '28%' },
                { x: 112, y: 92, val: '54%' },
                { x: 225, y: 48, val: '76%' },
                { x: 337, y: 22, val: '89%' },
                { x: 450, y: 32, val: '84%' },
                { x: 562, y: 16, val: '92%' },
                { x: 675, y: 24, val: '88%' },
                { x: 787, y: 64, val: '68%' },
                { x: 900, y: 116, val: '42%' }
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#0891b2" stroke="#fff" strokeWidth="2" />
                </g>
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              {hourlyOccupancy.map((item, idx) => (
                <span key={idx}>{item.time}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Parking Demand by Period */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-display font-bold text-white text-base">
              Parking Demand By Day-Part
            </h3>
            <p className="text-xs text-slate-400">Peak congestion clustering index</p>
          </div>

          <div className="space-y-4">
            {demandByPeriod.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{item.period}</span>
                  <span className="font-mono font-bold text-white">{item.demand}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`${item.color} h-full rounded-full transition-all`}
                    style={{ width: item.demand }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-cyan-300 block">Operator Recommendation</span>
            <p>Afternoon peak between 11 AM and 4 PM shows highest pressure. Deploy dynamic rate tiering.</p>
          </div>
        </div>
      </div>

      {/* Row 3: Zone Utilization Bar Chart & Search Time Reduction */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Zone Utilization */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-white text-base">
            Zone Utilization Comparison
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {zones.slice(0, 6).map((z) => (
              <div key={z.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">{z.name}</span>
                  <span className="text-cyan-400 font-bold">{z.occupancy}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      z.occupancy >= 90 ? 'bg-rose-500' : z.occupancy >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${z.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Time Reduction Progress */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-white text-base">
            Average Search Time Impact
          </h3>
          <p className="text-xs text-slate-400">Time spent by drivers looking for vacant parking (minutes)</p>

          <div className="space-y-3 font-mono text-xs">
            {searchTimeReduction.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-emerald-400 font-bold">{item.time} mins</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    style={{ width: `${(item.time / 16) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
