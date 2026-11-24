import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  FileSpreadsheet, 
  Printer, 
  Building2, 
  DollarSign, 
  Activity 
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const ReportsExport: React.FC = () => {
  const { zones, showToast } = useParking();
  const [selectedReport, setSelectedReport] = useState('Occupancy Report');
  const [dateRange, setDateRange] = useState('18 September 2026');
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');

  const reportTypes = [
    { name: 'Occupancy Report', description: 'Hourly space utilization, peak factor, and turnover breakdown' },
    { name: 'Revenue Report', description: 'Financial ledger, dynamic rate collections, FASTag UPI reconciliations' },
    { name: 'Zone Performance', description: 'Comparative metrics across Commercial, Financial, and Transit sectors' },
    { name: 'Parking Demand', description: 'Aggregated driver search queries, unmet demand, and street dwell time' },
    { name: 'Sensor Health', description: 'IoT battery voltages, packet arrival rates, and node calibration logs' },
    { name: 'Reservation Report', description: 'Advance booking ratios, no-show rates, and duration analytics' }
  ];

  const handleExport = (exportType: 'csv' | 'pdf') => {
    showToast(`Generating and downloading ${selectedReport} (${exportType.toUpperCase()})...`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Audit Reports & Data Export</span>
          </h2>
          <p className="text-xs text-slate-400">
            Generate certified compliance documents, revenue audits, and sensor operational digests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
            id="export-csv-btn"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
            id="export-pdf-btn"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Select Report Type */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-semibold text-slate-300 block">Select Report Classification</span>
          <div className="space-y-2">
            {reportTypes.map((item) => (
              <div
                key={item.name}
                onClick={() => setSelectedReport(item.name)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedReport === item.name
                    ? 'bg-slate-900 border-cyan-500 shadow-sm ring-1 ring-cyan-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white text-xs">{item.name}</h4>
                  {selectedReport === item.name && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Date Range & Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <span className="text-xs font-semibold text-white block">Audit Period & Filter Parameters</span>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="18 September 2026">18 September 2026 (Today)</option>
                  <option value="Past 7 Days">Past 7 Days (11 - 18 Sep 2026)</option>
                  <option value="Past 30 Days">Past 30 Days (August - Sep 2026)</option>
                  <option value="Quarter 3 2026">Q3 2026 Fiscal Comprehensive</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Regional Scope</label>
                <select className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500">
                  <option>All Delhi-NCR Monitored Zones (8 Zones)</option>
                  <option>Central Business District Only</option>
                  <option>Transit Corridors & Airport Express</option>
                </select>
              </div>
            </div>
          </div>

          {/* Report Preview Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Generated Preview: {selectedReport}</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">{dateRange}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-slate-800 text-slate-500">
                  <tr>
                    <th className="pb-2">Zone Identifier</th>
                    <th className="pb-2">Avg Occupancy</th>
                    <th className="pb-2">Total Turnover</th>
                    <th className="pb-2">Gross Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {zones.slice(0, 4).map(z => (
                    <tr key={z.id} className="text-slate-300">
                      <td className="py-2.5 font-semibold text-white">{z.name}</td>
                      <td className="py-2.5 text-cyan-300">{z.occupancy}%</td>
                      <td className="py-2.5">{z.turnover_rate * 8} vehicles</td>
                      <td className="py-2.5 text-emerald-400 font-bold">₹{z.capacity * z.price_per_hour * 6}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
