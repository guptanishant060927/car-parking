import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  BarChart3, 
  Sparkles, 
  AlertTriangle, 
  Building2, 
  DollarSign, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  Ticket, 
  ShieldCheck, 
  Search, 
  Bell, 
  Activity,
  Layers,
  LogOut
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { AdminTab } from '../../types';
import { AdminOverview } from './AdminOverview';
import { LiveParkingOperations } from './LiveParkingOperations';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ForecastingDashboard } from './ForecastingDashboard';
import { AlertsManagement } from './AlertsManagement';
import { ZoneManagement } from './ZoneManagement';
import { DynamicPricing } from './DynamicPricing';
import { ReportsExport } from './ReportsExport';
import { MyReservations } from '../driver/MyReservations';

export const AdminDashboard: React.FC = () => {
  const { 
    adminTab, 
    setAdminTab, 
    alerts, 
    setCurrentRole, 
    setCurrentView, 
    showToast 
  } = useParking();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeAlertCount = alerts.filter(a => a.status === 'Active').length;

  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live Parking', icon: Radio },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'forecasting', label: 'Forecasting AI', icon: Sparkles },
    { id: 'alerts', label: 'Alerts & Incidents', icon: AlertTriangle, badge: activeAlertCount },
    { id: 'zones', label: 'Parking Zones', icon: Building2 },
    { id: 'reservations', label: 'Reservations', icon: Ticket },
    { id: 'pricing', label: 'Dynamic Pricing', icon: DollarSign },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-display font-bold text-white text-sm">Operator Control Center</span>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          City Admin
        </span>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 md:translate-x-0 md:static md:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand / Role header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-sm">
                P
              </div>
              <span className="font-display font-bold text-white text-base tracking-tight">ParkSmart</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 block mt-1">
              CITY MOBILITY OPERATOR
            </span>
          </div>
        </div>

        {/* Navigation items list */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setAdminTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                id={`admin-nav-${item.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer: Node telemetry and quick Switch to Driver */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>CLOUD GATEWAY</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              aws-iot-core://ap-south-1.grid
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentRole('driver');
              setCurrentView('driver');
              showToast('Switched to Driver Perspective');
            }}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <span>Switch to Driver UI</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {adminTab === 'overview' && <AdminOverview />}
          {adminTab === 'live' && <LiveParkingOperations />}
          {adminTab === 'analytics' && <AnalyticsDashboard />}
          {adminTab === 'forecasting' && <ForecastingDashboard />}
          {adminTab === 'alerts' && <AlertsManagement />}
          {adminTab === 'zones' && <ZoneManagement />}
          {adminTab === 'reservations' && <MyReservations />}
          {adminTab === 'pricing' && <DynamicPricing />}
          {adminTab === 'reports' && <ReportsExport />}
        </main>
      </div>
    </div>
  );
};
