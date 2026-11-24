import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Sliders,
  Layers,
  Info
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const ForecastingDashboard: React.FC = () => {
  const { forecast, showToast } = useParking();
  const [horizon, setHorizon] = useState<'1 Hour' | '3 Hours' | '6 Hours'>('3 Hours');

  return (
    <div className="space-y-6">
      {/* Title & Horizon Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Parking Demand Forecast & Shortage AI</span>
          </h2>
          <p className="text-xs text-slate-400">
            Machine Learning predictive models trained on historical occupancy, weather, and arterial traffic
          </p>
        </div>

        {/* Prediction Horizons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Horizon:</span>
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            {(['1 Hour', '3 Hours', '6 Hours'] as const).map(h => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  horizon === h
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Key Insight Banner from Section 11 */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Automated Dynamic Demand Advisory
            </span>
            <p className="text-sm font-semibold text-white">
              "Demand is expected to increase significantly between 12:30 PM and 2:30 PM. Consider redirecting drivers toward nearby Connaught Underground or Tech Park Zone."
            </p>
            <div className="text-xs text-slate-400">
              Correlated with: Rain forecast in Central Delhi + Friday afternoon retail surge
            </div>
          </div>
        </div>

        <button
          onClick={() => showToast('Traffic advisory pushed to connected driver navigation apps')}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-md"
        >
          Push Diversion Advisory
        </button>
      </div>

      {/* Disclaimer Card */}
      <div className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong>ML Model Accuracy Notice:</strong> Forecasts represent probabilistic distributions calculated at 95% confidence intervals using AWS SageMaker time-series regressors.
        </span>
      </div>

      {/* Forecast Cards Grid (Section 11) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forecast.map((item) => {
          const isHigh = item.risk_level === 'High Risk';
          const isModerate = item.risk_level === 'Moderate Risk';

          const riskBadge = isHigh 
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
            : isModerate 
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

          return (
            <div
              key={item.zone_id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-display font-bold text-white text-base">
                    {item.zone_name}
                  </h4>
                  <span className="text-xs font-mono text-slate-400">Forecast Horizon: {horizon}</span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${riskBadge}`}>
                  {item.risk_level}
                </span>
              </div>

              {/* Forecast Alert narrative */}
              <p className="text-xs text-cyan-300 font-medium bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                "{item.zone_name} is expected to reach {item.predicted_occupancy}% occupancy within 2 hours."
              </p>

              {/* 4 Core Forecast Metrics from Section 11 */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">PREDICTED OCCUPANCY</span>
                  <span className="text-base font-bold text-white">{item.predicted_occupancy}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SHORTAGE PROBABILITY</span>
                  <span className={`text-base font-bold ${item.shortage_probability > 70 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {item.shortage_probability}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">EXPECTED SPOTS</span>
                  <span className="text-base font-bold text-emerald-400">{item.expected_available_spots} left</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PEAK TIME</span>
                  <span className="text-base font-bold text-cyan-300">{item.peak_time}</span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">AI Confidence: <strong>94.2%</strong></span>
                <button
                  onClick={() => showToast(`Automated capacity reservation adjusted for ${item.zone_name}`)}
                  className="text-cyan-400 font-semibold hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Mitigate Risk</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
