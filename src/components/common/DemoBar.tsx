import React from 'react';
import { 
  Sparkles, 
  Activity, 
  Play, 
  Pause, 
  Compass, 
  Cpu, 
  ChevronRight,
  Shield,
  Award
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const DemoBar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    setDriverTab, 
    setAdminTab, 
    triggerLivePulse, 
    simulationActive, 
    setSimulationActive,
    setSelectedZoneId,
    setIsDetailOpen
  } = useParking();

  const handleQuickDemoFlow = () => {
    // Jump straight to driver with Main Street selected
    setCurrentView('driver');
    setDriverTab('find');
    setSelectedZoneId('zone-main-street');
    setIsDetailOpen(true);
  };

  return (
    <aside aria-label="Demo Controller" className="w-full bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-indigo-500/20 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Hackathon Badge & Team Name */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cloud Wars Hackathon</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            Team: <strong className="text-white font-semibold">Code Warrior's</strong>
          </span>
          <span className="text-slate-500 text-[11px] hidden md:inline">
            (AWS Cloud Club, SRMIST Delhi-NCR)
          </span>
        </div>

        {/* Interactive Quick-Demo Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleQuickDemoFlow}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-sm hover:brightness-110 transition-all text-xs"
            title="Start Judge Demo Flow: Driver map with Main Street Block 12 pre-focused"
            id="demo-btn-start-flow"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Judge Demo Walkthrough</span>
            <ChevronRight className="w-3 h-3 text-cyan-200" />
          </button>

          <button
            onClick={triggerLivePulse}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
            title="Simulate immediate IoT sensor packet arrival and occupancy shift"
            id="demo-btn-trigger-pulse"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Simulate IoT Pulse</span>
          </button>

          <button
            onClick={() => setSimulationActive(!simulationActive)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            id="demo-btn-toggle-sim"
          >
            {simulationActive ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span className="hidden sm:inline">{simulationActive ? 'Pause Sim' : 'Resume Sim'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
