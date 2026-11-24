import React from 'react';
import { 
  Car, 
  LayoutDashboard, 
  MapPin, 
  Cpu, 
  Bell, 
  User as UserIcon, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    switchUserRole, 
    unreadNotificationsCount, 
    simulationActive,
    setSimulationActive,
    lastUpdatedSeconds,
    setDriverTab
  } = useParking();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
          id="navbar-brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Car className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xl tracking-tight text-white">ParkSmart</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Find. Park. Move. Smarter.
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentView === 'landing'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            id="nav-link-landing"
          >
            Overview
          </button>
          <button
            onClick={() => {
              setCurrentView('driver');
              setDriverTab('find');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'driver'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            id="nav-link-driver"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            Driver App
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'admin'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            id="nav-link-admin"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            City Operator
          </button>
          <button
            onClick={() => setCurrentView('architecture')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'architecture'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            id="nav-link-architecture"
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            IoT & Cloud
          </button>
        </nav>

        {/* Right Controls: Live status, Notifications, User Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Live Sensor Ticker */}
          <div 
            onClick={() => setSimulationActive(!simulationActive)}
            title={simulationActive ? 'Live IoT stream running (Click to pause)' : 'Simulation paused (Click to resume)'}
            className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono border cursor-pointer transition-all ${
              simulationActive 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40' 
                : 'bg-amber-950/40 text-amber-400 border-amber-500/30 hover:bg-amber-900/40'
            }`}
            id="navbar-live-status-pill"
          >
            <span className={`w-2 h-2 rounded-full ${simulationActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-semibold">{simulationActive ? 'LIVE' : 'PAUSED'}</span>
            <span className="text-[10px] text-slate-400 border-l border-slate-700/60 pl-1.5">
              {lastUpdatedSeconds === 0 ? 'Just now' : `${lastUpdatedSeconds}s ago`}
            </span>
          </div>

          {/* Quick Notifications */}
          <button
            onClick={() => {
              setCurrentView('driver');
              setDriverTab('notifications');
            }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors"
            title="Notifications"
            id="navbar-notifications-btn"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => switchUserRole('driver')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                currentUser.role === 'driver'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="role-switch-driver"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Driver</span>
            </button>
            <button
              onClick={() => switchUserRole('operator')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                currentUser.role === 'operator'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="role-switch-operator"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">City Ops</span>
            </button>
          </div>

          {/* User Profile Avatar Pill */}
          {currentUser.role === 'driver' && (
            <button
              onClick={() => {
                setCurrentView('driver');
                setDriverTab('profile');
              }}
              title={`Logged in as ${currentUser.name} (Click to edit profile)`}
              className="hidden sm:flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs transition-all group"
              id="navbar-profile-btn"
            >
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${currentUser.avatar_color || 'from-cyan-500 to-blue-600'} text-slate-950 font-black text-[11px] flex items-center justify-center shadow-sm`}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-slate-200 group-hover:text-cyan-300 font-medium truncate max-w-[110px]">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
