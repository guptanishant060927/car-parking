import React from 'react';
import { ParkingProvider, useParking } from './context/ParkingContext';
import { DemoBar } from './components/common/DemoBar';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ArchitecturePage } from './components/architecture/ArchitecturePage';
import { AuthPage } from './components/auth/AuthPage';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toastMessage, hideToast } = useParking();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Presentation & Simulation Bar for Cloud Wars Hackathon */}
      <DemoBar />

      {/* Global Navbar (shown on landing, driver, architecture) */}
      {currentView !== 'auth' && <Navbar />}

      {/* Main View Router */}
      <div className="flex-1 flex flex-col">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'driver' && <DriverDashboard />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'architecture' && <ArchitecturePage />}
        {currentView === 'auth' && <AuthPage />}
      </div>

      {/* Global Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl text-white text-xs font-medium flex items-center gap-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-cyan-300">{toastMessage}</span>
            <button
              onClick={hideToast}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ParkingProvider>
      <AppContent />
    </ParkingProvider>
  );
}
