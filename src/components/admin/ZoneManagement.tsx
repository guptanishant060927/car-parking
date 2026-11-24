import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Eye, 
  Power, 
  ShieldCheck, 
  X, 
  Check, 
  Zap, 
  Accessibility, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { ParkingZone } from '../../types';

export const ZoneManagement: React.FC = () => {
  const { zones, addParkingZone, updateParkingZone, showToast } = useParking();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ParkingZone | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formBlock, setFormBlock] = useState('Block 1');
  const [formAddress, setFormAddress] = useState('');
  const [formCapacity, setFormCapacity] = useState(120);
  const [formPrice, setFormPrice] = useState(40);
  const [formType, setFormType] = useState('Multi-Level');
  const [formHours, setFormHours] = useState('24/7 Mon-Sun');
  const [formHasEv, setFormHasEv] = useState(true);
  const [formHasAccessible, setFormHasAccessible] = useState(true);

  const filtered = zones.filter(z => 
    z.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    z.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
    z.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormName('');
    setFormBlock('Block 1');
    setFormAddress('Connaught Extension, New Delhi');
    setFormCapacity(150);
    setFormPrice(40);
    setFormType('Multi-Level');
    setFormHours('24/7 Mon-Sun');
    setFormHasEv(true);
    setFormHasAccessible(true);
    setEditingZone(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (zone: ParkingZone) => {
    setEditingZone(zone);
    setFormName(zone.name);
    setFormBlock(zone.block);
    setFormAddress(zone.address);
    setFormCapacity(zone.capacity);
    setFormPrice(zone.price_per_hour);
    setFormType(zone.parking_type);
    setFormHours(zone.operating_hours);
    setFormHasEv(zone.has_ev);
    setFormHasAccessible(zone.has_accessible);
    setIsAddModalOpen(true);
  };

  const handleToggleZoneActive = (zone: ParkingZone) => {
    const newStatus = zone.status === 'Full' ? 'Available' : 'Full';
    updateParkingZone(zone.id, { 
      status: newStatus,
      available_spaces: newStatus === 'Full' ? 0 : Math.floor(zone.capacity * 0.3)
    });
    showToast(`Zone ${zone.name} status updated to ${newStatus}`);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingZone) {
      updateParkingZone(editingZone.id, {
        name: formName,
        block: formBlock,
        address: formAddress,
        capacity: Number(formCapacity),
        price_per_hour: Number(formPrice),
        parking_type: formType,
        operating_hours: formHours,
        has_ev: formHasEv,
        has_accessible: formHasAccessible
      });
      showToast(`Zone "${formName}" modified successfully`);
    } else {
      const newZone: ParkingZone = {
        id: `zone-${Date.now()}`,
        name: formName,
        block: formBlock,
        address: formAddress,
        total_spots: Number(formCapacity),
        available_spaces: Math.floor(Number(formCapacity) * 0.4),
        capacity: Number(formCapacity),
        occupancy: 60,
        price_per_hour: Number(formPrice),
        status: 'Available',
        distance_m: 650,
        walking_time_min: 8,
        eta_min: 5,
        latitude: 28.6320,
        longitude: 77.2180,
        has_ev: formHasEv,
        has_accessible: formHasAccessible,
        operating_hours: formHours,
        parking_type: formType,
        sensor_health: 'Healthy',
        last_updated: 'Just now',
        current_demand: 'Moderate',
        opening_probability: 80,
        expected_wait_min: 2,
        turnover_rate: 15,
        trend_hourly: [20, 25, 30, 45, 60, 70, 75, 80, 85, 90, 80, 70]
      };
      addParkingZone(newZone);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Parking Zone Management</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure municipal parking lots, bay capacities, tariffs, and EV infrastructure
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
          id="btn-add-parking-zone"
        >
          <Plus className="w-4 h-4" />
          <span>Add Parking Zone</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter zones by name or block..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
        />
      </div>

      {/* Zones Table (Section 13) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="p-4 font-semibold">Zone</th>
                <th className="p-4 font-semibold">Capacity</th>
                <th className="p-4 font-semibold">Occupied</th>
                <th className="p-4 font-semibold">Available</th>
                <th className="p-4 font-semibold">Occupancy</th>
                <th className="p-4 font-semibold">Pricing</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Sensor Health</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map(zone => {
                const isAvailable = zone.status === 'Available';
                const isFilling = zone.status === 'Filling Soon';

                return (
                  <tr key={zone.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{zone.name}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{zone.block} • {zone.parking_type}</div>
                    </td>
                    <td className="p-4 text-slate-300 font-bold">{zone.capacity}</td>
                    <td className="p-4 text-cyan-300 font-bold">{zone.capacity - zone.available_spaces}</td>
                    <td className="p-4 text-emerald-400 font-bold">{zone.available_spaces}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              zone.occupancy >= 90 ? 'bg-rose-500' : zone.occupancy >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${zone.occupancy}%` }}
                          />
                        </div>
                        <span>{zone.occupancy}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-amber-300 font-bold">₹{zone.price_per_hour}/hr</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isAvailable ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        isFilling ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {zone.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1 ${
                        zone.sensor_health === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {zone.sensor_health}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(zone)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Zone Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleZoneActive(zone)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition-colors"
                          title="Toggle Zone Online / Full"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Parking Zone Modal Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white">
                {editingZone ? `Edit Zone: ${editingZone.name}` : 'Add New Municipal Parking Zone'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Zone Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ring Road Plaza"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Block / Section</label>
                  <input
                    type="text"
                    value={formBlock}
                    onChange={(e) => setFormBlock(e.target.value)}
                    placeholder="e.g. Block 15"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Street address or landmark"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Capacity</label>
                  <input
                    type="number"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pricing (₹/hr)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Parking Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                  >
                    <option value="Multi-Level">Multi-Level</option>
                    <option value="Surface Lot">Surface Lot</option>
                    <option value="Underground">Underground</option>
                    <option value="Curbside Smart">Curbside Smart</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={formHours}
                    onChange={(e) => setFormHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHasEv}
                    onChange={(e) => setFormHasEv(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <span>EV Fast Charging Available</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHasAccessible}
                    onChange={(e) => setFormHasAccessible(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <span>Accessible Bays</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                {editingZone ? 'Update Zone Parameters' : 'Create Parking Zone'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
