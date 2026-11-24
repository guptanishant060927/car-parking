import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Car, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export const ReservationModal: React.FC = () => {
  const { 
    selectedZone, 
    zones, 
    isReservationOpen, 
    setIsReservationOpen, 
    createReservation,
    currentUser 
  } = useParking();

  const [zoneId, setZoneId] = useState(selectedZone?.id || zones[0]?.id || 'zone-main-street');
  const [date, setDate] = useState('18 September 2026');
  const [time, setTime] = useState('11:30 AM');
  const [durationHours, setDurationHours] = useState(2);
  const [vehicleNumber, setVehicleNumber] = useState(currentUser.vehicle_number || 'DL-04-AB-1234');
  const [paymentMethod, setPaymentMethod] = useState<'FASTag' | 'UPI' | 'Card'>('FASTag');

  React.useEffect(() => {
    if (currentUser?.vehicle_number) {
      setVehicleNumber(currentUser.vehicle_number);
    }
  }, [currentUser?.vehicle_number, isReservationOpen]);

  if (!isReservationOpen) return null;

  const currentChosenZone = zones.find(z => z.id === zoneId) || selectedZone || zones[0];
  const hourlyRate = currentChosenZone?.price_per_hour || 40;
  const totalCost = hourlyRate * durationHours;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    createReservation({
      zoneId: currentChosenZone.id,
      date,
      time,
      durationHours,
      vehicleNumber
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        id="reservation-modal"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Smart Parking Reservation</h3>
              <p className="text-xs text-slate-400">Guaranteed bay allocation with FASTag auto-barrier</p>
            </div>
          </div>
          <button
            onClick={() => setIsReservationOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          {/* Parking Location Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Parking Location
            </label>
            <select
              value={currentChosenZone.id}
              onChange={(e) => setZoneId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 outline-none"
              id="res-select-location"
            >
              {zones.map(z => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.block}) — ₹{z.price_per_hour}/hr ({z.available_spaces} spaces left)
                </option>
              ))}
            </select>
          </div>

          {/* Date & Arrival Time Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 outline-none"
                id="res-input-date"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Arrival Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 outline-none"
                id="res-select-time"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM (Popular)</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
              </select>
            </div>
          </div>

          {/* Duration Selector & Vehicle Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Duration
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 4].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDurationHours(hrs)}
                    className={`py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      durationHours === hrs
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-cyan-400" /> Vehicle Plate
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. DL-04-AB-1234"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs uppercase focus:border-cyan-500 outline-none"
                id="res-input-vehicle"
                required
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('FASTag')}
                className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  paymentMethod === 'FASTag'
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                FASTag Auto
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                UPI (GPay / PhonePe)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  paymentMethod === 'Card'
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Card / NetBanking
              </button>
            </div>
          </div>

          {/* Reservation Summary Card */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider pb-1 border-b border-slate-800/80">
              Reservation Summary
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Parking:</span>
                <span className="font-semibold text-white">{currentChosenZone.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date:</span>
                <span className="font-semibold text-white">{date}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Arrival:</span>
                <span className="font-semibold text-white">{time}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Duration:</span>
                <span className="font-semibold text-white">{durationHours} hours</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-sm">
              <span className="text-slate-400">Estimated cost:</span>
              <span className="text-xl font-bold font-mono text-cyan-300">₹{totalCost}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
            id="confirm-reservation-btn"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>Confirm Reservation</span>
          </button>
        </form>
      </div>
    </div>
  );
};
