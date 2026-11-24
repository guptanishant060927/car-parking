import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Sliders, 
  AlertCircle 
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const DynamicPricing: React.FC = () => {
  const { zones, showToast } = useParking();
  const [currentBasePrice, setCurrentBasePrice] = useState(40);
  const [recommendedPrice, setRecommendedPrice] = useState(50);
  const [demandFactor, setDemandFactor] = useState(1.25);
  const [isScheduled, setIsScheduled] = useState(false);

  const pricingTimeline = [
    { slot: '06:00 - 09:00 (Early Commute)', rate: '₹30/hr', status: 'Off-Peak Base' },
    { slot: '09:00 - 12:00 (Morning Rush)', rate: '₹40/hr', status: 'Standard' },
    { slot: '12:00 - 15:00 (Lunch & Commercial Peak)', rate: '₹50/hr', status: 'High Demand Surge (AI Recommended)' },
    { slot: '15:00 - 18:00 (Afternoon Transit)', rate: '₹45/hr', status: 'Moderate Surge' },
    { slot: '18:00 - 21:00 (Evening Retail & Dining)', rate: '₹40/hr', status: 'Standard' },
    { slot: '21:00 - 06:00 (Overnight Stalls)', rate: '₹20/hr', status: 'Incentivized Off-Peak' },
  ];

  const handleAcceptRecommendation = () => {
    setCurrentBasePrice(recommendedPrice);
    showToast(`Dynamic tariff updated to ₹${recommendedPrice}/hour across congested zones`);
  };

  const handleScheduleChange = () => {
    setIsScheduled(true);
    showToast(`Surge pricing of ₹${recommendedPrice}/hour scheduled for 12:30 PM peak window`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <span>Dynamic Tariff & Congestion Pricing</span>
          </h2>
          <p className="text-xs text-slate-400">
            Algorithmic pricing adjustments to balance bay turnover and eliminate street cruising
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Elasticity Engine Active</span>
        </div>
      </div>

      {/* Recommended Rate Card from Section 14 */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              AI Dynamic Pricing Advisory
            </span>
            <div className="flex items-baseline gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-mono">CURRENT BASE RATE</span>
                <span className="text-3xl font-mono font-extrabold text-white">₹{currentBasePrice}<span className="text-sm font-normal text-slate-400">/hr</span></span>
              </div>
              <ArrowRight className="w-6 h-6 text-amber-400 self-center" />
              <div>
                <span className="text-xs text-amber-400 block font-mono">RECOMMENDED SURGE RATE</span>
                <span className="text-3xl font-mono font-extrabold text-amber-300">₹{recommendedPrice}<span className="text-sm font-normal text-slate-400">/hr</span></span>
              </div>
            </div>
            <p className="text-sm text-slate-300 font-medium pt-1">
              <strong>Reason:</strong> "High demand expected during peak hours (12:30 PM - 2:30 PM). 92% occupancy anticipated in Sector 1 Commercial."
            </p>
          </div>

          {/* Action buttons from prompt */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={handleAcceptRecommendation}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              id="btn-accept-pricing"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Recommendation</span>
            </button>

            <button
              onClick={handleScheduleChange}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              id="btn-schedule-pricing"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{isScheduled ? 'Scheduled (12:30 PM)' : 'Schedule Price Change'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Timeline Throughout the Day (Section 14) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-base">
              Diurnal Tariff Schedule Timeline
            </h3>
            <p className="text-xs text-slate-400">Automated price steps configured for the municipal grid</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Auto-balanced by FASTag</span>
        </div>

        <div className="space-y-2.5">
          {pricingTimeline.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-mono text-slate-300 font-semibold">{item.slot}</span>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-slate-400">{item.status}</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{item.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
