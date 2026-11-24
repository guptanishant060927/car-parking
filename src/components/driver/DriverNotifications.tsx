import React from 'react';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  MapPin, 
  ChevronRight,
  ShieldAlert,
  Car
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const DriverNotifications: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    setSelectedZoneId,
    setIsDetailOpen,
    setDriverTab 
  } = useParking();

  const handleNotificationClick = (zoneId?: string) => {
    if (zoneId) {
      setSelectedZoneId(zoneId);
      setIsDetailOpen(true);
      setDriverTab('find');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span>Driver Notifications & Alerts</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time spot telemetry, shortage warnings, and commute advisories
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          id="btn-mark-all-read"
        >
          <CheckCheck className="w-4 h-4 text-cyan-400" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => {
                markNotificationAsRead(item.id);
                handleNotificationClick(item.zone_id);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex items-start gap-3.5 ${
                item.read 
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300' 
                  : 'bg-slate-900 border-cyan-500/40 text-white shadow-lg shadow-cyan-500/5'
              }`}
            >
              {/* Unread indicator */}
              {!item.read && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}

              {/* Icon avatar based on severity */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                item.severity === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : item.severity === 'warning' 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                  : item.severity === 'error' 
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {item.severity === 'warning' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : item.severity === 'error' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <Car className="w-5 h-5" />
                )}
              </div>

              {/* Message body */}
              <div className="flex-1 pr-6 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-white">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.message}
                </p>

                {item.zone_id && (
                  <div className="pt-1.5 flex items-center gap-1 text-[11px] font-mono text-cyan-400 group-hover:underline">
                    <span>View zone on map</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
