import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Wrench, 
  Filter, 
  CheckCheck,
  Search
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { SystemAlert } from '../../types';

export const AlertsManagement: React.FC = () => {
  const { alerts, updateAlertStatus, showToast } = useParking();
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'Critical' | 'Warning' | 'Info'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Investigating' | 'Resolved'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = alerts.filter(a => {
    if (filterSeverity !== 'All' && a.severity !== filterSeverity) return false;
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    if (searchTerm) {
      const match = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    a.description.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const handleAcknowledge = (id: string) => {
    updateAlertStatus(id, 'Investigating');
    showToast('Alert marked as Investigating');
  };

  const handleResolve = (id: string) => {
    updateAlertStatus(id, 'Resolved');
    showToast('Incident marked as Resolved');
  };

  const handleDispatch = (location: string) => {
    showToast(`Field technician dispatched to ${location}`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Incidents & Anomaly Alerts</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time IoT sensor drops, unauthorized parking violations, and surge anomalies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
            {alerts.filter(a => a.status === 'Active').length} Active Incidents
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts or locations..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity & Status filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Severity:</span>
          {(['All', 'Critical', 'Warning', 'Info'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterSeverity === sev ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}

          <span className="text-slate-600 mx-1">|</span>

          <span className="text-slate-400 font-medium">Status:</span>
          {(['All', 'Active', 'Investigating', 'Resolved'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterStatus === st ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table / List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">No matching incidents found</p>
            <p className="text-xs text-slate-500 mt-1">All monitored parking sectors are within nominal operating parameters.</p>
          </div>
        ) : (
          filtered.map(alert => {
            const isCritical = alert.severity === 'Critical';
            const isWarning = alert.severity === 'Warning';

            const badgeColor = isCritical 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
              : isWarning 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
              : 'bg-blue-500/10 text-blue-400 border-blue-500/30';

            return (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
              >
                {/* Left info */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isCritical ? 'bg-rose-500/10 text-rose-400' : isWarning ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {isCritical ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${badgeColor}`}>
                        {alert.severity}
                      </span>
                      <h4 className="font-semibold text-white text-sm">
                        {alert.title}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">{alert.id}</span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {alert.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{alert.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{alert.timestamp}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono font-semibold text-slate-300">
                        Status: <span className={
                          alert.status === 'Active' ? 'text-rose-400' : alert.status === 'Investigating' ? 'text-amber-400' : 'text-emerald-400'
                        }>{alert.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleDispatch(alert.location)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    title="Dispatch Field Crew"
                  >
                    <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Dispatch</span>
                  </button>

                  {alert.status === 'Active' && (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
